const input = {
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
const estimateCurrentlyInfected = (data) => ({
  data,
  impact: {
    currentlyInfected: data.reportedCases * 10
  },
  severeImpact: {
    currentlyInfected: data.reportedCases * 50
  }
});
const estimateProjectedInfections = (data) => {
  const estimate = estimateCurrentlyInfected(data);
  const estimatedImpact = estimate.impact.currentlyInfected;
  const severeEstimatedImpact = estimate.severeImpact.currentlyInfected;
  const { periodType } = data;
  switch (periodType) {
    case 'days':
      return {
        data,
        impact: {
          infectionsByRequestedTime: estimatedImpact * Math.floor(2 ** (1.0 / 3))
        },
        severeImpact: {
          infectionsByRequestedTime: severeEstimatedImpact * Math.floor(2 ** (1.0 / 3))
        }
      };
    case 'weeks':
      return {
        data,
        impact: {
          infectionsByRequestedTime: estimatedImpact * Math.floor(2 ** (7.0 / 3))
        },
        severeImpact: {
          infectionsByRequestedTime: severeEstimatedImpact * Math.floor(2 ** (7.0 / 3))
        }
      };
    default:
      return {
        data,
        impact: {
          infectionsByRequestedTime: estimatedImpact * Math.floor(2 ** (30.0 / 3))
        },
        severeImpact: {
          infectionsByRequestedTime: severeEstimatedImpact * Math.floor(2 ** (3.0 / 3))
        }
      };
  }

  // if (periodType === 'days') {
  //   return {
  //     data: input,
  //     impact: {
  //       infectionsByRequestedTime: estimatedImpact * Math.floor(2 ** 0.3)
  //     },
  //     severeImpact: {
  //       infectionsByRequestedTime: severeEstimatedImpact * Math.floor(2 ** 0.3)
  //     }
  //   };
  // }
  // if (periodType === 'weeks') {
  //   return {
  //     data: input,
  //     impact: {
  //       infectionsByRequestedTime: estimatedImpact * Math.floor((2 ** 0.3) * 7)
  //     },
  //     severeImpact: {
  //       infectionsByRequestedTime: severeEstimatedImpact * Math.floor((2 ** 0.3) * 7)
  //     }
  //   };
  // }
  // return {
  //   data: input,
  //   impact: {
  //     infectionsByRequestedTime: estimatedImpact * Math.floor((2 ** 0.3) * 30)
  //   },
  //   severeImpact: {
  //     infectionsByRequestedTime: severeEstimatedImpact * Math.floor((2 ** 0.3) * 30)
  //   }
  // };
};
const estimateSevereCases = (data) => {
  const projectedInfections = estimateProjectedInfections(data);
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
const estimatedBedspaceAvailability = (data) => {
  const avail = estimateSevereCases(data);
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
const estimateCasesForICU = (data) => {
  const icuCases = estimateCurrentlyInfected(data);
  const icuImpact = icuCases.impact.infectionsByRequestedTime;
  const icuSevereImpact = icuCases.severeImpact.infectionsByRequestedTime;
  return {
    data,
    impact: {
      casesForICUByRequestedTime: 0.05 * icuImpact
    },
    severeImpact: {
      casesForICUByRequestedTime: 0.05 * icuSevereImpact
    }
  };
};
const estimateCasesForVentilators = (data) => {
  const ventilatorsCases = estimateProjectedInfections(data);
  const ventilatorImpact = ventilatorsCases.impact.infectionsByRequestedTime;
  const ventilatorSevereImpact = ventilatorsCases.severeImpact.infectionsByRequestedTime;
  return {
    data,
    impact: {
      casesForICUByRequestedTime: 0.02 * ventilatorImpact
    },
    severeImpact: {
      casesForICUByRequestedTime: 0.02 * ventilatorSevereImpact
    }
  };
};
const estimateDollarsInFlight = (data) => {
  const estimateInfectionPerTime = estimateProjectedInfections(data);
  const dollarsInFlightImpact = estimateInfectionPerTime.impact.infectionsByRequestedTime;
  const dollarsInFlightSevereImpact = estimateInfectionPerTime.impact.infectionsByRequestedTime;
  const avgIncome = data.region.avgDailyIncomePopulation;
  const avgIncomeDollar = data.region.avgDailyIncomeInUSD;
  const avgIncomePercentage = (avgIncome / data.population) * 100;
  const { periodType } = data;
  if (periodType === 'days') {
    return {
      data,
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
      data,
      impact: {
        dollarsInFlight: dollarsInFlightImpact * avgIncomePercentage * avgIncomeDollar * 7
      },
      severeImpact: {
        dollarsInFlight: dollarsInFlightSevereImpact * avgIncomePercentage * avgIncomeDollar * 7
      }
    };
  }
  return {
    data,
    impact: {
      dollarsInFlight: dollarsInFlightImpact * avgIncomePercentage * avgIncomeDollar * 30
    },
    severeImpact: {
      dollarsInFlight: dollarsInFlightSevereImpact * avgIncomePercentage * avgIncomeDollar * 30
    }
  };
};
const covid19ImpactEstimator = function () {
// challenge one
  this.estimateCurrentlyInfected = estimateCurrentlyInfected;
  this.estimateProjectedInfections = estimateProjectedInfections;

  // // Challenge two
  this.estimateSevereCases = estimateSevereCases;
  this.estimatedBedspaceAvailability = estimatedBedspaceAvailability;

  // // Challenge three
  this.estimateCasesForICU = estimateCasesForICU;
  this.estimateCasesForVentilators = estimateCasesForVentilators;
  this.estimateDollarsInFlight = estimateDollarsInFlight;
};
module.exports = covid19ImpactEstimator;



// const estimator = new covid19ImpactEstimator();

// console.log(estimator);
