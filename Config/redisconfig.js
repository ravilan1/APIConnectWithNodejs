const { createClient } = require('redis');

const redisConnect = async()=>{
    try{
        const client=createClient({url: 'redis://redis-server:6379'});
        await client.connect();
        return client;
    }catch(e){
        console.error(e);
    }
}

const createCountries=async(countries)=>{
    try{
        let client = await redisConnect();
        await Object.entries(countries).map((cty)=>{
        client.set(cty[0],cty[1]);
        })
     await client.quit();
    }catch(e){
        console.error(e);
    }
}

const getCountry=async(ckey)=>{
    try{
        let client = await redisConnect();
        const country = await client.get(String(ckey));
        await client.quit();
        return country;
    }catch(e){
        console.error(e);
    }
}


    

module.exports = {redisConnect,createCountries,getCountry};