const express =require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname+'/date.js');
const app = express();
const db = []
const _ = require('lodash');
const homestarting = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended:true}));


app.get('/', function(req, res){
    res.render("home",{posts: db , date:date.curr_date(),page:"Blog"});
})
app.get('/webtech',function(req, res){
    res.render("home",{ posts: db ,date:date.curr_date(),page:"Web Technology"});
})
app.get('/tech',function(req, res){
    res.render("home",{ posts: db ,date:date.curr_date(),page:"Technology"});
})
app.get('/posts/:postname',function(req, res){
    // console.log(req.params.postname);
    const postname = _.lowerCase(req.params.postname);
   
    for(let i=0; i<db.length; i++){
        // const titleStored = db[i].title;

        const titleStored = _.lowerCase(db[i].title);
        
        if(titleStored==postname){
            console.log("matching post");
            res.render("post",{post: db[i],date:date.curr_date()});
        }
    }
    
})
app.get('/about',function(req, res){
    res.render("about");
})
app.get('/contact',function(req, res){
    res.render("contact");
})
app.get('/compose',function(req, res){
    res.render("compose");
});
app.post('/compose',function(req, res){
    
   
    const post = {topic : req.body.topic, title:req.body.title,headline:req.body.headline, content : req.body.content};
    console.log(post);
    // if(post.topic === "Web Technology"){
        db.push(post)
    // }
    res.redirect('/');
})
app.listen(3000,(req,res)=>{
    console.log("listening on port 3000");
});