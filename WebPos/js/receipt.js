//  Declare SQL Query for SQLite
var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);
var insertStatement = "INSERT INTO Receipts(created,total,remarks) VALUES(?,?,?)";
var deleteStatement = "DELETE FROM Receipts WHERE id=?";
var selectAllStatement = "SELECT * FROM Receipts";

/**
 * Get value from Input and insert record. Called when Save/Submit Button Click.
 */
function insertRecord() {
    var created = $("#created").datepicker("getDate")/1000;
    var total = parseFloat($('input:text[id=total]').val());
    var remarks = $("#remarks").val();
    alert(created+" "+total+" "+remarks);
    db.transaction(
    	function (tx) {
    		tx.executeSql(insertStatement, [created,total,remarks], loadAndReset, onError);
    		alert("Save successfully");
	});
}

/**
 * Get id of record . Called when Delete Button Click.
 */
function deleteRecord(id) {
    db.transaction(function (tx) {
    	tx.executeSql(deleteStatement, [id], loadAndReset, onError);
    	alert("Delete Sucessfully");
	});
}

/**
 * Get id of record. Called when Delete Button Click.
 */
function updateRecord() {
	var id = $("#id").val();
    var code = $('input:text[id=code]').val().toString();
    var remarks = $("#remarks").val();
    db.transaction(function (tx) { tx.executeSql(updateStatement, [code,name,price,remarks,id], loadAndReset, onError); });
}

/**
 * Reset form input values.
 */
function resetForm() {
	$("#id").val("");
    $("#created").datepicker("setDate", new Date());
    $("#remarks").val("");
    
    $("#items").val("");
    addItem();
    $("#total").val("0.00");
}

/**
 * Create one empty receipt item.
 */
function addItem() {

	db.transaction(function(tx) {
    	var sql = "SELECT * FROM Stocks";
	    tx.executeSql(sql,[],function(tx,result) {
	
			var i = $("#items li").size();			
			var ddl = "<select id='stock"+i+"' style='width:200px'>";
			ddl += "<option></option>";
			var dataset = result.rows;
	        for (var j = 0, item = null; j < dataset.length; j++) {
	            item = dataset.item(j);
	            var displayText = item['code'] + '    ' + item['name'];
	            var value = item['id']+','+item['price'];
				ddl += "<option value="+value+">";
				ddl += displayText;
				ddl += "</option>";
	        }
	        ddl += "</select>";
	        
		    var line = "";
		    line += "<li>";
		    line += "<button onclick='removeItem("+i+")'>delete</button>";
		    line += "<button onclick='addItem()'>add</button>";
		    line += ddl;
		    
		    var js = 'calculateAmount('+i+',document.getElementById("qty'+i+'").value'+')';
		    line += "<input id='qty"+i+"' class='numberBox' type='text' style='width:60px' onchange='"+js+"'></input>";
		    line += "<input id='price"+i+"' class='numberBox' type='text' readonly='readonly' style='width:60px'></input>";
		    line += "<input id='amount"+i+"' class='numberBox' type='text' readonly='readonly' style='width:60px'></input>";
		    line += "</li>";		    
		    
		    $("#items").append(line);
	    })
    });
}
/**
 * Remove child item.
 */
function removeItem(index) {
	console.log("removeItem("+index+")");
	$("#items li").eq(index).replaceWith("");
	
	calculateTotal();
}

/**
 * Display unit price and calculate the amount based on quantity.
 */
function calculateAmount(index,qty) {
	var chunks = $("#stock"+index).val().split(",");
	var price = parseFloat(chunks[1]);
	var amount = qty*price;	
	$("#price"+index).val(price.toFixed(2));
	$("#amount"+index).val(amount.toFixed(2));
	
	calculateTotal();
}
/**
 * Display total amount for all item purchase.
 */
function calculateTotal() {
	var i=0;
	var sum = 0.00;
	$("#items li").each(function(i,v){
		if($("#amount"+i).val() != null) {
			amount = parseFloat($("#amount"+i).val());
			if(amount > 0) {
				sum += amount;
				console.log(sum);
			}
		}
		
		i++;
	});
	$("#total").val(sum.toFixed(2));
}

/**
 * Load and Reset.
 */
function loadAndReset() {
    resetForm();
}

/**
 * Handle error.
 */
function onError(tx, error) {
    alert(error.message);
}

/**
 * Called when page is ready for load.
 */
$(document).ready(function () {

	//Fade In Effect when Page Load.
    $("body").fadeIn(2000);
    
    // Register Event Listener when button click.
    $("#btnReset").click(resetForm);
    $("#submitButton").click(insertRecord);
    $("#btnUpdate").click(updateRecord);
    loadAndReset();
});

$(function() {
	$("#created").datepicker({dateFormat: "dd-M-yy"});
	$("#created").datepicker("setDate", new Date());
});