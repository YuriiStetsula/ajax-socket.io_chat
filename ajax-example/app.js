var express = require("express")
var bodyParser = require("body-parser")
var app = express();
var chat = require("./models/chat")


app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json())

app.set("view engine","ejs")
app.set("views",__dirname + "/public");
app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res){
    
    res.render("login")
})

app.get("/chat",function(req,res){
   res.render("chat")
})

app.post("/login",function(req,res){
       var obj= {  
         id:new Date().getTime(),
         userName: req.body.userName,
         userNickName: req.body.userNickName
        }
    chat.logginedAs(obj,function(data){
        res.redirect("/chat")
    })
    
})


app.get("/messages",function(req,res){
    chat.getMessages(-1,function(err,data){
          if(err){
              console.log(err)
              res.status(400)
              res.end()
          }else{
              console.log("FIRST REQUEST")
             res.json(data)
         }
     })
})

app.get("/messages/:id",function(req,res){
  
     chat.getMessages(Number(req.params.id),function(err,data){
          if(err){
              console.log(err)
              res.status(400)
              res.end()
          }else{
              res.json(data)
          }
          
     })
})

app.post("/messages",function(req,res){
   chat.addMessage(req.body)
   res.end()
})

app.listen(3000,function(){
    console.log("server started")
})