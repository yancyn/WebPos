//  Declare SQL Query for SQLite
var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);
var insertStatement = "INSERT INTO Stocks(code,name,price,remarks) VALUES(?,?,?,?)";
var deleteStatement = "DELETE FROM Stocks WHERE id=?";
var updateStatement = "UPDATE Stocks SET code=?, name=?, price=?, remarks=? WHERE id=?";
var selectAllStatement = "SELECT * FROM Stocks";
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
    var id = (item['id']).toString();
    $("#id").val(id);
    $("#code").val((item['code']).toString());
    $("#name").val((item['name']).toString());
    $("#price").val((item['price']).toString());
    $("#remarks").val((item['remarks']).toString());
    
    showHistory(id);
    countAvailable(id);
}
/**
 * Retrive purchase history record for stock selected.
 */
function showHistory(i) {
    $("#history").html('');
    db.transaction(function (tx) {
    	var sql = "SELECT stock, qty, datetime(buyat,'unixepoch','localtime') AS localdate, remarks";
    	sql += " FROM Warehouse";
    	sql += " WHERE stock = "+i;
    	sql += " ORDER BY buyat DESC";
        tx.executeSql(sql, [], function (tx, result) {
            if(result.rows.length == 0) {
            	$("#history").html("No record found!");
            	return;
			}
            
            for (var i = 0, item = null; i < result.rows.length; i++) {
                item = result.rows.item(i);
                var linkeditdelete = '<li>' + item['localdate']+': '+item['qty'] + 'pcs</li>';
                $("#history").append(linkeditdelete);
            }
        });
    });
}

function countAvailable(id) {
	$("#available").html("0");
	var buyin = 0;
	var sold = 0;	
	db.transaction(function (tx) {
		var sql = "select sum(qty) as total from warehouse where stock = "+id;
		tx.executeSql(sql,[],function(tx,result){
			if(result.rows.item(0)['total'] != null) buyin = result.rows.item(0)['total'];
			
			db.transaction(function (tx) {
				sql = "select sum(qty) as sold from ReceiptItems where stock = "+id;
				tx.executeSql(sql,[],function(tx,result){
					if(result.rows.item(0)['sold'] != null) sold = result.rows.item(0)['sold'];
					var balance = buyin-sold;
					$("#available").val(balance);
				});
			});
		});
	});
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
    
    $("#qty").val("");
    $("#buyat").val("");
    $("#whremarks").val("");
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
                var linkeditdelete = '<li>' + item['code']+': '+item['name']+' $'+item['price']
                	+ ' ' + '<button onclick="deleteRecord(' + item['id'] + ');">delete</button>'
                	+ ' ' + '<button onclick="loadRecord(' + i + ');">edit</button>'
                	+ '</li>';
                $("#results").append(linkeditdelete);
            }
        });
    });
}

/**
 * Purchase stock into warehouse.
 */
function buyStock() {
	var sql = "INSERT INTO Warehouse(stock,qty,buyat,remarks) VALUES(?,?,?,?)";
	var id = $("#id").val();
    var qty = $('input:text[id=qty]').val();
    var buyat = $('input:text[id=buyat]').val();
    var remarks = $("#whremarks").val();
    db.transaction(function (tx) {tx.executeSql(sql, [id,qty,buyat,remarks], loadAndReset, onError);});
}

/**
 * Called when page is ready for load.
 */
$(document).ready(function () {

	//Fade In Effect when Page Load.
    $("body").fadeIn(2000);
    
    // Register Event Listener when button click.
    $("#submitButton").click(insertRecord);
    $("#btnUpdate").click(updateRecord);
    $("#btnReset").click(resetForm);    
    $("#btnBuy").click(buyStock);
    
    showRecords();
});