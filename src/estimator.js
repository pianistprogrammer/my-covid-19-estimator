export const input = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};
const estimateCurrentlyInfected = (data = input) => {
  this.data = data;
  this.impact.currentlyInfected = data.data.reportedCases * 10;
  this.severeImpact.currentlyInfected = data.reportedCases * 50;
};
const estimateProjectedInfections = (data = input) => {
  const estimate = estimateCurrentlyInfected();
  const estimatedImpact = estimate.impact.currentlyInfected;
  const severeEstimatedImpact = estimate.severeImpact.currentlyInfected;
  const { periodType } = data;
  if (periodType === 'days') {
    return {
      data: input,
      impact: {
        infectionsByRequestedTime: estimatedImpact * Math.floor(2 ** 0.3)
      },
      severeImpact: {
        infectionsByRequestedTime: severeEstimatedImpact * Math.floor(2 ** 0.3)
      }
    };
  }
  if (periodType === 'weeks') {
    return {
      data: input,
      impact: {
        infectionsByRequestedTime: estimatedImpact * Math.floor((2 ** 0.3) * 7)
      },
      severeImpact: {
        infectionsByRequestedTime: severeEstimatedImpact * Math.floor((2 ** 0.3) * 7)
      }
    };
  }
  return {
    data: input,
    impact: {
      infectionsByRequestedTime: estimatedImpact * Math.floor((2 ** 0.3) * 30)
    },
    severeImpact: {
      infectionsByRequestedTime: severeEstimatedImpact * Math.floor((2 ** 0.3) * 30)
    }
  };
};
const estimateSevereCases = (data = input) => {
  const projectedInfections = estimateProjectedInfections();
  return {
    data,
    impact: {
      severeCasesByRequestedTime: projectedInfections.impact.infectionsByRequestedTime * 0.15
    },
    severeImpact: {
      severeCasesByRequestedTime: projectedInfections.severeImpact.infectionsByRequestedTime * 0.15

    }
  };
};
const estimatedBedspaceAvailability = (data = input) => {
  const avail = estimateSevereCases();
  const bedImpact = avail.impact.severeCasesByRequestedTime;
  const bedSevereImpact = avail.severeImpact.severeCasesByRequestedTime;
  return {
    data,
    impact: {
      hospitalBedsByRequestedTime: 0.35 * data.totalHospitalBeds - bedImpact
    },
    severeImpact: {
      hospitalBedsByRequestedTime: data.totalHospitalBeds * 512 - bedSevereImpact
    }
  };
};
const covid19ImpactEstimator = (data) => {
  // challenge one
  estimateCurrentlyInfected(data);
  estimateProjectedInfections(data);

  // Challenge two
  estimateSevereCases(data);
  estimatedBedspaceAvailability(data);
};
export default covid19ImpactEstimator;
