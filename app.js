const express = require("express");  //this app kind of servers as a main method, only for the backend though***
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const session = require('express-session');


dotenv.config({ path: './.env'})

const app = express();

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Goldfish123',
    database: 'registrationsystem'
})

app.use(session({
    secret: 'badabing', // Change this to a secret key
    resave: false,
    saveUninitialized: false
}));

const publicDirectory = path.join(__dirname, './public'); //i set it to the public folder, thats where a lot of plug-in logic we are going to have
app.use(express.static(publicDirectory)); 

app.use(express.urlencoded({extended: false})); //allows nodejs to parse URL-encoded things (ex. html forms)
app.use(express.json()); //parse json things 

app.set("view engine", "hbs"); //hbs is a template for html and view engine is just telling node to view the documents within hbs

database.connect((error) => {  //just testing the connection
    if(error){
        console.log(error);
    } else {
        console.log("MySQL connected succesfully...")
    }
})


//essentially saying when we are in /, which is just the index, it will go into /routes/pages to figure out what page to render to the front-end
//form based files like register sometimes dont need these because in their form they make a POST to the auth file
//which is already included
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(5002, () => {
    console.log("Server started on Port 5002");
});