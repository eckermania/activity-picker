// This router handles GET requests to the /activity endpoint
import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';
import pool from "../db_pool.js";

// constants for accessibility thresholds
const highAccessibilityUpperBound = .25;
const lowAccessibilityLowerBound = .75;

// constant for price threshold
const priceThreshhold = .5;

// translate string for price level to min and max values
function translatePrice(priceStr){
    let priceMinMax = [];
    switch(priceStr){
        case 'Free':
            priceMinMax = [0, 0];
            break;
        case 'Low':
            priceMinMax = [.01, priceThreshhold];
            break;
        case 'High':
            priceMinMax = [priceThreshhold + .01, 1];
            break;
    };
    return priceMinMax;
}

// translate string for accessibility level to min and max values
function translateAccessibility(accessibilityStr){
    let accessibilityMinMax = [];
    switch(accessibilityStr){
        case 'High':
            accessibilityMinMax = [0, highAccessibilityUpperBound];
            break;
        case 'Medium':
            accessibilityMinMax = [highAccessibilityUpperBound, lowAccessibilityLowerBound];
            break;
        case 'Low':
            accessibilityMinMax = [lowAccessibilityLowerBound + .01, 1];
            break;
    };
    return accessibilityMinMax;
}

// Class for a single activity
class Activity {
    constructor(activity, accessibility, type, participants, price, link, key) {
        this.activity = activity;
        this.accessibility = this.identifyAccessibilityLevel(accessibility);
        this.type = type;
        this.participants = participants;
        this.price = this.identifyPriceLevel(price);
        this.link = link;
        this.key = key;
    }

    // Method to translate accessibility score into string - if value is outside of range of 0 to 1, "Unknown" will be returned
    identifyAccessibilityLevel(accessibility) {
        if (accessibility <= highAccessibilityUpperBound){
            return 'High';
        } else if (accessibility > highAccessibilityUpperBound && accessibility < lowAccessibilityLowerBound){
            return 'Medium';
        } else if (accessibility >= lowAccessibilityLowerBound){
            return 'Low';
        } else {
            return 'Unknown';
        }
    };

    // Method to translate price into string - if value is outside of 0 to 1, "Unknown" will be returned
    identifyPriceLevel(price){
        if(price == 0){
            return 'Free';
        } else if (price <= priceThreshhold){
            return 'Low';
        } else if (price > priceThreshhold){
            return 'High';
        }
    }
}


// GET /activity
// Retrieve a random activity from the Bored API and return new instance of Activity. 
// Request will be filtered on youngest user record if table is not empty.
router.get("/", (req, res) => {
    // Check Users table to see if at least one record exists
    let SQL = `SELECT accessibility, price FROM Users WHERE user_id=(SELECT max(user_id) FROM Users);`

    return pool.query(SQL)
    .then((db_res) => {
        let reqURL = `https://www.boredapi.com/api/activity`;
        // Users table is not empty - add price and accessibility params to path
        if (db_res.rows.length > 0){
            console.log(db_res.rows);
            let priceMinMax = translatePrice(db_res.rows[0].price);
            let accessibilityMinMax = translateAccessibility(db_res.rows[0].accessibility);
            reqURL += `?minprice=` + priceMinMax[0] + `&maxprice=` + priceMinMax[1] + `&minaccessibility=` + 
                accessibilityMinMax[0] + `&maxaccessibility=` + accessibilityMinMax[1];
        }
        (async () => {
            let resBody = await fetch(reqURL).then(response => response.json());

            if(resBody.error){
                return res.status(404).send("No activity found matching accessibility and price requirements")
            }

            let newActivity = new Activity(resBody.activity, resBody.accessibility, resBody.type, resBody.participants, 
                resBody.price, resBody.link, resBody.key);
            console.log('Activity instance:', newActivity);
            res.send(newActivity);
        })();

    })
    .catch((err) =>{
        console.log(err)
        res.status(500).send("Error retrieving record.")
    });
});

export default router;
