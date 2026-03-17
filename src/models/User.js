const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Companies'
    }
  ]
});

module.exports = mongoose.model('Users', userSchema);
