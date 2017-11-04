var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    PriceGroup  = require("../models/priceGroup"),
    Price       = require("../models/price");
    
// Price Group Pages
// ====================

// Price Group primary landing
router.get("/", middleware.isLoggedIn, function(req, res) {
      PriceGroup.find({}, function(err, allGroups) {
          if(err) {
              console.log(err);
              res.redirect("/admin");
          } else {
              res.render("admin/priceGroup/index", {priceGroups: allGroups, priceGroup: null});
          }
      });
});

//Price Group Create
router.post("/", middleware.isLoggedIn, function(req, res){
    // create Collection
   PriceGroup.create({label: middleware.capitalizeFirstLetter(req.body.label), order: req.body.order, addDate: new Date()}, function(err, newPriceGroup) {
        if(err) {
            res.render("/admin/priceGroup/new", {});
        } else {
            // then, redirect to the index
            req.app.locals.priceGroupList = middleware.getPriceGroupList();
            console.log("price group added");
            res.redirect("/admin/pricegroups");
        }
   });
});


//Price Group Add
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("admin/priceGroup/new", {});
});

// Edit Price Group
router.get("/:id/edit", middleware.isLoggedIn, function(req, res) {
    //Collection.findById(req.params.id, function(err, foundCollection) {
    PriceGroup.findById(req.params.id).populate("images").exec(function(err, foundPriceGroup){
       if(err) {
           res.redirect("/admin/priceGroup");
       } else {
           res.render("admin/priceGroup/edit", {priceGroup: foundPriceGroup});
       }
    });
});

// Update Price Group
router.put("/:id", middleware.isLoggedIn, function(req, res) {
    PriceGroup.findByIdAndUpdate(req.params.id, {label: middleware.capitalizeFirstLetter(req.body.label), order: req.body.order}, function(err, updatedPriceGroup) {
       if(err) {
           res.redirect("/admin/priceGroup");
       } else {
           req.app.locals.priceGroupList = middleware.getPriceGroupList();
           res.redirect("/admin/pricegroups/" + updatedPriceGroup.label);
       }
    });
});

// Destory Price Group
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    PriceGroup.findById(req.params.id, function(err, priceGroup){
        if(err) {
            console.log(err);
        } else {
            //remove from Database
            priceGroup.prices.forEach(function(price) {
                Price.findByIdAndRemove(price._id, function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Price removed");
                    }
                });
            });
            
            PriceGroup.findByIdAndRemove(req.params.id, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Price Group removed");
                }
            });
            req.app.locals.priceGroupList = middleware.getPriceGroupList();
        }     
    });
    
    res.redirect("/admin/pricegroups");
});

// Price Group selected landing
router.get("/:label", middleware.isLoggedIn, function(req, res) {
    PriceGroup.findOne({label: req.params.label }).populate("prices").exec(function(err, priceGroup) {
        if(err) {
            console.log(err);
            res.redirect("/admin");
        } else {
            //console.log(col);
            res.render("admin/priceGroup/index", {priceGroup: priceGroup});
        }
    });
});

module.exports = router;