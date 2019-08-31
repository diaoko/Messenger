/*let message = messages => {

    return {
        messages_id: messages.id,
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
        first_name : 'diaoko',
        last_name:'mahmoodi',
        unread_messages : 12,
        chat_photo : {
          small_avatar_id : 1,
          large_avatar_id : 2,
        },
            conversations: chat.messages.map(message.messageViewModel)
    }
};
