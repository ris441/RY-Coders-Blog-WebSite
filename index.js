require("dotenv").config();
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
     multer = require("multer"),
    passportLocalMongoose = 
        require("passport-local-mongoose")

        var fs = require('fs');
        var path = require('path');
        
// const upload = multer({ dest: '/upload' });
const User = require("./model/User");
const Post = require("./model/Post");
const { response } = require("express");
const { connect } = require("http2");
var app = express();
mongoose.set('strictQuery',false)
const PORT = process.env.PORT || 3000;
const connectDB = async () =>{
    try{
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected : ${conn.connection.host}`);
    }
    catch(error){
      console.log(error);
      process.exit(1);
    }
}
// mongoose.connect("mongodb+srv://RY-Coder:rycoder@cluster0.sfzulgf.mongodb.net/rjit_project?retryWrites=true&w=majority");
  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true}));
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  

//

// const upload = multer({ dest: './public/data/uploads/' });


//
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/", function (req, res) {
  if (req.session.isLoggedIn) {
    // Redirect the logged-in user to the home page
    res.redirect('/userPage');
  } else{
    res.render("home");

  }
});
  
// Showing secret page
  
// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
  
// Handling user signup
app.post("/register", async (req, res) => {
   
  const user = await User.create({
      username: req.body.username,
      password: req.body.password
    });
    
    return res.status(200).json(user);
  });
  
//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});
  
//Handling user login
app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            req.session.isLoggedIn=true;
            req.session.user=user;
            console.log(user);
            res.redirect("/userPage");
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});
  
//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});


function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) return next();
    else{
      res.redirect("/login");

    }
}

app.get("/userPage", isLoggedIn, async function (req, res) {
 console.log(req.session.user);

 
 const posts = await Post.find({});
 const tech = await Post.find({page:'Technology'})
 const webtech = await Post.find({page:'Web Technology'})
//  console.log(posts);
  res.render("userPage",{Post:posts,tech:tech,webtech:webtech});
  // res.send("user Page");
});
app.get('/tech',isLoggedIn,async function (req,res){
  
  const tech = await Post.find({page:'Technology'})
  res.render('tech',{tech:tech});
});

app.get('/webtech',isLoggedIn,async function (req,res){
  
  const webtech = await Post.find({page:'Web Technology'})
  
  res.render("webtech",{webtech:webtech});
  
});
app.get('/posts/:postname',isLoggedIn,async function(req, res){
  // console.log(req.params.postname);
  if(isLoggedIn){
    
  const post=await Post.findOne({title:req.params.postname});
  console.log(post);
  res.render("post",{post:post})
  }
})
app.get('/success',isLoggedIn, (req, res) => {
  if(isLoggedIn){
    res.render('success');

  }
})
app.get('/about',isLoggedIn,function(req, res){
  if(isLoggedIn){
    res.render("about");

  }
})
app.get('/contact',isLoggedIn,function(req, res){
  if(isLoggedIn){

    res.render("contact");
  }
})
app.get('/compose',isLoggedIn,function(req, res){
  if(isLoggedIn){
    res.render("compose");
  }

});
app.post('/compose',isLoggedIn,
// upload.single("image"),
async function(req, res){
  if(req.session.isLoggedIn){

  //   console.log("req body",req.body,"req file",req.file)
  //   const buffer = fs.readFileSync(req.file.path);
  // console.log("image buffer",buffer);
  var date = new Date();
  const options = {
    // weekday:"long",
    day:"numeric",
    month: "short",
    year:"numeric"
}
  // date = date.toLocaleDateString("en-US",options)
    const post = await Post.create({
      username:req.session.user.username,
      title: req.body.title,
      headline:req.body.headline,
      content: req.body.content,
      page:req.body.page,
      // image:{
      //   data:buffer,
      //   contentType: 'image/jpeg'
      // },
      date:date.toLocaleDateString("en-US"),
    })
    console.log(JSON.stringify(post));
    return res.redirect('/success');
  }
  else{
    res.send('error in login in ')  
  }
})


  
// var port = process.env.PORT || 3000;
connectDB().then(
  ()=>{
    app.listen(PORT, function () {
      console.log("Server Has Started!");
  });
  }
);

