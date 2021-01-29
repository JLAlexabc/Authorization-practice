require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const app = express();
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
console.log(process.env.SECRET);
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});
const User = new mongoose.model("user",userSchema);

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
////////////////////////////////////////////Requests//////////////////////////////////
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
////////////////////////////////////////////Response//////////////////////////////////
app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  User.find({email:req.body.username,password:req.body.password},function(err,result){
    if(!err && result){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});
app.listen(3939,function(){
  console.log("Secret is online");
});