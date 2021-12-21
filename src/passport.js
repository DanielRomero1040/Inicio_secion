const passport = require("passport")
const LocalStrategy=require("passport-local").Strategy

const {User} = require("./models/users")

// sign in



//sign up
passport.use("local-signup",new LocalStrategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback:true
},async (req,username,password,done)=>{
    //validar
    let user = await User.findOne({
        where:{
            username,
        },
    });
    if(!user){
        let userNew = await User.create({
            username,
            password
        })
        return done(null, userNew)
    }
    return done(null,false);

}));

//sign in
passport.use("local-login",new LocalStrategy(async(username, password,done)=>{
    let user = await User.findOne({
        where:{
            username
        }
    })
    if(user){
        done(null,user)
        return
    }
    done(null, false)
}))

//serializacion
passport.serializeUser((user, done)=>{
    done(null, user.id)
})

//des serializacion
passport.deserializeUser(async(id, done)=>{
    let user = await User.findOne({
        where:{
            id,
        },
    });
    done(null,user)
});

module.exports = passport