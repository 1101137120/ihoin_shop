 var serverBaseUrl = document.domain+":9004";
function init() {

	
	console.log("server base url:"+"http://"+serverBaseUrl);
	var socket = io.connect("http://"+serverBaseUrl);

	socket.on('connect', function () {


	});	

	socket.on("channel1", function (readerObj) {
		console.log("2.4頁面receive"+JSON.stringify(readerObj));
 		console.log("get the reader name:"+readerObj.reader_name);	
		
		$("#readerTable tr").css('background','#FFFFFF');
		console.log("did I get readerTable:"+$("#readerTable").length);
		//adding color
		$("#"+readerObj.reader_name).css('background-color','#FFE700');
		if(readerObj.wrong_packet ==="1")
		{
			$("#"+readerObj.reader_name).css('background-color','#FF0000');
		
		}
		
		//position column
		$("#"+readerObj.reader_name+" td:nth-child(2)").text(readerObj.position);
		
		//tag name column
		$("#"+readerObj.reader_name+" td:nth-child(3)").text(readerObj.tag_name);
		
		//tag uid column
		$("#"+readerObj.reader_name+" td:nth-child(4)").text(readerObj.tag_uid);
		
		//strength column
		$("#"+readerObj.reader_name+" td:nth-child(5)").text(readerObj.strength);
		
		
		var date = new Date(readerObj.created_at);
		var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
		+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());                                
		
		//created at column
		$("#"+readerObj.reader_name+" td:nth-child(6)").text(formatDate);
		
		
		
		
	});	
	var protocol = location.protocol;
	var hostname = location.hostname;
	$.ajax({
		 type: "GET",
		 //url: "http://10.1.1.77:9004/2.4/v1/readers ",
		 //url: "http://1.163.240.170:9004/2.4/v1/readers ",
		 url: protocol+"//"+hostname+":9004/2.4/v1/readers",
	})
	.success(function( msg ) {
		//alert(JSON.stringify(msg));
		//msg.response
		
		var readerArray = msg.response;
		console.log("readerArray:"+JSON.stringify(readerArray));
		for(var i=0;i<readerArray.length;i++)
		{
			
			var row = 
				"<tr id='"+readerArray[i].reader_name+"'>"+
					"<td data-field='reader_name'>"+readerArray[i].reader_name+"</td>"+
					"<td data-field='position'>"+readerArray[i].position+"</td>"+
					"<td data-field='tag_name'></td>"+
					"<td data-field='tag_uid'></td>"+
					"<td data-field='strength'></td>"+
					"<td data-field='created_at'></td>"+
				"</tr>";
			$("#readerTable tbody").append(row);			
		
		
		}
		
		
	

	})
	.fail(function() {
			console.log("error");
	})
	.always(function() {
			console.log("complete")
	});

}
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
$(document).on('ready', init);

