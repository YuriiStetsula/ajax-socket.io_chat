(function(){
var input = document.getElementById("input")
var sendButton = document.getElementById("send-btn");
var content = document.querySelector(".content")
var onlineUsers = document.querySelector(".online-users")

var lastMessageId = null;


var loggined = (function(){
    var log = null
    var id = null
    var nick = null
    return {
        setLog: function(login){
            log = login
        },
        getLog: function(){
            return log 
        },
        setId: function(i){
            id = i
        },
        getId: function(){
            return id 
        },
        setNick : function(n){
            nick = n
        },
         getNick : function(n){
            return nick 
        }
    }
}())







sendButton.addEventListener("click",function(e){
    e.preventDefault()
   
    var userMessage = input.value;
     var user = {
        name: loggined.getLog(),
        message: userMessage,
        senderId: loggined.getId(),
        recieverId: null,
        messageId: new Date().getTime()
    }

    if(userMessage.indexOf("@") === 0){
        var end = userMessage.indexOf(" ")
         user.recieverId = userMessage.substring(1,end)
       

    }
   

   
    if(user.message){
        request({
            method: "POST",
            path: "http://localhost:3000/messages",
            data: user
        })
    }
    input.value = ""
    
})


function request(obj){
    var method = obj.method || "GET"
    var path = obj.path || "/"
    var callback = obj.cb || function(){}
    var xhr = new XMLHttpRequest();

    xhr.open(obj.method,obj.path,true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onreadystatechange = function(){
        if(xhr.status === 200 && xhr.readyState ===4){
            callback(xhr.responseText)
        }   
    }

    xhr.send(JSON.stringify(obj.data))
}

function getData(id){
   
    var  path= "http://localhost:3000/messages"
    if (typeof id === "number"){
        console.log(id+"++++++++++++++++++++++++")
        path = "http://localhost:3000/messages/"+id
    }
    var response = null
    
    var xhr = new XMLHttpRequest();

    xhr.open("GET",path,true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onreadystatechange = function(){
        if(xhr.status === 200 && xhr.readyState ===4){
            response = JSON.parse(xhr.responseText)
                 content.innerHTML = "";
           if (Array.isArray(response)) {
              
                response.forEach(function(e){
                render(e)
            })
           }else {
          
               render(response)
           }
               
               lastMessageId = content.lastElementChild.id 
              
        }   
    }

       xhr.send()
     
}

getData()
setInterval(function(){
    var number = Number(lastMessageId)
    getData(number)
},1000)

function render(e){
   
    if(e._logginedAs){
        
        loggined.setLog(e._logginedAs.userName)
        loggined.setId(e._logginedAs.id) 
        loggined.setNick(e._logginedAs.userNickName)    
        var userNickName = e._logginedAs.userNickName
    }
    
  e._messages.forEach(function(el){
     
      var contentMessage = document.createElement("div")
        
                if(el.recieverId === "@"+loggined.getNick()){
                      contentMessage.className = "to_usermessage"

                }else{
                      contentMessage.className = "content-message"

                }
              
            var userName = document.createElement("div")
                userName.className = "content-message_username"

            var userMessage = document.createElement("div")
                userMessage.className = "content-message_usermessage"
              
                userName.innerHTML =  findUserById(e._users,el.senderId) 
                 
                userMessage.innerHTML =  el.message

                contentMessage.setAttribute("id",el.messageId)
                contentMessage.appendChild(userName)
                contentMessage.appendChild(userMessage)
                content.appendChild(contentMessage)
  })

   onlineUsers.innerHTML= ""
    e._users.forEach(function(e){

        

        var span = document.createElement("span")
        span.innerHTML = e.userName + " (@"+e.userNickName+")"
        onlineUsers.appendChild(span)

      

  })
    
    var div = document.createElement("div")
        div.classList ="logged-as"
        div.innerHTML = "Logged as: "+loggined.getNick()
   
        onlineUsers.appendChild(div)
    


}


function findUserById(arr,id){
    
    var username = arr.find(function(el){
      return  (Number(el.id) === Number(id))
})
    if (username) return username.userName
    else return "Guest"
}


}())

