const express = require("express");
const authController = require("../controllers/auth")

const router = express.Router();

//all the routing happens here, authController.whateverMethod
//authController links to the class auth under the controllers folder, which then has export functions named register,verify etc...
router.post('/register', authController.register);  
router.post('/index', authController.verify);



module.exports = router;