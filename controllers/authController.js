const fetch = require('node-fetch');
require('dotenv').config();
const apiURL = process.env.URL;
const key = process.env.API_KEY;
require('../lib/passport');

module.exports = {

    //render weather results page
    weather:(req, res) => {
        if(req.isAuthenticated()){
            return res.render('main/weather', {result:null, results:null});
        }else {
            return res.redirect('/fail');
        };
    },

    //weather query logic
    weatherQuery:(req, res) => {
        //check if fields are filled
        if(!req.query.city || !req.query.forecast){
            return res.status(403).json({message:'All fields must be filled'});
        };
        //if 5 day forecast is selected
        if(req.query.forecast === 'fiveDayForecast'){
            return fetch(`${apiURL}forecast?q=${req.query.city}&appid=${key}&units=imperial`)
            .then(res=>res.json())
            .then((results)=>{
                return res.render('main/weather', {result:null, results});
            })
            .catch(err=>console.log('that sucks, it broke', err));
        }
        //if current weather is selected
        if(req.query.forecast === 'currentWeather'){
            return fetch(`${apiURL}weather?q=${req.query.city}&appid=${key}&units=imperial`)
            .then(res=>res.json())
            .then((result)=>{
                return res.render('main/weather', {results:null, result});
            })
            .catch(err=>console.log('that sucks, it broke', err));
        }
    },

    //render weather query page
    findWeather:(req, res) => {
        if(req.isAuthenticated()){
            return res.render('main/findWeather');
        }else {
            return res.redirect('/fail');
        };
    }
};