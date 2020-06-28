//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true, useUnifiedTopology: true
});

const articlesSchema = new mongoose.Schema({
title:String,
content:String
})

const Article = mongoose.model("Article", articlesSchema);


app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, results) {
    if(err){
      res.send(err);
    }else {
      res.send(results);
    }
  })
})

.post(function(req, res) {
  console.log(req.body.title);
  console.log(req.body.content);

  const art1 = new Article ({
    title: "Atom",
    content: "Atom is an application used to code."
  })
  art1.save(function(err){
    if(err){
      res.send(err);
    }else {
      console.log("Succesfully created a new post");
    }
  })
})

.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Articles Succesfully deleted!");
    }
  })
});

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
    if(err){
      res.send(err);
    }else {
      console.log(foundArticle);
      res.send(foundArticle);
    }
  })
})

.put(function(req, res){
  Article.update({title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully updated article.")
      } else{
        res.send(err);
      }
    }
  );
  })


.patch(function(req, res){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err,patchedArticle){
      if(err){
        console.log(err);
      }else{
        res.send(patchedArticle);
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Succesfully deleted!");
      } else {
        res.send(err);
      }
    }
  )
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
