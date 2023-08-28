var express = require("express")
var app = express()
var db = require("./database.js")
var cron = require('node-cron');
var bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let HTTP_PORT = 8080
const cors = require('cors');
app.use(cors({
    origin: '*'
}));



// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/api/customer", (req, res, next) => {
    try {
        var sql = "select * from customer"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});

app.get("/api/customer/:id", (req, res, next) => {
    try {
        var sql = "select * from customer where id = ?"
        var params = [req.params.id]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/products/quantity/:quantity", (req, res, next) => {
    try {
        var row = "[]"
        var sql = "select * from products where quantity > ?"
        var params = [req.params.quantity]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/products/unitPrice/:unitPrice", (req, res, next) => {
    try {
        var row = "[]"
        var sql = "select * from products where unitPrice > ?"
        var params = [req.params.unitPrice]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            } else {
                res.json({

                    "message": "success",
                    "data": row
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.post("/api/customer/", (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ "error": "Bad Request" });
        }

        const {
            name,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv
        } = req.body;

        // Validation checks
        if (!validateEmail(email)) {
            return res.status(400).json({ "error": "Invalid email address" });
        }

        if (!validateCardNumber(cardNumber)) {
            return res.status(400).json({ "error": "Invalid credit card number" });
        }

        // Insert data into the database
        var sql = 'INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var params = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv]
        db.run(sql, params, function (err, result) {
            if (err) {
                return res.status(400).json({ "error": err.message });
            } else {
                return res.status(201).json({
                    "message": `Customer ${name} has been registered`,
                    "customerId": this.lastID
                });
            }
        });
    } catch (e) {
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});

// Email validation function
function validateEmail(email) {
    // Use a regular expression for basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Credit card number validation function
function validateCardNumber(cardNumber) {
    // Check if the card number has exactly 12 digits
    const cardNumberPattern = /^\d{12}$/;
    return cardNumberPattern.test(cardNumber);
}





app.delete("/api/customer/delete", (req, res, next) => {
    try {
        db.run(
            'drop table customer',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.delete("/api/products/deleteAll/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM products WHERE id > ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});


app.get("/api/suppliers/", (req, res, next) => {
    try {
        var sql = "select * from suppliers"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});


app.post("/api/suppliers/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const { supplierName,
            address,
            joinedDate,
            mobileNo
        } = req.body;

        var sql = 'INSERT INTO suppliers (supplierName, address, joinedDate, mobileNo) VALUES (?,?,?,?)'
        var params = [supplierName, address, joinedDate, mobileNo]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.json({
                    "message": "success",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.delete("/api/suppliers/deleteAll/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM suppliers WHERE id > ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});


// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "University of Moratuwa" })
});