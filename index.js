const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const aish = require("./models/mongo.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const reveiew = require("./models/reveiw.js");
const cookieParser=require ("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const  LocalStrategy=require("passport-local");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const user=require("./models/pass.js");
app.use(cookieParser("secretcode"));
app.use(cookieParser());


const sessionOption={
  secret:"mysupersecretcode",
  resave:false,
  saveninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));


passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs', ejsMate);




main().then((res)=>{
    console.log("connnected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/project');
}


app.listen(port,()=>{
    console.log(`port is listeing ${port}`);
});

app.get("/pro",(req,res)=>{
    res.send("hii");
});


// app.get("/test",(req,res)=>{
// let listing=new aish({
//     title:"my dairy books",
//     description:"this is new lunched book",
//     price:2000,
//  location:"banglore",
//  country:"India",

// });

// listing.save().then((res)=>{
//     console.log("data was saved");
// });

// res.send("sucess");


// });

app.get("/listing",async (req,res)=>{
  const list=await aish.find({});
  res.render("list.ejs",{ list});
    
});

app.get("/listing/new",(req,res)=>{
  if(req.isAuthenticated()){
    req.flash("error","you must be logged in");
    res.redirect("/listing");
  }
    res.render("create.ejs");
})

app.get("/listing/:id",async (req,res)=>{

    let{id}=req.params;
  let all=  await aish.findById(id).populate("reveiew");
  res.render("new.ejs",{all});
})

app.post("/listing",async(req,res,next)=>{
  try{
    
   const nw= await new aish(req.body.listing);
   nw.save();
   res.redirect("/listing");
  }catch(err){
    next(err);
  }
});

app.get("/listing/:id/edit",async (req,res)=>{
    let{id}=req.params;
  let all=  await aish.findById(id);
  res.render("edit.ejs",{all});
});

app.put("/listing/:id",async(req,res)=>{
     let{id}=req.params;
    await aish.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect("/listing");
});

app.delete("/listing/:id",async(req,res)=>{
     let{id}=req.params;
  const delet= await  aish.findByIdAndDelete(id);
  res.redirect("/listing");
});




app.post("/listings/:id/reveiws",async(req,res)=>{
  const listing= await aish.findById(req.params.id);
  const newreveiw=new reveiew(req.body.reveiew);

listing.reveiew.push( newreveiw);

 await newreveiw.save();
  await listing.save();
 

 res.redirect(`/listing/${listing._id}`);
})


app.get("/",(req,res)=>{

console.log(req.cookies);
res.send("Hii I am root");

}
)
app.get("/demo",(req,res)=>{
  let fakeUser=new user({
    email:"aishu2005@gmail.com",
    username:"aishu"

  });
 let newuser= user.register(fakeUser,"helloworld");
 res.send(newuser);
})



app.get("/gsc",(req,res)=>{
res.cookie("made-in","India",{ signed :true });
res.send("yahh itss secrete cookie");
})

app.get("/ver",(req,res)=>{
console.log(req.signedCookies);
res.send("done!");

})
// app.get("/greet",(req,res)=>{
// let{name="aishu"}=req.cookies;
// res.send(`hii ${name}`);

// });

// app.get("/getcookies",(req,res)=>{
//   res.cookie("greet","aishwraya");
//   res.send("we have sent cookies for u ");
// })
app.get("/sign",(req,res)=>{
  res.render("login.ejs");
});

// app.post("/sign",async(req,res)=>{
// let{username,email,password}=req.body;
// const newUser=new user({
//   email,password
// });
// const registerUser=user.register(newUser,password);
// console.log(registerUser);
// req.flash("success","u have login successfully");
// res.redirect("/listing");
// })
app.post("/sign", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new user({ username, email });
    const registerUser = await user.register(newUser, password);
    console.log(registerUser);
    req.flash("success", "User has registered successfully!");
    res.redirect("/listing");
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/sign");
  }
});

// app.get("/login",(req,res)=>{
//   res.render("user.ejs");
// });
// app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
//   res.send("welcome to wanderluast! Your are logged in");

// })
app.get("/login", (req, res) => {
  res.render("user.ejs");
});

app.post("/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in.");
    res.redirect("/listing");
  }
);

app.get("/logout",(req,res)=>{
req.logOut((err)=>{
  if(err){
   return next(err);
}
})

req.flash("sucess","your logged out");
res.redirect("/listing");
})

app.get('/listing/search', async (req, res) => {
  const query = req.query.q ? req.query.q.trim() : "";

  try {
    // If query is empty, show all listings
    let listings;
    if (query === "") {
      listings = await Listing.find({});
    } else {
      listings = await Listing.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
          { country: { $regex: query, $options: "i" } }
        ]
      });
    }

    res.render("list.ejs", { listings });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while searching listings");
  }
});

