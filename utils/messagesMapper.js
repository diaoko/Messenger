
module.exports.messageViewModel =  messages => {
    if(messages.type.toString().trim()==='text_message'){

        return {
            message_id: messages.id,
            type : messages.type,
            time : Math.round(new Date(messages.createdAt).getTime()/1000),
            sender : {
                id : '1dc4d7rf5vv5fvs',
                type : 'user',
                username: 'diaoko89',
                first_name : 'diaoko',
                last_name : 'mahmoodi'
            },
            text_message : {
                text: messages.text_message.text
            }
        }

    }
    else
    {

        return {
            message_id: messages.id,
            type : messages.type,
            time :  Math.round(new Date(messages.createdAt).getTime()/1000),
            sender : {
                id : '1dc4d7rf5vv5fvs',
                type : 'user',
                username: 'diaoko89',
                first_name : 'diaoko',
                last_name : 'mahmoodi'
            },
            voice_message : {
                file_id: messages.file._id,
                file_type : messages.file.type,
                file_extension : messages.file.ext,
                file_duration : messages.file.duration,
                file_size : messages.file.size
            }
        }
    }
};
