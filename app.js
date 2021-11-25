/** Simple Hello Word Express app. */

const express = require("express");
const app = express();

// useful error class to throw
const { NotFoundError } = require("./expressError");

// process JSON body => req.body
app.use(express.json());

// process traditional form data => req.body
app.use(express.urlencoded({ extended: true }));



//!*************IMPORTING ROUTES*****************
//importing doctors routes
const dRoutes = require('./routes/doctors');
const apptRoutes = require('./routes/appoinments');
//!******************************

//!*************Creating ROUTES*****************

app.use('/doctors', dRoutes);
app.use('/appts', apptRoutes);
//!******************************




/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});
// end


module.exports = app;