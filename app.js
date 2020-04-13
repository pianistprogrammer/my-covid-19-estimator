const express = require('express');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audit.log');

const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

const estimatorRoutes = require('./src/backend/estimator');

app.use(
  morgan(':method :url    :status  :response-time ms', {
    stream: fs.createWriteStream(filePath, {
      flags: 'a'
    })
  })
);
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes to handle requests
app.use('/api/v1/on-covid-19', estimatorRoutes);

// Error Handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
/* eslint-disable no-unused-vars */
module.exports = app;
