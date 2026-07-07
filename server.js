// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');


const app = express();
// const PORT = process.env.PORT || 3000;

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
  res.locals.customer = req.session.customer || null;
  res.locals.cartCount = req.session?.cart ? Object.values(req.session.cart).reduce((a,b)=>a+Number(b||0),0) : 0;
  next();
});

// routes
app.get('/', (req, res) => {
  res.render('home', { title: 'SamCosmetics' });
});
const productsController = require('./controllers/productsController');
const productsApiRouter = require('./routes/productsApi');
const cartRoutes = require('./routes/cartRoutes');

app.get('/products', productsController.listProductsPage);
app.get('/products/:id', productsController.viewProductPage); // optional single product page
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

const checkoutRoutes = require('./routes/checkoutRoutes');
app.use('/', checkoutRoutes);

const adminNotifications = require('./routes/adminNotifications');
app.use('/', adminNotifications);

const adminRevenue = require('./routes/adminRevenue');
app.use('/', adminRevenue);

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

