const { Router } = require('express');
const CompanyModel = require('../models/Company');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const companies = await CompanyModel.find().lean();
    res.json({ status: 'success', payload: companies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener empresas' });
  }
});

module.exports = router;