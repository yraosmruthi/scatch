const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedin')

router.get("/", (req, res) => {
    let error = req.flash("error") // Use query param if needed
    res.render("index", { error });
});
router.get("/shop",isLoggedIn,(req,res)=>{
    res.render("shop");
})

module.exports = router;