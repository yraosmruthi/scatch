const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');
const isOwnerloggedin = require('../middlewares/isOwnerloggedin');

router.get("/ownerpage", (req,res)=>{
  let success= req.flash("success");
  let error = req.flash("error");
  res.render("owner",{success,error});
})

router.post("/register",async (req,res)=>{
console.log("Registration Route Hit!");
try{
let owners = await ownerModel.find();
if(owners.length>0) {
return res.status(503).send("you dont have permission to create new owner ");
}
let {fullname,email,password}=req.body;
let salt = await bcrypt.genSalt(10);
let hash = await bcrypt.hash(password, salt);

let createdOwner = await ownerModel.create({
fullname,
email,
password: hash
});

let token2 = generateToken(createdOwner);
res.cookie("token2", token2);
req.flash("success","owner registered successfully");
res.redirect("/owners/ownerpage");
} catch(err){
console.log(err.message);
}
});

router.post("/login",async (req,res)=>{
  try{
  let {email,password} = req.body;
  let owner = await ownerModel.findOne({email:email});
  if(!owner) return res.send('email or password incorrect');

  let isMatch = await bcrypt.compare(password,owner.password);
  if(!isMatch){
    req.flash("error","email or password incorrect");
    return res.redirect("/owners/ownerpage");
  }
  else{
  let token2=generateToken(owner);
  res.cookie("token2",token2);

  req.flash("success","logged in");
   return res.redirect("/owners/admin");
  }
}catch(err){
  console.log(err.message);
  
}
  
})


router.get("/admin",isOwnerloggedin,(req,res)=>{
  let success=req.flash("success");
  let error = req.flash("error");

    res.render("createproducts",{success,error});
});

router.get("/logout",(req,res)=>{
  res.cookie("token2","");
  res.redirect("/owners/ownerpage")
})

router.get("/deleteowner",isOwnerloggedin,async (req,res)=>{
  let owner= await ownerModel.deleteOne({email:req.owner.email})
  console.log(owner);
   res.clearCookie("token2");
   res.redirect("/owners/ownerpage");

})

module.exports = router;