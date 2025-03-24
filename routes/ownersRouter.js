const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

router.get("/ownerpage", (req,res)=>{
  let success= req.flash("success")
  res.render("owner",{success});
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

console.log(createdOwner);
let token2 = generateToken(createdOwner);
res.cookie("token2", token2);
req.flash("success","owner registered successfully");
res.redirect("/owners/ownerpage");
} catch(err){
console.log(err.message);
}
});

router.post("/login",async (req,res)=>{
  let {email,password} = req.body;
  let owner = await ownerModel.findOne({email:email});
  if(!owner) return res.send('email or password incorrect');

  bcrypt.compare(password,owner.password,(err,result)=>{
    if(result){
      console.log(password,owner.password);
      let token2=  generateToken(owner);
      res.cookie("token2",token2);
      res.redirect("/owners/admin");
    }else{
      console.log(password,owner.password);
        return res.send("email or password incorrect");
    }
  })
  

})


router.get("/admin",(req,res)=>{
  let success=req.flash("success");

    res.render("createproducts",{success});
});

module.exports = router;