const User = require('../routes/models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../lib/passport');


module.exports = {
    //register with passport
    register:(req, res) => {
        if(!req.body.name || !req.body.email || !req.body.password){
            return res.status(403).json({message:'All fields must be filled'});
        };
        //check if user exists
        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
            return res.status(400).json({message:'User already exists'});
            };
            const newUser = new User();
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = hash;
            newUser.save()
            .then(user => {
            return req.login(user, (err) => {
                if(err){
                return res.status(500).json({message:'Server error', err});
                } else {
                res.redirect('/auth/findWeather');
                }
            });
            })
            .catch(err => res.status(400).json({message:'User not saved', err}))
        })
        .catch(err => res.status(500).json({message:'Server error', err}));
    },

    //render register page
    registerPage:(req, res) => {
    return res.render('main/register');
    },

    //login with passport
    login:
    //authenticate using local login from passport file
    passport.authenticate('local-login', {
        successRedirect:'/auth/findWeather',
        failureRedirect:'/fail',
    }),

    //render login page
    loginPage:(req, res) => {
    res.render('main/login');
    },

    //render fail page
    failPage:(req, res) => {
    return res.render('main/fail');
    },

    //logout user
    logout:(req, res) => {
    req.session.destroy();
    console.log('logout ', req.session)
    req.logout();
    return res.redirect('/');
    },

    //render landing page
    home:(req, res) => {
        return res.render('main/index')
    }
};