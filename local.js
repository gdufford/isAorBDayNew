var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});

console.log('testing');

pool.getConnection(function(err, connection) {
  if (err) throw err;
  connection.query('select * from all_dates',function(error, results, fields){
    connection.release();

    if(error) throw error;
    else console.log(results[0].day_type + "--" + results[0].day_date);

    process.exit();
  });
});
