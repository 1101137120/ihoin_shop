process.env.TZ = 'Asia/Taipei' 
// Get the packages we need
var express = require('express');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

var productController = require('./controllers/product');
var productAllController = require('./controllers/productAll');
var productOrderController = require('./controllers/product_order');
var productOrderAllController = require('./controllers/product_orderAll');
var productOrderDetailController = require('./controllers/order_detail');
var productOrderDetailAllController = require('./controllers/order_detailAll');
var productInventoryAddController = require('./controllers/inventoryAdd');
var productInsertController = require('./controllers/productInsert');

var session = require('express-session');
var passport = require('passport');
var path = require('path');
var mime = require('mime');
//file upload
var multer  = require('multer');
var done=false; 
// Create our Express application
var app = express();
app.set('http_port', 9004);
//app.set('ip', "localhost");

 app.set('ip', "172.31.1.179");
//app.set('ip', "1.163.240.170");
//app.set('ip', "127.0.0.1");

//handle for jsonp
//handle for jsonp
app.set("jsonp callback", true);
// http
var http = require('http');
var httpServer = http.createServer(app);

var io = require("socket.io").listen(httpServer);
io.set('transports', ['polling', 'websocket']);
var fs = require('fs');
app.use("/registration/v1/img",express.static(__dirname + "/public/img"));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://www.ihoin.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//handle for jsonp
app.set("jsonp callback", true);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(session({
    secret: 'session_cookie_secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.session());

app.set("views", __dirname + "/views");
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');





app.use("/2.4/v1",express.static("public", __dirname + "/public"));
app.all("/2.4/v1/index", function(request, response) {
	response.render('index');


});





var routerRegistration = express.Router();
app.use('/2.4/v1', routerRegistration);

//查詢單件商品	uid
routerRegistration.route('/product')
	.post(productController.getProduct);
//後台商品顯示	
routerRegistration.route('/productAll')
	.post(productAllController.getProductAll);	
//新贈訂單
routerRegistration.route('/product_order')
	.post(productOrderController.getProductOrder);
	//商品新增
	routerRegistration.route('/productInsert')
        .post(productInsertController.getProduct);
//後台訂單顯示	
routerRegistration.route('/product_orderAll')
	.post(productOrderAllController.getProductOrderAll);	
//新增訂單的明細	
routerRegistration.route('/order_detail')
	.post(productOrderDetailController.getProductOrderDetail);
//後台訂單明細顯示	
routerRegistration.route('/order_detailAll')
	.post(productOrderDetailAllController.getProductOrderDetailAll);	
//後台庫存增加	
routerRegistration.route('/inventoryAdd')
	.post(productInventoryAddController.getProductInventoryAll);	

	
// Error Hanlding
app.use(function(err, req, res, next) {
	var apiOutput = {};
	apiOutput.status = "failure";
	apiOutput.error_message = err.message;
	
	if(typeof err.gcm_user_id !== "undefined")apiOutput.gcm_user_id = err.gcm_user_id;
	if(typeof err.status !== "undefined")res.statusCode = err.status;	

	res.send(JSON.stringify(apiOutput) || '** no relevant error handle **');  
	
	

	
	return next();
}); 
httpServer.listen(app.get('http_port'),app.get('ip'),function(){
	console.log("listen on port "+app.get('http_port')+", server is running");


});


