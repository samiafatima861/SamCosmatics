require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db'); // adjust only if your config path differs

(async () => {
  try {
    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASS || 'ChangeMe123!';
    const phone = process.env.ADMIN_PHONE || null;
    const address = process.env.ADMIN_ADDRESS || null;

    console.log('Using admin:', email); // debug line

    const hash = await bcrypt.hash(password, 10);

    const [rows] = await db.query('SELECT id FROM admins WHERE email = ? LIMIT 1', [email]);
    if (rows.length) {
      console.log('Admin already exists with email:', email);
      process.exit(0);
    }

    const [res] = await db.query(
      'INSERT INTO admins (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, phone, address]
    );

    console.log('Admin created, id:', res.insertId, 'email:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
})();
