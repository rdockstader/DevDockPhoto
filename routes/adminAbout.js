var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    Person          = require("../models/person");

// Person Primary Landing
router.get("/", middleware.isLoggedIn, function(req, res){
    Person.find({}, function(err, allPersons){
        if(err) {
            console.log(err);
        } else {
            res.redner("admin/about/index", {persons: allPersons});
        }
    });
});
// Person Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Set Add Date
    req.body.person.addDate = new Date();
    // Create Person
    Person.create(req.body.person, function(err, newPerson){
        if(err) {
            console.log(err);
            res.render("/admin/about/new");
        } else {
            res.redirect("/admin/about");
        }
    });
});
// Person Add
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("admin/about/new", {});    
});
// Person Update

// Person edit

// Person Destroy

module.exports = router;