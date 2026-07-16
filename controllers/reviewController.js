const Review = require('../models/review');

exports.create = async (req, res, next) => {
  try {
    if (!req.session.customer) {
      return res.redirect('/login');
    }
    const productId = req.params.id;
    const customerId = req.session.customer.id;
    const { rating, comment } = req.body;

    const already = await Review.hasCustomerReviewed(productId, customerId);
    if (already) {
      return res.redirect(`/products/${productId}?reviewError=already_reviewed`);
    }

    await Review.create({
      product_id: productId,
      customer_id: customerId,
      rating: Number(rating),
      comment
    });

    res.redirect(`/products/${productId}?reviewSubmitted=1`);
  } catch (err) {
    next(err);
  }
};