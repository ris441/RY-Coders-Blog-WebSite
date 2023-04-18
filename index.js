require("dotenv").config();
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local")
const User = require("./model/User");
const Post = require("./model/Post");
const { response } = require("express");
const { connect } = require("http2");
const { curr_date } = require('./date');
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
// app.get("/register", function (req, res) {
//     res.render("register");
// });
  
// Handling user signup
app.post("/register", async (req, res) => {
   
  const user = await User.create({
      name:req.body.name,
      email:req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    
    return res.status(200).redirect("/");
  });
  
//Showing login form
// app.get("/login", function (req, res) {
//     res.render("login");
// });
  
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
      res.redirect("/");

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
  const user = await User.findOne({username:post.username})
  res.render("post",{post:post,user:user})
  }
})

app.get('/myblog/:username',isLoggedIn,async function(req, res){
  // console.log(req.params.postname);
  if(isLoggedIn){
    
  const posts=await Post.find({username:req.params.username});
  
  const user = await User.findOne({username:req.params.username})
  res.render("myblog",{Posts:posts,author:user.name})
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
app.post('/compose',isLoggedIn,async function(req, res){
  // if(req.session.isLoggedIn){

  const today = curr_date();
  // date = date.toLocaleDateString("en-US",options)
  console.log(req.body)
    const post = await Post.create({
      username:req.session.user.username,
      title: req.body.title,
      headline:req.body.headline,
      content: req.body.content,
      page:req.body.page,
      image:req.body.image,
      date:today,
    })
    console.log(JSON.stringify(post));
    return res.redirect('/success');
  // }
  // else{
  //   res.send('error in login in ')  
  // }
})


  
// var port = process.env.PORT || 3000;
connectDB().then(
  ()=>{
    app.listen(PORT, function () {
      console.log("Server Has Started!");
  });
  }
);

