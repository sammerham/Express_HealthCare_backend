
const express = require("express");
const cors = require("cors");
const app = express();
const { authenticateJWT } = require("./middleware/auth");
app.use(cors());

// useful error class to throw
const { NotFoundError } = require("./ExpressError/expressError");

// process JSON body => req.body
app.use(express.json());

// process traditional form data => req.body
app.use(express.urlencoded({ extended: true }));

//Middleware: Authenticate user.
/**
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
app.use(authenticateJWT);
//!*************IMPORTING ROUTES*****************
//importing routes
const dRoutes = require('./routes/doctors');
const apptRoutes = require('./routes/appointments');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//!******************************

//!*************Middleware for CORS Access-Control-Allow-Origin header *****************

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//!*************Creating ROUTES*****************
app.use('/doctors', dRoutes);
app.use('/appts', apptRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
//!******************************




//** 404 handler: matches unmatched routes; raises NotFoundError.
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

//** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});
// end


module.exports = app;