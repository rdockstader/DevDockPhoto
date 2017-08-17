var fileUpload      = require("express-fileupload"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    nodemailer      = require('nodemailer'),
    mongoose        = require('mongoose'),
    express         = require("express"),
    app             = express(),
    PriceGroup      = require("./models/priceGroup"),
    Collection      = require("./models/collection"),
    seedDB          = require("./seeds/seed");

// Application Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(/*__dirname +*/ "public"));
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dev_dock_photo", {useMongoClient: true});
app.use(methodOverride("_method"));
app.use(fileUpload());


//seedDB();

// Helper Functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getGalleryList() {
    var headerGalleryList = [];
    Collection.find({}, 'title', function(err, allCollections) {
       if(err) {
           console.log(err);
       } else {
           allCollections.forEach(function(col){
               headerGalleryList.push(col.title);
           });
       }
   });
   return headerGalleryList;
}

// Global Variables
var galleryList = getGalleryList();


app.set("view engine", "ejs");

//Set Email Variables
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rddtest64@gmail.com',
    pass: 'PaY4qGRrjm0q'
  }
});

// ====================
// Begin Public Pages
// ====================

//Home page
app.get("/", function(req, res) {
   // console.log(galleryList);
    var backgrounds = [
        {name: "jordan-min.jpg", alt: "jordan min jpg"},
        {name: "devinrae.jpg", alt: "devinrae min jpg"},
        {name: "wagon-ride.jpg", alt: "wagone ride jpg"},
        {name: "family.jpg", alt: "Family photo"}
    ];
    res.render("home", {backgrounds: backgrounds, galleryList: galleryList});
});

//About page
app.get("/about", function(req, res) {
    res.render("about", {galleryList: galleryList});
});

//Contact page
app.get("/contact", function(req, res) {
   res.render("contact", {galleryList: galleryList}); 
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
    PriceGroup.find().sort("order").populate("prices").exec(function(err, allPriceGroups) {
        if(err) {
            console.log(err);
        } else {
            res.render("pricing", {pricing: allPriceGroups, galleryList: galleryList}); 
        }
    });
    
    
});

//Gallery Pages
app.get("/gallery/:titleLC", function(req, res) {
   Collection.findOne({titleLower: req.params.titleLC }, function(err, col) {
       if(err) {
           console.log(err);
       } else {
           res.render("gallery", {title: col.title, images: col.images, galleryList: galleryList});
       }
   });
});

// ====================
// End Public Pages
// ====================

// ====================
// Begin Admin Pages
// ====================

// Main Pages
// ====================


// Login Page
app.get("/admin", function(req, res) {
    res.render("admin/login", {galleryList: galleryList}); 
});

// Main Landing
app.get("/admin/home", function(req, res) {
    res.render("admin/home", {galleryList: galleryList}); 
});

// Gallery Pages
// ====================

// Gallery primary landing
app.get("/admin/gallery", function(req, res) {
      Collection.find({}, function(err, allCollections) {
          if(err) {
              console.log(err);
              res.redirect("/admin");
          } else {
              res.render("admin/gallery/index", {collections: allCollections, thisCollection: "none", galleryList: galleryList});
          }
      });
});

//Gallery Create
app.post("/admin/gallery", function(req, res){
    // create Collection
   Collection.create({title: capitalizeFirstLetter(req.body.title), titleLower: req.body.title.toLowerCase()}, function(err, newCollection) {
        if(err) {
            res.render("/admin/gallery/new", {galleryList: galleryList});
        } else {
            // then, redirect to the index
            galleryList = getGalleryList();
            res.redirect("/admin/gallery");
        }
   });
});

//Gallery Add
app.get("/admin/gallery/new", function(req, res) {
    res.render("admin/gallery/new", {galleryList: galleryList});
});

// Edit Gallery
app.get("/admin/gallery/:id/edit", function(req, res) {
    Collection.findById(req.params.id, function(err, foundCollection) {
       if(err) {
           res.redirect("/admin/gallery");
       } else {
           res.render("admin/gallery/edit", {collection: foundCollection, galleryList: galleryList});
       }
    });
});

// Update Gallery
app.put("/admin/gallery/:id", function(req, res) {
    Collection.findByIdAndUpdate(req.params.id, {title: capitalizeFirstLetter(req.body.title), titleLower: req.body.title.toLowerCase()}, function(err, updatedCollection) {
       if(err) {
           res.redirect("/admin/gallery");
       } else {
           galleryList = getGalleryList();
           res.redirect("/admin/gallery/" + req.body.title.toLowerCase());
       }
    });
});

// Destory Gallery
app.delete("/admin/gallery/:id", function(req, res) {
   Collection.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/admin/gallery");
       } else {
           galleryList = getGalleryList();
           res.redirect("/admin/gallery");
       }
   });
});

// Gallery selected landing
app.get("/admin/gallery/:title", function(req, res) {
      Collection.find({}, function(err, allCollections) {
          if(err) {
              console.log(err);
              res.redirect("/admin");
          } else {
              //console.log("got here");
              res.render("admin/gallery/index", {collections: allCollections, thisCollection: req.params.title, galleryList: galleryList});
          }
      });
});

// Photo Pages
// ====================

// Photo Create
app.post("/admin/gallery/:galleryId/photos", function(req, res) {
    //console.log(req.params.galleryId);
    Collection.findById(req.params.galleryId, function(err, col){
        if(err) {
            console.log(err);
        }
        //Save To Database
        //console.log(req.body);
        var path = col.titleLower + "/" + req.body.title;
        col.images.push({path: path, title: req.body.title, alt: req.body.alt, showOnHome: req.body.showOnHome}); 
        col.save();
        //Save to File Structure
        //console.log(req.files);
        var newFile = req.files.newPhoto;
        if(newFile) {
            newFile.mv(__dirname + "/public/img/gallery/" + path, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("File Uploaded!");
                }
            });    
        }
        // Send to Gallery page
        res.redirect("/admin/gallery/" + col.titleLower);
        //res.send("file uploaded");
    });
});


// Photo Add
app.get("/admin/gallery/:galleryId/photos/new", function(req, res) {
    res.render("admin/photos/new", {galleryId: req.params.galleryId, galleryList: galleryList });  
});


// Photo Update

// Photo edit

// Photo Destory

// ====================
// End Admin Pages
// ====================


//catch all other requests
app.get("*", function(req, res) {
    res.render("error", {galleryList: galleryList});
    
});

//Server listener
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server Started!!!"); 
});