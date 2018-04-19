var Time_lineInstance= require('../models/time_lines'); 

// Handle /2.4/v1/during for POST
exports.postDuring = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var time_lineInstance = new Time_lineInstance();		

	
	if(typeof req.body.tag_name === "undefined")errorMessages.push("Missing 'tag_name' field");

	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		
		var tag_name = time_lineInstance.escape(req.body.tag_name);
		var created_at = new Date();

		var sql = 
		
		"select count(*),max(created_at) as maxCreated,min(created_at) as minCreated from time_line "+
		"where id >= "+
		"("+
		"select time_line.id from time_line "+
		"where id> (SELECT id "+
		"FROM time_line "+
		"WHERE tag_name = '"+tag_name+"' and id IN (SELECT MAX(id) FROM time_line where tag_name = '"+tag_name+"' GROUP BY reader_name) order by created_at desc limit 1 OFFSET 1) "+
		"and "+
		"tag_name = '"+tag_name+"' "+
		"limit 1 "+
		") "+
		"and id <=(select max(id) from time_line where tag_name = '"+tag_name+"') "+
		"and tag_name = '"+tag_name+"'";
		
		
	
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
				 
				
				
				if(rows[0].minCreated == null)
				{
				
					res.json("無法計算");	
				
				}
				else
				{
				
					var today = new Date(rows[0].minCreated);
					var Christmas = new Date(rows[0].maxCreated);
					var diffMs = (Christmas - today); // milliseconds between now & Christmas
					var diffDays = Math.floor(diffMs / 86400000); // days
					
					
					
					var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
					var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
					var diffresult = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes ";				
					
					var date = new Date(rows[0].minCreated);
					var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
					+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());					
					rows[0].minCreated = formatDate;
					
					date = new Date(rows[0].maxCreated);
					var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
					+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());						
					rows[0].maxCreated = formatDate;
					rows[0].during = diffresult;
					var apiOutput = {};
					apiOutput.status = "success";
					apiOutput.message = "during test";
					apiOutput.response = rows;
					res.json(JSON.stringify(apiOutput));						
				
				
				}


				
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