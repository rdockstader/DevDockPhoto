var mongoose    = require("mongoose"),
    PriceGroup  = require("../models/priceGroup"),
    Collection  = require("../models/collection"),
    User        = require("../models/user");

function seedDB(){
    console.log("seed started....");
    User.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("users removed");
        }
    });
    
     var newUser = new User({username: "admin", isAdmin: true, addDate: new Date()});
    User.register(newUser, "pass", function(err, user){
        if(err){
            console.log(err);
        } else {
            console.log("user created");
        }
    });
}

module.exports = seedDB;