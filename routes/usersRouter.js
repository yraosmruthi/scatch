const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');
const {registeredUser} = require('../controllers/authController');
const {loginUser} = require('../controllers/authController');
const {logout} = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedin')


router.post("/register",registeredUser);
    
router.post("/login",loginUser);

router.get("/logout",logout);

router.get("/profile",isLoggedIn,async (req,res)=>{
    try{
    let user = await userModel.findOne({email:req.user.email});
    if (!user) return res.send("User not found");
    console.log("User found:", user); 
    let cartCount = user.cart.length;
    console.log(cartCount);
    res.render("profile",{user,cartCount});

    } catch(err){
        res.status(500).send("server error");
    }
})

router.get("/delete",isLoggedIn,async(req,res)=>{
    try{
        await userModel.deleteOne({email:req.user.email});
        
        res.clearCookie("token");
        res.redirect("/");
    }catch(err){
        res.status(500).send("server error");
    }
})
module.exports = router;