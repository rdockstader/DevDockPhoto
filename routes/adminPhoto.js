var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    fs          = require("fs"),
    middleware  = require("../middleware"),
    Collection  = require("../models/collection"),
    Photo       = require("../models/photo");

// Photo Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Collection.findById(req.params.galleryId, function(err, col){
        if(err) {
            console.log(err);
        }
        //Save to File Structure
        req.body.title = req.files.newPhoto.name;
        req.body.alt = req.body.title.replace(/\.[^/.]+$/, "");
        console.log("Filename: " + req.body.title);
        var path = col.titleLower + "/" + req.body.title;
        var localFilePath;
        var newFile = req.files.newPhoto;
        if(newFile) {
            var dir = __dirname + "/../public/img/gallery/temp";
            if(!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            localFilePath = __dirname + "/../public/img/gallery/temp/" + req.body.title;
            newFile.mv(localFilePath, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("File Uploaded!");
                }
            });    
        }
        //Save to s3
        middleware.uploadToAWS(localFilePath, path, function(AWSpath) {
            Photo.create({path: AWSpath, title: req.body.title, alt: req.body.alt, key: path, showOnHome: req.body.showOnHome}, function(err, photo){
            if(err) {
                console.log(err);
            } else {
                col.images.push(photo); 
                col.save();
                res.redirect("/admin/gallery/" + col.titleLower);
            }
        })});
    });
});

// Photo Add
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("admin/photos/new", {galleryId: req.params.galleryId});  
});

// Photo Update
router.get("/:id", middleware.isLoggedIn, function(req, res) {
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
router.put("/:id", middleware.isLoggedIn, function(req, res){
    if(!req.body.photo.showOnHome) {
        req.body.photo.showOnHome = false;
    }
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err) {
            console.log(err);
        } else {
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
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    var photoId = "";
    // Locate photo for destruction
    Photo.findById((req.params.id), function(err, photo){
        if(err){
            console.log(err);
        } else {
            if(photo) {
                photoId = photo._id;
                middleware.deleteFromAWS(photo.key);
            }
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
                    var indexOfPhoto = col.images.indexOf(photoId);
                    //console.log("photo index: " + indexOfPhoto);
                    //console.log("Expected ID to remove: " + photoId);
                    //console.log("Images before splice: " + col.images);
                    if(indexOfPhoto >= 0) {
                        col.images.splice(indexOfPhoto, 1); 
                        console.log("photo removed from collection");
                    } else {
                        console.log("Image not found. Not removing from collection.");
                    }
                    //console.log("Images after splice: " + col.images);
                    col.save();
                    res.redirect("/admin/gallery/" + col.titleLower);
                }
            });
        }
    });
});

module.exports = router;