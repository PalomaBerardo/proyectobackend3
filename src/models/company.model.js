const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
name: { type: String, required: true },
industry: String,
address: String,
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
