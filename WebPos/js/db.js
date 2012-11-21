/**
 * Open SQLite Database with size 4MB.
 */
var db = openDatabase("Pos", "1.0", "Web Point of Sales", 4*1024*1024);

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

    db.transaction(function(tx) {
    	console.log("creating table [Stocks]");
    	var createStatement = "CREATE TABLE IF NOT EXISTS Stocks(id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT, price REAL, remarks TEXT);";
    	tx.executeSql(createStatement,[],null,onError);
    	
    	console.log("creating table [Warehouse]");
    	createStatement = "CREATE TABLE IF NOT EXISTS Warehouse(id INTEGER PRIMARY KEY AUTOINCREMENT, stock INTEGER, qty INTEGER, buyat INTEGER, remarks TEXT, FOREIGN KEY(stock) REFERENCES Stocks(id));";
    	tx.executeSql(createStatement,[],null,onError);
    	
    	console.log("creating table [Receipts]");
    	createStatement = "CREATE TABLE IF NOT EXISTS Receipts(id INTEGER PRIMARY KEY AUTOINCREMENT, created INTEGER, total REAL, remarks TEXT);";
    	tx.executeSql(createStatement,[],null,onError);
    	
    	console.log("creating table [ReceiptItems]");
		createStatement = "CREATE TABLE IF NOT EXISTS ReceiptItems(id INTEGER PRIMARY KEY AUTOINCREMENT, parent INTEGER, stock INTEGER, qty INTEGER, FOREIGN KEY(parent) REFERENCES Receipts(id), FOREIGN KEY(stock) REFERENCES Stocks(id));";
		tx.executeSql(createStatement,[],null,onError);
	});
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
    $("body").fadeIn(2000);//Fade In Effect when Page Load.    
    initDatabase();
});