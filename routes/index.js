const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const errorMessage = req.query.error || ""; // Use query param if needed
    res.render("index", { error: errorMessage });
});

module.exports = router;