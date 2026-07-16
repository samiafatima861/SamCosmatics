const Category = require('../models/category');
const path = require('path');

// exports.list = async (req, res) => {
//   const categories = await Category.getWithProductCount();
//   res.render('admin/categories', { title: 'Categories', categories });
// };

exports.list = async (req, res) => {
  const categories = await Category.getWithProductCount();
  const totalProducts = categories.reduce((sum, c) => sum + Number(c.product_count), 0);
  res.render('admin/categories', {
    title: 'Categories',
    categories,
    summary: { total: categories.length, totalProducts }
  });
};

exports.showCreate = (req, res) => {
  res.render('admin/category-form', { category: {} });
};

exports.create = async (req, res, next) => {
  try {
    const image_url = req.file ? '/images/' + path.basename(req.file.path) : null;
    await Category.create({ name: req.body.name, image_url });
    res.redirect('/admin/categories');
  } catch (err) {
    next(err);
  }
};

exports.showEdit = async (req, res) => {
  const category = await Category.getById(req.params.id);
  res.render('admin/category-form', { category });
};

exports.update = async (req, res, next) => {
  try {
    const existing = await Category.getById(req.params.id);
    let image_url = existing ? existing.image_url : null;
    if (req.file) image_url = '/images/' + path.basename(req.file.path);
    await Category.update(req.params.id, { name: req.body.name, image_url });
    res.redirect('/admin/categories');
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Category.remove(req.params.id);
    res.redirect('/admin/categories');
  } catch (err) {
    next(err);
  }
};