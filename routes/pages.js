const express = require("express");

const router = express.Router();


//based on the request, we fetch a page and return as a response a render
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/mainMenu', (req, res) =>{
    res.render('mainMenu');
});

router.get('/searchClasses', (req, res) => {
    res.render('searchClasses');
});

router.get('/startPage', (req, res) => {
    res.render('startPage');
})

module.exports = router;