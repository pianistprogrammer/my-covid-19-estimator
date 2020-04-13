const express = require('express');
const fs = require('fs');

const router = express.Router();
const estimator = require('../estimator');

const checkParameter = (res, parameter) => {
  if (parameter === 'json') {
    return res.setHeader('Content-Type', 'application/json');
  }
  if (parameter === 'xml') {
    return res.setHeader('Content-Type', 'application/xml');
  }

  throw new Error('Please cross-check your url, Something is wrong !');
};

const getEstimate = (req) => {
  const inputData = {
    region: {
      name: req.body.region.name,
      avgAge: req.body.region.avgAge,
      avgDailyIncomeInUSD: req.body.region.avgDailyIncomeInUSD,
      avgDailyIncomePopulation: req.body.region.avgDailyIncomePopulation
    },
    periodType: req.body.periodType,
    timeToElapse: req.body.timeToElapse,
    reportedCases: req.body.reportedCases,
    population: req.body.population,
    totalHospitalBeds: req.body.totalHospitalBeds
  };

  return estimator(inputData);
};

router.post('/', (req, res) => {
  const result = getEstimate(req);
  const { data, impact, severeImpact } = result;

  res.status(200).json({
    data,
    impact,
    severeImpact
  });
});

router.post('/:optional', (req, res) => {
  const urlParam = req.params.optional;

  checkParameter(res, urlParam);

  const result = getEstimate(req);
  const { data, impact, severeImpact } = result;

  res.status(200).json({
    data,
    impact,
    severeImpact
  });
});

router.get('/logs', (req, res) => {
  res.setHeader('Content-Type', 'application/text');

  fs.readFile('./logs.txt', (err, data) => {
    if (err) {
      res.send(err);
      return;
    }
    res.status(200).send(data);
  });
});

module.exports = router;
