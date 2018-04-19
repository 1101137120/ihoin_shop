var serverBaseUrl = document.domain+":9004";
var protocol = location.protocol;
var hostname = location.hostname; 
var intervaObj = {};
var tableStructure = {};
tableStructure.tag_id = 1;
tableStructure.tag_name =2;
tableStructure.tag_uid = 3;
tableStructure.strength = 4;
tableStructure.position = 5;
tableStructure.created_at = 6;
tableStructure.during = 7;
tableStructure.comment = 8;
function init() {


	console.log("server base url:"+"http://"+serverBaseUrl);
	var socket = io.connect("http://"+serverBaseUrl);

	socket.on('connect', function () {


	});	

	socket.on("channel1", function (readerObj) {
		

		// console.log("data from channel:"+JSON.stringify(readerObj));
 		if(readerObj.tag_uid !== "無" && readerObj.tag_uid !== "" && readerObj.tag_uid !== null && readerObj.tag_name !== "")
		{


			var positionOnRow = $("#"+readerObj.tag_uid+" td:nth-child("+tableStructure.position+")").text();
			var positionFromChannel = readerObj.position;
			// var positionFromChannel = "備料室";



			// 把這次讀到的TAG設成黃色
			$("#"+readerObj.tag_uid).css('background-color','#FFE700');

			// $('table a:hover').css('background-color','#FFE700');
			$('table tr:hover td').css('background-color','#FFE700');
			// 如果傳來的封包有問題則設成紅色
			if(readerObj.wrong_packet ==="1")
			{
				$("#"+readerObj.reader_name).css('background-color','#FF0000');
			
			}
			
			//設定強度與地點
			$("#"+readerObj.tag_uid+" td:nth-child("+tableStructure.position+")").text(readerObj.position);
			$("#"+readerObj.tag_uid+" td:nth-child("+tableStructure.strength+")").text(readerObj.strength);

			// 設定最後更新時間
			var created_at = new Date(readerObj.created_at);
			var formatCreated_at = created_at.getFullYear() + "-"+addZero(created_at.getMonth()+1)+"-"+addZero(created_at.getDate())+" "
			+addZero(created_at.getHours()) + ":" + addZero(created_at.getMinutes())+":"+addZero(created_at.getSeconds()); 
			
			$("#"+readerObj.tag_uid+" td:nth-child("+tableStructure.created_at+")").text(formatCreated_at);


			
			if(positionOnRow != null&& positionOnRow !== ""  && positionOnRow !== positionFromChannel)
			{
				console.log("position on row:"+positionOnRow);
				console.log("position from channel:"+positionFromChannel);		
				console.log("tag_name from channel:"+readerObj.tag_name);			
				var tag_uid = readerObj.tag_uid;
				var tag_name = readerObj.tag_name;		
				
				clearInterval(intervaObj[tag_uid]);
				delete intervaObj[tag_uid];			
			
				$("#"+readerObj.tag_uid).css('background-color','#ff0066');
				setInterval(function(){
				
					$.ajax({
						 type: "POST",
						 url: protocol+"//"+hostname+":9004/2.4/v1/duringtest",
						 data:{tag_name:tag_name}
					})
					.success(function(msg) {
						var ojb = JSON.parse(msg)
						var minCreated = ojb.response[0].minCreated;
						console.log("tag_uid:"+tag_uid);
						console.log("intervaObj[tag_uid]:"+intervaObj[tag_uid]);
						clearInterval(intervaObj[tag_uid]);
						delete intervaObj[tag_uid];								
						intervaObj[tag_uid] = 					
						
							setInterval(function(){
								
								// console.log("minCreated:"+minCreated);
								if(minCreated != null)
								{
									var diffobj = diffDatetime(null,minCreated);
									// console.log("diffobj.diffMs:"+diffobj.diffMs);

									
									// 如果距離現在時刻大於五分鐘就把顏色設成綠色
									if(diffobj.diffMs > 1000 * 60 * 5)
									{
									
											$("#"+tag_uid).css('background-color','#C3EEE7');
									}
									else // 如果距離現在時刻小於五分鐘就把顏色設成灰色
									{
											$("#"+tag_uid).css('background-color','#dfdfdf');
									
									
									} 
									$("#"+tag_uid+" td:nth-child("+tableStructure.during+")").text(diffobj.diffresult);									

								}

							},1000);	
						console.log("after assign intervaObj[tag_uid]:"+intervaObj[tag_uid]);

					})
					.fail(function(error) {
							//console.log("error:"+JSON.stringify(error));
					})
					.always(function() {
							//console.log("complete")
					});					
				
				
				},10000);	
			
				
				
				
				
				
				
/* 				var tag_uid = readerObj.tag_uid;
				var tag_name = readerObj.tag_name;
				console.log("tag_uid:"+tag_uid);
				console.log("intervaObj.tag_uid:"+intervaObj[tag_uid]);
				
				
				clearInterval(intervaObj[tag_uid]);
				delete intervaObj[tag_uid];
				console.log("after deletion:"+intervaObj[tag_uid]);
				
				$.ajax({
					 type: "POST",
					 url: protocol+"//"+hostname+":9004/2.4/v1/duringtest",
					 data:{tag_name:tag_name}
				})
				.success(function(msg) {
					var ojb = JSON.parse(msg)
					var minCreated = ojb.response[0].minCreated;
					intervaObj[tag_uid] = 					
					
						setInterval(function(){
							
							// console.log("minCreated:"+minCreated);
							if(minCreated != null)
							{
								var diffobj = diffDatetime(null,minCreated);
								// console.log("diffobj.diffMs:"+diffobj.diffMs);

								
								// 如果距離現在時刻大於五分鐘就把顏色設成綠色
								if(diffobj.diffMs > 1000 * 60 * 5)
								{
								
										$("#"+tag_uid).css('background-color','#C3EEE7');
								}
								else // 如果距離現在時刻小於五分鐘就把顏色設成灰色
								{
										$("#"+tag_uid).css('background-color','#dfdfdf');
								
								
								} 
								$("#"+tag_uid+" td:nth-child("+tableStructure.during+")").text(diffobj.diffresult);									

							}

						},1000);	

				})
				.fail(function(error) {
						//console.log("error:"+JSON.stringify(error));
				})
				.always(function() {
						//console.log("complete")
				}); */					
				
				
				
			}
		
		}
		

	});



	$.ajax({
		 type: "GET",
		 url: protocol+"//"+hostname+":9004/2.4/v1/tags"
	})
	.success(function( msg ) {
		
		var readerArray = msg.response;
		for(var i=0;i<readerArray.length;i++)
		{
			if(readerArray[i].tag_name.trim() !== "")
			{
				var comment = "";
 				if(readerArray[i].comment !== null)
				{				
					comment = readerArray[i].comment;				
				} 
				
				var row = 
					"<tr id='"+readerArray[i].tag_uid+"'>"+
						"<td data-field='tag_id'>"+readerArray[i].id+"</td>"+
						"<td data-field='tag_name'>"+readerArray[i].tag_name+"</td>"+
						"<td data-field='tag_uid'>"+readerArray[i].tag_uid+"</td>"+						
						"<td data-field='tag_strength'></td>"+						
						"<td data-field='newest_position'></td>"+
						"<td data-field='last_modified'></td>"+
						"<td data-field='during'></td>"+
						"<td data-field='tag_comment'>"+comment+"</td>"+
					"</tr>";
				$("#readerTable tbody").append(row);
		

				var tag_id = readerArray[i].id;
				var tag_uid = readerArray[i].tag_uid;
				var tag_name = readerArray[i].tag_name;
				(function(tag_uid){
					$.ajax({
						 type: "POST",
						 url: protocol+"//"+hostname+":9004/2.4/v1/tag_position",
						 data:{tag_id:tag_id}
					})
					.success(function(msg) {

						$("#"+tag_uid+" td:nth-child("+tableStructure.position+")").text(msg.response[0].position);

						var date = new Date(msg.response[0].created_at);
						var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
						+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 
						
						$("#"+tag_uid+" td:nth-child("+tableStructure.created_at+")").text(formatDate);
						


					})
					.fail(function() {
							//console.log("error");
					})
					.always(function() {
							//console.log("complete")
					});					
				
				})(tag_uid);
		
	
				(function(tag_uid,tag_name){

					$.ajax({
						 type: "POST",
						 url: protocol+"//"+hostname+":9004/2.4/v1/duringtest",
						 data:{tag_name:tag_name}
					})
					.success(function(msg) {
						var ojb = JSON.parse(msg)
						var minCreated = ojb.response[0].minCreated;
						intervaObj[tag_uid] = 					
						
							setInterval(function(){
								
								// console.log("minCreated:"+minCreated);
								if(minCreated != null)
								{
									var diffobj = diffDatetime(null,minCreated);
									// console.log("diffobj.diffMs:"+diffobj.diffMs);

									
									// 如果距離現在時刻大於五分鐘就把顏色設成綠色
									if(diffobj.diffMs > 1000 * 60 * 5)
									{
									
											$("#"+tag_uid).css('background-color','#fafafa');
									}
									else // 如果距離現在時刻小於五分鐘就把顏色設成灰色
									{
											$("#"+tag_uid).css('background-color','#c75359');
									
									
									} 
									$("#"+tag_uid+" td:nth-child("+tableStructure.during+")").text(diffobj.diffresult);									

								}

							},1000);	

					})
					.fail(function(error) {
							//console.log("error:"+JSON.stringify(error));
					})
					.always(function() {
							//console.log("complete")
					});							

				})(tag_uid,tag_name);  

			}

		}

	})
	.fail(function() {
			//console.log("error");
	})
	.always(function() {
			//console.log("complete")
	});


}
function diffDatetime(maxCreated,minCreated)
{
		var min = new Date(minCreated);
		var max = new Date(maxCreated);
		if(maxCreated == null)
		{
			max = new Date();
		}
		var diffMs = (max - min); // milliseconds between min & max
		var diffDays = Math.floor(diffMs / 86400000); // days				
		var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
		var diffresult = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes ";		

		var result = {'diffMs':diffMs,'diffDays':diffDays,'diffHrs':diffHrs,'diffMins':diffMins,'diffresult':diffresult};
		// console.log("diffMs:"+diffMs);
		// console.log("result.diffMs:"+result.diffMs);
		return result;

}
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
$(document).on('ready', init);

