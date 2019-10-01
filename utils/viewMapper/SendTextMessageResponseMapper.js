module.exports.success = (chat,message,req,type) => {
  if(type==='push')
  {
      return {
          type:101,
          conversations :[{
                  message_id: message.id,
                  type : message.type,
                  chat:{
                      chat_id:chat._id,
                      type:chat.type
                  },
                  date: Math.round(new Date(message.createdAt).getTime()),
                  from : {
                      id : req.user._id,
                      type : 'user',
                      username: req.user.username,
                      first_name : req.user.first_name,
                      last_name : req.user.last_name
                  },
                  text_message : {
                      text: message.text_message.text
                  }}]
          }
}
  else if(type==='response')
  {
      return {
          haserror:false,
          code:100,
          conversations :[{
              message_id: message.id,
              type : message.type,
              from : {
                  id : req.user._id,
                  type : 'user',
                  username: req.user.username,
                  first_name : req.user.first_name,
                  last_name : req.user.last_name
              },
              text_message : {
                  text: message.text_message.text
              }}]}
  }

};