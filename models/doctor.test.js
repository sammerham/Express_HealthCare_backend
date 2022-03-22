"use strict";

const {
  NotFoundError,
  BadRequestError,
} = require("../ExpressError/expressError");

const db = require("../db");
const Doctor = require("./doctor");

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


/************************************** Data */
const data = [
  {
    id: expect.any(Number),
    first_name: 'd1',
    last_name: 'test1',
    email:'d1@test.com'
  },
  {
    id: expect.any(Number),
    first_name: 'd2',
    last_name: 'test2',
    email:'d2@test.com'
  },
  {
    id: expect.any(Number),
    first_name: 'd3',
    last_name: 'test3',
    email:'d3@test.com'
  },
]

/************************************** ShowAlldoctors*/
describe("show All Doctors", () => {
  test("works", async () => {
    const docs = await Doctor.showAll();
    expect(docs).toEqual(data);
  });
});

/************************************** ShowDoctorByName */
describe("Show Doctor By Name", () => {
  const docTest = {
    id: expect.any(Number),
    first_name: 'd1',
    last_name: 'test1',
    email: 'd1@test.com'
  };
  test("works", async () => {
    const doc = await Doctor.showDoctorByName('d1', 'test1');
    expect(doc[0]).toEqual(docTest);
  });

  test("not found if no such doc", async () => {
    try {
      await Doctor.showDoctorByName('nope', 'nope');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************************************** ShowDoctorById */
describe("Show doctor By Id", () => {
  test("works", async () => {
    const doc = await Doctor.showDoctorByName('d1', 'test1');
    const id = doc[0].id;
    const docById = await Doctor.showDoctorById(id);
    expect(docById).toEqual(doc[0]);
  });

  test("not found if no such appt", async () => {
    try {
      await Doctor.showDoctorById(55);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** checkDupes */
describe("check for Dublicates", () => {
  const docTest = {
    id: expect.any(Number),
    first_name: 'd1',
    last_name: 'test1',
    email: 'd1@test.com'
  };
  test("works", async () => {
    const doc = await Doctor.checkDupes('d1', 'test1');
    expect(doc.first_name).toEqual('d1');
    expect(doc.last_name).toEqual('test1');
  });

  test("not found if no such doc", async () => {
    try {
      await Doctor.checkDupes('nope', 'nope');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** Add Doctor */

describe("Add Doctor", () => {
 const newDoctor = {
    first_name: 'newDoctor',
    last_name: 'NewLast',
    email: 'newDoctor@test.com'
  };
  

  test("works", async () => {
    const doc = await Doctor.addDoctor(...Object.values(newDoctor));
    expect(doc.first_name).toEqual('newDoctor');
    expect(doc.last_name).toEqual('NewLast');
    expect(doc.email).toEqual('newDoctor@test.com');
    
    const doctor = await Doctor.showDoctorByName('newDoctor', 'NewLast');
    expect(doctor[0].email).toEqual('newDoctor@test.com');
  });

  test("bad request with dup data", async () =>  {
    try {
      await Doctor.addDoctor(...Object.values(newDoctor))
      await Doctor.addDoctor(...Object.values(newDoctor))
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

   test("bad request if no data", async () => {
    try {
      await Doctor.addDoctor();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
/************************************** Delete doctor */

describe(" delete a doctor", () => {
  test("works", async () => {
    const doc = await Doctor.showDoctorByName('d1', 'test1');
    const id = doc[0].id;
    await Doctor.deleteDoctor(id);
    const res = await Doctor.showDoctorByName('d1', 'test1');
    expect(res.length).toEqual(0);
  });

  test("not found if no such doctor", async () => {
    try {
      await Doctor.deleteDoctor(99);
      // fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
/************************************** update a doctor */

describe("update a doctor", () => {
  const updateData = {
    first_name: 'updatedDoctor',
    last_name: 'updateLast',
    email: 'updateDoctor@test.com'
  };


  test("works with all data", async () => {
    const docs = await Doctor.showDoctorByName('d1', 'test1');
    const id = docs[0].id;
    const updatedDoc = await Doctor.updateDoctor(...Object.values(updateData),id);
    expect(updatedDoc.first_name).toEqual('updatedDoctor');
    expect(updatedDoc.last_name).toEqual('updateLast');
    expect(updatedDoc.email).toEqual('updateDoctor@test.com');
  });

  test("bad request if no data", async () => {
    try {
      const docs = await Doctor.showDoctorByName('d1', 'test1');
      const id = docs[0].id;
      await Doctor.updateDoctor(id);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/************************************** ShowDoctApptsByName */

describe("ShowDoctApptsByName", () => {
  test("works", async () => {
    const appts = await Doctor.showDocApptsByName('d1', 'test1');
    expect(appts.length).toEqual(1);
    expect(appts[0].patient_first_name).toEqual('ptest1');
  });
});

/************************************** ShowDoctApptsByDate */
describe("ShowDoctApptsByDate", () => {
  test("works", async () => {
    const appts = await Doctor.showDocApptsByName('d1', 'test1', '2022-03-04');
    expect(appts.length).toEqual(1);
    expect(appts[0].patient_first_name).toEqual('ptest1');
  });
});