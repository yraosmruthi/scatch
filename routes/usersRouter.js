const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');
const {registeredUser} = require('../controllers/authController');
const {loginUser} = require('../controllers/authController');
const {logout} = require('../controllers/authController');


router.post("/register",registeredUser);
    
router.post("/login",loginUser);

router.get("/logout",logout);

module.exports = router;