var mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  agent	   :false,
  password : 'root',
  database : 'ihoin_shop',
  port:'3306'//,
  //waitForConnections:true,
  //connectionLimit:10
});

var Client = MyAppModel.extend({
    tableName: "product_order",
});

//connection.release();
module.exports = Client;
