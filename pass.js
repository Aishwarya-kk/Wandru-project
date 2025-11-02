const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose");



const UserSchema=new Schema({
    username:String,
    email:{
        type:String,
        required:true
    }
});
UserSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("user", UserSchema);

