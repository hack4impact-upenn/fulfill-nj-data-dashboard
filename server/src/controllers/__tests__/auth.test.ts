import request from 'supertest';
import createServer from '../../config/createServer';
import db from '../../config/database';
import ensureAuthenticated from '../auth.middleware';

const app = createServer();

beforeEach(async () => {
  await db.open(); // open database connection
});

afterEach(async () => {
  await db.close(); // close database connection
});

// it('logging out before logging in should return a 400', async () => {
//   const response = await request(app).post('/api/auth/logout');
//   expect(response.status).toBe(400);
// });

// it('registering new user issues 201 status code and registering existing user issues 400 status code', async () => {
//   let response = await request(app).post('/api/auth/register').send({
//     email: 'example@gmail.com',
//     password: 'Hack4Impact',
//   });
//   expect(response.status).toBe(201);
//   response = await request(app).post('/api/auth/register').send({
//     email: 'example@gmail.com',
//     password: 'Hack4Impact',
//   });
//   expect(response.status).toBe(400);
// });

// it('successful login should give 200 status code', async () => {
//   let response = await request(app).post('/api/auth/register').send({
//     email: 'example@gmail.com',
//     password: 'Hack4Impact',
//   });
//   expect(response.status).toBe(201);
//   response = await request(app).post('/api/auth/login').send({
//     email: 'example@gmail.com',
//     password: 'Hack4Impact',
//   });
//   expect(response.status).toBe(200);
// });

// it('incorect password should give 401 status', async () => {
//   let response = await request(app).post('/api/auth/register').send({
//     email: 'example@gmail.com',
//     password: 'Hack4Impact',
//   });
//   expect(response.status).toBe(201);
//   response = await request(app).post('/api/auth/login').send({
//     email: 'example@gmail.com',
//     password: 'hack4impact',
//   });
//   expect(response.status).toBe(401);
// });

it('test register, login, logout', async () => {
  let response = await request(app).post('/api/auth/register').send({
    email: 'example2@gmail.com',
    password: 'Hack4Impact',
  });
  expect(response.status).toBe(201);
  response = await request(app).post('/api/auth/login').send({
    email: 'example2@gmail.com',
    password: 'Hack4Impact',
  });
  expect(response.status).toBe(200);
  response = await request(app).post('/api/auth/logout');
  expect(response.status).toBe(200);
});
