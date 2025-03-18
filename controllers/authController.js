const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');


module.exports.registeredUser = async  (req,res)=>{
    try{
        let {fullname,email,password} = req.body;
       let user= await userModel.findOne({email:email});
       if(user) return res.status(401).send("you have an account,login");
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(password,salt, async (err,hash)=>{
                if(err) return res.send(err.message);
                else {
                    let user= await userModel.create({
                        fullname:req.body.fullname,
                        email:req.body.email,
                        password:hash
                     })
                    let token= generateToken(user);
                    res.cookie("token",token);
                    res.send("user created successs")
                }
            });
        });

    } catch(err){
        console.log(err.message);
    }
};
module.exports.loginUser = async (req,res)=>{
    let {email,password}=req.body;

   let user = await userModel.findOne({email:email});
   if(!user) return res.send("email or password incorrect");
    
   bcrypt.compare(password,user.password,(err,result)=>{
    if(result){
      let token=  generateToken(user);
      res.cookie("token",token);
      res.redirect("/shop");
    }else{
        return res.send("email or password incorrect");
    }
   });
   
};
module.exports.logout = async (req,res)=>{
    res.cookie("token"," ");
    res.redirect("/");
}