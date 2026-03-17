const { Router } = require('express');
const AdoptionModel = require('../models/Adoption');
const UserModel = require('../models/User');
const PetModel = require('../models/Pet');

const router = Router();

router.get('/', async (req, res) => {
    try {
    const adoptions = await AdoptionModel.find()
        .populate('owner')
        .populate('pet')
        .lean();

    res.json({ status: 'success', payload: adoptions });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener adopciones' });
    }
});

router.get('/:aid', async (req, res) => {
  try {
    const adoption = await AdoptionModel.findById(req.params.aid)
      .populate('owner')
      .populate('pet')
      .lean();

    if (!adoption) {
      return res.status(404).json({
        status: 'error',
        message: 'Adopción no encontrada'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: adoption
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener adopción'
    });
  }
});

router.post('/:uid/:pid', async (req, res) => {
    try {
    const { uid, pid } = req.params;

    const user = await UserModel.findById(uid);
    if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const pet = await PetModel.findById(pid);
    if (!pet) {
        return res.status(404).json({ status: 'error', message: 'Mascota no encontrada' });
    }

    if (pet.adopted) {
        return res.status(400).json({ status: 'error', message: 'La mascota ya fue adoptada' });
    }

    const newAdoption = await AdoptionModel.create({
        owner: user._id,
        pet: pet._id
    });

    pet.adopted = true;
    pet.owner = user._id;
    await pet.save();

    res.status(201).json({ status: 'success', payload: newAdoption });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear adopción' });
    }
});

module.exports = router;