//jshint esversion:6
require("dotenv").config();
const express = require ("express");
const  ejs =require('ejs');
const port= 3000
const app = express()
const mongoose =require("mongoose");
const encrypt = require('mongoose-encryption');
const { stringify } = require("nodemon/lib/utils");

app.use(express.static("public")) 
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

const userSchema = new mongoose.Schema({
    email: String, 
    password: String
})
const secretSchema = new mongoose.Schema({
    secret: String, 
    
})


userSchema.plugin(encrypt, { secret: process.env.DB_SECRET , encryptedFields: ["password"] });



const User =new mongoose.model("User", userSchema)
const Secret= new mongoose.model("Secret",secretSchema)





app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/secrets",function(req,res){
    
    const secret= req.body.secret
    res.render("secrets",{secret:secret})
})

app.get("/submit",function(req,res){
    res.render("submit")
})

app.post("/register",function(req,res){
    const newUser= new User({email:req.body.username,password:req.body.password})
    const username = req.body.username;

    User.findOne({email:username}).then(foundUser=>{
        if(foundUser){ 
            res.render("login")
            console.log("User already exists")}
else {
    newUser.save().then(()=>{
      res.render("secrets")})
    }})} )
       



app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
   
    User.findOne({email:username}).then(foundUser=>{
          if(foundUser){
              if(foundUser.password===password){
                  res.render("secrets");
              }
          }
      })
      .catch(err=>{
          console.log(err);
      });
  });



app.post("/submit",function(req,res){

    const secret= req.body.secret
    const newSecret= new Secret({secret:secret})
    newSecret.save()
    
    res.render("secrets",{secret:secret})

})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });