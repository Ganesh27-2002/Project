if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}



const mongoose=require("mongoose");
const express=require("express");
const app=express();
const path=require("path");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const ejsMate=require("ejs-mate");
const expresserror=require("./utils/expresserror.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const methodoveride=require("method-override");



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(methodoveride("_method"));

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60
})
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE.",err);
})
const sessionOption={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() +7 *24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
// app.get("/",(req,res)=>{
// res.send("Hi I'm Root server.");
// });




app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  // console.log(res.locals.success);
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  
  next();
});

// app.get("/demouser",async (req,res)=>{
//   let fakeuser= new User({
//     email:"abc@gmai.com",
//     username:"delta-student"
//   });
//   let registeruser=await User.register(fakeuser,"helloworld");
//   res.send(registeruser);
// })


app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new expresserror(404,"Page not found"));
})

//this will execute when page will not present
app.use((err,req,res,next)=>{
  let {statuscode=500,message}=err;
  res.status(statuscode).render("error.ejs",{err});
  // res.status(statuscode).send(message);
})

app.listen(8000,()=>{
    console.log("Server is running on the port 8000");
});