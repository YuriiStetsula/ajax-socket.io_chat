var users = [];
var messages = [];

    function findUser(id){
        
        var index = null;
        var err = null;
        var user = users.find(function(e,ind){

            if (Number(e.id) === Number(id)) {
                
                index = ind 
                return true
            } else{
                return false
            }
        })

        if(!user){
            err = "no such user"
        }

        return {index,err,user}
    }

module.exports = {

    getAllUsers: function(){
        return users
    },
    addNewUser : function(user){
         users.push(user)
          
    },

    removeUser: function(id){
      

        const {index,err} = findUser(Number(id))
        if(err){
            console.log(err)
        }else{
            users.splice(index,1)
            console.log(users)
        }
       
    },

    addMessage : function(msg){
        if(messages.length > 100){
            messages.shift()
            messages.push(msg)    
        }
        messages.push(msg)
    },
    getMessage: function(){
        return messages
    }
}