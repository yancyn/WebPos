var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);
var selectAllStatement = "SELECT * FROM Receipts ORDER BY created DESC LIMIT 100";
var dataset;

function showRecords() {
	$("#results").html("");
	//var tab = "<span style='display:block;width:80px;'></span>";
	var tab = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	db.transaction(function(tx) {
		tx.executeSql(selectAllStatement,[], function(tx,result) {
			dataset = result.rows;
			for(var i=0;i<dataset.length;i++) {
				var item = dataset.item(i);
				var line = "<li>";
				line += "<a id='id"+i+"' href='receipt.htm?id="+item["id"]+"'>"+item["id"]+"</a>";				
				line += "<input class='dateBox' id='created"+i+"' disabled='disabled' readonly='readonly' />";
				line += "<input class='numberBox' id='total"+i+"' readonly='readonly' />";
				line += "</li>";
				
				$("#results").append(line);
				
				//$("#id"+i).val(item["id"]);
				$("#id"+i).formatNumber({format:"000000", local:"US"});
				
				$("#created"+i).datepicker({dateFormat: "dd-M-yy"});
				$("#created"+i).datepicker("setDate",new Date(item["created"]*1000));
				
				$("#total"+i).val(item["total"]);
				$("#total"+i).formatNumber({format:"###,###,###.00", local:"US"});
			}
		});
	});
}

$(document).ready(function() {
	$("body").fadeIn(2000);
	showRecords();
});