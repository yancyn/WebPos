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
  //y axis must in number. fail after change to "Jan"
	var graphData = [{
	        data: [ [1, sales[0]], [2, sales[1]], [3, sales[2]], [4, sales[3]], [5, sales[4]], [6, sales[5]], [7, sales[6]], [8, sales[7]], [9, sales[8]], [10, sales[9]], [11,sales[10]], [12,sales[11]] ],
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
		yaxis: {tickSize: 1000},
	});
	
	//plot bar graph
	$.plot($("#graph-bars"),graphData,{
		series: {
			bars: {show:true, barWidth:.9, align:"center"},
			shadowSize:0,
		},
		grid: {color:"#646464", borderColor:"transparent", borderWidth:20, hoverable:true},
		xaxis: {tickColor:'transparent'},
		yaxis: {tickSize:1000},
	});
}

$(document).ready(function() {
	$("body").fadeIn(2000);
	showRecords();
});


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
	                showTooltip(item.pageX, item.pageY, y.toFixed(2) + ' at ' + x + ' month');//todo: convert 1 to Jan
	        }
	    } else {
	        $('#tooltip').remove();
	        previousPoint = null;
	    }
	});

});