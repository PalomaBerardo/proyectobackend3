const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specie: {
    type: String,
    required: true
  },
  adopted: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null
  }
});

module.exports = mongoose.model('Pets', petSchema);