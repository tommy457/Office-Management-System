import redisClient from '../dist/utils/clients/redisClient';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import app from '../dist/index.js';
import UserService from '../dist/services/UserService';
import AuthService from '../dist/services/AuthService';
import SeedUsers from '../src/utils/seeders/seed-users';


const { expect } = chai;
const EMAIL = 'mohamed.lamine@admin.com';
const TEST_EMAIL = 'mohamed.lamine.test@doctor.com';

chai.use(chaiHttp);

describe('Test suite for the Auth system', function () {
  this.timeout(8000);
  let server: Server;
  let refreshToken: string;
  let accessToken: string;
  let hashedUserPassword: string;
  const userId = '11111111-1111-1111-1111-111111111111';
  const registerRoute = '/api/v1/auth/register';
  const loginRoute = '/api/v1/auth/login';
  const refreshRoute = '/api/v1/auth/refresh';
  const logoutRoute = '/api/v1/auth/logout';
  const changePasswordroute = '/api/v1/auth/change-password';

  before(async () => {
    server = app.listen(3002);
    await new Promise((resolve) => server.once('listening', resolve));
    // Delay 500ms to ensure server starts
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await SeedUsers.up();

    hashedUserPassword = await AuthService.hashPassword('password123');
  });

  beforeEach(async () => {
    await SeedUsers.up();
    const res = await chai.request(server)
      .post(loginRoute)
      .send({ email: EMAIL, password: 'testing123' });
    refreshToken = res.body.data.refreshToken;
    accessToken = res.body.data.accessToken
  });

  afterEach(async () => {
    await SeedUsers.down()
  });

  after(async () => {
    await redisClient.deleteAllKeys();
    server.close();
  });

  it('Test POST /register with a user with all required fields', async () => {
    const res = await chai.request(server)
      .post(registerRoute)
      .send(
        {
          email: TEST_EMAIL,
          password: 'testing123',
          specialization: 'Surgeon',
          name: 'Mohamed',
        }
      );

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Account Created Successfully.');

    const user = await UserService.findUser({ name: 'Mohamed' });
    expect(user.name).to.deep.equal('Mohamed');
    expect(user.specialization).to.deep.equal('Surgeon');
  });

  it('Test POST /register with a user with missing email', async () => {
    const res = await chai.request(server)
      .post(registerRoute)
      .send(
        {
          password: 'testing123',
          specialization: 'Surgeon',
          name: 'Mohamed',
        }
      );

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['email']).to.deep.equal('Email is required.');

    const user = await UserService.findUser({ name: 'Mohamed' });
    expect(user).to.be.null;
  });

  it('Test POST /register with a user with missing password', async () => {
    const res = await chai.request(server)
      .post(registerRoute)
      .send(
        {
          email: TEST_EMAIL,
          specialization: 'Surgeon',
          name: 'Mohamed',
        }
      );

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['password']).to.deep.equal('Password is required.');

    const user = await UserService.findUser({ name: 'Mohamed' });
    expect(user).to.be.null;
  });

  it('Test POST /register with a user with a weak password', async () => {
    const res = await chai.request(server)
      .post(registerRoute)
      .send(
        {
          email: TEST_EMAIL,
          password: 'testing',
          specialization: 'Surgeon',
          name: 'Mohamed',
        }
      );

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['password']).to.deep.equal('Password must be at least 8 characters long.');

    const user = await UserService.findUser({ name: 'Mohamed' });
    expect(user).to.be.null;
  });

  it('Test POST /register with a user with missing name', async () => {
    const res = await chai.request(server)
      .post(registerRoute)
      .send(
        {
          email: TEST_EMAIL,
          password: 'testing123',
          specialization: 'Surgeon',
        }
      );

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['name']).to.deep.equal('Name is required.');

    const user = await UserService.findUser({ email: TEST_EMAIL });
    expect(user).to.be.null;
  });

  it('Test POST /login with both the email and passwords', async () => {
    const res = await chai.request(server)
      .post(loginRoute)
      .send({ email: EMAIL, password: 'testing123' });

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property('accessToken');
    expect(res.body.data).to.have.property('refreshToken');
    expect(res.body.data).to.have.property('userId');
  });

  it('Test POST /login with wrong password', async () => {
    const res = await chai.request(server)
      .post(loginRoute)
      .send({ email: EMAIL, password: 'wrongpassword' });

    expect(res).to.have.status(401);
    expect(res.body.message).to.deep.equal('Wrong Password.');
  });

  it('Test POST /login with missing email', async () => {
    const res = await chai.request(server)
      .post(loginRoute)
      .send({ password: 'testing123' });

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['email']).to.deep.equal('Email is required.');
  });

  it('Test POST /login with missing password', async () => {
    const res = await chai.request(server)
      .post(loginRoute)
      .send({ email: EMAIL });

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['password']).to.deep.equal('Password is required.');
  });

  it('Test POST /login with a user that does not exist', async () => {
    const res = await chai.request(server)
      .post(loginRoute)
      .send({ email: 'fake@email.com', password: 'testing123' });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal('User Not Found.');
  });

  it('Test POST /refresh refresh the user access token', async () => {
    const res = await chai.request(server)
      .post(refreshRoute)
      .send({ refreshToken });

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Refreched Access Token Successfully.');
    expect(res.body.data).to.have.property('accessToken');
  });

  it('Test POST /refresh with a missing refresh Token', async () => {
    const res = await chai.request(server)
      .post(refreshRoute)

    expect(res).to.have.status(401);
    expect(res.body.message).to.deep.equal('Missing Refresh Token.');
  });

  it('Test POST /refresh with a an expired refresh Token', async () => {
    await redisClient.del(`${userId}_refresh`);
    const res = await chai.request(server)
      .post(refreshRoute)
      .send({ refreshToken });

    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('The token is invalid or has expired.');
  });

  it('Test POST /refresh with a an invalid refresh Token', async () => {
    await redisClient.del(`${userId}_refresh`);

    const res = await chai.request(server)
      .post(refreshRoute)
      .send({ refreshToken: `invalid refresh token` });

    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Invalid token.');
  });

  it('Test POST /logout logout a user', async () => {
    const res = await chai.request(server)
      .post(logoutRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      );
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('User Logged Out Successfully.');
  });

  it('Test POST /logout logout a user with a missing access token', async () => {
    const res = await chai.request(server)
      .post(logoutRoute)

    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Missing Access Token.');
  });

  it('Test POST /logout logout a user with an expired access token', async () => {
    await redisClient.del(`${userId}`);

    const res = await chai.request(server)
      .post(logoutRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      );
    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('The token is invalid or has expired.');
  });

  it('Test PATCH /change-password change a user password', async () => {
    const res = await chai.request(server)
      .patch(changePasswordroute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        old_password: 'testing123',
        new_password: 'NewPassword123',
        confirm_new_password: 'NewPassword123',
      });
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Password Changed Successfully.');

    const loginRes = await chai.request(server)
      .post(loginRoute)
      .send({ email: EMAIL, password: 'NewPassword123' });
    console.log(loginRes.body)
    expect(loginRes).to.have.status(200);
  });

  it('Test PATCH /change-password change a user password with wrong password', async () => {
    const res = await chai.request(server)
      .patch(changePasswordroute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        old_password: 'wrongpassword',
        new_password: 'NewPassword123',
        confirm_new_password: 'NewPassword123',
      });
    expect(res).to.have.status(401);
    expect(res.body.message).to.deep.equal('Wrong Password.');
  });

  it('Test PATCH /change-password change a user password with password mismatch', async () => {
    const res = await chai.request(server)
      .patch(changePasswordroute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        old_password: 'testing123',
        new_password: 'NewPassword123',
        confirm_new_password: 'password mismatch',
      });
    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(
      res.body.data['confirm_new_password']
    ).to.deep.equal('Your passwords don\'t match. Please try again.');
  });
});