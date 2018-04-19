var Time_lineInstance= require('../models/time_lines'); 

// Handle /2.4/v1/collecteddata for POST
exports.getCollectedData = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var time_lineInstance = new Time_lineInstance();		

	
	if(typeof req.body.reader_name === "undefined")errorMessages.push("Missing 'reader_name' field");
	if(typeof req.body.start === "undefined")errorMessages.push("Missing 'start' field");
	if(typeof req.body.end === "undefined")errorMessages.push("Missing 'end' field");

	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		var reader_name = time_lineInstance.escape(req.body.reader_name);
		var start = time_lineInstance.escape(req.body.start);
		var end = time_lineInstance.escape(req.body.end);
		

		if(!validation.isNumber(reader_name))
		{
			customErr.status = 400;
			customErr.message = "reader_name must be a number";		
			console.log("reader_name must be a number");
			next(customErr);	
		
		}
		else
		{
		
			var sql = 
			" select reader_name,FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at)/ 60)*60) as date,count(*) as 'count',strength"+
			" from time_line "+
			" where reader_name = '"+reader_name+"' and "+
			" created_at between '"+start+"' and '"+end+"' "+
			" group by date "+
			" order by date asc; ";
			
		
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
	

					if(rows.length >= 1)
					{
						var apiOutput = {};
						apiOutput.status = "success";
						apiOutput.message = "get strength data success";
						
						
       						
						for(var i=0;i<rows.length;i++)
						{
						
							var date = new Date(rows[i].date);
							var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
							+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());   						
							rows[i].date = formatDate;
						
						}
						
						apiOutput.response = rows;
						apiOutput.reader_name = reader_name;
						res.json(apiOutput);		
						console.log(JSON.stringify(apiOutput));							
					
					}
					else
					{
								customErr.status = 404;
								customErr.message = "readerID:"+reader_name+" 沒有統計資料";	
								next(customErr);
					
					}
				
				}
			
			});
	
		
		
		}

	}
};

                      
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
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