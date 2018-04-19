var TagInstance= require('../models/tag'); 

// Handle /2.4/v1/department/tags for GET
exports.getDepartmentTags = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();		
	console.log("getTags---");
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		var departments;
		var outputResponse = [];
		var sql = "select distinct(department) as department from tag";
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
				departments = rows;
	
				sql = "select * from tag";
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
					
						for(var i=0;i<departments.length;i++)
						{
							var tempobject = {};
							tempobject.department = departments[i].department;
							tempobject.data = [];
							for(var j=0;j<rows.length;j++)
							{
								if(departments[i].department === rows[j].department)
								{
									
									tempobject.data.push(rows[j]);
								}			
							
							
							}
							outputResponse.push(tempobject);
							
						}					
						var apiOutput = {};
						apiOutput.status = "success";
						apiOutput.message = "tag found";
						apiOutput.response = outputResponse;			
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