import redisClient from '../dist/utils/clients/redisClient';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import app from '../dist/index';
import PrescriptionService from '../dist/services/PrescriptionService';
import seedDB from '../dist/utils/seeders/seedDB'

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
  const prescriptionId = '11111111-1111-1111-1111-111111111111';
  const prescriptionsRoute = '/api/v1/prescriptions';
  const loginRoute = '/api/v1/auth/login';

  before(async () => {
    server = app.listen(3002);
    await new Promise((resolve) => server.once('listening', resolve));
    // Delay 500ms to ensure server starts
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedDB.up();

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
    await seedDB.up();
  });

  afterEach(async () => {
    await seedDB.down();
  });

  after(async () => {
    await redisClient.deleteAllKeys();
    server.close();
  });

  it('Test POST /prescriptions create a new prescription', async () => {
    const res = await chai.request(server)
      .post(prescriptionsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        patientId,
        medication: 'medication',
        dosage: 'dosage',
        frequency: 'frequency',
        startDate: new Date(),
        endDate: new Date()
      });
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Prescription Created Successfully.');
  });

  it('Test POST /prescriptions create a new prescription with missing fields', async () => {
    const res = await chai.request(server)
      .post(prescriptionsRoute)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        patientId,
        dosage: 'dosage',
        endDate: new Date()
      });
    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['medication']).to.deep.equal('Medication is required.');
    expect(res.body.data['frequency']).to.deep.equal('Frequency is required.');
    expect(res.body.data['startDate']).to.deep.equal('Start Date is required.');
  });

  it('Test POST /prescriptions create a new prescription as a None doctor', async () => {
    const res = await chai.request(server)
      .post(prescriptionsRoute)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      )
      .send({
        patientId,
        medication: 'medication',
        dosage: 'dosage',
        frequency: 'frequency',
        startDate: new Date(),
        endDate: new Date()
      });
    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Access Denied.');
  });

  it('Test PUT /prescriptions/:id update a prescription', async () => {
    const prescriptionBefore = await PrescriptionService.findPrescriptionById(prescriptionId);
    expect(prescriptionBefore.medication).to.deep.equal('medication');
    expect(prescriptionBefore.dosage).to.deep.equal('dosage');
    expect(prescriptionBefore.frequency).to.deep.equal('frequency');

    const res = await chai.request(server)
      .put(`${prescriptionsRoute}/${prescriptionId}`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        medication: 'medication UPDATED',
        dosage: 'dosage UPDATED',
        frequency: 'frequency UPDATED',
      });
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Prescription Updated Successfully.');

    const prescriptionAfter = await PrescriptionService.findPrescriptionById(prescriptionId);
    expect(prescriptionAfter.medication).to.deep.equal('medication UPDATED');
    expect(prescriptionAfter.dosage).to.deep.equal('dosage UPDATED');
    expect(prescriptionAfter.frequency).to.deep.equal('frequency UPDATED');
  });

  it('Test PUT /prescriptions/:id update a prescription as a None doctor', async () => {
    const prescriptionBefore = await PrescriptionService.findPrescriptionById(prescriptionId);
    expect(prescriptionBefore.medication).to.deep.equal('medication');
    expect(prescriptionBefore.dosage).to.deep.equal('dosage');
    expect(prescriptionBefore.frequency).to.deep.equal('frequency');

    const res = await chai.request(server)
      .put(`${prescriptionsRoute}/${prescriptionId}`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      )
      .send({
        medication: 'medication UPDATED',
        dosage: 'dosage UPDATED',
        frequency: 'frequency UPDATED',
      });
    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Access Denied.');

    const prescriptionAfter = await PrescriptionService.findPrescriptionById(prescriptionId);
    expect(prescriptionAfter.medication).to.deep.equal('medication');
    expect(prescriptionAfter.dosage).to.deep.equal('dosage');
    expect(prescriptionAfter.frequency).to.deep.equal('frequency');
  });

  it('Test PUT /prescriptions/:id update a prescription with empty required fields', async () => {
    const prescriptionBefore = await PrescriptionService.findPrescriptionById(prescriptionId);
    expect(prescriptionBefore.medication).to.deep.equal('medication');
    expect(prescriptionBefore.dosage).to.deep.equal('dosage');
    expect(prescriptionBefore.frequency).to.deep.equal('frequency');

    const res = await chai.request(server)
      .put(`${prescriptionsRoute}/${prescriptionId}`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      )
      .send({
        medication: '',
        dosage: '',
        frequency: '',
      });
    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal('Validation Error.');
    expect(res.body.data['medication']).to.deep.equal('Medication is required.');
    expect(res.body.data['frequency']).to.deep.equal('Frequency is required.');
    expect(res.body.data['dosage']).to.deep.equal('Dosage is required.');

    const prescriptionAfter = await PrescriptionService.findPrescriptionById(prescriptionId);
    expect(prescriptionAfter.medication).to.deep.equal('medication');
    expect(prescriptionAfter.dosage).to.deep.equal('dosage');
    expect(prescriptionAfter.frequency).to.deep.equal('frequency');
  });

  it('Test GET /prescriptions/:id retirive a patient prescription', async () => {
    const res = await chai.request(server)
      .get(`${prescriptionsRoute}/${prescriptionId}`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Prescription Retrived Successfully.');
  });

  it('Test GET /prescriptions/:id retirive a patient prescription that doesn\'t belong to him', async () => {
    const res = await chai.request(server)
      .get(`${prescriptionsRoute}/22222222-2222-2222-2222-222222222222`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );

    expect(res).to.have.status(403);
    expect(res.body.message).to.deep.equal('Access Denied.');
  });

  it('Test GET /prescriptions/:id doctors can access all prescriptions', async () => {
    const res = await chai.request(server)
      .get(`${prescriptionsRoute}/22222222-2222-2222-2222-222222222222`)
      .set(
        { Authorization: `Bearer ${accessToken}` }
      );

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Prescription Retrived Successfully.');
  });

  it('Test GET /prescriptions retrive all patient\'s prescriptions', async () => {
    const res = await chai.request(server)
      .get(prescriptionsRoute)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Prescriptions Retrived Successfully.');
    expect(res.body.data.records).to.have.length(2)
  });

  it('Test GET /prescriptions retrive all patient\'s prescriptions paginated', async () => {
    const res = await chai.request(server)
      .get(`${prescriptionsRoute}?limit=1`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );
    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal('Prescriptions Retrived Successfully.');
    expect(res.body.data.records).to.have.length(1);

    const res2 = await chai.request(server)
      .get(`${prescriptionsRoute}?limit=1&cursor=${res.body.data.nextCursor}`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );
    expect(res2).to.have.status(200);
    expect(res2.body.message).to.deep.equal('Prescriptions Retrived Successfully.');
    expect(res2.body.data.records).to.have.length(1)

    const res3 = await chai.request(server)
      .get(`${prescriptionsRoute}?limit=1&cursor=${res2.body.data.nextCursor}`)
      .set(
        { Authorization: `Bearer ${patientAccessToken}` }
      );
    expect(res3).to.have.status(200);
    expect(res3.body.message).to.deep.equal('Prescriptions Retrived Successfully.');
    expect(res3.body.data.records).to.have.length(0)
  });
});