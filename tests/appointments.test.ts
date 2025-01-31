import redisClient from '../dist/utils/clients/redisClient';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import app from '../dist/index';
import SeedUsers from '../src/utils/seeders/seed-users';
import SeedAppointments from '../src/utils/seeders/seed-appointments';
import AppointmentsService from '../dist/services/AppointmentsService';
import { AppointmentStatus } from '../src/utils/enums/appointment-status.enum';


const { expect } = chai;
const DOCTOR_EMAIL = 'mohamed.lamine@doctor.com';
const PATIENT_EMAIL = 'mohamed.lamine3@patient.com'

chai.use(chaiHttp);

describe('Test suite for the appointments endpoints', function () {
  this.timeout(8000);
  let server: Server;
  let accessToken: string;
  let patientAccessToken: string
  const doctorId = '22222222-2222-2222-2222-222222222222';
  const patientId = '33333333-3333-3333-3333-333333333333';
  const appointmentId = '11111111-1111-1111-1111-111111111111';
  const appointmentsRoute = '/api/v1/appointments';
  const loginRoute = '/api/v1/auth/login';

  before(async () => {
    server = app.listen(3002);
    await new Promise((resolve) => server.once('listening', resolve));
    // Delay 500ms to ensure server starts
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await SeedUsers.up();

    const res = await chai.request(server)
      .post(loginRoute)
      .send({ email: DOCTOR_EMAIL, password: 'password123' });

    const patientRes = await chai.request(server)
      .post(loginRoute)
      .send({ email: PATIENT_EMAIL, password: 'testing123' });

    accessToken = res.body.data.accessToken
    patientAccessToken = patientRes.body.data.accessToken
  });

  beforeEach(async () => {
    await SeedUsers.up();
    await SeedAppointments.up();
  });

  afterEach(async () => {
    await SeedUsers.down();
    await SeedAppointments.down();
  });

  after(async () => {
    await redisClient.deleteAllKeys();
    server.close();
  });

  it('Test POST /appointments create a new appointment', async () => {
    const res = await chai.request(server)
      .post(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        patientId,
        reason: 'Reason for the appointment',
        date_and_time: new Date(),
      });
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointment Created Successfully.');
  });

  it('Test POST /appointments create a new appointment with missing patientId', async () => {
    const res = await chai.request(server)
      .post(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        reason: 'Reason for the appointment',
        date_and_time: new Date(),
      });
    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['patientId']).to.deep.equal('Patient ID required.');
  });

  it('Test POST /appointments create a new appointment with missing reason', async () => {
    const res = await chai.request(server)
      .post(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        patientId,
        date_and_time: new Date(),
      });
    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['reason']).to.deep.equal('Reason is required.');
  });

  it('Test POST /appointments create a new appointment with missing date and time', async () => {
    const res = await chai.request(server)
      .post(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        patientId,
        reason: 'Reason for the appointment',
      });
    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['date_and_time']).to.deep.equal('Date And Time is required.');
  });

  it('Test POST /appointments create a new appointment as a patient', async () => {
    const res = await chai.request(server)
      .post(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      )
      .send({
        patientId,
        reason: 'Reason for the appointment',
        date_and_time: new Date(),
      });
    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Access Denied.');
  });

  it('Test PUT /appointments/:id update appointment details', async () => {
    const appointmentBeforeUpdate = await AppointmentsService.findAppointmentById(appointmentId);
    expect(appointmentBeforeUpdate.reason).to.deep.equal('Reason for the appointment');
    expect(appointmentBeforeUpdate.status).to.deep.equal(AppointmentStatus.PENDING);

    const res = await chai.request(server)
      .put(`${appointmentsRoute}/${appointmentId}`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        reason: 'Reason for the appointment UPDATED',
        status: AppointmentStatus.CANCELED
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointment Updated Successfully.');

    const appointmentAfterUpdate = await AppointmentsService.findAppointmentById(appointmentId);
    expect(appointmentAfterUpdate.reason).to.deep.equal('Reason for the appointment UPDATED');
    expect(appointmentAfterUpdate.status).to.deep.equal(AppointmentStatus.CANCELED);
  });

  it('Test PUT /appointments/:id update appointment details as a None doctor', async () => {
    const appointmentBeforeUpdate = await AppointmentsService.findAppointmentById(appointmentId);
    expect(appointmentBeforeUpdate.reason).to.deep.equal('Reason for the appointment');
    expect(appointmentBeforeUpdate.status).to.deep.equal(AppointmentStatus.PENDING);

    const res = await chai.request(server)
      .put(`${appointmentsRoute}/${appointmentId}`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      )
      .send({
        reason: 'Reason for the appointment UPDATED',
        status: AppointmentStatus.COMPLETED
      });

    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Access Denied.');

    const appointmentAfterUpdate = await AppointmentsService.findAppointmentById(appointmentId);
    expect(appointmentAfterUpdate.reason).to.deep.equal('Reason for the appointment');
    expect(appointmentAfterUpdate.status).to.deep.equal(AppointmentStatus.PENDING);
  });

  it('Test GET /appointments/:id retrive a patient appointment', async () => {
    const res = await chai.request(server)
      .get(`${appointmentsRoute}/${appointmentId}`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointment Retrived Successfully.');
    expect(res.body.data.patient_id).to.deep.equal(patientId);
  });

  it('Test GET /appointments/:id retrive an appointment that does not belong to a patient', async () => {
    const res = await chai.request(server)
      .get(`${appointmentsRoute}/22222222-2222-2222-2222-222222222222`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );

    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Access Denied.');
  });

  it('Test GET /appointments/:id retrive an appointment as a doctor and/or admin', async () => {
    const res = await chai.request(server)
      .get(`${appointmentsRoute}/${appointmentId}`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      );

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointment Retrived Successfully.');
  });

  it('Test GET /appointments retrive all appointment for a patient', async () => {
    const res = await chai.request(server)
      .get(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointments Retrived Successfully.');
    expect(res.body.data.records).to.have.length(1)
  });

  it('Test GET /appointments retrive all doctor\'s appointments', async () => {
    const res = await chai.request(server)
      .get(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      );
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointments Retrived Successfully.');
    expect(res.body.data.records).to.have.length(3)
  });

  it('Test GET /appointments retrive all doctor\'s appointments paginated', async () => {
    process.env.RECORDS_LIMIT = '2';

    const res = await chai.request(server)
      .get(appointmentsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      );

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Appointments Retrived Successfully.');
    expect(res.body.data.records).to.have.length(2)

    const res2 = await chai.request(server)
      .get(`${appointmentsRoute}?cursor=${res.body.data.nextCursor}`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
    expect(res2).to.have.status(200);
    expect(res2.body.message).to.deep.equal('Appointments Retrived Successfully.');
    expect(res2.body.data.records).to.have.length(1)

    const res3 = await chai.request(server)
      .get(`${appointmentsRoute}?cursor=${res2.body.data.nextCursor}`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
    expect(res3).to.have.status(200);
    expect(res3.body.message).to.deep.equal('Appointments Retrived Successfully.');
    expect(res3.body.data.records).to.have.length(0)
  });
});