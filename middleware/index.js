var AWS             = require("aws-sdk"),
    fs              = require("fs"),
    Collection      = require("../models/collection");

var middlewareObj = {};

//AWS configuration
//var bucketName = 'dev-dock-photo';
var bucketName = 'rdd-test-bucket';
var photoBucket = new AWS.S3({params: {Bucket: bucketName}});


//  *************** Helper Functions ***************** //
// AWS Functions
middlewareObj.uploadToAWS = function(file, key, callback) {
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
    
};

middlewareObj.deleteFromAWS = function(key) {
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
};

// Other Functions
middlewareObj.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

middlewareObj.getGalleryList = function() {
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
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/admin");
};

module.exports = middlewareObj;