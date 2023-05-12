// This router handles GET requests to the /activity endpoint
import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

// constants for accessibility thresholds
const highAccessibilityUpperBound = .25;
const lowAccessibilityLowerBound = .75;

// constant for price threshold
const priceThreshhold = .5;

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
// Retrieve a random activity from the Bored API and return new instance of Activity
router.get("/", (req, res) => {
    (async () => {
        const resBody = await fetch('https://www.boredapi.com/api/activity').then(response => response.json());
        console.log("resBody", resBody);

        let newActivity = new Activity(resBody.activity, resBody.accessibility, resBody.type, resBody.participants, 
            resBody.price, resBody.link, resBody.key);
        console.log('Activity instance:', newActivity);
        res.send(newActivity);
    })();
});

export default router;
