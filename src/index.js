const express = require("express");

const app = express();
const passport = require("passport")
const configPassport = require("./passport")
const session = require("express-session")

//DAtABASE
const {db}=require("./db");
const req = require("express/lib/request");
const res = require("express/lib/response");

//session
app.use(session({
    secret:"misecreto",
    resave:true,
    saveUninitialized:true
}))

//-------
const auth = (req,res,next)=>{
    if(req.isAuthenticated()) return next()
    res.redirect("/login")
}

//plantilla
app.set("views",__dirname+"/views")
app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//routes
app.get("/profile",auth ,(req,res)=>{
    res.render("profile", {user:req.user.username})
})

app.get("/login", (req,res)=>{
    res.render("signin")
})

app.get("/signup", (req,res)=>{
    req.logOut();
    res.redirect("/login")
})

app.get("/logout",(req,res)=>{
    res.send("bienv")
})

app.post("/signup",passport.authenticate("local-signup",{
    successRedirect:"/login",
    failureRedirect:"/signup"
}))

app.post("/login",passport.authenticate("local-login",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}))

app.listen(8080, ()=>{
    db.sync({force:false})
    .then(()=>{
        console.log("conectado a la base de datos")
    }).catch((err)=> {
        console.log(err)
    })
    console.log("server andando")
});