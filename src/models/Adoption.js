const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pets',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Adoptions', adoptionSchema);