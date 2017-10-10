var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    passport        = require("passport");

// Login Page
router.get("/", function(req, res) {
    res.render("admin/login", {}); 
});

router.post("/", passport.authenticate("local", 
    {
        successRedirect: "/admin/home",
        failureRedirect: "/admin"
    }), function(req, res){
});

// Main Landing
router.get("/home", middleware.isLoggedIn, function(req, res) {
    res.render("admin/home", {}); 
});

module.exports = router;