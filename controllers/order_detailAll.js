var TagInstance= require('../models/product_order'); 

// Handle /2.4/v1/tags for GET
exports.getProductOrderDetailAll = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();		
	console.log("getTags---");
	var order_id = req.body.order_id;
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		console.log("Not in");
		var sql = "select * from product_order,order_detail,product where product_order.id=order_detail.order_id and product.product_uid = order_detail.product_uid and product_order.id='"+order_id+"'";
		tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));
console.log("No");
				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{console.log("OK---");
			for(var i=0;i<rows.length;i++){
				var date = new Date(rows[i].create_at);
				rows[i].create_at = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+addZero(date.getHours())+ ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());
console.log(rows[i].create_at);
}
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "product found";
				apiOutput.response = rows;			
				res.json(apiOutput);	
			}
		});



	}
};

function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}; 
var validation = {
	isEmailAddress:function(str) {
	   var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	   return pattern.test(str);  // returns a boolean
	},
	isNotEmpty:function (str) {
	   var pattern =/\S+/;
	   return pattern.test(str);  // returns a boolean
	},
	isNumber:function(str) {
	   var pattern = /^\d+$/;
	   return pattern.test(str);  // returns a boolean
	},
	isSame:function(str1,str2){
	  return str1 === str2;
}};

function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
