const mongoose = require('mongoose')

const uploadedFileSchema = mongoose.Schema({
  file_name: String,
  type: String,
  file_content: Buffer,
});

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  dateOfBirth:Date,
  street1: String,
  street2: String,
  permanentStreet1:String,
  permanentStreet2:String,

  uploaded_files: [uploadedFileSchema]
});

module.exports = mongoose.model("UserDetail", userSchema);
