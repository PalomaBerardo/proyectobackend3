const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');

router.get('/', async (req, res) => {
const users = await UserModel.find().populate('companies').lean();
return res.json({ status: 'success', payload: users });
});

module.exports = router;
