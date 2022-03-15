const express = require("express");
const app = require("../app");
const router = express.Router();
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError/expressError");
const Appointment = require("../models/appointment")
const {ensureLoggedIn } = require('../middleware/auth')

// routes for appointments

//Get a list of all appointments
router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const appointments = await Appointment.showAll();
    return res.json({ appointments });
  } catch (e) {
    return next(new NotFoundError('Not Found'));
  }
});

//Get a an appointment by Id
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.getAppointment(id);
    if(!appointment) throw new ExpressError('No appt with this id', 404);
    return res.json({ appointment });
  } catch (e) {
    return next(new NotFoundError('Not Found'));
  }
});

/** POST / - create appt from data; return `{appt: appt}` */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  console.log(req.body)
  try {
    const appt = await Appointment.addAppt(
      req.body.doctor_First_Name,
      req.body.doctor_Last_Name,
      req.body.patient_first_name,
      req.body.patient_last_name,
      req.body.date,
      req.body.time,
      req.body.kind
    );
    
    return res.status(201).json({ appt });
  } catch (e) {
    return next (new BadRequestError(`Doctors already has three appts for that time`));
  }
});


/** DELETE /[id] - delete appt, return `{message: "appt deleted"}` */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  let id;
  try {
    id = req.params;
    const appt = await Appointment.deleteAppt(id);
    console.log('appts in delete', appt)
    if (!appt) throw new NotFoundError(`No matching appt with id ${req.params.id}`);
    return res.json({ message: "Appt deleted" });
  } catch (e) {
    return next(new NotFoundError(`No matching appt with id ${req.params.id}`));
  }
});

/** PATCH /[id] - update fields in appt; return `{appt: appt}` */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  console.log('inside patch')
  let appt;
  console.log('body', req.body)
  const { date, time } = req.body;
  const { id } = req.params;
  console.log('id -->', id, 'date--->>', date, 'Time___>>', time)
  try {
    appt = await Appointment.updateAppt(date, time, id);
    console.log('appt in pacth', appt)
    if (!appt) throw new NotFoundError(`No matching appt: ${id}`)
    return res.json({ appt });
  } catch (e) {
    return next (new NotFoundError(`No matching appt: ${id}`));
  };
});

module.exports = router;
