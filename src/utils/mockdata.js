const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'coder123';

async function hashDefaultPassword() {
return bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
}

async function generateUsers(qty = 1) {
const hashed = await hashDefaultPassword();
const users = [];
for (let i = 0; i < qty; i++) {
    const role = (i % 10 === 0) ? 'admin' : 'user'; // Aproximadamente 1 admin cada 10 usuarios
    users.push({
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: `user${Date.now()}_${i}_${faker.internet.email()}`.toLowerCase(),
    password: hashed,
    role,
    companies: [],
    createdAt: new Date(),
    updatedAt: new Date()
    });
}
return users;
}

function generateCompanies(qty = 1) {
const companies = [];
for (let i = 0; i < qty; i++) {
    companies.push({
    _id: faker.database.mongodbObjectId(),
    name: faker.company.name(),
    industry: faker.company.bsNoun(),
    address: faker.location.streetAddress(),
    owner: null,
    createdAt: new Date(),
    updatedAt: new Date()
    });
}
return companies;
}

module.exports = { generateUsers, generateCompanies };
