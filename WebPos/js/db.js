//  Declare SQL Query for SQLite
var dropStatement = "DROP TABLE Contacts";
var db = openDatabase("AddressBook", "1.0", "Address Book", 200000);  // Open SQLite Database
var dataset;

/**
 * Called When Page is ready.
 */
 function initDatabase() {

    try {
    	// Check browser is supported SQLite or not.
        if (!window.openDatabase) {
            alert('Databases are not supported in this browser.');
        }
        // If supported then call Function for create table in SQLite
        else {
            createTable();
        }
    }
    catch (e) {    
    	// Version number mismatch. 
        if (e == 2) {
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }

        return;
    }
}

/**
 * Create Table in SQLite.
 */
function createTable() {
	console.log("create table");
	var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, useremail TEXT);";
    db.transaction(function (tx) { tx.executeSql(createStatement, [], showRecords, onError); });
    
    createStatement = "CREATE TABLE IF NOT EXISTS Products(id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT, price REAL, remarks TEXT);";
    db.transaction(function(tx) {tx.executeSql(createStatement,[],null,onError);});
    
    createStatement = "CREATE TABLE IF NOT EXISTS Warehouse(id INTEGER PRIMARY KEY AUTOINCREMENT, product INTEGER, qty INTEGER, buyat INTEGER, remarks TEXT, FOREIGN KEY(product) REFERENCES Products(id));";
    db.transaction(function(tx) {tx.executeSql(createStatement,[],null,onError);});
    
    createStatement = "CREATE TABLE IF NOT EXISTS Receipts(id INTEGER PRIMARY KEY AUTOINCREMENT, created INTEGER, sum REAL, remarks TEXT);";
    db.transaction(function(tx) {tx.executeSql(createStatement,[],null,onError);});
    
	createStatement = "CREATE TABLE IF NOT EXISTS ReceiptItems(id INTEGER PRIMARY KEY AUTOINCREMENT, parent INTEGER, product INTEGER, qty INTEGER, FOREIGN KEY(parent) REFERENCES Receipts(id), FOREIGN KEY(product) REFERENCES Products(id));";
    db.transaction(function(tx) {tx.executeSql(createStatement,[],null,onError);});
}

/**
 * Get value from Input and insert record. Called when Save/Submit Button Click.
 */
function insertRecord() {
	console.log("insert record");
	var insertStatement = "INSERT INTO Contacts (username, useremail) VALUES (?, ?)";
    var usernametemp = $('input:text[id=username]').val();
    var useremailtemp = $('input:text[id=useremail]').val();
    db.transaction(function (tx) { tx.executeSql(insertStatement, [usernametemp, useremailtemp], loadAndReset, onError); });
}

/**
 * Get id of record . Called when Delete Button Click.
 */
function deleteRecord(id) {
	console.log("delete record".id);
	var deleteStatement = "DELETE FROM Contacts WHERE id=?";
    db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); alert("Delete Sucessfully"); });
    resetForm();
}

/**
 * Get id of record. Called when Delete Button Click.
 */
function updateRecord() {
	console.log("updating record");
	var updateStatement = "UPDATE Contacts SET username = ?, useremail = ? WHERE id=?";
    var usernameupdate = $('input:text[id=username]').val().toString();
    var useremailupdate = $('input:text[id=useremail]').val().toString();
    var useridupdate = $("#id").val();
    db.transaction(function (tx) { tx.executeSql(updateStatement, [usernameupdate, useremailupdate, Number(useridupdate)], loadAndReset, onError); });
}

/**
 * Called when Drop Button Click. Table will be dropped from database.
 */
function dropTable() {
    db.transaction(function (tx) { tx.executeSql(dropStatement, [], showRecords, onError); });
    resetForm();
    initDatabase();
}

/**
 * Display records which are retrived from database.
 */
function loadRecord(i) {
    var item = dataset.item(i);
    $("#username").val((item['username']).toString());
    $("#useremail").val((item['useremail']).toString());
    $("#id").val((item['id']).toString());
}

/**
 * Reset form input values.
 */
function resetForm() {
    $("#username").val("");
    $("#useremail").val("");
    $("#id").val("");
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
    	var selectAllStatement = "SELECT * FROM Contacts";
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var linkeditdelete = '<li>' + item['username'] + ' , ' + item['useremail'] + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' + '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
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
    initDatabase();
    $("#submitButton").click(insertRecord);// Register Event Listener when button click.
    $("#btnUpdate").click(updateRecord);
    $("#btnReset").click(resetForm);
    $("#btnDrop").click(dropTable);
});