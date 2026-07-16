// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const SiteSettings = require('./models/siteSettings');
const Category = require('./models/category');
const Product = require('./models/product');
const Blog = require('./models/blog');
const Faq = require('./models/faq');
const FaqSubmission = require('./models/faqSubmission');
const Notification = require('./models/notification');

const app = express();


// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static assets
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');


app.use(session({
  name: 'sam.sid',
  secret: process.env.SESSION_SECRET || 'change_this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// after session setup, before routes
app.use((req, res, next) => {
  res.locals.cartCount = req.session && req.session.cart
    ? Object.values(req.session.cart).reduce((a, b) => a + Number(b || 0), 0)
    : 0;
  next();
});

app.use((req,res,next)=>{
  res.locals.admin = req.session.admin || null;
  res.locals.seller = req.session.seller || null;
  res.locals.customer = req.session.customer || null;
  res.locals.cartCount = req.session?.cart ? Object.values(req.session.cart).reduce((a,b)=>a+Number(b||0),0) : 0;
  next();
});



app.use(async (req, res, next) => {
  try {
    res.locals.siteSettings = await SiteSettings.get();
  } catch (err) {
    res.locals.siteSettings = null;
  }
  next();
});

// routes


app.get('/', async (req, res) => {
  const categories = await Category.getWithProductCount();
  const featuredProducts = await Product.getAll(8);
  res.render('home', { title: '', categories, featuredProducts });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

app.get('/blog', async (req, res) => {
  const blogs = await Blog.getPublished(50);
  res.render('blog-list', { title: 'Blog', blogs });
});

app.get('/blog/:slug', async (req, res) => {
  const blog = await Blog.getBySlug(req.params.slug);
  if (!blog || blog.status !== 'published') return res.status(404).render('404', { title: 'Not Found' });
  res.render('blog-detail', { title: blog.title, blog });
});

app.get('/faq', async (req, res) => {
  const faqs = await Faq.getAll();
  res.render('faq', { title: 'FAQs', faqs, submitted: req.query.submitted });
});




app.get('/faq', async (req, res) => {
  const faqs = await Faq.getAll();
  res.render('faq', { title: 'FAQs', faqs, submitted: req.query.submitted });
});

app.post('/faq/ask', async (req, res, next) => {
  try {
    const { question, name, email } = req.body;
    if (!question || question.trim().length < 5) {
      return res.redirect('/faq?error=invalid');
    }
    await FaqSubmission.create({
      question: question.trim(),
      customer_id: req.session.customer ? req.session.customer.id : null,
      customer_name: req.session.customer ? req.session.customer.name : (name || null),
      customer_email: req.session.customer ? req.session.customer.email : (email || null)
    });
    Notification.create('faq_question', `New question submitted: "${question.trim().slice(0, 80)}"`, '/admin/faq-submissions').catch(console.error);
    res.redirect('/faq?submitted=1');
  } catch (err) {
    next(err);
  }
});

const productsController = require('./controllers/productsController');
const productsApiRouter = require('./routes/productsApi');
const cartRoutes = require('./routes/cartRoutes');

app.get('/products', productsController.listProductsPage);
app.get('/products/:id', productsController.viewProductPage); // optional single product page
app.post('/products/:id/reviews', require('./controllers/reviewController').create);
app.use('/api/products', productsApiRouter);


const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

const adminProducts = require('./routes/adminProducts');
app.use('/', adminProducts);

const adminOrders = require('./routes/adminOrders');
app.use('/', adminOrders);

const adminInventory = require('./routes/adminInventory');
app.use('/', adminInventory);

const sellerRoutes = require('./routes/sellerRoutes');
app.use('/', sellerRoutes);

const adminSellers = require('./routes/adminSellers');
app.use('/', adminSellers);

const customerRoutes = require('./routes/customerRoutes');
app.use('/', customerRoutes);

const adminCustomers = require('./routes/adminCustomers');
app.use('/', adminCustomers);

const adminCategories = require('./routes/adminCategories');
app.use('/', adminCategories);

const adminSettings = require('./routes/adminSettings');
app.use('/', adminSettings);

const checkoutRoutes = require('./routes/checkoutRoutes');
app.use('/', checkoutRoutes);

const adminNotifications = require('./routes/adminNotifications');
app.use('/', adminNotifications);

const adminRevenue = require('./routes/adminRevenue');
app.use('/', adminRevenue);

const adminContent = require('./routes/adminContent');
app.use('/', adminContent);

app.use('/', cartRoutes); // pages at /cart and /wishlist, API under /api/...


// simple 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

// start
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

