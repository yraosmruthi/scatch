const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedin')
const productModel = require('../models/product_model');
const userModel = require('../models/user_model');

router.get("/", (req, res) => {
    let error = req.flash("error") // Use query param if needed
    res.render("index", { error,loggedin:false });
});
router.get("/shop",isLoggedIn,async (req,res)=>{
  let products =await  productModel.find();
   let success=req.flash("success")
    res.render("shop",{products, success});
})
router.get("/cart",isLoggedIn,async (req,res)=>{
    
  })

router.get("/addtocart/:id",isLoggedIn,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    console.log(typeof userModel.findOne);
    user.cart.push(req.params.productid);
  await  user.save();
  req.flash("success","Added to Cart");
  res.redirect("/shop");

})

router.get("/logout",isLoggedIn,(req,res)=>{
    res.render("shop");
})
module.exports = router;