//  Declare SQL Query for SQLite
var db = openDatabase("AddressBook", "1.0", "Address Book", 200000);  // Open SQLite Database
var insertStatement = "INSERT INTO Products(code,name,price,remarks) VALUES(?,?,?,?)";
var deleteStatement = "DELETE FROM Products WHERE id=?";
var updateStatement = "UPDATE Products SET code=?, name=?, price=?, remarks=? WHERE id=?";
var selectAllStatement = "SELECT * FROM Products";
var dataset;

/**
 * Get value from Input and insert record. Called when Save/Submit Button Click.
 */
function insertRecord() {
    var code = $('input:text[id=code]').val();
    var name = $('input:text[id=name]').val();
    var price = $('input:text[id=price]').val();
    var remarks = $("#remarks").val();
    db.transaction(function (tx) { tx.executeSql(insertStatement, [code,name,price,remarks], loadAndReset, onError); });
}

/**
 * Get id of record . Called when Delete Button Click.
 */
function deleteRecord(id) {
    db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); alert("Delete Sucessfully"); });
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
    $("#id").val((item['id']).toString());
    $("#code").val((item['code']).toString());
    $("#name").val((item['name']).toString());
    $("#price").val((item['price']).toString());
    $("#remarks").val((item['remarks']).toString());
}

/**
 * Reset form input values.
 */
function resetForm() {
	$("#id").val("");
    $("#code").val("");
    $("#name").val("");
    $("#price").val("0.00");
    $("#remarks").val("");
}

/**
 * Load and Reset.
 */
function loadAndReset() {
    resetForm();
    showRecords();
}

/**
 * Handle error.
 */
function onError(tx, error) {
    alert(error.message);
}

/**
 * Retrive data from Database Display records as list.
 */
function showRecords() {
    $("#results").html('');
    db.transaction(function (tx) {
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var linkeditdelete = '<li>' + item['code']+': '+item['name']+' '+item['price']+' '+ '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' + '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#results").append(linkeditdelete);
            }
        });
    });
}

/**
 * Called when page is ready for load.
 */
$(document).ready(function () {
    $("body").fadeIn(2000);//Fade In Effect when Page Load.
    $("#submitButton").click(insertRecord);// Register Event Listener when button click.
    $("#btnUpdate").click(updateRecord);
    $("#btnReset").click(resetForm);
    showRecords();
});