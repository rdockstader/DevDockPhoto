var express     = require("express"),
    router      = express.Router(),
    nodemailer  = require('nodemailer'),
    Photo       = require("../models/photo"),
    Collection  = require("../models/collection"),
    PriceGroup  = require("../models/priceGroup");

//Set Email Variables -- TODO: Test and fix email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rddtest64@gmail.com',
    pass: 'PaY4qGRrjm0q'
  }
});

//Home page
router.get("/", function(req, res) {
    Photo.find({showOnHome: true}, function(err, backgrounds){
        if(err) {
            console.log();
        } else {
            res.render("home", {backgrounds: backgrounds});
        }
    });
    
});

//About page
router.get("/about", function(req, res) {
    res.render("about", {});
});

//Contact page
router.get("/contact", function(req, res) {
   res.render("contact", {}); 
});

//Contact Post
router.post("/contact", function(req, res){
    //prep the body
    var emailBody = "From: " + req.body.name + "\n";
    emailBody += "Email: " + req.body.email + "\n";
    emailBody += "Phone Number: " + req.body.phone + "\n";
    emailBody += "Prefered Method of Contact: " + req.body.contactOptions + "\n";
    emailBody += "Interested In: " + req.body.interestedOptions + "\n";
    emailBody += "\n\n";
    emailBody += "Other Comments:" + "\n";
    emailBody += req.body.otherComments;
    //prep the email
    var mailOptions = {
      from: req.body.email,
      to: 'devindockstaderphotography@gmail.com',
      subject: 'New contact from DDP photos site!',
      text: emailBody
    };
    //send an email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
    
    //Return to contact page, with a response of successful or not.
   res.redirect("/contact"); 
});

//Pricing page
router.get("/pricing", function(req, res) {
    PriceGroup.find().sort("order").populate("prices").exec(function(err, allPriceGroups) {
        if(err) {
            console.log(err);
        } else {
            res.render("pricing", {pricing: allPriceGroups}); 
        }
    });
});

//Gallery Pages
router.get("/gallery/:titleLC", function(req, res) {
    var sorter= {addDate: -1};    
    Collection.findOne({titleLower: req.params.titleLC }).populate({path: "images", options: {sort: sorter}}).exec(function(err, col) {
       if(err) {
           console.log(err);
       } else {
           if(col) {
            res.render("gallery", {title: col.title, images: col.images});    
           }
           else{
               res.redirect("/");
           }
           
       }
   });
});

module.exports = router;