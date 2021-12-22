const express = require("express");

const yargs = require ("yargs/yargs")(process.argv.slice(2))
const args = yargs.default({
    port:8080
}).argv

const dotenv = require("dotenv");
dotenv.config()

//-- child process
const {exec,spawn} = require("child_process")

exec("ls", (error, stdout,stderr)=>{
    if(error){
        console.log(`error: ${error.message}`)
        return
    }
    if(stderr){
        console.log(`stderr: ${stderr}`)
        return
    }

    console.log(`stdout: ${stdouts}`)
})


const app = express();
const passport = require("passport")
const configPassport = require("./passport")
const session = require("express-session")

//DAtABASE
//const {db}=require("./db");
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

//-------- fork



app.get("/random", (req,res)=>{
   let random = fork("./random.js");
   random.send("start")
   process.on("message",(sum)=>{
       res.send(sum)       
   })
})

//--- process

let pid = process.cwd();
let path = process.pid;
let nodev = process.version;
let title = process.title;
let platform = process.platform;
let memory = process.memoryUsage();
console.log(memory)



app.get("/info", (req,res)=>{
    res.render("info",{pid, path, nodev, title, platform,memory})
})



let PORT = process.env.PORT;
let HOST = process.env.HOST;

app.listen(PORT, ()=>{
    /*db.sync({force:false})
    .then(()=>{
        console.log("conectado a la base de datos")
    }).catch((err)=> {
        console.log(err)
    })*/
    console.log(`server run on PORT ${args.port} HOST ${HOST}`)
});