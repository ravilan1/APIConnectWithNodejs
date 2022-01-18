const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); //Environment configuration
const express = require('express'); //express module
const app = express(); //for express get and post calls
mongoose.connect(process.env.mongourl);//Mongoosedv connectivity
require('./Dao/dataAccess');
const redis = require('redis');
const path = require('path');
const rediscon = require('./Config/redisconfig');
const router = require('./Route/router');
rediscon.redisConnect();

//var upload = multer({dest:'/Config'}).single('my-file');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/',router);
app.use('/logIn',router);
app.use('/createUser',router);
app.use('/postCountries',router);
app.use('/createProducts',router);
app.use('/getProducts',router);
app.use('/getProductsByCost',router);

app.listen(process.env.port,()=>{
    console.log("server listening on port ",process.env.port);
})