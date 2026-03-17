const { Router } = require('express');
const PetModel = require('../models/Pet');

const router = Router();

router.get('/', async (req, res) => {
    try {
    const pets = await PetModel.find().lean();
    res.json({ status: 'success', payload: pets });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener mascotas' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
    const pet = await PetModel.findById(req.params.pid).lean();

    if (!pet) {
        return res.status(404).json({ status: 'error', message: 'Mascota no encontrada' });
    }

    res.json({ status: 'success', payload: pet });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener mascota' });
    }
});

router.post('/', async (req, res) => {
    try {
    const { name, specie } = req.body;

    if (!name || !specie) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios' });
    }

    const newPet = await PetModel.create({ name, specie });

    res.status(201).json({ status: 'success', payload: newPet });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear mascota' });
    }
});

module.exports = router;