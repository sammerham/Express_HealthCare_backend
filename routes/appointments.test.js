"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testDocIds,
  testApptsIds,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");
const req = require("express/lib/request");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */
describe("GET /appts", () => { 
  const appointments = [
        {
          id: expect.any(Number),
          patient_first_name: 'ptest1',
          patient_last_name: 'test1',
          doctor_id: expect.any(Number),
          appt_date: '2022-01-09T08:00:00.000Z',
          appt_time: '10:00:00',
          kind: 'Follow-up'
        },
        {
          id: expect.any(Number),
          patient_first_name: 'ptest2',
          patient_last_name: 'test2',
          doctor_id: expect.any(Number),
          appt_date: '2022-04-04T07:00:00.000Z',
          appt_time: '10:30:00',
          kind: 'Follow-up'
        },
        {
          id: expect.any(Number),
          patient_first_name: 'ptest3',
          patient_last_name: 'test3',
          doctor_id: expect.any(Number),
          appt_date: '2022-12-04T08:00:00.000Z',
          appt_time: '10:15:00',
          kind: 'Follow-up'
        }
      ]

  test("works for logged in user", async () => {
    const resp = await request(app)
      .get("/appts")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({appointments});
  });
  
  test("works for admins", async () => {
    const resp = await request(app)
      .get("/appts")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({appointments});
  });

  test("unauth for a none user", async () => {
    const resp = await request(app)
        .get("/appts");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /appts/:id */
describe("GET /appts/:id", () => { 

  test("works for logged in user", async () => {
    const resp = await request(app)
        .get(`/appts/${testApptsIds[0]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      appointment: {
        id: testApptsIds[0],
        patient_first_name: 'ptest1',
        patient_last_name: 'test1',
        doctor_id: expect.any(Number),
        appt_date: '2022-01-09T08:00:00.000Z',
        appt_time: '10:00:00',
        kind: 'Follow-up'
      }
    });
  });
  
  test("works for logged in Admin", async () => {
    const resp = await request(app)
      .get(`/appts/${testApptsIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      appointment: {
        id: testApptsIds[0],
        patient_first_name: 'ptest1',
        patient_last_name: 'test1',
        doctor_id: expect.any(Number),
        appt_date: '2022-01-09T08:00:00.000Z',
        appt_time: '10:00:00',
        kind: 'Follow-up'
      }
    });
  });

  test("unauth for a none user", async () => {
    const resp = await request(app)
        .get(`/appts/${testApptsIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if appt not found", async () => {
    const resp = await request(app)
        .get(`/appts/${testApptsIds[99]}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST / appts */
describe("POST /appts", () => { 
  test("works for logged in users ", async () => {
    const resp = await request(app)
        .post("/appts")
        .send({
    doctor_First_Name: "d1",
    doctor_Last_Name: "test1",
    patient_first_name: "addtest",
    patient_last_name: "test",
    date: '2022-01-01',
    time: '09:00:00',
    kind: 'Follow-up',
    })
    .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    console.log('appts body --->>', resp.body)  
    expect(resp.body).toEqual({
      appt: {
        id: expect.any(Number),
        patient_first_name: 'addtest',
        patient_last_name: 'test',
        doctor_id: expect.any(Number),
        appt_date: '2022-01-01T08:00:00.000Z',
        appt_time: '09:00:00',
        kind: 'Follow-up'
      }
    });
  });
});
