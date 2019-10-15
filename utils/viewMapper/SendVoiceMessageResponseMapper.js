module.exports.success = (chat,message,req,file,type) => {
    if(type==='push')
    {
        return {
            type:501,
            conversations: [{
                message_id: message.id,
                type: message.type,
                date: Math.round(new Date(message.createdAt).getTime()),
                chat:{
                    chat_id:chat._id,
                    type:chat.type,
                    username:req.user.username,
                    first_name:req.user.first_name,
                    last_name:req.user.last_name
                },
                from: {
                    id : req.user._id,
                    type : 'user',
                    username: req.user.username,
                    first_name : req.user.first_name,
                    last_name : req.user.last_name
                },
                voice_message: {
                    file_id: file._id,
                    file_extension : file.ext,
                    file_duration : file.duration,
                    file_size : file.size,
                    file_waveform : file.file_waveform

                    }
                }]
            }
    }
    else if(type==='response') {
        return {
            haserror: false,
            code: 100,
            conversations: [{
                message_id: message.id,
                type: message.type,
                date: Math.round(new Date(message.createdAt).getTime()),
                chat:{
                    chat_id: chat._id,
                    type: chat.type
                },
                from: {
                    id: req.user._id,
                    type: 'user',
                    username: req.user.username,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name
                },
                voice_message: {
                    file_id: file._id,
                    file_extension: file.ext,
                    file_duration: file.duration,
                    file_size: file.size,
                    file_waveform: file.file_waveform
                }
            }]
        }
    }
};