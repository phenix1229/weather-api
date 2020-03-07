const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../routes/models/Users');
const bcrypt = require('bcryptjs');

//this places the mongo user id into passport sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//this gives us our req.user to use throughout the app
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//create login middleware
//local-login names the middleware
passport.use(
    'local-login',
    //usernameField defaults to name, but we call email, these fields are expected in LocalStrategy
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        console.log('hello')
        //search for user
        User.findOne({email:req.body.email}, (err, user) => {
            if(err){
                //return the error and no user
                console.log('Login Error', err);
                return done(err, null);
            }
            if(!user){
                console.log('No User Found');
                return done(null, false);
            }
            //unencrypt and compare password
            bcrypt.compare(password, user.password)
            .then(result => {
                if(!result){
                    //no error no user
                    return done(null, false);
                } else {
                    //get our res.user
                    return done(null, user);
                }
            })
            .catch(error => {throw error});
        });
    })
);