# activity-picker
Author: Erin Eckerman

## Overview
This application suggests random activities using the [Bored API](https://www.boredapi.com/documentation) and stores user profiles. This API includes two endpoints:
* /activity - if there is at least one record in the Users table, the app will retrieve a random activity per the user's preferences. If the table is empty, it will retrieve an activity with no constraints. This endpoint will return an error if either there is a server failure or if there is not an activity that matches user preferences.
* /user - creates a user record including the following fields: name, accessibility, and price. If any of these fields is missing or not a string, the server will return an error message.

## Assumptions
* Lower bound of the "Low" price range is .01 (rather than 0) since it is referenced as a category separate from "Free"
* Both accessibility and price are required inputs for creating a user profile
* Duplicate names within the user records is expected/permissable
* The last row of the user database is the most recently created user record - if update and delete functionality is later added to the /user endpoint, a timestamp field should be added as a column to the Users table

## Database
Before running the application, you should create the user database. Start your PostgresSQL server on port 5432 and run the following command in the PostgresSQL interface to create the database:
```
CREATE DATABASE eckerman_user_records;
```
Then, navigate to the new database:
```
\c eckerman_user_records
```
Finally, create the Users table within the new database:
```
CREATE TABLE users ( user_id serial PRIMARY KEY, name VARCHAR (50) NOT NULL, accessibility VARCHAR (50), price VARCHAR(50));
```

## Running Locally
Create an env file with a single key: `DATABASE_USER = {your postgresql username}`.
Run `npm i` in your terminal to install the app's dependencies. Once that is completed, use `nodemon` to start the server.

## Testing
In the root of this repo, there is a json file named "activity-picker.postman_collection.json" that containins a collection of Postman tests. These tests cover the following cases:
* Requesting an activity with an empty User table
* Creating user records for all 9 possible combinations of accessibility/price preferences and requesting activities for each of these users
* Attempting to create user records with invalid request bodies

**IMPORTANT:** The /activity endpoint is set up to pull an activity based on the most recent user record added to the database. If the tests are not run in sequence, they will fail.

### Running Postman Tests
If you don't yet have Postman, it can be downloaded [here](https://www.postman.com/downloads/). 
From within the Postman desktop app:

1. Import the collection: Click on the "Import" button on the top-left corner of the Postman app and select "Import from file". Choose the collection file you want to import ("activity-picker.postman_collection.json").

2. Once you have imported the collection, you can click on the collection in the left-hand sidebar to view its contents. The collection will contain multiple requests that you can execute.

3. To execute a request, click on it to open it in the main window. Click on the "Send" button to send the request to the server. Postman will display the server's response in the main window.

5. To run the entire collection, click on the "Runner" button in the top toolbar. This will open the Postman Collection Runner, where you can select the collection you want to run and configure any necessary options.

6. Click on the "Run" button to execute the collection. Postman will send each request in the collection to the server and display the results in the Collection Runner window.
