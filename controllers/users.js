const User =require("../models/user.js");


module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,password,email}=req.body;
    const newuser=new User({
        email,username
    });
    const registereduser=await User.register(newuser,password);
    console.log(registereduser);
    req.login(registereduser,((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Wonderlust...");
    res.redirect("/listings");
    }))
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}

module.exports.renderloginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginForm=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! Your logged in successfully.!")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are Logged out Now...!")
        res.redirect("/listings");
    })
}