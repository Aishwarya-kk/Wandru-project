const mongoose = require('mongoose');
const a = require("../models/mongo.js");
const initDB=require("./data.js");

const mongo="mongodb://127.0.0.1:27017/project";

main().then((res)=>{
    console.log("connnected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo);
}



const ai= async()=>{
    await a.deleteMany({});
    await a.insertMany(initDB.data);
    console.log("data was initilaized");
}

ai();