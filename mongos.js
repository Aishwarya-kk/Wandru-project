const mongoose = require('mongoose');

let userSchema=new mongoose.Schema({
    name:String,
    age:Number,

}) ;


let user=mongoose.model("user",userSchema);

module.exports=user;