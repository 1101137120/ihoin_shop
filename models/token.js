var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  agent	   :false,
  password : 'isup155231',
  database : 'api',
});

var Token = MyAppModel.extend({
    tableName: "token",
});
module.exports = Token;

/*var mysql = require('mysql');
// 建立資料庫連線池
var pool  = mysql.createPool({
    host     : 'localhost',
  user     : 'root',
  password : 'isup155231',
  database : 'api',
});
	//console.log('ssssssssssssss');
			pool.query( 'select * from token', function(error, results,fields) {
			console.log('token');
            // 使用連線查詢完資料
			console.log(results);
			module.exports = results;
            // 釋放連線
           // connection.release();
            // 不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用
        });*/
