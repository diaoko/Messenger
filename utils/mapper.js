let message = messages => {
    return {
        type : messages.type,
        sender : {
            id : '1dc4d7rf5vv5fvs',
            type : 'user',
            username: 'diaoko89',
            first_name : 'diaoko',
            last_name : 'mahmoodi'
        },
        'text-message' : {
            text: messages.text_message.text
        }
    }
};
module.exports.chatviewmodel = chat=>{
    return {
        id : chat._id,
        type : 'private',
        unread_messages : 12,
        avatar : {
          small_avatar_id : 1,
          large_avatar_id : 2,
        },
            conversations: chat.messages.map(message)
    }
};