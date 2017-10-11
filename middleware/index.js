var AWS             = require("aws-sdk"),
    fs              = require("fs"),
    Collection      = require("../models/collection");

var middlewareObj = {};

//Production Bucket
//var bucketName = 'dev-dock-photo';
var bucketName = process.env.BUCKET_NAME;
var photoBucket = new AWS.S3({params: {Bucket: bucketName}});

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

middlewareObj.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

middlewareObj.getGalleryList = function() {
    var sorter = {order: 1};
    var headerGalleryList = [];
    Collection.find({}, 'title').sort(sorter).exec(function(err, allCollections) {
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

middlewareObj.findIndexByKeyValue = function(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return -1;
};

module.exports = middlewareObj;