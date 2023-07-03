//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hi, My Name is Aditya Kumar and I am studing in class 8th.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/myBlogDB', {
  useNewUrlParser: true
}, {
  useUnifiedTopology: true
});

const blogSchema = mongoose.Schema({
  postTitle: String,
  blogPost: String,
  summary : String
});

const blogModel = mongoose.model("blogModel", blogSchema);

//finding all data showing on home page

app.get("/", function (req, res) {
  blogModel.find({}, {}, function (err, results) {
    res.render("home", {
      startingContent: homeStartingContent,
      data : results
    });
  });
});

// showing about page

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

// showing contact page

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});



// compose page view 
app.get("/compose", function (req, res) {
  res.render("compose");
});


//creating post request and saving data to mongodb database
app.post("/compose", function (req, res) {
  const postTitle = req.body.postTitle;
  blogModel.findOne({postTitle:postTitle},function(err,data){
    if(!err){
       if (!data) {
           const newBlog = new blogModel({
           postTitle:req.body.postTitle,
           blogPost:req.body.blogPost,
           summary : req.body.summary

  });
  newBlog.save();
  res.redirect("/");
 }
 else{
  res.send("<h1>Post title aready in use. Please give another name to your post.</h1>");
 }
}
});
});




//redirecting to post name when clicked read more to selected title

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  blogModel.find({}, {}, function (err, results) {
    results.forEach(function (post) {
      const storedTitle = _.lowerCase(post.postTitle);
      if (storedTitle === requestedTitle) {
        res.render("post", {
          postTitle: post.postTitle,
          blogPost: post.blogPost
        });
      }
    });
  });
});

app.get("/posts/summary/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  blogModel.find({}, {}, function (err, results) {
    results.forEach(function (post) {
      const storedTitle = _.lowerCase(post.postTitle);
      if (storedTitle === requestedTitle) {
        res.render("summary", {
          postTitle: post.postTitle,
          blogPost: post.blogPost,
          summary : post.summary
        });
      }
    });
  });
});




//deleting the post 
app.post("/delete", function (req, res) {
  console.log(req.body.deleteButton);
  const postTitle = req.body.deleteButton;
  if (postTitle===postTitle){
  blogModel.findOneAndDelete({postTitle:postTitle}, function (err, data) {
  if (!err){
  res.redirect("/");
  }
});
  }else{
    res.redirect("/");
  }
});


//starting server at 3000 port

app.listen(3000, function () {
  console.log("Server started on port 3000");
});