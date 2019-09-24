module.exports.success = (message,req) => {
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
          'text_message' : {
              text: message.text_message.text
          }}]}
};