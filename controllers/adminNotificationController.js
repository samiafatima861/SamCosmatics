const Notification = require('../models/notification');

exports.list = async (req, res) => {
  const notifications = await Notification.getAll(100);
  await Notification.markAllRead();
  res.render('admin/notifications', { title: 'Notifications', notifications });
};