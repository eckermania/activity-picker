"use strict";

// dependencies
import express from 'express';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
import activity from './endpoints/activity.js';
import user from './endpoints/user.js';

// setup server
const app = express();

// add req.body to all requests
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.send("Hello, world")
});

// API routes
app.use("/activity", activity);
app.use("/user", user);

// const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});


const port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
});
