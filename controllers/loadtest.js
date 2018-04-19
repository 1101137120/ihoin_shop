var Time_lineInstance= require('../models/time_lines'); 

// Handle /2.4/v1/during for POST
exports.postloadtest = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var time_lineInstance = new Time_lineInstance();		

	
	//if(typeof req.body.tag_name === "undefined")errorMessages.push("Missing 'tag_name' field");

	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
					var apiOutput = {};
					apiOutput.status = "success";
					apiOutput.message = "load test";
					res.json(JSON.stringify(apiOutput));	
						
		// var tag_name = time_lineInstance.escape(req.body.tag_name);
/* 		var created_at = new Date();

		var sql = 
		
		"select count(*) from time_line";
		
		
	
		time_lineInstance.query(sql,function(err,rows,fields){
			if(err) 
			{
				customErr.status = 503;
				customErr.message = "db query error";	
				console.log("db query error:"+err);
				next(customErr);			
					
			}
			else
			{
				 
					var apiOutput = {};
					apiOutput.status = "success";
					apiOutput.message = "load test";
					res.json(JSON.stringify(apiOutput));	
				



				
			}
		
		}); */
	
		
		
		

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