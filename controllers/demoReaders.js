var ReaderInstance= require('../models/reader'); 

// Handle /2.4/v1/demoreaders for GET
exports.getDemoReaders = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var readerInstance = new ReaderInstance();		
	console.log("getDemoReaders---");
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		var sql = "select * from reader where comment = '畜牧'";
		readerInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "readers found";
				apiOutput.response = rows;			
				res.json(apiOutput);	
			}
		});



	}
};
// Handle /2.4/v1/readers for POST
exports.postReaders = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var readerInstance = new ReaderInstance();		
	if(typeof req.body.reader_name === "undefined")errorMessages.push("Missing 'reader_name' field");
	if(typeof req.body.position === "undefined")errorMessages.push("Missing 'position' field");
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
	
		var reader_name = readerInstance.escape(req.body.reader_name);
		var position = readerInstance.escape(req.body.position);
		
		console.log("reader_name:"+reader_name);
		console.log("position:"+position);
 		console.log("is reader_name numeric:"+validation.isNumber(reader_name));
		if(!validation.isNumber(reader_name))
		{
			customErr.status = 400;
			customErr.message = "reader_name is not a number";		
			next(customErr);	
		
		} 
		
		
		
 		readerInstance.set('reader_name', reader_name);
		readerInstance.set('position', position);
		readerInstance.save(function(err){
			if(err) 
			{
				console.log(JSON.stringify(err));
				
				if(err.errno === 1062)
				{
					customErr.status = 409;
					customErr.message = "reader record already exists";
				}
				else
				{
					customErr.status = 503;
					customErr.message = "db query error";			
				}
				next(customErr);			
			}
			else
			{	
				var sql = "select * from reader where reader_name = "+reader_name+"";
				console.log("sql:"+sql);
				
 				readerInstance.query(sql,function(err, rows, fields) {
					if(err) 
					{
						console.log(JSON.stringify(err));

						customErr.status = 503;
						customErr.message = "db query error";		
						next(customErr);					
					}
					else
					{
							var apiOutput = {};
							apiOutput.status = "success";
							apiOutput.message = "new reader established";
							apiOutput.response = rows;
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