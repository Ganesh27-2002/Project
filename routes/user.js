const express=require("express");
const router=express.Router({mergeParams:true});

const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapasync(userController.signup));

router.route("/login")
.get(userController.renderloginForm)
.post(
    saveRedirectUrl,
    passport.authenticate('local',
    {failureRedirect:"/login",failureFlash:true}),
    userController.loginForm);


//logout route
router.get("/logout",userController.logout)

module.exports=router;