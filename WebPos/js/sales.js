var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);
var selectAllStatement = "SELECT * FROM Receipts ORDER BY created DESC LIMIT 100";
/**
 * Sales array through the 12 months.
 */
var months = [1,2,3,4,5,6,7,8,9,10,11,12];
var sales = [0,0,0,0,0,0,0,0,0,0,0,0];
var dataset;

function showRecords() {
	$("#results").html("");
	//var tab = "<span style='display:block;width:80px;'></span>";
	var tab = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	
	//only show this year sales
	var today = new Date();
	var year = today.getYear()+1900;
	
	db.transaction(function(tx) {
		tx.executeSql(selectAllStatement,[], function(tx,result) {
			dataset = result.rows;
			for(var i=0;i<dataset.length;i++) {
				var item = dataset.item(i);
				var line = "<li>";
				line += "<a id='id"+i+"' href='receipt.htm?id="+item["id"]+"'>"+item["id"]+"</a>";				
				line += "<input class='dateBox' id='created"+i+"' disabled='disabled' readonly='readonly' />";
				line += "<input class='numberBox' id='total"+i+"' readonly='readonly' />";
				line += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				line += item["remarks"];
				line += "</li>";
				
				$("#results").append(line);
				
				$("#id"+i).formatNumber({format:"000000", local:"US"});
				
				var created = new Date(item["created"]*1000);
				if(created.getYear()+1900 == year) {
				  sales[parseInt(created.getMonth())] += parseFloat(item["total"]);
				}
				$("#created"+i).datepicker({dateFormat: "dd-M-yy"});
				$("#created"+i).datepicker("setDate",created);
				
				$("#total"+i).val(item["total"]);
				$("#total"+i).formatNumber({format:"###,###,###.00", local:"US"});				
			}
			
	    showGraph();
		});
	});
}

/**
 * Display sales in graph.
 * @source http://designmodo.com/create-interactive-graph-css3-jquery/
 */
function showGraph() {
	//y axis must be in number. fail after change to "Jan"
  	var points = [];
  	for(var i=0;i<sales.length;i++) {
  		points[i] = [i+1, sales[i]];
  	}
  	
	var graphData = [{
	        data: points,
	        color: '#71c73e',
	        points: { radius: 4, fillColor: '#71c73e' }
	    }
	];
	
	//plot the lines graph
	$.plot($("#graph-lines"), graphData, {
		series: {
			points: {show:true, radius:5},
			lines: {show:true},
			shadowSize: 0
		},
		grid: {color: '#646464', borderColor:'transparent', borderWidth: 20, hoverable: true},
		xaxis: {tickColor: 'transparent'},
		yaxis: {tickSize: 500},
	});
	
	//plot bar graph
	$.plot($("#graph-bars"),graphData,{
		series: {
			bars: {show:true, barWidth:.9, align:"center"},
			shadowSize:0,
		},
		grid: {color:"#646464", borderColor:"transparent", borderWidth:20, hoverable:true},
		xaxis: {tickColor:'transparent'},
		yaxis: {tickSize:500},
	});
}

/**
 * Convert to readable month string.
 * @param int i 1-based value.
 */
function convertToMonth(i) {

	switch(i%12) {
		case 0: return "Dec"; break;
		case 1: return "Jan"; break;
		case 2: return "Feb"; break;
		case 3: return "Mar"; break;
		case 4: return "Apr"; break;
		case 5: return "May"; break;
		case 6: return "Jun"; break;
		case 7: return "Jul"; break;
		case 8: return "Aug"; break;
		case 9: return "Sep"; break;
		case 10: return "Oct"; break;
		case 11: return "Nov"; break;		
	}
}


$(function() {
	
	/* toggle graph */
	$('#graph-bars').hide(); 
	$('#lines').on('click', function (e) {
	    $('#bars').removeClass('active');
	    $('#graph-bars').fadeOut();
	    $(this).addClass('active');
	    $('#graph-lines').fadeIn();
	    e.preventDefault();
	});
	 
	$('#bars').on('click', function (e) {
	    $('#lines').removeClass('active');
	    $('#graph-lines').fadeOut();
	    $(this).addClass('active');
	    $('#graph-bars').fadeIn().removeClass('hidden');
	    e.preventDefault();
	});
	
	/**
	 * Show tooltip
	 */
	function showTooltip(x, y, contents) {
	    $('<div id="tooltip">' + contents + '</div>').css({
	        top: y - 16,
	        left: x + 20
	    }).appendTo('body').fadeIn();
	}
	 
	var previousPoint = null;	 
	$('#graph-lines, #graph-bars').bind('plothover', function (event, pos, item) {
	    if (item) {
	        if (previousPoint != item.dataIndex) {
	            previousPoint = item.dataIndex;
	            $('#tooltip').remove();
	            var x = item.datapoint[0],
	                y = item.datapoint[1];
	                showTooltip(item.pageX, item.pageY, y.toFixed(2) + ' at ' + convertToMonth(x));
	        }
	    } else {
	        $('#tooltip').remove();
	        previousPoint = null;
	    }
	});

});


$(document).ready(function() {
	$("body").fadeIn(2000);
	showRecords();
});