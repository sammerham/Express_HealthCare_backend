'use strict'
const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const doctorNewSchema = require("../schemas/doctorNew.json");
const doctorUpdateSchema = require("../schemas/doctorUpdate.json");
const {ensureLoggedIn, ensureAdmin} = require('../middleware/auth')
const {
  NotFoundError,
  BadRequestError,
  ExpressError } = require("../ExpressError/expressError");
const Doctor = require("../models/doctor");



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

/** POST /name - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }}` */


router.post("/name",ensureLoggedIn, async function (req, res, next) {
  try {
    const { firstName, lastName } = req.body;
    if ((firstName === '' || lastName === '') ) throw new ExpressError('First name and Last name are required!', 404);
    const doctor = await Doctor.showDoctorByName(firstName, lastName);
    if (!doctor) throw new ExpressError(`Doctor ${req.body.firstName} ${req.body.lastName} doesn't exist!`, 404);
    return res.status(200).json({ doctor });
  } catch (e) {
    return next(e);
  }
});

//Get a list of all appointments for a particular doctor
/** POST /name/appts- return data about one appt: `{appts: appts}` */

router.post("/name/appts",ensureLoggedIn, async function (req, res, next) {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) throw new BadRequestError(`Doctor first name and last are required`);
    const doctor = await Doctor.showDoctorByName(firstName, lastName);

    if(!doctor) throw new NotFoundError(`Dr. ${firstName} ${lastName} doesn't exist`)
    const appts = await Doctor.showDocApptsByName(firstName, lastName);
    if (appts.length === 0) throw new BadRequestError(`No appts available for Dr. ${lastName}`);
    // if (appts.length === 0) return res.status(200).json({ appts:`No appts available for Dr. ${lastName}` });
    return res.status(200).json({
      appts,
      doctor: `Dr.${doctor.last_name}`
     });
  } catch (e) {
    return next(e);
  }
});
//Get a list of all appointments for a particular doctor and particular day
/** GET /name/appts/date- return data about one appt: `{appts: appts}` */

router.post("/name/appts/date",ensureLoggedIn,  async function (req, res, next) {
  try {
    const { firstName, lastName, date } = req.body;
    console.log(firstName, lastName, date)
    if (!firstName || !lastName || !date) throw new BadRequestError(`Doctor first name and last are required`);
    const doctor = await Doctor.showDoctorByName(firstName, lastName);
    if(!doctor) throw new NotFoundError(`Dr. ${firstName} ${lastName} doesn't exist`)
    const appts = await Doctor.showDocApptsByDate(firstName, lastName, date);
    // if (appts.length === 0) return res.status(200).json({ appts:`No appts booked for Dr. ${lastName} on ${date}` });
    if (appts.length === 0) throw new BadRequestError(`No appts booked for Dr. ${lastName} on ${date}` )
    return res.status(200).json({
      appts,
      doctor: `Dr.${doctor.last_name}`
     });
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
    if (!doctor) throw new NotFoundError(`No doctor with id: ${id}`, 404);
    return res.status(200).json({ doctor });
  } catch (e) {
    return next(e);
  }
});



//Get a list of all appointments for a particular doctor by ID
/** GET /[id]/appts return data about one appt: `{appts: appts}` */

router.get("/:id/appts", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new ExpressError(`No doctor with id: ${id}`, 404);
    const appts = await Doctor.showDocApptsById(id); 
    // if (appts.length === 0) return res.status(200).json({ appts:`No appts booked for doctos with id :${id}` });
    if (appts.length === 0) throw new BadRequestError(`No appointments booked for Dr.${doctor.last_name}!`);
    return res.status(200).json({
      appts,
      doctor: `Dr.${doctor.last_name}`
     });
  } catch (e) {
    return next(e);
  }
});

//Get a list of all appointments for a particular doctor by ID and Date
/** POST /[id] return data about one appt: `{appts: appts}` */

router.post("/:id/appts/date", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new ExpressError(`No doctor with id: ${id}`, 404);
    const appts = await Doctor.showDocApptsByIdDate(id, date);
    // if (appts.length === 0) return res.status(200).json({ appts:`No appts booked for Dr. ${doctor.first_name} on ${date}` });
    if (appts.length === 0) throw new BadRequestError(`No appts booked for Dr. ${doctor.last_name} on ${date}`);
    return res.status(200).json({
      appts,
      doctor: `Dr.${doctor.last_name}`
     });
  } catch (e) {
    return next(e);
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
    const { firstName, lastName, email } = req.body;
    const validator = jsonschema.validate(req.body, doctorNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack.replaceAll('"', ''));
      throw new BadRequestError(errs);
    }
    const doctor = await Doctor.addDoctor(firstName, lastName, email);
    return res.status(201).json({ doctor });
  } catch (e) {
    return next(e);
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
    return res.status(200).json({ message: `Doctor deleted!` });
  } catch (e) {
    return next(new NotFoundError(e));
  }
});

/** PATCH /[id] - update fields in doctor; return `{doctor: doctor}` */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  let doctor;
  try {
    const { firstName, lastName, email } = req.body;
    const validator = jsonschema.validate(req.body, doctorUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack.replaceAll('"', ''));
      throw new BadRequestError(errs);
    }
    const id = req.params.id;
    const doctor = await Doctor.showDoctorById(id);
    if (!doctor) throw new NotFoundError(`No matching doctor with ID: ${id}`,404);
    const updatedDoctor = await Doctor.updateDoctor(firstName, lastName, email, id);
    return res.status(200).json({ doctor:updatedDoctor });
  } catch (e) {
    return next(e);
  };
});

module.exports = router;



