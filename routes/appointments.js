const express = require("express");
const router = express.Router();
const { NotFoundError, BadRequestError, ExpressError } = require("../ExpressError/expressError");
const Appointment = require("../models/appointment")
const jsonschema = require("jsonschema");
const apptNewSchema = require("../schemas/apptNew.json");
const { ensureLoggedIn } = require('../middleware/auth')


// routes for appointments

//Get a list of all appointments
router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const appointments = await Appointment.showAll();
    return res.status(200).json({ appointments });
  } catch (e) {
    return next(new NotFoundError('Not Found'));
  }
});

//Get a an appointment by Id
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.getAppointment(id);
    if(!appointment) throw new ExpressError(`No appt with id : ${id}`, 404);
    return res.status(200).json({ appointment });
  } catch (e) {
    return next(new NotFoundError(e));
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
    // check for dupes appt for patient at same date
    const patientAppts = await Appointment.getAppts(patient_first_name, patient_last_name);
    const dupes = patientAppts.some(
      appt => appt.appt_date.toISOString().split('T')[0] === date
    )
    if (dupes) throw new BadRequestError(`Patient has an appt already on ${date} at ${time}!!`);
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
    return res.status(201).json({ appt });
  } catch (e) {
    return next (new BadRequestError(e));
  }
});


/** DELETE /[id] - delete appt, return `{message: "appt deleted"}` */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const appt = await Appointment.getAppointment(id);
    console.log('appts in delete route', appt)
    if (!appt) throw new ExpressError(`No appt with id : ${id}`, 404);
    await Appointment.deleteAppt(id);
    return res.status(200).json({ message: "Appt deleted" });
  } catch (e) {
    return next(new NotFoundError(e));
  }
});

/** PATCH /[id] - update fields in appt; return `{appt: appt}` */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  let appt;
  const { id } = req.params;
  try {
    appt = await Appointment.updateAppt(id, req.body);
    if (!appt) throw new NotFoundError(`No matching appt: ${id}`)
    return res.status(200).json({ appt });
  } catch (e) {
    return next (new NotFoundError(e));
  };
});

module.exports = router;
