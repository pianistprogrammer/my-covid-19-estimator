// Covid-19 Estimator
const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;

  // Get factor
  let estimate;
  if (periodType === 'months') {
    estimate = timeToElapse * 30;
  } else if (periodType === 'weeks') {
    estimate = timeToElapse * 7;
  } else {
    estimate = timeToElapse;
  }

  const factor = Math.trunc(estimate / 3);
  const result = 2 ** factor;

  const impact = {};
  const severeImpact = {};

  const getMultiplier = (cases, estimateNum) => cases * estimateNum;

  impact.currentlyInfected = getMultiplier(reportedCases, 10);
  impact.infectionsByRequestedTime = getMultiplier(impact.currentlyInfected, result);

  let severeCases = getMultiplier(impact.infectionsByRequestedTime, 0.15);
  severeCases = Math.trunc(severeCases);

  const casesForICU = getMultiplier(impact.infectionsByRequestedTime, 0.05);

  const casesForVentilators = getMultiplier(impact.infectionsByRequestedTime, 0.02);

  const populationIncome = avgDailyIncomePopulation * avgDailyIncomeInUSD;
  const moneyLoss = (impact.infectionsByRequestedTime * populationIncome) / estimate;

  let hospitalBeds = getMultiplier(totalHospitalBeds, 0.35);
  hospitalBeds = Math.trunc(hospitalBeds - severeCases);

  // All Impacts section
  impact.severeCasesByRequestedTime = severeCases;
  impact.hospitalBedsByRequestedTime = hospitalBeds;
  impact.casesForICUByRequestedTime = Math.trunc(casesForICU);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVentilators);
  impact.dollarsInFlight = Math.trunc(moneyLoss);

  severeImpact.currentlyInfected = getMultiplier(reportedCases, 50);
  severeImpact.infectionsByRequestedTime = getMultiplier(
    severeImpact.currentlyInfected,
    result
  );

  let severeImpactCases = getMultiplier(
    severeImpact.infectionsByRequestedTime,
    0.15
  );
  severeImpactCases = Math.trunc(severeImpactCases);

  const severeCasesForICU = getMultiplier(
    severeImpact.infectionsByRequestedTime,
    0.05
  );

  const severeCasesForVentilators = getMultiplier(
    severeImpact.infectionsByRequestedTime,
    0.02
  );

  const severePopIncome = avgDailyIncomePopulation * avgDailyIncomeInUSD;
  const severeMoneyLoss = (severeImpact.infectionsByRequestedTime * severePopIncome) / estimate;

  let severeImpactHospitalBeds = getMultiplier(totalHospitalBeds, 0.35);
  severeImpactHospitalBeds = Math.trunc(
    severeImpactHospitalBeds - severeImpactCases
  );

  // All severeImpact Section
  severeImpact.severeCasesByRequestedTime = severeImpactCases;
  severeImpact.hospitalBedsByRequestedTime = severeImpactHospitalBeds;
  severeImpact.casesForICUByRequestedTime = Math.trunc(severeCasesForICU);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    severeCasesForVentilators
  );
  severeImpact.dollarsInFlight = Math.trunc(severeMoneyLoss);

  return { data, impact, severeImpact };
};

module.exports = covid19ImpactEstimator;
