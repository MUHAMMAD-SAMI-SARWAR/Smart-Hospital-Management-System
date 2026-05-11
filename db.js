const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',     
  password: 'Enter your password', 
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
