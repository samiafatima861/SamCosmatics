// controllers/adminController.js
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const Product = require('../models/product');
const Order = require('../models/order');
const ProductVariant = require('../models/productVariant');
const Seller = require('../models/seller');
const Customer = require('../models/customer');
const Notification = require('../models/notification');


// exports.dashboard = (req,res) => {
//   res.render('admin/dashboard', { title:'Admin Dashboard', admin: req.session.admin });
// };


exports.dashboard = async (req, res) => {
  const [productsCount, ordersCount, revenue, lowStock, inventory,topSelling,topSellers, sellersCount, customersCount,dailySales, allProducts,unreadNotifications] = await Promise.all([
    Product.count(),
    Order.count(),
    Order.totalRevenue(),
    Product.getLowStock(5,10),
    ProductVariant.getAllWithVariants(),
    Order.getTopSellingProducts(5),
    Order.getTopSellers(5),
    Seller.count(),
    Customer.count(),
    Order.getDailySales(7),
    Product.getAll(10),
    Notification.getUnreadCount()
  ]);

  let healthy = 0, low = 0, outOfStock = 0;
  inventory.forEach(p => {
    if (p.variants.length === 0) {
      if (p.stock_quantity <= 0) outOfStock++;
      else if (p.stock_quantity <= 5) low++;
      else healthy++;
    } else {
      p.variants.forEach(v => {
        if (v.stock_quantity <= 0) outOfStock++;
        else if (v.stock_quantity <= v.low_stock_threshold) low++;
        else healthy++;
      });
    }
  });
  const stockSummary = { healthy, low, outOfStock, totalProducts: inventory.length };

  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    admin: req.session.admin,
    stats: {
      products: productsCount,
      orders: ordersCount,
      revenue: revenue,
      customers: customersCount,
      sellers: sellersCount,
      notifications: unreadNotifications
      
    },
    lowStock,
    inventory,
    stockSummary,
    topSelling,
    topSellers,
    dailySales,
    allProducts
  });
};

exports.showProfile = async (req,res) => {
  const admin = await Admin.findById(req.session.admin.id);
  res.render('admin/profile-view', { title:'Profile', admin });
};
exports.showEditProfile = async (req, res) => {
  const admin = await Admin.findById(req.session.admin.id);
  res.render('admin/profile', { title: 'Edit Profile', admin });
};

exports.updateProfile = async (req,res) => {
  const id = req.session.admin.id;
  const fields = {};
  if (req.body.name) fields.name = req.body.name;
  if (req.body.phone) fields.phone = req.body.phone;
  if (req.body.address) fields.address = req.body.address;
  if (req.file && req.file.filename) fields.image_url = '/images/' + req.file.filename;
  await Admin.updateProfile(id, fields);
  // refresh session
  const updated = await Admin.findById(id);
  req.session.admin = { id: updated.id, name: updated.name, email: updated.email, image_url: updated.image_url };
  res.redirect('/admin/profile');
};

exports.changePassword = async (req,res) => {
  const { current, newPassword } = req.body;
  const admin = await Admin.findById(req.session.admin.id);
  const ok = await bcrypt.compare(current, admin.password_hash || admin.passwordHash || '');
  if (!ok) return res.render('admin/profile', { admin, error: 'Current password is wrong' });
  const hash = await bcrypt.hash(newPassword, 10);
  await Admin.updateProfile(admin.id, { password_hash: hash });
  res.render('admin/profile', { admin: await Admin.findById(admin.id), success:'Password updated' });
};
