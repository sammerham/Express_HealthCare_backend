'use strict'
const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const doctorNewSchema = require("../schemas/doctorNew.json");
const {ensureLoggedIn, ensureAdmin} = require('../middleware/auth')
const {
  NotFoundError,
  BadRequestError,
  ExpressError } = require("../ExpressError/expressError");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment")


// routes for doctors
/** GET / - returns `{doctors: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }, ...]}` */

router.get('/' ,ensureLoggedIn,  async (req, res, next) => {
  try {
    const doctors = await Doctor.showAll();
    return res.status(200).json({ doctors });
  } catch (e) {
    return next(new NotFoundError('NOt Found'));
  }
});

/** GET /name - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }}` */


router.get("/name",ensureLoggedIn, async function (req, res, next) {
  try {
    const { fName, lName } = req.body;
    const doctor = await Doctor.showDoctorByName(fName, lName);
    if (!doctor) throw new ExpressError('No doctor with this name', 404);
    return res.status(200).json({ doctor });
  } catch (e) {
    return next(new ExpressError(`${req.body.fName} ${req.body.lName} doesn't exist`, 404));
  }
});

//Get a list of all appointments for a particular doctor
/** GET /name/appts- return data about one appt: `{appts: appts}` */

router.get("/name/appts",ensureLoggedIn, async function (req, res, next) {
  try {
    const { fName, lName } = req.body;
    const appts = await Appointment.showDocAppts(fName, lName);
    if (!appts) throw new NotFoundError()
    if (appts.length === 0) return res.status(200).json({ appts:`No appts available for Dr. ${lName}` });
    return res.status(200).json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
//Get a list of all appointments for a particular doctor and particular day
/** GET /name/appts/date- return data about one appt: `{appts: appts}` */

router.get("/name/appts/date",ensureLoggedIn,  async function (req, res, next) {
  try {
    const { fName, lName, date } = req.body;
    const appts = await Appointment.showDocApptsDate(fName, lName, date);
    if (!appts) throw new NotFoundError();
    if (appts.length === 0) return res.status(200).json({ appts:`No appts available for Dr. ${lName} on ${date}` });
    return res.status(200).json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
/** GET /id - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }}` */
router.get("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new ExpressError('No doctor with this name', 404);
    return res.status(200).json({ doctor });
  } catch (e) {
    return next(new ExpressError(`${req.params.id} doesn't exist`, 404));
  }
});
//Get a list of all appointments for a particular doctor by ID
/** GET /[id]/appts return data about one appt: `{appts: appts}` */

router.get("/:id/appts", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const appts = await Appointment.showDocApptsID(id);
    if (appts.length === 0) return res.status(200).json({ appts:`No appts available for id :${id}` });
    if (!appts) throw new NotFoundError();
    return res.status(200).json({ appts });
  } catch (e) {
    return next(e);
  }
});

//Get a list of all appointments for a particular doctor by ID and Date
/** GET /[id] return data about one appt: `{appts: appts}` */

router.get("/:id/appts/date", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const appts = await Appointment.showDocApptsIdDate(id, date);
    if (!appts) throw new NotFoundError();
    return res.status(200).json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
/** POST  - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }}` */


router.post("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const { fName, lName, email } = req.body;
    const validator = jsonschema.validate(req.body, doctorNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack.replaceAll('"', ''));
      throw new BadRequestError(errs);
    }
    const doctor = await Doctor.addDoctor(fName, lName, email);
    return res.status(201).json({ doctor });
  } catch (e) {
    return next(new BadRequestError(e), 400);
  }
});
/** DELETE /[id] - delete doctor, return `{message: "doctor deleted"}` */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  let id;
  try {
    id = req.params.id;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new NotFoundError(`No matching doctor with ID: ${id}`,404);
    await Doctor.deleteDoctor(id);
    return res.status(200).json({ message: "doctor deleted" });
  } catch (e) {
    return next(new NotFoundError(`No matching doctor with ID: ${id}`, 404));
  }
});

/** PATCH /[id] - update fields in doctor; return `{doctor: doctor}` */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  let doctor;
  const { fName, lName } = req.body;
  const id = req.params.id;
  try {
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new NotFoundError(`No matching doctor with ID: ${id}`,404);
    const updatedDoctor = await Doctor.updateDoctor(fName, lName, id);
    return res.status(200).json({ doctor:updatedDoctor });
  } catch (e) {
    return next(new NotFoundError(`No matching doctor with ID: ${id}`,404));
  };
});

module.exports = router;



