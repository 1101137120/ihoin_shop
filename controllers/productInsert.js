var TagInstance= require('../models/product'); 

// Handle /2.4/v1/tags for GET
exports.getProduct = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	customErr.message=errorMessages;
	var tagInstance = new TagInstance();		
	console.log("getTags---");
	console.log(req.body.product_uid );
	if(typeof req.body.product_uid === "undefined")errorMessages.push("Missing 'product_uid' field");
	if(typeof req.body.product_name === "undefined")errorMessages.push("Missing 'product_name' field");
	if(typeof req.body.inventory === "undefined")errorMessages.push("Missing 'inventory' field");
	if(typeof req.body.price === "undefined")errorMessages.push("Missing 'price' field");
	console.log(customErr.message);
	var product_uid = req.body.product_uid;
	var product_name = req.body.product_name;
	var inventory = req.body.inventory;
	var price = req.body.price;
	var URL = req.body.URL;
	
	if(customErr.message.length >0)
	{
		next(customErr);	
	}
	else
	{
		tagInstance.set('product_uid', product_uid);
		tagInstance.set('product_name', product_name);
		tagInstance.set('inventory', inventory);
		tagInstance.set('price', price);
		tagInstance.set('URL', URL);
		tagInstance.save(function(err) {
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
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "product Insert";			
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
