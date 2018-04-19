var TagInstance= require('../models/product'); 

// Handle /2.4/v1/tags for GET
exports.getProductInventoryAll = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();		
	console.log("getTags---");
	var product_id = req.body.product_id;
	var inventoryAdd = req.body.inventoryAdd;
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		console.log("Not in");
		var sql = "select inventory from product where id='"+product_id+"'";
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
				
				var inventory = parseInt(rows['0'].inventory)+parseInt(inventoryAdd);
				console.log(inventory);
				tagInstance.set('id',product_id);
				tagInstance.set('inventory',inventory);
				tagInstance.save(function(err){
					if(err) 
						{
							console.log(JSON.stringify(err));
							console.log("No");
							customErr.status = 503;
							customErr.message = "db query error";		
							next(customErr);			
						}
					else
						{	console.log("OK---");
							var apiOutput = {};
							apiOutput.status = "success";
							apiOutput.message = "product inventory add  OK";		
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