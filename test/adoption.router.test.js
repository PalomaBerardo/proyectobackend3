const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

const UserModel = require('../src/models/User');
const PetModel = require('../src/models/Pet');
const AdoptionModel = require('../src/models/Adoption');

const expect = chai.expect;
const requester = supertest(app);

describe('Testing adoption router', function () {
  this.timeout(10000);

  let testUser;
  let testPet;
  let testAdoption;

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/proyectobackend3_test');

    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await AdoptionModel.deleteMany({});

testUser = await UserModel.create({
  first_name: 'Paloma',
  last_name: 'Test',
  email: 'paloma@test.com',
  password: '123456'
});

    testPet = await PetModel.create({
      name: 'Firulais',
      specie: 'Perro'
    });
  });

  after(async function () {
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await AdoptionModel.deleteMany({});
    await mongoose.connection.close();
  });

  it('GET /api/adoptions debería devolver todas las adopciones', async function () {
    const res = await requester.get('/api/adoptions');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('array');
  });

  it('POST /api/adoptions/:uid/:pid debería crear una adopción', async function () {
    const res = await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('payload');

    testAdoption = res.body.payload;
  });

  it('GET /api/adoptions/:aid debería devolver una adopción existente', async function () {
    const res = await requester.get(`/api/adoptions/${testAdoption._id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('payload');
  });

  it('GET /api/adoptions/:aid debería devolver 404 si no existe', async function () {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await requester.get(`/api/adoptions/${fakeId}`);

    expect(res.status).to.equal(404);
  });

  it('POST /api/adoptions/:uid/:pid debería devolver 400 si la mascota ya fue adoptada', async function () {
    const anotherUser = await UserModel.create({
  first_name: 'Otro',
  last_name: 'Usuario',
  email: 'otro@test.com',
  password: '123456'
});

    const res = await requester.post(`/api/adoptions/${anotherUser._id}/${testPet._id}`);

    expect(res.status).to.equal(400);
  });
});