const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const wrapasync = require("../utils/wrapasync.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage})
const Listing=require("../models/listing.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listing.js")


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapasync(listingController.createListing));
    


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
    .get(wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;