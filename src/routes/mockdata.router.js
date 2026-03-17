const { Router } = require('express');
const UserModel = require('../models/User');
const CompanyModel = require('../models/Company');

const router = Router();
/* GET */
router.get('/mockingcompanies', (req, res) => {
const qty = parseInt(req.query.qty) || 10;
const companies = generateCompanies(qty);
return res.json({ status: 'success', payload: companies });
});

/* GET*/
router.get('/mockingusers', async (req, res) => {
try {
    const qty = parseInt(req.query.qty) || 50;
    const users = await generateUsers(qty);
    return res.json({ status: 'success', payload: users });
} catch (err) {
    console.error('Error generating users', err);
    return res.status(500).json({ status: 'error', message: 'Error generating users' });
}
});

/*
POST /generateData
Body JSON:
{
"users": 10,
"companies": 5,
"assignMode": "none" | "onePerUser" | "random",
"companiesPerUser": 1
}
*/
router.post('/generateData', async (req, res) => {
try {
    const usersQty = parseInt(req.body.users) || 0;
    const companiesQty = parseInt(req.body.companies) || 0;
    const assignMode = req.body.assignMode || 'none';
    const companiesPerUser = parseInt(req.body.companiesPerUser) || 1;

    const result = { usersInserted: 0, companiesInserted: 0, assignments: 0 };

    // Generar e insertar usuarios
    let insertedUsers = [];
    if (usersQty > 0) {
    const usersToInsert = await generateUsers(usersQty);
    insertedUsers = await UserModel.insertMany(usersToInsert, { ordered: false });
    result.usersInserted = insertedUsers.length;
    }

    // Generar e insertar companias
    let insertedCompanies = [];
    if (companiesQty > 0) {
    const companiesToInsert = generateCompanies(companiesQty);
    insertedCompanies = await CompanyModel.insertMany(companiesToInsert, { ordered: false });
    result.companiesInserted = insertedCompanies.length;
    }

    // Asignaciones opcionales
    if (assignMode !== 'none' && insertedUsers.length > 0 && insertedCompanies.length > 0) {
    const userIds = insertedUsers.map(u => u._id);
    const companyIds = insertedCompanies.map(c => c._id);

    if (assignMode === 'onePerUser') {
        const assignments = Math.min(userIds.length, companyIds.length);
        for (let i = 0; i < assignments; i++) {
        const u = userIds[i];
        const c = companyIds[i];
        await CompanyModel.findByIdAndUpdate(c, { owner: u });
        await UserModel.findByIdAndUpdate(u, { $push: { companies: c } });
        result.assignments++;
        }
    } else if (assignMode === 'random') {
        for (const u of userIds) {
        for (let k = 0; k < companiesPerUser; k++) {
            const idx = Math.floor(Math.random() * companyIds.length);
            const c = companyIds[idx];
            await CompanyModel.findByIdAndUpdate(c, { owner: u });
            await UserModel.findByIdAndUpdate(u, { $addToSet: { companies: c } });
            result.assignments++;
        }
        }
    }
    }

    return res.json({ status: 'success', payload: result });
} catch (err) {
    console.error('generateData error', err);
    return res.status(500).json({ status: 'error', message: err.message });
}
});

module.exports = router;
