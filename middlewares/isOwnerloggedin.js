const jwt = require('jsonwebtoken');
const ownerModel=require('../models/owner_model')

module.exports = async (req,res,next)=>{
    if(!req.cookies.token2){
        req.flash("error","login first please");
        return res.redirect("/owners/ownerpage");
    }
    try{
        let decoded = jwt.verify(req.cookies.token2,process.env.JWT_KEY);
        let owner=await ownerModel.findOne({email:decoded.email})
        .select("-password");
        req.owner = owner;
        next();

    }catch(err){
        console.log(err.message);
        req.flash("error","something is wrong");
        return res.redirect("/owners/ownerpage");
    }
};