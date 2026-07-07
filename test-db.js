// const db = require('./config/db');
// (async ()=> {
//   try {
//     const [rows] = await db.query('SELECT 1 AS ok');
//     console.log('DB OK', rows);
//     process.exit(0);
//   } catch (e) {
//     console.error('DB connect error', e);
//     process.exit(1);
//   }
// })();


require('dotenv').config();
const db = require('./config/db');

(async () => {
  try {
    const [rows] = await db.query('SELECT 1 AS ok');
    console.log('DB OK', rows);
    process.exit(0);
  } catch (err) {
    console.error('DB connect error:', err);
    process.exit(1);
  }
})();

