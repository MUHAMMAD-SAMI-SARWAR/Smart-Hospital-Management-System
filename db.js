const mysql = require('mysql2');

// Connection banayein
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Tumhara MySQL username
  password: 'Enter your password', // Jo password tumne Workbench mein rakha tha
  database: 'HospitalDB'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection is fail to connect: ' + err.stack);
    return;
  }
  console.log('Congratulation,Database is successfully connected.');
});

module.exports = connection;