const { Router } = require('express');
const UserModel = require('../models/User');

const router = Router();

router.get('/', async (req, res) => {
    try {
    const users = await UserModel.find().populate('companies').lean();
    res.json({ status: 'success', payload: users });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener usuarios' });
    }
});

router.get('/:uid', async (req, res) => {
    try {
    const user = await UserModel.findById(req.params.uid).populate('companies').lean();

    if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', payload: user });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener usuario' });
    }
});

router.post('/', async (req, res) => {
    try {
    const { first_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios' });
    }

    const newUser = await UserModel.create(req.body);

    res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear usuario' });
    }
});

router.put('/:uid', async (req, res) => {
    try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.uid,
        req.body,
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', payload: updatedUser });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar usuario' });
    }
});

router.delete('/:uid', async (req, res) => {
    try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.uid);

    if (!deletedUser) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar usuario' });
    }
});

module.exports = router;