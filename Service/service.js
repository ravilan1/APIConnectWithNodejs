const fs =require('fs');
const jwt = require('jsonwebtoken');
const dao = require('../Dao/dataAccess');

const readJsonFile = async(path) => {
    try{
        let filepath = path.path; 
         const dataJson =  await fs.readFileSync(filepath,'utf-8'); //File read into String
        dao.uploadRecords(dataJson);
    }catch(e){
        console.error(e);
    }
}

const getWebToken = async(data) =>{
    try{
       // let fread = fs.readFileSync('./box/private','utf-8');
       // console.log(fread.replace(/\\n/g, "\n"));
       console.log('Helo-->',data);
        return await jwt.sign(data,'mynameisravilankalapalliwhoisthis');
    }catch(e){
        console.log(e);
    }
}

module.exports = { readJsonFile,getWebToken };