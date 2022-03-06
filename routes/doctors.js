'use strict'
const express = require("express");
const router = express.Router();
const app = require("../app");

const db = require("../db");
const { NotFoundError, BadRequestError, ExpressError } = require("../expressError");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment")


// routes for doctors
/** GET / - returns `{doctors: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }, ...]}` */

router.get('/', async (req, res, next) => {
  try {
    const doctors = await Doctor.showAll();
    return res.json({ doctors });
  } catch (e) {
    return next(new NotFoundError('NOt Found'));
  }
});

/** GET /name - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }}` */


router.get("/name", async function (req, res, next) {
  try {
    const { fName, lName } = req.body;
    const doctor = await Doctor.showDoctorByName(fName, lName);
    if (!doctor) throw new ExpressError('No doctor with this name', 404);
    return res.json({ doctor });
  } catch (e) {
    return next(new ExpressError(`${req.params.fName} ${req.params.lName} doesn't exist`, 404));
  }
});

//Get a list of all appointments for a particular doctor
/** GET /name/appts- return data about one appt: `{appts: appts}` */

router.get("/name/appts", async function (req, res, next) {
  try {
    const { fName, lName } = req.body;
    const appts = await Appointment.showDocAppts(fName, lName);
    if (!appts) throw new NotFoundError()
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
//Get a list of all appointments for a particular doctor and particular day
/** GET /name/appts/date- return data about one appt: `{appts: appts}` */

router.get("/name/appts/date", async function (req, res, next) {
  try {
    const { fName, lName, date } = req.body;
    const appts = await Appointment.showDocApptsDate(fName, lName, date);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
/** GET /id - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }}` */
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new ExpressError('No doctor with this name', 404);
    return res.json({ doctor });
  } catch (e) {
    return next(new ExpressError(`${req.params.id} doesn't exist`, 404));
  }
});
//Get a list of all appointments for a particular doctor by ID
/** GET /[id]/appts return data about one appt: `{appts: appts}` */

router.get("/:id/appts", async function (req, res, next) {
  try {
    const { id } = req.params;
    const appts = await Appointment.showDocApptsID(id);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(e);
  }
});

//Get a list of all appointments for a particular doctor by ID and Date
/** GET /[id] return data about one appt: `{appts: appts}` */

router.get("/:id/appts/date", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const appts = await Appointment.showDocApptsIdDate(id, date);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
/** POST  - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }}` */


router.post("/", async function (req, res, next) {
  try {
    const { fName, lName } = req.body;
    // if fName or lName fields is empty return bad request
    if (!fName|| !lName) return next(new BadRequestError(`First name and last name are required`, 400));
    // check for duplicates
    const dupes = await Doctor.checkDupes(fName, lName);
    if(dupes) throw new ExpressError(`Doctor ${fName} ${lName} already exist`, 404)
    const doctor = await Doctor.addDoctor(fName, lName);
    return res.json({ doctor });
  } catch (e) {
    return next(new BadRequestError(`Doctor ${req.body.fName} ${req.body.lName} already exists`), 400);
  }
});
/** DELETE /[id] - delete doctor, return `{message: "doctor deleted"}` */

router.delete("/:id", async function (req, res, next) {
  let id;
  try {
    id = req.params.id;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new NotFoundError(`No matching doctor with ID: ${id}`,404);
    await Doctor.deleteDoctor(id);
    return res.json({ message: "doctor deleted" });
  } catch (e) {
    return next(new NotFoundError(`No matching doctor with ID: ${id}`, 404));
  }
});

/** PATCH /[id] - update fields in doctor; return `{doctor: doctor}` */

router.patch("/:id", async function (req, res, next) {
  let doctor;
  const { fName, lName } = req.body;
  const id = req.params.id;
  try {
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new NotFoundError(`No matching doctor with ID: ${id}`,404);
    await Doctor.updateDoctor(fName, lName, id);
    return res.json({ doctor });
  } catch (e) {
    return next(new NotFoundError(`No matching doctor with ID: ${id}`,404));
  };
});

module.exports = router;



