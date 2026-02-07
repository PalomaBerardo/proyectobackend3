const express = require('express');
const router = express.Router();
const CompanyModel = require('../models/company.model');

router.get('/', async (req, res) => {
const companies = await CompanyModel.find().populate('owner').lean();
return res.json({ status: 'success', payload: companies });
});

module.exports = router;
