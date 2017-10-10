var express         = require("express"),
    router          = express.Router(),
    fs              = require("fs"),
    middleware      = require("../middleware"),
    Collection  = require("../models/collection"),
    Photo       = require("../models/photo");
    
// Gallery Pages
// ====================

// Gallery primary landing
router.get("/", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res){
    // create Collection
   Collection.create({title: middleware.capitalizeFirstLetter(req.body.title), titleLower: req.body.title.toLowerCase()}, function(err, newCollection) {
        if(err) {
            res.render("/admin/gallery/new", {});
        } else {
            // then, redirect to the index
            req.app.locals.galleryList = middleware.getGalleryList();
            res.redirect("/admin/gallery");
        }
   });
});

//Gallery Add
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("admin/gallery/new", {});
});

// Edit Gallery
router.get("/:id/edit", middleware.isLoggedIn, function(req, res) {
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
router.put("/:id", middleware.isLoggedIn, function(req, res) {
    Collection.findByIdAndUpdate(req.params.id, {title: middleware.capitalizeFirstLetter(req.body.title), titleLower: req.body.title.toLowerCase()}, function(err, updatedCollection) {
       if(err) {
           res.redirect("/admin/gallery");
       } else {
           req.app.locals.galleryList = middleware.getGalleryList();
           res.redirect("/admin/gallery/" + req.body.title.toLowerCase());
       }
    });
});

// Destory Gallery
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    
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
            req.app.locals.galleryList = middleware.getGalleryList();
        }     
    });
    res.redirect("/admin/gallery");
});

// Gallery selected landing
router.get("/:title", middleware.isLoggedIn, function(req, res) {
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

module.exports = router;