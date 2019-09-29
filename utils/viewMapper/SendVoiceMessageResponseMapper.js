module.exports.success = (message,req,file) => {
  return {
      haserror: false, code: 100, conversations: [{
          message_id: message.id,
          type: message.type,
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
};