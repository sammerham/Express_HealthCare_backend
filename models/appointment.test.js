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
    
/************************************** ShowAllAppointments*/

describe("showAll", () => {
  test("works", async () => {
    const appts = await Appointment.showAll();
    expect(appts).toEqual(data);
  });
});

/************************************** GetAppointmentByName */
describe("GetApptByName", () => {
  test("works", async () => {
    const appts = await Appointment.getApptsByName('ptest2', 'test2');
    expect(appts[0].patient_first_name).toEqual('ptest2');
    expect(appts[0].kind).toEqual('New Patient');
  });

  test("not found if no such appt", async function () {
    try {
      await Appointment.getAppointmentById(55);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** GetAppointmentById */
describe("GetApptById", () => {
  test("works", async () => {
    const appts = await Appointment.getApptsByName('ptest2', 'test2');
    const id = appts[0].id;
    const appt = await Appointment.getAppointmentById(id);
    expect(appt).toEqual(appts[0]);
  });

  test("not found if no such appt", async function () {
    try {
      await Appointment.getAppointmentById(55);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
/************************************** Add appointment */

describe("Add Appointment", () => {
  const newAppt = {
    doctor_First_Name: "d1",
    doctor_Last_Name: "test1",
    patient_first_name: "addtest",
    patient_last_name: "test",
    date: '2022-01-01',
    time: '9:00 AM',
    kind: 'Follow-up',
  };
  

  test("works", async () => {
    const appt = await Appointment.addAppt(...Object.values(newAppt));
    expect(appt.patient_first_name).toEqual('addtest');
    const appts = await Appointment.getApptsByName('addtest', 'test');
    expect(appts.length).toEqual(1);
    expect(appts[0].kind).toEqual('Follow-up');
    expect(appts[0].appt_time).toEqual('09:00:00');
  });

  test("bad request with dup data", async () =>  {
    try {
      await Appointment.addAppt(...Object.values(newAppt))
      await Appointment.addAppt(...Object.values(newAppt))
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with 3 appts same time for same doc", async () => {
    const appt1 = Object.values(newAppt)
    appt1.splice(2, 2, 'sam', 'merham')
    const appt2 = Object.values(newAppt)
    appt2.splice(2, 2, 'tam', 'terham')
    const appt3 = Object.values(newAppt)
    appt3.splice(2, 2, 'ram', 'rerham')
    try {
      await Appointment.addAppt(...appt1)
      await Appointment.addAppt(...appt2)
      await Appointment.addAppt(...appt3)
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});



/************************************** update */

describe("update", () => {
  const updateData = {
    patient_first_name: "addtest",
    patient_last_name: "test",
    appt_date: '2022-01-01',
    appt_time: '09:00:00',
    kind: 'Follow-up',
  };


  test("works with all data", async () => {
    const appts = await Appointment.getApptsByName('ptest2', 'test2');
    const id = appts[0].id;
    const appt = await Appointment.updateAppt(id, updateData);
    expect(appt.patient_first_name).toEqual('addtest');
    expect(appt.patient_last_name).toEqual('test');
    expect(appt.appt_time).toEqual('09:00:00');
  });

  test("bad request if no data", async function () {
    // expect.assertions(1);
    try {
      const appts = await Appointment.getApptsByName('ptest2', 'test2');
      const id = appts[0].id;
      await Appointment.updateAppt(id, {});
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", () => {
  test("works", async function () {
    const appts = await Appointment.getApptsByName('ptest2', 'test2');
    const id = appts[0].id;
    await Appointment.deleteAppt(id);
    const res = await Appointment.getApptsByName('ptest2', 'test2')
    expect(res.length).toEqual(0);
  });

  test("not found if no such Appt", async function () {
    try {
      await Appointment.deleteAppt(99);
      // fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});





