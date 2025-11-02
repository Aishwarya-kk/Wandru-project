const mongoose = require('mongoose');
const reveiw = require('./reveiw');

let listSchema=new mongoose.Schema({
    title:{
        type:String,
      
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://media.cntraveler.com/photos/57fbdfdcfcc4299a48964454/master/pass/PoolArea2-HotelWaileaMaui-Hawaii-CRHotel.jpg",
        set:(v)=> v==="" ? "https://media.cntraveler.com/photos/57fbdfdcfcc4299a48964454/master/pass/PoolArea2-HotelWaileaMaui-Hawaii-CRHotel.jpg":v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },

    reveiew:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reveiw",
    }]
});

let aish = mongoose.model("aish",listSchema);

module.exports=aish;