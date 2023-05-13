// This router handles POST requests to the /user endpoint
import express from 'express';
const router = express.Router();
import pool from "../db_pool.js";

// constants to assist with data validation
const accessibilityOptions = ['High', 'Medium', 'Low'];
const priceOptions = ['Free', 'Low', 'High'];

class User {
    constructor(name, accessibility, price) {
        this.name = name;
        this.accessibility = accessibility;
        this.price = price;
    }
}

// POST /user
// create user record in db
router.post("/", (req, res) => {


    // reject if any of the request fields are missing
    if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('accessibility') || !req.body.hasOwnProperty('price')){
        return res.status(500).send("Error inserting record - missing field")
    };

    // reject if any of the request fields are incorrectly formatted
    if (typeof req.body.name != 'string' || accessibilityOptions.indexOf(req.body.accessibility) === -1 || priceOptions.indexOf(req.body.price) === -1 ){
        return res.status(500).send("Error inserting record - invalid field")
    };

    // handle cases of names with apostrophes
    let cleanedName = req.body.name.replace(/'/g, "''");

    // perform insert in db
    let SQL = `INSERT INTO Users ("name", "accessibility", "price") \
        VALUES ('${cleanedName}', '${req.body.accessibility}', '${req.body.price}');`

    return pool.query(SQL)
    .then((db_res) => {
        res.send("success");
    })
    .catch((err) =>{
        console.log(err)
        res.status(500).send("Error inserting record.")
    });
});

export default router;
