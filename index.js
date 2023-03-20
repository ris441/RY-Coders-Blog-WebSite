const express =require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');

const multer = require('multer');
const fs = require('fs');

const date = require(__dirname+'/date.js');
const app = express();
const upload = multer({ dest: '/upload' });
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string
//mongodb+srv://RY-Coder:rycoder@cluster0.sfzulgf.mongodb.net/test.
const uri =
  "mongodb+srv://RY-Coder:rycoder@cluster0.sfzulgf.mongodb.net/test";
//   const client = new MongoClient(uri);
  
  const database = "BlogWebSite";
  const coll = "Posts";

const _ = require('lodash');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended:true}));
app.get('/', function(req, res){
    const connectPromise = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Use the promise to perform database operations
  connectPromise.then((client) => {
    const collection = client.db(database).collection(coll);

    // Fetch data from the collection
    const findPromise = collection.find({}).toArray();

    // Use the promise to handle the success and error cases
    findPromise.then((db) => {
      res.render('home', {posts: db , date:date.curr_date(),page:"Blog"});
      client.close();
    }).catch((err) => {
      console.error(err);
      client.close();
    });
  }).catch((err) => {
    console.error(err);
  });
    // run().catch(console.dir);
    // console.log(db)
    // res.render("home",{posts: db , date:date.curr_date(),page:"Blog"});
})
app.get('/webtech',function(req, res){
    const connectPromise = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Use the promise to perform database operations
  connectPromise.then((client) => {
    const collection = client.db(database).collection(coll);

    // Fetch data from the collection
    const findPromise = collection.find({page:"Web Technology"}).toArray();

    // Use the promise to handle the success and error cases
    findPromise.then((db) => {
      res.render('home', {posts: db , date:date.curr_date()});
      client.close();
    }).catch((err) => {
      console.error(err);
      client.close();
    });
  }).catch((err) => {
    console.error(err);
  });
    
    // res.render("home",{ posts: db ,date:date.curr_date(),page:"Web Technology"});
})
app.get('/tech',function(req, res){
    const connectPromise = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Use the promise to perform database operations
  connectPromise.then((client) => {
    const collection = client.db(database).collection(coll);

    // Fetch data from the collection
    const findPromise = collection.find({page:"Technology"}).toArray();

    // Use the promise to handle the success and error cases
    findPromise.then((db) => {
      res.render('home', {posts: db , date:date.curr_date()});
      client.close();
    }).catch((err) => {
      console.error(err);
      client.close();
    });
  }).catch((err) => {
    console.error(err);
  });
    
})
app.get('/posts/:postname',function(req, res){
    // console.log(req.params.postname);
    const connectPromise = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Use the promise to perform database operations
    connectPromise.then((client) => {
        const collection = client.db(database).collection(coll);
        
        // Fetch data from the collection
      const findPromise = collection.find({}).toArray();




      
      
      // Use the promise to handle the success and error cases
      findPromise.then((db) => {
          const postname = _.lowerCase(req.params.postname);
          var find = -1 ;
          for(let i=0; i<db.length; i++){
                // const titleStored = db[i].title;
        
                const titleStored = _.lowerCase(db[i].title);
                
                if(titleStored==postname){
                    console.log("matching post");
                    find = i;
                }
            }
            console.log(db[find])
          //  var rpost = db[find];
          //  rpost.image = r
        res.render("post",{post: db[find],date:date.curr_date()});
        // res.render('home', {posts: db , date:date.curr_date(),page:"Blog"});
        client.close();
      }).catch((err) => {
        console.error(err);
        // client.close();
      });
    }).catch((err) => {
      console.error(err);
    });
})
app.get('/success', (req, res) => {
   res.render('success');
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
app.post('/compose',upload.single("image"),function(req, res){
  const buffer = fs.readFileSync(req.file.path);
  console.log(req.file,req.body)
    const post = {
        image:buffer,
        page:req.body.page,
        title: req.body.title,
        headline:req.body.headline,
        content: req.body.content,

    };
    const connectPromise = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Use the promise to perform database operations
    connectPromise.then((client) => {
      const collection = client.db(database).collection(coll);
  
      // Fetch data from the collection
    //   const findPromise = collection.find({}).toArray();
    console.log(post);
    collection.insertOne(post,((err) => {
        if (err) throw err;
        console.log('Data inserted successfully');
        res.send('Data inserted successfully');
      }));
  
      // Use the promise to handle the success and error cases
    //   findPromise.then((db) => {
    //     res.render('home', {posts: db , date:date.curr_date(),page:"Blog"});
    //     client.close();
    //   }).catch((err) => {
    //     console.error(err);
    //     client.close();
    //   });
    }).catch((err) => {
      console.error(err);
    });
     const postname = post.title;
    // res.redirect(`/posts/${postname}`);
    
    res.redirect('/success');
  })
app.listen(3000,(req,res)=>{
    console.log("listening on port 3000");
});