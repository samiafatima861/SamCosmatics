const path = require('path');
const Blog = require('../models/blog');

exports.list = async (req, res) => {
  const blogs = await Blog.getAllAdmin();
  res.render('admin/blogs', { title: 'Blogs', blogs });
};

exports.showCreate = (req, res) => {
  res.render('admin/blog-form', { title: 'New Blog Post', blog: {} });
};

exports.create = async (req, res, next) => {
  try {
    const { title, excerpt, content, status } = req.body;
    if (!title || !content) throw new Error('Title and content required');

    const file = req.file;
    const cover_image_url = file ? '/images/' + path.basename(file.path) : (req.body.cover_image_url || null);

    const slug = Blog.slugify(title);
    await Blog.create({ title, slug, excerpt, content, cover_image_url, status });
    res.redirect('/admin/blogs');
  } catch (err) {
    next(err);
  }
};

exports.showEdit = async (req, res) => {
  const blog = await Blog.getById(req.params.id);
  res.render('admin/blog-form', { title: 'Edit Blog Post', blog });
};

exports.update = async (req, res, next) => {
  try {
    const { title, excerpt, content, status } = req.body;


    const file = req.file;
    let cover_image_url = req.body.cover_image_url;
    if (file) {
      cover_image_url = '/images/' + path.basename(file.path);
    } else if (!cover_image_url) {
      const existing = await Blog.getById(req.params.id);
      cover_image_url = existing ? existing.cover_image_url : null;
    }

    const slug = Blog.slugify(title);
    await Blog.update(req.params.id, { title, slug, excerpt, content, cover_image_url, status });
    res.redirect('/admin/blogs');
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  await Blog.remove(req.params.id);
  res.redirect('/admin/blogs');
};