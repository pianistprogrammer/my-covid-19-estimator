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
const estimateCurrentlyInfected = (data = input) => ({
  data: input,
  impact: {
    currentlyInfected: data.reportedCases * 10
  },
  severeImpact: {
    currentlyInfected: data.reportedCases * 50
  }
});
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
const estimateSevereCases = () => {
  const projectedInfections = estimateProjectedInfections();
  return {
    data: input,
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
const estimateCasesForICU = () => {
  const icuCases = estimateCurrentlyInfected();
  const icuImpact = icuCases.impact.infectionsByRequestedTime;
  const icuSevereImpact = icuCases.severeImpact.infectionsByRequestedTime;
  return {
    data: input,
    impact: {
      casesForICUByRequestedTime: 0.05 * icuImpact
    },
    severeImpact: {
      casesForICUByRequestedTime: 0.05 * icuSevereImpact
    }
  };
};
const estimateCasesForVentilators = () => {
  const ventilatorsCases = estimateProjectedInfections();
  const ventilatorImpact = ventilatorsCases.impact.infectionsByRequestedTime;
  const ventilatorSevereImpact = ventilatorsCases.severeImpact.infectionsByRequestedTime;
  return {
    data: input,
    impact: {
      casesForICUByRequestedTime: 0.02 * ventilatorImpact
    },
    severeImpact: {
      casesForICUByRequestedTime: 0.02 * ventilatorSevereImpact
    }
  };
};
const estimateDollarsInFlight = (data = input) => {
  const estimateInfectionPerTime = estimateProjectedInfections();
  const dollarsInFlightImpact = estimateInfectionPerTime.impact.infectionsByRequestedTime;
  const dollarsInFlightSevereImpact = estimateInfectionPerTime.impact.infectionsByRequestedTime;
  const avgIncome = data.region.avgDailyIncomePopulation;
  const avgIncomeDollar = data.region.avgDailyIncomeInUSD;
  const avgIncomePercentage = (avgIncome / data.population) * 100;
  const { periodType } = data;
  if (periodType === 'days') {
    return {
      data: input,
      impact: {
        dollarsInFlight: dollarsInFlightImpact * avgIncomePercentage * avgIncomeDollar
      },
      severeImpact: {
        dollarsInFlight: dollarsInFlightSevereImpact * avgIncomePercentage * avgIncomeDollar
      }
    };
  }
  if (periodType === 'weeks') {
    return {
      data: input,
      impact: {
        dollarsInFlight: dollarsInFlightImpact * avgIncomePercentage * avgIncomeDollar * 7
      },
      severeImpact: {
        dollarsInFlight: dollarsInFlightSevereImpact * avgIncomePercentage * avgIncomeDollar * 7
      }
    };
  }
  return {
    data: input,
    impact: {
      dollarsInFlight: dollarsInFlightImpact * avgIncomePercentage * avgIncomeDollar * 30
    },
    severeImpact: {
      dollarsInFlight: dollarsInFlightSevereImpact * avgIncomePercentage * avgIncomeDollar * 30
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

  // Challenge three
  estimateCasesForICU();
  estimateCasesForVentilators();
  estimateDollarsInFlight(data);
};
export default covid19ImpactEstimator;
