const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') });



const requireAdmin = require('../middleware/requireAdmin');
const adminBlogCtrl = require('../controllers/adminBlogController');
const adminFaqCtrl = require('../controllers/adminFaqController');
const adminFaqSubmissionCtrl = require('../controllers/adminFaqSubmissionController');


// Blogs
router.get('/admin/blogs', requireAdmin, adminBlogCtrl.list);
router.get('/admin/blogs/new', requireAdmin, adminBlogCtrl.showCreate);
router.post('/admin/blogs/new', requireAdmin, upload.single('cover_image'), adminBlogCtrl.create);
router.get('/admin/blogs/:id/edit', requireAdmin, adminBlogCtrl.showEdit);
router.post('/admin/blogs/:id/edit', requireAdmin, upload.single('cover_image'), adminBlogCtrl.update);
router.post('/admin/blogs/:id/delete', requireAdmin, adminBlogCtrl.delete);

// FAQs
router.get('/admin/faqs', requireAdmin, adminFaqCtrl.list);
router.get('/admin/faqs/new', requireAdmin, adminFaqCtrl.showCreate);
router.post('/admin/faqs/new', requireAdmin, adminFaqCtrl.create);
router.get('/admin/faqs/:id/edit', requireAdmin, adminFaqCtrl.showEdit);
router.post('/admin/faqs/:id/edit', requireAdmin, adminFaqCtrl.update);
router.post('/admin/faqs/:id/delete', requireAdmin, adminFaqCtrl.delete);


router.get('/admin/faq-submissions', requireAdmin, adminFaqSubmissionCtrl.list);
router.post('/admin/faq-submissions/:id/publish', requireAdmin, adminFaqSubmissionCtrl.publish);
router.post('/admin/faq-submissions/:id/discard', requireAdmin, adminFaqSubmissionCtrl.discard);
router.post('/admin/faq-submissions/:id/delete', requireAdmin, adminFaqSubmissionCtrl.delete);

module.exports = router;