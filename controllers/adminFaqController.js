const Faq = require('../models/faq');

exports.list = async (req, res) => {
  const faqs = await Faq.getAll();
  res.render('admin/faqs', { title: 'FAQs', faqs });
};

exports.showCreate = (req, res) => {
  res.render('admin/faq-form', { title: 'New FAQ', faq: {} });
};

exports.create = async (req, res, next) => {
  try {
    const { question, answer, sort_order } = req.body;
    if (!question || !answer) throw new Error('Question and answer required');
    await Faq.create({ question, answer, sort_order });
    res.redirect('/admin/faqs');
  } catch (err) {
    next(err);
  }
};

exports.showEdit = async (req, res) => {
  const faq = await Faq.getById(req.params.id);
  res.render('admin/faq-form', { title: 'Edit FAQ', faq });
};

exports.update = async (req, res, next) => {
  try {
    const { question, answer, sort_order } = req.body;
    await Faq.update(req.params.id, { question, answer, sort_order });
    res.redirect('/admin/faqs');
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  await Faq.remove(req.params.id);
  res.redirect('/admin/faqs');
};