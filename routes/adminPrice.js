var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    middleware  = require("../middleware"),
    PriceGroup  = require("../models/priceGroup"),
    Price  = require("../models/price");


// Price Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //Find the price group
    PriceGroup.findById(req.params.priceGroupID, function(err, group){
        if(err) {
            console.log(err);
        } else if(group){
            // set add date to right now
            req.body.price.addDate = new Date();
            // Save new price
            Price.create(req.body.price, function(err, price){
                if(err) {
                    console.log(err);
                } else {
                    group.prices.push(price);
                    group.save();
                    res.redirect("/admin/pricegroups/" + group.label);
                }
            });
        } else {
            console.log("ALERT: No error or group returned!!!");
        }
    });
});

// Price Add
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("admin/prices/new", {priceGroupID: req.params.priceGroupID});
});
// Price Update
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Price.findById(req.params.id, function(err, price) {
        if(err) {
            console.log(err);
        } else {
            //console.log(price);
            res.render("admin/prices/edit", {priceGroupID: req.params.priceGroupID, price: price});
        }
    });
});
// Price Edit
router.put("/:id", middleware.isLoggedIn, function(req, res){
    //console.log("Yes we can!");
    Price.findByIdAndUpdate(req.params.id, req.body.price, function(err, updatedPrice) {
        if(err) {
            console.log(err);
        } else {
            PriceGroup.findById(req.params.priceGroupID, function(err, group){
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/admin/pricegroups/" + group.label);
                }
            });
        }
    });
});
// Price Destory
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Price.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("price deleted!");
            PriceGroup.findById(req.params.priceGroupID, function(err, group){
                if(err) {
                    console.log(err);
                } else {
                    //remove price from price group
                    var indexOfPrice = group.prices.indexOf(req.params.id);
                    if(indexOfPrice >= 0) {
                        group.prices.splice(indexOfPrice, 1);
                        console.log("price removed from price group.");
                    } else {
                        console.log("ALERT: Price has not been removed from price group.");
                    }
                    group.save();
                    res.redirect("/admin/pricegroups/" + group.label);
                }
            });
        }
    }) ;
});


module.exports = router;