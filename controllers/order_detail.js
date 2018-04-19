var TagaInstance= require('../models/order_detail'); 
var TagInstance= require('../models/product_order');
var ProductInstance= require('../models/product');
// Handle /2.4/v1/tags for GET
exports.getProductOrderDetail = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();
	var tagaInstance = new TagaInstance();
	var productInstance = new ProductInstance();
	console.log("getTags---");

	var product_uid = req.body.product_uid;
	var total = req.body.total;
	var amount = req.body.amount;
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		console.log("Not in");
		console.log("prduct_order OK---");
		
		
		var sql = "SELECT * FROM product_order order by id desc limit 1";
		tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));
				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
						var sql = "SELECT * FROM product where product_uid='"+product_uid+"'";
		tagInstance.query(sql,function(err, rows, fields) {
							var inventory = parseInt(rows['0'].inventory)-parseInt(total);
							console.log('ssssss'+inventory);
							console.log('ssssss'+rows['0'].id);
							productInstance.set('id',rows['0'].id);
							productInstance.set('inventory',inventory);
							productInstance.save(function(err){
								if(err) 
			{
				console.log(JSON.stringify(err));
				console.log("No");
				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}else{
				console.log("OK-- inventory");
				
				
				
				
			}
								
			});
			
		});
		console.log("OK---"+product_uid);
		console.log("OK---"+total);
		console.log("OK---"+amount);
		console.log("OK---"+rows['0'].id);
		console.log("OK---"+rows['0'].order_uid);
					tagaInstance.set('product_uid',product_uid);
					tagaInstance.set('total',total);
					tagaInstance.set('amount', amount);
					tagaInstance.set('order_id',rows['0'].id);
					tagaInstance.set('order_uid',rows['0'].order_uid);
					tagaInstance.save(function(err){
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
				/*var sql = "select product.id,order_detail.product_uid,total,inventory from order_detail,product where order_detail.product_uid = product.product_uid and order_detail.order_id='"+rows['0'].id+"'";
		tagInstance.query(sql,function(err, rows, fields) {
						for(var i;i<rows.length;i++){
							inventory[i] = parseInt(rows[i].inventory)-parseInt(rows[i].total);
							ProductInstance.set('id',id[i]);
							ProductInstance.set('inventory',inventory[i]);
							ProductInstance.save();

							}
				});*/
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "order_detail insert OK";		
				res.json(apiOutput);
				
			}
		});				
		
					
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