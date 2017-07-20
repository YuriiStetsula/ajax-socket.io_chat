var userName =     document.getElementById("userName")
var nickName = document.getElementById("userNickName")
var loginBtn = document.getElementById("login")


loginBtn.addEventListener("click",function(e){
   
    e.preventDefault()
    var user  = {
        name: userName.value,
        nickName: nickName.value
      } 
      console.log(user)
    request(user)
})


function request(data){

 var xhr = new XMLHttpRequest();

    xhr.open("POST","http://localhost:3000/login",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onreadystatechange = function(){
        if(xhr.status === 200 && xhr.readyState ===4){
            // console.log(xhr.responseText)
        }   
    }

    xhr.send(JSON.stringify(data))

}