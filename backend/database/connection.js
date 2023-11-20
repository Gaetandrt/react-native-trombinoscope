const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'survivorpool'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err);
    throw err;
  }
});

module.exports = db
