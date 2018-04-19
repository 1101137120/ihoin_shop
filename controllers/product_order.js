var TagInstance= require('../models/product_order'); 
var TagaInstance= require('../models/order_detail'); 
var ProductInstance= require('../models/product');
// Handle /2.4/v1/tags for GET
exports.getProductOrder = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();
	var tagaInstance = new TagaInstance();
	var productInstance = new ProductInstance();
	var create_at = new Date();
	var formatDate = create_at.getFullYear() + "-"+addZero(create_at.getMonth()+1)+"-"+addZero(create_at.getDate())+" "
		+addZero(create_at.getHours()) + ":" + addZero(create_at.getMinutes())+":"+addZero(create_at.getSeconds());
	console.log("getTags---");
if(typeof req.body.total_amount === "undefined")errorMessages.push("Missing 'total_amount' field");
if(typeof req.body.name === "undefined")errorMessages.push("Missing 'name' field");
if(typeof req.body.order_detail === "undefined")errorMessages.push("Missing 'order_detail' field");
if(typeof req.body.address === "undefined")errorMessages.push("Missing 'address' field");

	var order_uid = getRandomArray(1,10,10);
	var name = req.body.name;
	var total_amount = req.body.total_amount;
	var address = req.body.address;
	var order_detail = stringToJson(req.body.order_detail);
	/*var product_uid = req.body.product_uid;
	var total = req.body.total;
	var amount = req.body.amount;*/
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		console.log("Not in");
		
		
		console.log('CC'+order_uid);
		console.log('CC'+total_amount);
		console.log('CC'+address);
		tagInstance.set('order_uid', order_uid);
		tagInstance.set('total_amount', total_amount);
		tagInstance.set('address', address);
		tagInstance.set('name', name);
		tagInstance.set('create_at', create_at);
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
			{
			console.log("order insert OK");
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
					var a=0;
				for(var i=0;i<order_detail.length;i++){
					var sql = "SELECT * FROM product where product_uid='"+order_detail[i].product_uid+"'";
		productInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));
				console.log("No");
				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}else{
				console.log("OK-- inventory"+a);
				console.log("OK-- inventory"+rows['0'].id+order_detail[a]);
							var inventory = parseInt(rows['0'].inventory)-parseInt(order_detail[a].total);
							var sql = "update product set inventory='"+inventory+"' where id='"+rows['0'].id+"'"
							a=a+1;
							productInstance.query(sql,function(err, rows, fields) {
							//productInstance.set('id',rows['0'].id);
							//productInstance.set('inventory',inventory);
							
							//productInstance.save(function(err){
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
				
				
				
			}
							
			
		});
		var sql = "insert into order_detail (product_uid,total,amount,order_id,order_uid) values('"+order_detail[i].product_uid+"','"+order_detail[i].total+"','"+order_detail[i].amount+"','"+rows['0'].id+"','"+rows['0'].order_uid+"')"
					/*console.log("orderdetail"+order_detail[i].product_uid);
					tagaInstance.set('product_uid',order_detail[i].product_uid);
					tagaInstance.set('total',order_detail[i].total);
					tagaInstance.set('amount',order_detail[i].amount);
					tagaInstance.set('order_id',rows['0'].id);
					tagaInstance.set('order_uid',rows['0'].order_uid);
					tagaInstance.save(function(err){*/
					tagaInstance.query(sql,function(err, rows, fields) {
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
								
			}
		});		
					
				}
								
		
					
				}	
		});

			}
		});
						var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "order insert OK";		
				apiOutput.order_uid = order_uid;
				apiOutput.formatDate = formatDate;
				res.json(apiOutput);
		
		

		


	}
};

function getRandom(minNum, maxNum) {	
	return Math.floor( Math.random() * (maxNum - minNum + 1) ) + minNum;
}

function getRandomArray(minNum, maxNum, n) {	
	var rdmArray="0";		
 
	for(var i=0; i<n; i++) {
			rdm = getRandom(minNum, maxNum);
 
		rdmArray = rdmArray+rdm;
		}
	return rdmArray;
}

function stringToJson(json){
   eval('var s='+json+';');
   return s;
}
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