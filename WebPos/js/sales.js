var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);
var selectAllStatement = "SELECT * FROM Receipts ORDER BY created DESC LIMIT 100";
/**
 * Sales array through the 12 months.
 */
var sales = [];
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

/**
 * Display sales in line graph.
 * @source http://designmodo.com/create-interactive-graph-css3-jquery/
 */
function showGraph() {
	var graphData = [{
	        // Visits
	        data: [ [6, 1300], [7, 1600], [8, 1900], [9, 2100], [10, 2500], [11, 2200], [12, 2000], [13, 1950], [14, 1900], [15, 2000] ],
	        color: '#71c73e'
	    }, {
	        // Returning Visits
	        data: [ [6, 500], [7, 600], [8, 550], [9, 600], [10, 800], [11, 900], [12, 800], [13, 850], [14, 830], [15, 1000] ],
	        color: '#77b7c5',
	        points: { radius: 4, fillColor: '#77b7c5' }
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
		xaxis: {tickColor: 'transparent', tickDecimals:2},
		yaxis: {tickSize: 1000},
	});
	
	//plot bar graph
	$.plot($("#graph-bars"),graphData,{
		series: {
			bars: {show:true, barWidth:.9, align:"center"},
			shadowSize:0,
		},
		grid: {color:"#646464", borderColor:"transparent", borderWidth:20, hoverable:true},
		xaxis: {tickColor:'transparent', tickDecimals:2},
		yaxis: {tickSize:1000},
	});
}

$(document).ready(function() {
	$("body").fadeIn(2000);
	showRecords();
	showGraph();
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
	                showTooltip(item.pageX, item.pageY, y + ' visitors at ' + x + '.00h');
	        }
	    } else {
	        $('#tooltip').remove();
	        previousPoint = null;
	    }
	});

});