var express = require("express");
const app = express(); //executable
const fs=require("fs")
var session=require("express-session")

app.use(session({
  secret: 'arjun',
  resave: false,
  saveUninitialized: true,
  cookie:{ maxAge:9000} 
}))

 

const users=require("./data.json")
//app.use(express.json());//to recevive body data.

//to receive body data
//var bodyParser=require("body-parser")
var path = require("path");
const folderpath = path.join(__dirname);
//console.log(folderpath)
 
app.use(express.static(folderpath)); 
app.set("view engine","ejs");
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

// // parse application/json
// app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse application/json
app.use(express.json())  


app.get("/", (req, res) => {
 // res.sendFile(folderpath + "/index");
  // res.send("Home1")
  res.render("index")
});

app.get("/about", (req, res) => {
  //res.sendFile(folderpath + "/about");
  // res.send("Home1")
  res.render("about")

});
app.get("/contact", (req, res) => {
  //res.sendFile(folderpath + "/about");
  // res.send("Home1")
  res.render("contact")
//console.log(req.body)
 

} );

app.get("/register",(req,res)=>{
  res.render("register",{msg:""})
});
app.post("/register", (req, res) => {
  //res.sendFile(folderpath + "/about");
  // res.send("Home1")
  // console.log(req.body)
  // res.send("register")

  let isValid=users.findIndex((u)=>{
    return u.email===req.body.email
  });
  if(isValid===-1)
  {
    let fileData=JSON.parse(fs.readFileSync("data.json"));
    fileData.push(req.body)
    fs.writeFileSync("data.json",JSON.stringify(fileData,null,4))
    res.render("register",{msg:"Register Successfully"})
  }
  else{

    res.render("register",{msg:"Already registered with this email id"})
  }  

});

// app.get("/About",(req,res)=>{
//     res.send("About")
// });

app.get("/dashboard",(req,res)=>{
  res.render("dashboard" ,{u:req.session.userData})
    
});
app.get("/logout",(req,res)=>{
  req.session.destroy(function(err){
    res.redirect("login")
  })
  
    
});
app.get("/login",(req,res)=>{
  res.render("login",{msg:""})
    
});
app.post("/login",(req,res)=>{
  let isValid=users.findIndex((u)=>{
      return (u.email===req.body.email && u.password ===req.body.password)
  });
  if(isValid===-1)
  { 
      res.render("login",{msg:"login UNSuccessfully"})
  }
  else{
    req.session.userData=users[isValid];
    req.session.save()
    res.redirect("/dashboard");  
  }
  
  
});

app.get("/*", (req, res) => {
  //res.sendFile(folderpath + "/404");
  res.render("404")
  // res.send("<h1>page not found</h1>");
});
app.listen(3000, () => {
  console.log("App running on port 3000");
  console.log("http://localhost:3000");
});
