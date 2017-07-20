var messages = [{senderId:2,recieverId:1, messageId:3,message:"hello"},
                {senderId:1,recieverId:2, messageId:1,message:"Fine"},
                {senderId:1,recieverId:null, messageId:2,message:"Hi everyne"}
                ];
var users   = [{
        userName:"Mike",userNickName:"mike111",
        id:1 
    },{
        userName:"Kate",userNickName:"kate222",
        id:2 
    }]; 

var logginedAs = null;

var lastId = Number(messages[messages.length-1].messageId)
module.exports = {

      getMessages : function(id,cb){
            
            var recievedId = Number(id)
            var err = null;
          
            if(id === -1){
                cb (err,{
                    _users: users,
                   _messages :messages,
                   _logginedAs : logginedAs
                })
            }else if (recievedId === lastId){
                err = "No new messages"
                cb(err)
            }else{
           
                cb (err,{
                    _users: users,
                   
                    _messages :messages
                })

            }
           
            logginedAs = null;
        },

      
     addMessage : function(message){
            
            message.messageId =  Number(message.messageId)
            lastId =  Number(message.messageId)
            if(messages.length > 15){
               
                messages.shift()
                messages.push(message)
            }else{
                  messages.push(message)
            }
                
           
        
        },
        
        addUser : function(cb){
            users.push(user)
            cb(users)
            
        },

        logginedAs: function(user,cb){
            logginedAs = user
            users.push(user)
            cb()
        }

}