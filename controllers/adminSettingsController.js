const SiteSettings = require('../models/siteSettings');
const path = require('path');

exports.show = async (req, res) => {
  const settings = await SiteSettings.get();
  res.render('admin/settings', { 
    title: 'Site Settings', 
    settings,
  query: req.query
 });
};

exports.update = async (req, res, next) => {
  try {
    const body = req.body || {};
    const fields = {
      site_name: body.site_name || '',
      contact_email: body.contact_email || '',
      contact_phone: body.contact_phone || '',
      address: body.address || '',
      about_text: body.about_text || '',
      copyright_text: body.copyright_text || '',
      facebook_url: body.facebook_url || '',
      instagram_url: body.instagram_url || '',
      twitter_url: body.twitter_url || '',
      tiktok_url: body.tiktok_url || ''
    };

    if (req.files?.logo?.[0]) {
      fields.logo_url = '/images/' + path.basename(req.files.logo[0].path);
    }
    if (req.files?.favicon?.[0]) {
      fields.favicon_url = '/images/' + path.basename(req.files.favicon[0].path);
    }

    await SiteSettings.update(fields);
    res.redirect('/admin/settings?saved=1');
  } catch (err) {
    next(err);
  }
};