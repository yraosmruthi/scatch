const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedin')
const productModel = require('../models/product_model');
const userModel = require('../models/user_model');
const PLATFORM_FEE = 20;

router.get("/", (req, res) => {
    let error = req.flash("error") 
  let success= req.flash("success")// Use query param if needed
    res.render("index", { error,loggedin:false,success });
});
router.get("/shop",isLoggedIn,async (req,res)=>{
  let products =await  productModel.find();
   let success=req.flash("success")
    res.render("shop",{products, success});
})
router.get("/cart",isLoggedIn,async (req,res)=>{
  try{
  let user = await userModel
  .findOne({email: req.user.email }).populate("cart");
   const totalprice = user.cart.reduce((total,item)=>{
    return total+item.discount+PLATFORM_FEE;
   },0);
    res.render("cart",{user,platformFee:PLATFORM_FEE,totalprice:totalprice});
  }catch(err){
    req.flash("error","something is wrong");
    res.redirect("/");
  }
  })


router.get("/addtocart/:id",isLoggedIn,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});

    user.cart.push(req.params.id);
  await  user.save();
  req.flash("success","Added to Cart");
  res.redirect("/shop");

})


module.exports = router;