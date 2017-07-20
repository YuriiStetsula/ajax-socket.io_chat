var express = require("express");
var chat    = require("./models/chat")

var app = express();

app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res){
    res.sendFile("index.html")
})

var io = require("socket.io").listen(app.listen(3000))
var user;
var messages;
io.sockets.on("connection",function(client){
        var users = chat.getAllUsers()  
        io.sockets.emit("onlinelist",users)
    client.on("newuser",function(data){
        console.log("+++++++++++")
        console.log(data)
        user = data
        chat.addNewUser(data)

        client.emit("pushuser",data)
        var users = chat.getAllUsers()
        messages = chat.getMessage()        
        io.sockets.emit("onlinelist",users)
        io.sockets.emit("firstmeassges",messages)
    })
    client.on("logOut",function(id){
        console.log("logoutted")
         
        chat.removeUser(id)
        var users = chat.getAllUsers()  
        io.sockets.emit("onlinelist",users)
     
    })

    client.on("message",function(data){
        console.log(data)
        chat.addMessage(data)
        var msgs = chat.getMessage()
        io.sockets.emit("message",msgs)
    })

    client.on("typing",function(data){
        io.sockets.emit("typing",data)
    })

    client.on("nottyping",function(){
        io.sockets.emit("nottyping",null)
    })

    client.on("disconnect",function(d){
        chat.removeUser(user.id)

        var users = chat.getAllUsers()  
        io.sockets.emit("onlinelist",users)
        console.log("DISCO!!!!!!!!!!!!!")
    })
})


