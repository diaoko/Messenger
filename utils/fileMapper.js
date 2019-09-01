module.exports.file = file => {
  return{
      id : file._id,
      type : file.type,
      duration : file.duration,
      size : file.size,
  }
};
