module.exports.file = file => {
  return {
    file_id: file._id,
    type: file.type,
    file_extension: file.ext,
    duration: file.duration,
    file_size: file.size,
    file_waveform: file.file_waveform
  }
};
