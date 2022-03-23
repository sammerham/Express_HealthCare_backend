"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const { createToken } = require("../helper/token");

const testDocIds = [];
const testApptsIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM appointments");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM doctors");

  //adding doctors
  const doc1 = await Doctor.addDoctor(
    'd1',
    'test1',
    'd1@test.com'
  );
  const doc2 = await Doctor.addDoctor(
    'd2',
    'test2',
    'd2@test.com'
  );
  const doc3 = await Doctor.addDoctor(
    'd3',
    'test3',
    'd3@test.com'
  );
  testDocIds[0] = doc1.id;
  testDocIds[1] = doc2.id;
  testDocIds[2] = doc3.id;

// adding appoitments
  const appt1 = await Appointment.addAppt(
    'd1',
    'test1',
    'ptest1',
    'test1',
    '2022-01-09',
    '10:00 AM',
    'Follow-up'
  );
  const appt2 = await Appointment.addAppt(
    'd2',
    'test2',
    'ptest2',
    'test2',
    '2022-04-04',
    '10:30 AM',
    'Follow-up'  
  );
  const appt3 = await Appointment.addAppt(
    'd3',
    'test3',
    'ptest3',
    'test3',
    '2022-12-04',
    '10:15 AM',
    'Follow-up'
  );

  testApptsIds[0] = appt1.id;
  testApptsIds[1] = appt2.id;
  testApptsIds[2] = appt3.id;

 // adding users
  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
   });
  
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testDocIds,
  testApptsIds,
  u1Token,
  u2Token,
  adminToken,
};