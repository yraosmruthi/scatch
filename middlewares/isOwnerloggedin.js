const jwt = require('jsonwebtoken');
const userModel = require("../models/user_model");

module.exports = async (req,res,next)=>{
    if(!req.cookies.token2){
        req.flash("error","login first please");
        return res.redirect("/owners/ownerpage");
    }
    try{
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user=await userModel.findOne({email:decoded.email})
        .select("-password");
        req.user = user;
        next();

    }catch(err){
        req.flash("error","something is wrong");
        return res.redirect("/owners/ownerpage");
    }
};