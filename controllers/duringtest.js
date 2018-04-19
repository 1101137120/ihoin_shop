var Time_lineInstance= require('../models/time_lines_today'); 

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
		var sql = "select min(created_at) as minCreated from time_line_today";
		
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
				console.log("min(created_at):"+rows[0].minCreated);
				var mindate = new Date(rows[0].minCreated);
				var minformatDate = mindate.getFullYear() + "-"+addZero(mindate.getMonth()+1)+"-"+addZero(mindate.getDate());					
				
				var currentdate = new Date();
				var currentformatDate = currentdate.getFullYear() + "-"+addZero(currentdate.getMonth()+1)+"-"+addZero(currentdate.getDate());					
				console.log("minformatDate:"+minformatDate);
				console.log("currentformatDate:"+currentformatDate);
				if(minformatDate !== currentformatDate)
				{
					console.log("!!!!!!!!!!!!!!!!!!! is not equal to");
					sql = "delete from time_line_today";
					
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
							sql = 
							"insert into time_line_today "+
							"(id,reader_name,created_at,is_read,strength,tag_uid,position,tag_name) "+
								"select "+
								"id,reader_name,created_at,is_read,strength,tag_uid,position,tag_name "+
								"from time_line "+
								"where created_at between "+
								"'"+currentformatDate+" 00:00:00' and "+
								"'"+currentformatDate+" 23:59:59'";
							
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
									console.log("insertion success");
									// res.json("!!!!!!!!!!!!!!!!!!!!!!!!!!!!success");
									customErr.status = 503;
									customErr.message = "maintanence";	
									console.log("db query error:"+err);
									next(customErr);								
								}
							});						
						
						
						}
					});				
				
				}
				else
				{
					var tag_name = time_lineInstance.escape(req.body.tag_name);
					var created_at = new Date();
					
					sql = 
					
					"select count(*),max(created_at) as maxCreated,min(created_at) as minCreated from time_line_today "+
					"where id >= "+
					"("+
					"select time_line_today.id from time_line_today "+
					"where id> (SELECT id "+
					"FROM time_line_today "+
					"WHERE tag_name = '"+tag_name+"' and id IN (SELECT MAX(id) FROM time_line_today where tag_name = '"+tag_name+"' GROUP BY reader_name) order by created_at desc limit 1 OFFSET 1) "+
					"and "+
					"tag_name = '"+tag_name+"' "+
					"limit 1 "+
					") "+
					"and id <=(select max(id) from time_line_today where tag_name = '"+tag_name+"') "+
					"and tag_name = '"+tag_name+"'";
					
					
					console.log("sql:"+sql);
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
								sql = 
								"select max(created_at) as maxCreated,min(created_at) as minCreated  from time_line_today where  tag_name = '"+tag_name+"'"
								
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
											rows[0].minCreated = null;												
											rows[0].maxCreated = null;	
											rows[0].during = null;

										}					
										else
										{
											rows[0].minCreated = formatDateime(rows[0].minCreated);												
											rows[0].maxCreated = formatDateime(rows[0].maxCreated);											
											rows[0].during = diffDatetime(rows[0].maxCreated,rows[0].minCreated).diffresult;
										
										}										
										
										var apiOutput = {};
										apiOutput.status = "success";
										apiOutput.message = "during test";
										apiOutput.response = rows;
										res.json(JSON.stringify(apiOutput));											
									
									}
								});							
					
							}
							else
							{
									
					
								rows[0].minCreated = formatDateime(rows[0].minCreated);												
								rows[0].maxCreated = formatDateime(rows[0].maxCreated);											
								rows[0].during = diffDatetime(rows[0].maxCreated,rows[0].minCreated).diffresult;
								var apiOutput = {};
								apiOutput.status = "success";
								apiOutput.message = "during test";
								apiOutput.response = rows;
								res.json(JSON.stringify(apiOutput));						
							
							
							}


							
						}
					
					});				
				
				
				}
				
				
				
							

			}
		});
		
		
		
		
		
		
		
/* 		var tag_name = time_lineInstance.escape(req.body.tag_name);
		var created_at = new Date();

		var sql = 
		
		"select count(*),max(created_at) as maxCreated,min(created_at) as minCreated from time_line_today "+
		"where id >= "+
		"("+
		"select time_line_today.id from time_line_today "+
		"where id> (SELECT id "+
		"FROM time_line_today "+
		"WHERE tag_name = '"+tag_name+"' and id IN (SELECT MAX(id) FROM time_line_today where tag_name = '"+tag_name+"' GROUP BY reader_name) order by created_at desc limit 1 OFFSET 1) "+
		"and "+
		"tag_name = '"+tag_name+"' "+
		"limit 1 "+
		") "+
		"and id <=(select max(id) from time_line_today where tag_name = '"+tag_name+"') "+
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
				
					customErr.status = 503;
					customErr.message = "db query error";	
					console.log("db query error:"+err);
					next(customErr);					
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
		
		}); */
	
		
		
		

	}
};



function formatDateime(timestr)
{
	var date = new Date(timestr);
	var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
	+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());					
	return formatDate;
}
function diffDatetime(maxCreated,minCreated)
{
		var min = new Date(minCreated);
		var max = new Date(maxCreated);
		var diffMs = (max - min); // milliseconds between min & max
		var diffDays = Math.floor(diffMs / 86400000); // days				
		var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
		var diffresult = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes ";		

		var result = {'diffMs':diffMs,'diffDays':diffDays,'diffHrs':diffHrs,'diffMins':diffMins,'diffresult':diffresult};
		return result;

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