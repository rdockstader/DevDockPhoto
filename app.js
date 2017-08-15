var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

//Set Email Variables
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rddtest64@gmail.com',
    pass: 'PaY4qGRrjm0q'
  }
});

//Home page
app.get("/", function(req, res) {
    var backgrounds = [
        {name: "jordan-min.jpg", alt: "jordan min jpg"},
        {name: "devinrae.jpg", alt: "devinrae min jpg"},
        {name: "wagon-ride.jpg", alt: "wagone ride jpg"},
        {name: "family.jpg", alt: "Family photo"}
    ];
    res.render("home", {backgrounds: backgrounds});
});

//About page
app.get("/about", function(req, res) {
    res.render("about");
});

//Contact page
app.get("/contact", function(req, res) {
   res.render("contact"); 
});

//Contact Post
app.post("/contact", function(req, res){
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
app.get("/pricing", function(req, res) {
    var pricing = [
        {
            label: "Portraits", 
            prices: [
                {type: "Single Session/Head Shots", time: "Up to 30 min", price: "$199.00"},
                {type: "Small Family (4 or less)", time: "up to 1 hour/1-3 Location(s)", price: "$399.00"},
                {type: "Medium Family (4-10)", time: "up to 1 hour/1-2 Location(s)", price: "$449.00"},
                {type: "Large Family (10+)", time: "up to 1 hour/1 location", price: "$499.00+"},
            ]
        },
        {
            label: "Seniors", 
            prices: [
                {type: "Half Session", time: "up to 30 min/1 Location", price: "$199.00"},
                {type: "Full Session", time: "up to 60 min/1-2 Locations", price: "$399.00"},
                {type: "Extended Session", time: "up to 90 min/1-3 Locations", price: "$499.00"}
            ]
        },
        {
            label: "Weddings", 
            prices: [
                {type: "Engagements", time: "up to 1 hour/1-3 Location(s)", price: "$399.00"},
                {type: "Formals/Bridals", time: "up to 1 hour/1-3 Location(s)", price: "$399.00"},
                {type: "Reception", time: "3 hour MAX", price: "$699.00"},
                {type: "Wedding Day", time: "2 hour MAX", price: "$699.00"}
            ]
        },
        {
            label: "Add Ons", 
            prices: [
                {type: "Travel Out of Cache County", time: "-", price: "$50.00/hour"},
                {type: "Second Photographer", time: "-", price: "Dependant upon Time/Distance"},
                {type: "Extra Time/Going Over", time: "-", price: "$300/hr"}
            ]
        }
    ];
    
    res.render("pricing", {pricing: pricing}); 
});

//Gallery Pages
app.get("/portraits", function(req, res) {
   var title = "Portraits";
   var images = [
        {path: "portraits/benji-min.jpg", alt: "Benji"},   
        {path: "portraits/bradey-min.jpg", alt: "Bradey"},
        {path: "portraits/carson-min.jpg", alt: "Carson"},
        {path: "portraits/devinrae-1.jpg", alt: "Devin Rae"},
        {path: "portraits/devinrae-2.jpg", alt: "Devin Rae"},
        {path: "portraits/devinrae-3.jpg", alt: "Devin Rae"},
        {path: "portraits/devinrae-4.jpg", alt: "Devin Rae"},
        {path: "portraits/devinrae-5.jpg", alt: "Devin Rae"},
        {path: "portraits/devinrae-6.jpg", alt: "Devin Rae"},
        {path: "portraits/devinrae-7.jpg", alt: "Devin Rae"},
        {path: "portraits/jordan-min.jpg", alt: "Jordan"},
        {path: "portraits/jr-min.jpg", alt: "JR"},
        {path: "portraits/kade-min.jpg", alt: "Kade"},
        {path: "portraits/kelson-min.jpg", alt: "Kelson"},
        {path: "portraits/ryan-min.jpg", alt: "Ryan"},
        {path: "portraits/sam-min.jpg", alt: "Sam"},
        {path: "portraits/trevor-min.jpg", alt: "Trevor"},
        {path: "portraits/P03.jpg", alt: "p03"},
        {path: "portraits/P06.jpg", alt: "p06"},
        {path: "portraits/P07.jpg", alt: "p07"},
        {path: "portraits/P09.jpg", alt: "p09"},
        {path: "portraits/P10.jpg", alt: "p10"},
        {path: "portraits/P17.jpg", alt: "p17"},
        {path: "portraits/P19.jpg", alt: "p19"},
        {path: "portraits/P21.jpg", alt: "p21"},
        {path: "portraits/P25.jpg", alt: "p25"},
        {path: "portraits/P26.jpg", alt: "p26"},
        {path: "portraits/P29.jpg", alt: "p29"}
    ];
   
   
   res.render("gallery", {title: title, images: images}); 
});

app.get("/family", function(req, res) {
   var title = "Family";
   var images = [
        {path: "family/_MG_2206-min.jpg", alt: "first picture"},
        {path: "family/_MG_2213-min.jpg", alt: "Second picture"},
        {path: "family/_MG_2219-min.jpg", alt: "Third picture"},
        {path: "family/_MG_2242-min.jpg", alt: "Fourth picture"},
        {path: "family/_MG_2296-min.jpg", alt: "Fifth picture"},
        {path: "family/_MG_2314-min.jpg", alt: "Sixth picture"},
        {path: "family/_MG_2318-min.jpg", alt: "Seventh picture"},
        {path: "family/DSC_0612-min.jpg", alt: "Eight picture"},
        {path: "family/DSC_0632-min.jpg", alt: "Ninth picture"},
        {path: "family/DSC_0644-min.jpg", alt: "Tenth picture"},
        {path: "family/DSC_0678-min.jpg", alt: "Eleventh picture"},
        {path: "family/DSC_0798-min.jpg", alt: "Twelth picture"},
        {path: "family/DSC_0878-min.jpg", alt: "13th picture"},
        {path: "family/DSC_0921-min.jpg", alt: "14th picture"},
        {path: "family/DSC_0955-min.jpg", alt: "15th picture"},
        {path: "family/DSC_0988-min.jpg", alt: "16th picture"},
        {path: "family/DSC_1012-min.jpg", alt: "17th picture"},
        {path: "family/DSC_1015-min.jpg", alt: "18th picture"},
        {path: "family/DSC_1034-min.jpg", alt: "19th picture"},
        {path: "family/DSC_1047-min.jpg", alt: "20th picture"},
        {path: "family/DSC_1086-min.jpg", alt: "21st picture"},
        {path: "family/DSC_1104-min.jpg", alt: "22th picture"},
        {path: "family/F17.jpg", alt: "23rd picture"},
        {path: "family/F18.jpg", alt: "24rd picture"},
        {path: "family/F21.jpg", alt: "25rd picture"},
        {path: "family/F22.jpg", alt: "26rd picture"},
        {path: "family/F24.jpg", alt: "27rd picture"},
        {path: "family/F27.jpg", alt: "28rd picture"},
        {path: "family/F28.jpg", alt: "29rd picture"},
        {path: "family/F29.jpg", alt: "30rd picture"}
    ];
   res.render("gallery", {title: title, images: images}); 
});
//End gallery pages


//catch all other requests
app.get("*", function(req, res) {
    res.render("error");
    
});

//Server listener
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server Started!!!"); 
});