
module.exports.messageViewModel =  messages => {
    if(messages.type.toString().trim()==='text_message'){

        return {
            messages_id: messages.id,
            type : messages.type,
            time : messages.createdAt,
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
            messages_id: messages.id,
            type : messages.type,
            time : messages.createdAt,
            sender : {
                id : '1dc4d7rf5vv5fvs',
                type : 'user',
                username: 'diaoko89',
                first_name : 'diaoko',
                last_name : 'mahmoodi'
            },
            voice : {
                file_id: messages.voice.file_id
            }
        }
    }
};;
