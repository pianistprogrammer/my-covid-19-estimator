const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');


const filePath = path.join(__dirname, 'audit.log');
const accessLogStream = fs.createWriteStream(filePath, { flags: 'a' });

const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

const estimatorRoutes = require('./src/backend/estimator');

app.use(helmet());
const logger = morgan(
  (tokens, req, res) => {
    let responseTime = Math.ceil(tokens['response-time'](req, res))
      .toString()
      .padStart(2, 0);
    responseTime = `${responseTime}ms`;
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      responseTime
    ].join(' ');
  },
  {
    stream: accessLogStream,
    skip: (_, res) => res.statusCode === 404
  }
);
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
