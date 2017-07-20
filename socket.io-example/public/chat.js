 var socket = io.connect("http://localhost:3000")

 var overlay = document.getElementById("overlay");
 var loginNameInput = document.getElementById("userName")
 var loginNickNameInput = document.getElementById("userNickName")
 var loginBtn = document.querySelector(".btn-wrap > .btn")
var usersonline = document.querySelector(".users-online")
var sendMsg  = document.getElementById("send-msg")
var inputField = document.getElementById("input-field")
var span = document.querySelector(".typing")

var user = {};


checkLocalStorage("logged") ? renderLogedBox(checkLocalStorage("logged")) : false

loginBtn.addEventListener("click",function(e){
    e.preventDefault()
    if(loginNameInput.value && loginNickNameInput.value){
         var user = {
             name:loginNameInput.value,
             nickName: loginNickNameInput.value,
             id: new Date().getTime()
         }
        socket.emit("newuser",user)
        loginNameInput.value = "";
        loginNickNameInput.value = ""
       

    }else{
        console.log("Set up all fields")
    }
})

sendMsg.addEventListener("click",function(){
   var obj = {
        body:  inputField.value,
        sender: user.name,
        reciever: null,
        id: new Date().getTime()
    }

     if(inputField.value.indexOf("@") === 0){
        var end = inputField.value.indexOf(" ")
        obj.reciever = inputField.value.substring(1,end)
    }

 
     
     inputField.value = ""
    
      console.log(obj)
     socket.emit("message",obj)
     socket.emit("nottyping")
  
})

inputField.addEventListener("keyup",function(e){
    socket.emit("typing",user.name)
    
    if(e.keyCode === 8 && inputField.value === ""){
         socket.emit("nottyping")
    }
})


socket.on("typing",function(data){
    span.innerText = data + " is typing"
})

socket.on("nottyping",function(){
    span.innerText  =  ""
})

socket.on("pushuser",function(data){
    user = Object.assign(user,data)
    console.log(user)
    window.localStorage.setItem("logged",JSON.stringify(data))
    renderLogedBox(data)
   
})

socket.on("onlinelist",function(data){
   var li = data.map(function(el){
        return `<li>${el.name} (@${el.nickName})</li>`
    }).join("")
    console.log(li)
    usersonline.innerHTML = li;
})

socket.on("message",function(data){
    console.log("ALOHA")
    var box = document.querySelector(".chat-box")
    var msg = data.map(function(el){
        console.log(el.reciever)
        console.log(user.nickName)
        return `<div class="sender">${el.sender}:</div><div class="${el.reciever === user.nickName ? "highlight" : "regular"}" id="${el.id}"> ${el.body}</div>`
    }).join("")
    box.innerHTML = msg;
    box.appendChild(span)
})

socket.on("firstmeassges",function(data){
    console.log("ALOHA")
    var box = document.querySelector(".chat-box")
    var msg = data.map(function(el){
      
        return `<div>${el.sender}:</div><div class="${el.reciever === user.nickName ? "highlight" : null}" id="${el.id}"> ${el.body}</div>`
    }).join("")
    box.innerHTML = msg;
     box.appendChild(span)
})






function checkLocalStorage(string){
    if (window.localStorage.hasOwnProperty(string)){
        user = JSON.parse(window.localStorage.getItem(string))
        return JSON.parse(window.localStorage.getItem(string))
    }else{
        return false   
     }
}

function renderLogedBox(data){
     overlay.style.display = "none"
    var loginDiv = document.querySelector(".login")
     loginDiv.innerHTML =`<p>Login as @${data.nickName}</p>`
    var button = document.createElement("button")
    button.addEventListener("click",function(){
        console.log(data.id)
        socket.emit("logOut",data.id)
        window.localStorage.removeItem("logged")
        loginDiv.removeChild(button)
        loginDiv.innerHTML = ""
        overlay.style.display = "block"
    })
    button.innerText = "LogOut"
    loginDiv.appendChild(button)
    
}

