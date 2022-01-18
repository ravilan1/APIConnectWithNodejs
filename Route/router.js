const express =require('express');
const dao = require('../Dao/dataAccess');
const route = express.Router();
const bodyParser = require('body-parser');
const {randomUUID} = require('crypto');
const encdec = require('buffer');
const rediscon = require('../Config/redisconfig');
const service = require('../Service/service');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './box/');
    },
    filename: function (request, file, callback) {
        callback(null, file.originalname)
    }
});
var upload = multer({ storage: storage });
route.get('/',(req,res)=>{
    res.send('Hello ravi');
});

route.post('/createUser',async(req,res)=>{
    let country  = await rediscon.getCountry(req.body.country);
    let password = await Buffer.from(req.body.password,'utf8').toString('base64');
    console.log('password',password);
    await dao.createUser(req.body.name,password,req.body.conformPassword,req.body.age,req.body.email,country,randomUUID());
    let jwtToken = await service.getWebToken(req.body.name);
    await res.status('200').json({'message':'User created with username '+req.body.name,token: jwtToken});
});

route.post('/postCountries',(req,res)=>{
    rediscon.createCountries(req.body);
    res.status('200').json({'message':'countries loaded '});
});

route.post('/logIn',async(req,res)=>{
    let pwd=Buffer.from(req.body.password,'utf8').toString('base64');
    let status = await dao.validateuser(req.body.email,pwd);
    if(status==true){
        await res.status('200').json({'message':'You are authorized to login'});
    }else{
        await res.status('400').json({'message':'Username or password is not found'});
    }
});

route.post('/createProducts',upload.single('my-file'),async(req,res)=>{
    await service.readJsonFile(req.file);
    res.status('200').json({'message':'countries loaded '});
});

route.get('/getProducts',async(req,res)=>{
    let objQueryStr = { ...req.query };
    const objData = await dao.getSelectedProductDetails(objQueryStr);
    res.status('200').json(objData);
});

route.get('/getProductsByCost',async(req,res)=>{
    let objStr =JSON.stringify({ ...req.query });
    //let que =  JSON.stringify(objStr).split(',').join(' ');
    //console.log(que);
    let objQueryStrByCost = objStr.replace(/\b(lt|lte|gt|gte)\b/g,match=>`$${match}`);
    console.log(JSON.parse(objQueryStrByCost));
    const objDataByCost = await dao.getSelectedProductDetailsbyCost(JSON.parse(objQueryStrByCost));
    res.status('200').json(objDataByCost);
});


module.exports = route;