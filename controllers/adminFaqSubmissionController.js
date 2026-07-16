const FaqSubmission = require('../models/faqSubmission');
const Faq = require('../models/faq');

exports.list = async (req, res) => {
  const status = req.query.status || null;
  const submissions = await FaqSubmission.getAll(status);
  res.render('admin/faq-submissions', { title: 'FAQ Questions', submissions, currentFilter: status });
};

exports.discard = async (req, res) => {
  await FaqSubmission.updateStatus(req.params.id, 'discarded');
  res.redirect('/admin/faq-submissions');
};

exports.delete = async (req, res) => {
  await FaqSubmission.remove(req.params.id);
  res.redirect('/admin/faq-submissions');
};

// Turns a submission directly into a published FAQ
exports.publish = async (req, res, next) => {
  try {
    const submission = await FaqSubmission.getById(req.params.id);
    if (!submission) return res.redirect('/admin/faq-submissions');

    const { answer } = req.body;
    if (!answer) return res.redirect('/admin/faq-submissions');

    await Faq.create({ question: submission.question, answer, sort_order: 0 });
    await FaqSubmission.updateStatus(req.params.id, 'answered');

    res.redirect('/admin/faq-submissions');
  } catch (err) {
    next(err);
  }
};