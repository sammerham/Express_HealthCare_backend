"use strict";

const {
  NotFoundError,
  BadRequestError,
} = require("../ExpressError/expressError");

const db = require("../db");
const Appointment = require("./appointment");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require('./_testCommon');


beforeAll(commonBeforeAll);

beforeEach(commonBeforeEach);

afterEach(commonAfterEach);

afterAll(commonAfterAll);




/************************************** showAll */
const data = 
  [
      {
        id: expect.any(Number),
        patient_first_name: 'ptest1',
        patient_last_name: 'test1',
        doctor_id: expect.any(Number),
        appt_date: expect.any(Date),
        appt_time: '10:00:00',
        kind: 'Follow-up'
      },
      {
        id: expect.any(Number),
        patient_first_name: 'ptest2',
        patient_last_name: 'test2',
        doctor_id: expect.any(Number),
        appt_date: expect.any(Date),
        appt_time: '15:00:00',
        kind: 'New Patient'
      },
      {
        id: expect.any(Number),
        patient_first_name: 'ptest3',
        patient_last_name: 'test3',
        doctor_id: expect.any(Number),
        appt_date: expect.any(Date),
        appt_time: '13:15:00',
        kind: 'Follow-up'
      }
    ]
describe("showAll", () => {
  test("works", async () => {
    const appts = await Appointment.showAll();
    expect(appts).toEqual(data);
  });
});