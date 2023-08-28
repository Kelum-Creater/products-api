var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Check if the table already exists
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='customer'", (tableErr, tableRow) => {
            if (tableErr) {
                console.error(tableErr.message);
            } else if (tableRow) {
                // Table already exists, no need to create
                console.log('Table "customer" already exists. Not creating again.');
            } else {
                // Table doesn't exist, create it
                db.run(`CREATE TABLE customer (
                    customerId INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT, 
                    address TEXT,
                    email TEXT,
                    dateOfBirth TEXT,
                    gender TEXT,
                    age INTEGER,
                    cardHolderName TEXT,
                    cardNumber INTEGER,
                    expiryDate TEXT,
                    cvv INTEGER,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )`, (createErr) => {
                    if (createErr) {
                        // Table creation failed
                        console.error(createErr.message);
                    } else {
                        console.log('Table "customer" created.');
                        // Insert data into the newly created table
                        var insert = 'INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        db.run(insert, ['A.D. Lakith Dharmasiri', 'No 324/A Ra De Mel Road, Colombo', 'lakith@gamil.com', '1991.02.25', 'female', 28, 'A.D.L.Dharmasiri', 102445217895, '12/2022', 246], (insertErr) => {
                            if (insertErr) {
                                console.error(insertErr.message);
                            } else {
                                console.log('Data inserted into "customer" table.');
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = db

