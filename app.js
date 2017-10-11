// Require Libraries
var fileUpload      = require("express-fileupload"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require('mongoose'),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    AWS             = require("aws-sdk"),
    express         = require("express"),
    //path            = require("path"),
    fs              = require("fs"),
    app             = express();
    
// Require Database Models    
var PriceGroup      = require("./models/priceGroup"),
    Collection      = require("./models/collection"),
    Photo           = require("./models/photo"),
    User            = require("./models/user");

// Require Routes and Middleware
var middleware          = require("./middleware"),
    indexRoutes         = require("./routes/index"),
    adminRoutes         = require("./routes/admin"),
    adminGalleryRoutes  = require("./routes/adminGallery"),
    adminPhotoRoutes    = require("./routes/adminPhoto");


// Application Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(/*__dirname +*/ "public"));
mongoose.Promise = global.Promise;
// Test database
 mongoose.connect("mongodb://localhost/dev_dock_photo", {useMongoClient: true});
// Live Database
// mongoose.connect("mongodb://herokuLogin:J1OMFqB2Vja0@ds119064.mlab.com:19064/dev_dock_photo", {useMongoClient: true});
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

//Seed Database (with test user)
/* var seedDB = require("./seeds/seed");
seedDB(); // */

app.locals.galleryList = middleware.getGalleryList();

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/gallery", adminGalleryRoutes);
app.use("/admin/gallery/:galleryId/photos", adminPhotoRoutes);

//catch all other requests
app.get("*", function(req, res) {
    res.render("error", {});
    
});

//Server listener
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server Started!!!"); 
});