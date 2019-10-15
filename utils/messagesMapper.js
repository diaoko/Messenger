
module.exports.messageViewModel =  messages => {
    if(messages.type.toString().trim()==='text_message'){

        return {
            message_id: messages.id,
            type : messages.type,
            date : Math.round(new Date(messages.createdAt).getTime()),
            from : {
                id : messages.sender_id._id,
                type : messages.sender_id.type,
                username: messages.sender_id.username,
                first_name : messages.sender_id.first_name,
                last_name : messages.sender_id.last_name
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
            date :  Math.round(new Date(messages.createdAt).getTime()),
            from : {
                id : messages.sender_id._id,
                type : messages.sender_id.type,
                username: messages.sender_id.username,
                first_name : messages.sender_id.first_name,
                last_name : messages.sender_id.last_name
            },
            voice_message : {
                file_id: messages.file._id,
                file_type : messages.file.type,
                file_extension : messages.file.ext,
                file_duration : messages.file.duration,
                file_size : messages.file.size,
                file_waveform:messages.file.file_waveform
            }
        }
    }
};
