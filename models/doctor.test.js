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