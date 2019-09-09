/*let message = messages => {

    return {
        message_id: messages.id,
        type : messages.type,
        time: messages.createdAt,
        sender : {
            id : '1dc4d7rf5vv5fvs',
            type : 'user',
            username: 'diaoko89',
            first_name : 'diaoko',
            last_name : 'mahmoodi'
        },
        'text_message' : {
            text: messages.text_message.text
        }

    }
};*/
var message = require('./messagesMapper');
module.exports.chatviewmodel = chat=>{
    return {
        id : chat._id,
        type : 'private',
        first_name : chat.users[0].first_name,
        last_name: chat.users[0].last_name,
        unread_messages : 12,
        chat_photo : {
          small_file_id : chat.users[0].avatars[0],
          large_file_id : chat.users[0].avatars[0],
        },
            conversations: chat.messages.map(message.messageViewModel)
    }
};
