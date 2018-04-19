 var serverBaseUrl = document.domain+":9004";
function init() {

	console.log("server base url:"+"http://"+serverBaseUrl);
	var socket = io.connect("http://"+serverBaseUrl);

	socket.on('connect', function () {


	});	
	var Reader27Active = false;
	var Reader23Avtive = false;
	socket.on("demochannel", function (readerObj) {
		console.log("收到"+JSON.stringify(readerObj));
 		// console.log("get the reader name:"+readerObj.reader_name);	
		var reader_name = readerObj.reader_name;
		
		var tag_id = readerObj.tag_id;
		var tag_name = readerObj.tag_name;
		var tag_uid = readerObj.tag_uid;
		
		var date = new Date(readerObj.created_at);
		var created_at = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
		+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 		
		
		
		if(Reader27Active)
		{
			if(reader_name === "27" && tag_uid !== "無" && tag_uid !== "")
			{
			
				var row =
				"<tr>"+
					"<td>"+tag_id+"</td>"+
					"<td>"+tag_name+"</td>"+
					"<td>"+tag_uid+"</td>"+
					"<td>"+created_at+"</td>"+
				"</tr>";
			
				$("#reader27 tbody").append(row);
				
			
			}
		
		}
		
		if(Reader23Avtive)
		{
			if(reader_name === "23")
			{
				if(reader_name === "23" && tag_uid !== "無" && tag_uid !== "")
				{
				
					var row =
					"<tr>"+
						"<td>"+tag_id+"</td>"+
						"<td>"+tag_name+"</td>"+
						"<td>"+tag_uid+"</td>"+
						"<td>"+created_at+"</td>"+
					"</tr>";
				
					$("#reader23 tbody").append(row);
					
				
				}			
			
			
			}		
		
		
		}

		
		
		
	});
	$("#start27").click(function(){
		Reader27Active = true;
		$("#Reader1_title span").remove();
		$("#reader27 tbody").empty();
		$("#Reader1_title").append("<span>狀態：偵測中......</span>");
	
	});
	
	
	$("#end27").click(function(){
		Reader27Active = false;
		$("#Reader1_title span").remove();
		$("#Reader1_title").append("<span>狀態：已結算</span>");	
		
		//把UID相同的列踢掉
		//再計算數量
		var uids = [];
		$("#reader27 tbody tr").each(function(){
			
			var uid = $(this).children('td:nth-child(3)').text();
			var contains = uids.indexOf(uid) > -1;
			if(!contains)
			{
				uids.push(uid);
			
			}
			else
			{
				$(this).remove();
			}
			
		
		
		
		});		
		$("#reader27 tbody").append("<tr align='center'><td></td><td></td><td><h1>總計："+uids.length+"</h1></td><td></td></tr>");
	

		
		
	
	});
	$("#start23").click(function(){
		Reader23Avtive = true;
		$("#Reader2_title span").remove();
		$("#reader23 tbody").empty();
		$("#Reader2_title").append("<span>狀態：偵測中......</span>");
	});

	$("#end23").click(function(){
		Reader23Avtive = false;
		$("#Reader2_title span").remove();
		$("#Reader2_title").append("<span>狀態：已結算</span>");	
		
		//把UID相同的列踢掉
		//再計算數量
		var uids = [];
		$("#reader23 tbody tr").each(function(){
			
			var uid = $(this).children('td:nth-child(3)').text();
			var contains = uids.indexOf(uid) > -1;
			if(!contains)
			{
				uids.push(uid);
			
			}
			else
			{
				$(this).remove();
			}
			
		
		
		
		});		
		$("#reader23 tbody").append("<tr align='center'><td></td><td></td><td><h1>總計："+uids.length+"</h1></td><td></td></tr>");
		
	
	});
}
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
$(document).on('ready', init);

