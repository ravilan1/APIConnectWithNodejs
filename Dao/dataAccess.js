const { throws } = require('assert');
const mongoose = require('mongoose');
const { object } = require('webidl-conversions');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;
const userdetail = new Schema(
                        { 
                            name: String,
                            password: String,
                            conformPassword: String,
                            age:    Number,
                            email:  String,
                            country:    String,
                            uid:    String 
                        });

//presave crypting password
userdetail.pre('save',async function(next){
    console.log(this.password);
    console.log(this.conformPassword);
    if(this.password == Buffer.from(this.conformPassword,'utf8').toString('base64')){
        console.log('inside pre');
        this.password = await bcrypt.hash(this.password,10);
        this.conformPassword=undefined;
    }else{
        console.error('passwords are not matched');
    }
    next();
})



const productDetails = new Schema({Productname: String,type: String,ProductOrigin: String,cost:Number,email:String});
//Model for users collection
const Users = mongoose.model('Users', userdetail);
const Products = mongoose.model('Products',productDetails);

async function  createUser(uname, password, conformPassword, age, email, country, uid){
  await Users({
       name:uname,
       password:password,
       conformPassword:conformPassword,
       age:age,
       email:email,
       country:country,
       uid:uid
   }).save();
   console.log('User created..');
}

const validateuser   = async (email,password)=>{
    let status = true;
    let compResult = false;
    console.log('email is -->',email)
    try{
        const result = await Users.findOne({'email':email});
        console.log(result);
        console.log(result['password'])
        if(result['password']){
           compResult = await bcrypt.compare(password,result.password);
           console.log('result is -->',compResult)
        }
        (result!=null)?status:status=false;
        return compResult;
       }catch(e){
            console.error(e);
       }
    }

const uploadRecords = async(records) =>{
    try{
        await Products.create(JSON.parse(records));
    }catch(e){
        console.log(e);
    }
}

const getSelectedProductDetails = async(obj) => {
    //ignore following keywords from querystring
    let ect = obj;
    let keyWords = ['page','sort','limit'];
    let reqObject = keyWords.filter((item)=>delete ect[item]);
    let cntRecords = await Products.countDocuments();
    let lmt = 2;
    let skp = (ect['pg']-1)*lmt;
    if(skp>=cntRecords){
        throw new Error('Records no more');
    }
    let query =  Products.find(reqObject['Productname']).select('Productname type ProductOrigin').skip(skp).limit(lmt).sort('type');
    let result = await query;
    console.log(result);
    return result;
}

const getSelectedProductDetailsbyCost = async(filObj) =>{
    console.log((filObj));
    let filBySort = await Products.find(filObj);
    console.log(filBySort)
    return filBySort;
}


module.exports = {createUser,validateuser,uploadRecords,getSelectedProductDetails,getSelectedProductDetailsbyCost}