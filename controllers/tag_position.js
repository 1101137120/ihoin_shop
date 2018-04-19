var TagInstance= require('../models/tag'); 

// Handle /2.4/v1/tag_position for GET
exports.postFindTagPosition = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();		
	console.log("getTagPosition---");
	console.log(req.body.tag_id);
	if(typeof req.body.tag_id === "undefined")errorMessages.push("Missing 'tag_id' field");
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	


	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
	
		var tag_id = req.body.tag_id;
		console.log("sql:"+tag_id);
		var interval = 5;
		// var sql = "SELECT * FROM `reader` WHERE reader_name =  (select reader_name from time_line where tag_name = (select tag_name from tag where id = "+tag_id+") and created_at BETWEEN timestamp(DATE_SUB(NOW(), INTERVAL "+interval+" MINUTE)) AND timestamp(NOW()) order by created_at desc limit 1)";
		
		var sql = 
		
		// "SELECT * FROM `reader` WHERE reader_name ="+
		// "(select reader_name from time_line where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		// "order by created_at desc limit 1)";		
		"SELECT *,(select created_at from time_line where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		"order by created_at desc limit 1)as created_at ,(select state from time_line where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		"order by created_at desc limit 1)as state FROM `reader` WHERE reader_name ="+
		"(select reader_name from time_line where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		"order by created_at desc limit 1)"	;
		
		
		//console.log("sql:"+sql);
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
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "tag newest position found";
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