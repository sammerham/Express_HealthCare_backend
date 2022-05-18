const express = require("express");
const router = express.Router();
const { NotFoundError, BadRequestError, ExpressError } = require("../ExpressError/expressError");
const Appointment = require("../models/appointment")
const jsonschema = require("jsonschema");
const apptNewSchema = require("../schemas/apptNew.json");
const apptUpdateSchema = require("../schemas/apptUpdate.json");
const { ensureLoggedIn } = require('../middleware/auth');
const { request } = require("../app");
const capitalize = require('../helper/uppercase');
const moment = require('moment')



// routes for appointments

//Get a list of all appointments
router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const appointments = await Appointment.showAll();
    if (!appointments) throw new ExpressError(`No apptointments found`, 404);
    return res.status(200).json({ appointments });
  } catch (e) {
    return next(e);
  }
});

//Get a an appointment by Id
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.getAppointmentById(id);
    if (!appointment) throw new ExpressError(`No appt with id : ${id}`, 404);
    return res.status(200).json({ appointment });
  } catch (e) {
    return next(e);
  }
});

//Get all appointments by patient name --> appointments:[{}, {}, ...]
router.post('/name', ensureLoggedIn, async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    if ((firstName === '' || lastName === '') ) throw new ExpressError('First name and Last name are required!', 404);
    const appointments = await Appointment.getApptsByName(firstName, lastName);
    if(appointments.length === 0 ) throw new ExpressError(`No appt for ${firstName} ${lastName}`, 404);
    return res.status(200).json({ appointments });
  } catch (e) {
    return next(e);
  }
});

/** POST / - create appt from data; return `{appt: appt}` */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, apptNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack.replaceAll('"', ''));
      throw new BadRequestError(errs);
    }
    const {
      doctor_First_Name,
      doctor_Last_Name,
      patient_first_name,
      patient_last_name,
      date,
      time,
      kind
    } = req.body;

    // check for dupes appt for patient at same date and time
    const patientAppts = await Appointment.getApptsByName(patient_first_name, patient_last_name);
    const dupes = patientAppts.filter(
      appt => moment.utc(appt.appt_date).format('YYYY-MM-DD') === date && appt.appt_time === time);
     if (dupes.length) throw new BadRequestError(`Patient has an appt already on same date and time!`);
    // else add appt
    const appt = await Appointment.addAppt(
      doctor_First_Name,
      doctor_Last_Name,
      patient_first_name,
      patient_last_name,
      date,
      time,
      kind
    );
    return res.status(201).json({ appointment:appt });
  } catch (e) {
    return next (e);
  }
});


/** DELETE /[id] - delete appt, return `{message: "appt deleted"}` */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  
  try {
    const foundAppt = await Appointment.getAppointmentById(req.params.id)
    if (!foundAppt) throw new NotFoundError(`No appt with id: ${req.params.id}`);
    await Appointment.deleteAppt(req.params.id);
    return res.status(200).json({ message: "Appt deleted" });
  } catch (e) {
    return next(e);
  }
});

/** PATCH /[id] - update fields in appt; return `{appt: appt}` */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const foundAppt = await Appointment.getAppointmentById(req.params.id)
    if (!foundAppt) throw new NotFoundError(`No appt: ${req.params.id}`);
    const validator = jsonschema.validate(req.body, apptUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack.replaceAll('"', ''));
      throw new BadRequestError(errs);
    }
    const appt = await Appointment.updateAppt(req.params.id, req.body);
    return res.status(200).json({ appointment:appt });
  } catch (e) {
    return next(e)
  }
});

module.exports = router;
