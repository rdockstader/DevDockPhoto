// Require Libraries
var fileUpload      = require("express-fileupload"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    nodemailer      = require('nodemailer'),
    mongoose        = require('mongoose'),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    AWS             = require("aws-sdk"),
    express         = require("express"),
    path            = require("path"),
    fs              = require("fs"),
    app             = express();
    
// Require Database Models    
var PriceGroup      = require("./models/priceGroup"),
    Collection      = require("./models/collection"),
    Photo           = require("./models/photo"),
    User            = require("./models/user");
    


// Application Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(/*__dirname +*/ "public"));
mongoose.Promise = global.Promise;
// Test database
//mongoose.connect("mongodb://localhost/dev_dock_photo", {useMongoClient: true});
// Live Database
mongoose.connect("mongodb://herokuLogin:J1OMFqB2Vja0@ds119064.mlab.com:19064/dev_dock_photo", {useMongoClient: true});
app.use(methodOverride("_method"));
app.use(fileUpload());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Devin Dockstader Photography will be the best there ever was",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//AWS configuration
var bucketName = 'rdd-test-bucket';
var photoBucket = new AWS.S3({params: {Bucket: bucketName}});


//require Seed
// var seedDB          = require("./seeds/seed");

// Create test user
// seedDB();



//  *************** Helper Functions ***************** //
// AWS Functions
function uploadToAWS(file, key, callback) {
    //console.log("In uploadtoAWS function");
    var awsFileLocation = "";
    var uploadParams = {Key: key, Body: ""};
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err){
        console.log("file error", err); 
    });
    uploadParams.Body = fileStream;
    
    photoBucket.upload(uploadParams, function (err, data) {
        if(err) {
            console.log("Error occured uploading to AWS: " + err);
        } else {
            console.log("Upload successful: " + data.Location);
        }
    });
    awsFileLocation = "https://" + bucketName + ".s3.amazonaws.com/" + key;
    console.log("finishing with return of " + awsFileLocation);
    callback(awsFileLocation);
    
}
function deleteFromAWS(key) {
    console.log("AWS Key: " + key);
    var params = { Key: key };
    photoBucket.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);  // error
        }
        else {
            console.log("file deleted from AWS"); // deleted
        }
    });
}

// Other Functions
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
   //console.log("Ran this code");
   return headerGalleryList;
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/admin");
}

app.locals.galleryList = getGalleryList();

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

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
    /*var backgrounds = [
        {name: "jordan-min.jpg", alt: "jordan min jpg"},
        {name: "devinrae.jpg", alt: "devinrae min jpg"},
        {name: "wagon-ride.jpg", alt: "wagone ride jpg"},
        {name: "family.jpg", alt: "Family photo"}
    ];*/
    Photo.find({showOnHome: true}, function(err, backgrounds){
        if(err) {
            console.log();
        } else {
            res.render("home", {backgrounds: backgrounds});
        }
    });
    
});

//About page
app.get("/about", function(req, res) {
    res.render("about", {});
});

//Contact page
app.get("/contact", function(req, res) {
   res.render("contact", {}); 
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
            res.render("pricing", {pricing: allPriceGroups}); 
        }
    });
    
    
});

//Gallery Pages
app.get("/gallery/:titleLC", function(req, res) {
   Collection.findOne({titleLower: req.params.titleLC }).populate("images").exec(function(err, col) {
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
    res.render("admin/login", {}); 
});

app.post("/admin", passport.authenticate("local", 
    {
        successRedirect: "/admin/home",
        failureRedirect: "/admin"
    }), function(req, res){
});

// Main Landing
app.get("/admin/home", isLoggedIn, function(req, res) {
    res.render("admin/home", {}); 
});

// Gallery Pages
// ====================

// Gallery primary landing
app.get("/admin/gallery", isLoggedIn, function(req, res) {
      Collection.find({}, function(err, allCollections) {
          if(err) {
              console.log(err);
              res.redirect("/admin");
          } else {
              res.render("admin/gallery/index", {collections: allCollections, collection: null});
          }
      });
});

//Gallery Create
app.post("/admin/gallery", isLoggedIn, function(req, res){
    // create Collection
   Collection.create({title: capitalizeFirstLetter(req.body.title), titleLower: req.body.title.toLowerCase()}, function(err, newCollection) {
        if(err) {
            res.render("/admin/gallery/new", {});
        } else {
            // then, redirect to the index
            app.locals.galleryList = getGalleryList();
            res.redirect("/admin/gallery");
        }
   });
});

//Gallery Add
app.get("/admin/gallery/new", isLoggedIn, function(req, res) {
    res.render("admin/gallery/new", {});
});

// Edit Gallery
app.get("/admin/gallery/:id/edit", isLoggedIn, function(req, res) {
    //Collection.findById(req.params.id, function(err, foundCollection) {
    Collection.findById(req.params.id).populate("images").exec(function(err, foundCollection){
       if(err) {
           res.redirect("/admin/gallery");
       } else {
           res.render("admin/gallery/edit", {collection: foundCollection});
       }
    });
});

// Update Gallery
app.put("/admin/gallery/:id", isLoggedIn, function(req, res) {
    Collection.findByIdAndUpdate(req.params.id, {title: capitalizeFirstLetter(req.body.title), titleLower: req.body.title.toLowerCase()}, function(err, updatedCollection) {
       if(err) {
           res.redirect("/admin/gallery");
       } else {
           app.locals.galleryList = getGalleryList();
           res.redirect("/admin/gallery/" + req.body.title.toLowerCase());
       }
    });
});

// Destory Gallery
app.delete("/admin/gallery/:id", isLoggedIn, function(req, res) {
    
    Collection.findById(req.params.id, function(err, col){
        if(err) {
            console.log(err);
        } else {
            //remove from Database and Local Filesystem
            col.images.forEach(function(image) {
                Photo.findByIdAndRemove(image._id, function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("photo removed");
                    }
                });
            });
            var dir = __dirname + "/public/img/gallery/" + col.titleLower;
            if(fs.existsSync(dir)) {
                fs.rmdir(dir, function(err){
                    if(err){
                        console.log(err);
                    } else {
                        console.log(col.title + " gallery directory removed");
                    }
                });
            }
            Collection.findByIdAndRemove(req.params.id, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("collection removed");
                }
            });
            app.locals.galleryList = getGalleryList();
        }     
    });
    res.redirect("/admin/gallery");
});

// Gallery selected landing
app.get("/admin/gallery/:title", isLoggedIn, function(req, res) {
    Collection.findOne({titleLower: req.params.title }).populate("images").exec(function(err, col) {
          if(err) {
              console.log(err);
              res.redirect("/admin");
          } else {
              //console.log(col);
              res.render("admin/gallery/index", {collection: col});
          }
      });
});

// Photo Pages
// ====================

// Photo Create
app.post("/admin/gallery/:galleryId/photos", isLoggedIn, function(req, res) {
    //console.log(req.params.galleryId);
    Collection.findById(req.params.galleryId, function(err, col){
        if(err) {
            console.log(err);
        }
        //Save to File Structure
        req.body.title = req.files.newPhoto.name;
        req.body.alt = req.body.title.replace(/\.[^/.]+$/, "");
        console.log("Filename: " + req.body.title);
        var path = col.titleLower + "/" + req.body.title;
        //console.log(req.files);
        var localFilePath;
        var newFile = req.files.newPhoto;
        if(newFile) {
            var dir = __dirname + "/public/img/gallery/" + col.titleLower;
            if(!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            localFilePath = __dirname + "/public/img/gallery/" + path;
            newFile.mv(localFilePath, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("File Uploaded!");
                }
            });    
        }
        //Save to s3
        uploadToAWS(localFilePath, path, function(AWSpath) {
            Photo.create({path: AWSpath, title: req.body.title, alt: req.body.alt, key: path, showOnHome: req.body.showOnHome}, function(err, photo){
            if(err) {
                console.log(err);
            } else {
                col.images.push(photo); 
                col.save();
                

                // Send to Gallery page
                res.redirect("/admin/gallery/" + col.titleLower);
                //res.send("file uploaded");  
            }
        })});
        
    });
});


// Photo Add
app.get("/admin/gallery/:galleryId/photos/new", isLoggedIn, function(req, res) {
    res.render("admin/photos/new", {galleryId: req.params.galleryId});  
});


// Photo Update
app.get("/admin/gallery/:galleryId/photos/:id", isLoggedIn, function(req, res) {
    Photo.findById(req.params.id, function(err, photo){
        if(err) {
            console.log(err);
        }
        else {
             console.log(photo);
             res.render("admin/photos/edit", {galleryId: req.params.galleryId, photo: photo}); 
        }
    });
   
});

// Photo edit
app.put("/admin/gallery/:galleryId/photos/:id", isLoggedIn, function(req, res){
    //console.log(req.body.photo);
    if(!req.body.photo.showOnHome) {
        req.body.photo.showOnHome = false;
    }
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err) {
            console.log(err);
        } else {
            //console.log(updatedPhoto);
            Collection.findById(req.params.galleryId, function(err, col){
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/admin/gallery/" + col.titleLower);
                }
            });
        }
    });
});

// Photo Destory
app.delete("/admin/gallery/:galleryId/photos/:id", isLoggedIn, function(req, res){
    var photoPath = "";
    var photoId = "";
    // Locate photo for destruction
    Photo.findById((req.params.id), function(err, photo){
        if(err){
            console.log(err);
        } else {
            photoPath = photo.path;
            photoId = photo._id;
            deleteFromAWS(photo.key);
        }
    });
    // Remove from AWS s3
    // Remove from local FS and database
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("photo removed");
            Collection.findById(req.params.galleryId, function(err, col){
                if(err) {
                    console.log(err);
                } else {
                    //Remove from array
                    var indexOfPhoto = col.images.findIndex(i => i._id === photoId);
                    col.images.splice(indexOfPhoto, 1);
                    console.log("photo removed from collection");
                    col.save();
                    res.redirect("/admin/gallery/" + col.titleLower);
                }
            });
        }
    });
    
    
});

// ====================
// End Admin Pages
// ====================


//catch all other requests
app.get("*", function(req, res) {
    res.render("error", {});
    
});

//Server listener
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server Started!!!"); 
});