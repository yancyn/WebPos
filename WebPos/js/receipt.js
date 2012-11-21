//  Declare SQL Query for SQLite
var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);
var insertStatement = "INSERT INTO Receipts(created,sum,remarks) VALUES(?,?,?)";
var deleteStatement = "DELETE FROM Receipts WHERE id=?";
var selectAllStatement = "SELECT * FROM Receipts";
var dataset;

/**
 * Get value from Input and insert record. Called when Save/Submit Button Click.
 * TODO: Handle case where user press a wrong button instead just want to update.
 */
function insertRecord() {
    var code = $('input:text[id=code]').val();
    var name = $('input:text[id=name]').val();
    if(name.length == 0) {
    	alert("Name cannot be blank!");
    	return;
	}
    
    //TODO: validate price
    var price = $('input:text[id=price]').val();
    //if(!price.match("\d+(\.\d{1,2})?")) {
    //	alert("Please provide a valid price. ie. 1.23");
    //	return;
    //}
    
    var remarks = $("#remarks").val();
    db.transaction(function (tx) { tx.executeSql(insertStatement, [code,name,price,remarks], loadAndReset, onError); });
}

/**
 * Get id of record . Called when Delete Button Click.
 */
function deleteRecord(id) {
    db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], loadAndReset, onError); alert("Delete Sucessfully"); });
    resetForm();
}

/**
 * Get id of record. Called when Delete Button Click.
 */
function updateRecord() {
	var id = $("#id").val();
    var code = $('input:text[id=code]').val().toString();
    var name = $('input:text[id=name]').val().toString();
    var price = $('input:text[id=price]').val().toString();
    var remarks = $("#remarks").val();
    db.transaction(function (tx) { tx.executeSql(updateStatement, [code,name,price,remarks,id], loadAndReset, onError); });
}

/**
 * Display records which are retrived from database.
 */
function loadRecord(i) {
    var item = dataset.item(i);
    var id = (item['id']).toString();
    $("#id").val(id);
    $("#created").val((item['code']).toString());
    $("#remarks").val((item['remarks']).toString());
}

/**
 * Reset form input values.
 */
function resetForm() {
	$("#id").val("");
    $("#created").datepicker("setDate", new Date());
    $("#remarks").val("");
    addItem();
}

/**
 * Create one empty receipt item.
 */
function addItem() {
	var i = $("#items li").size();
    var line = "";
    line += "<li>";
    line += "<button onclick='removeItem("+i+")'>delete</button>";
    line += "<button onclick='addItem()'>add</button>";
    line += "<input type='text'></input>";
    line += "<input type='text' style='width:60px'></input>";
    line += "<input type='text' readonly='readonly' style='width:60px'></input>";
    line += "<input type='text' readonly='readonly' style='width:60px'></input>";
    line += "</li>";
    $("#items").append(line);
}
/**
 * Remove child item.
 */
function removeItem(index) {
	console.log("removeItem("+index+")");
	$("#items li").eq(index).replaceWith("");
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
    resetForm();
});

$(function() {
	$("#created").datepicker({dateFormat: "dd-M-yy"});
	$("#created").datepicker("setDate", new Date());
});