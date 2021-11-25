const express = require("express");
const app = require("../app");
const router = express.Router();
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Appointment = require("../models/appointment")
// routes for appointments
//Get a list of all appointments

router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.showAll();
    return res.json({ appointments });
  } catch (e) {
    return next(new NotFoundError('Not Found'));
  }
});

//Get a list of all appointments for a particular doctor
/** GET /[fName]/[lName]- return data about one appt: `{appts: appts}` */

router.get("/:fName/:lName", async function (req, res, next) {

  try {
    const fName = req.params.fName;
    const lName = req.params.lName;
    const appts = await Appointment.showDocAppts(fName, lName);
    if (!appts) throw new NotFoundError()
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});

//Get a list of all appointments for a particular doctor and particular day
/** GET /[fName]/[lName] /[date]- return data about one appt: `{appts: appts}` */

router.get("/:fName/:lName/:date", async function (req, res, next) {
  try {

    const fName = req.params.fName;
    const lName = req.params.lName;
    const date = req.params.date;
    const appts = await Appointment.showDocApptsDate(fName, lName, date);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});

/** DELETE /[id] - delete appt, return `{message: "appt deleted"}` */

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const appt = await Appointment.deleteAppt(id);
    if (!appt) throw new NotFoundError(`No matching appt: ${id}`);
    return res.json({ message: "Appt deleted" });
  } catch (e) {
    return next(new NotFoundError(`No matching appt: ${id}`));
  }
});

/** POST / - create appt from data; return `{appt: appt}` */

router.post("/", async function (req, res, next) {
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

/** PATCH /[id] - update fields in appt; return `{appt: appt}` */

router.patch("/:id", async function (req, res, next) {
  let appt;
  const { date, time } = req.body;
  console.log('update ran')

  const id = req.params.id;
  console.log(date, time, id)
  try {
    appt = await Appointment.updateAppt(date, time, id);
    if (!appt) throw new NotFoundError(`No matching appt: ${id}`)
    return res.json({ appt });
  } catch (e) {
    return next (new NotFoundError(`No matching appt: ${id}`));
  };
});

module.exports = router;
