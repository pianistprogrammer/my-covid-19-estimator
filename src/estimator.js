const estimateCurrentlyInfected = (data) => {
    this.data = data;
    this.impact.currentlyInfected = data.data.reportedCases * 10;
    this.severeImpact.currentlyInfected = data.reportedCases * 50;
};
const estimateProjectedInfections = (data) => {
    const estimate = estimateCurrentlyInfected();
    const estimatedImpact = estimate.impact.currentlyInfected;
    const severeEstimatedImpact = estimate.severeImpact.currentlyInfected;
    const { periodType } = data;
    if (periodType === 'days') {
        return {
            data: data,
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
            data: data,
            impact: {
                infectionsByRequestedTime: estimatedImpact * Math.floor((2 ** 0.3) * 7)
            },
            severeImpact: {
                infectionsByRequestedTime: severeEstimatedImpact * Math.floor((2 ** 0.3) * 7)
            }
        };
    }
    return {
        data: data,
        impact: {
            infectionsByRequestedTime: estimatedImpact * Math.floor((2 ** 0.3) * 30)
        },
        severeImpact: {
            infectionsByRequestedTime: severeEstimatedImpact * Math.floor((2 ** 0.3) * 30)
        }
    };
};
const estimateSevereCases = (data) => {
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
const estimatedBedspaceAvailability = (data) => {
    const avail = estimateSevereCases();
    const bedImpact = avail.impact.severeCasesByRequestedTime;
    const bedSevereImpact = avail.severeImpact.severeCasesByRequestedTime;
    return {
        data: data,
        impact: {
            hospitalBedsByRequestedTime: 0.35 * data.totalHospitalBeds - bedImpact
        },
        severeImpact: {
            hospitalBedsByRequestedTime: data.totalHospitalBeds * 512 - bedSevereImpact
        }
    };
};
const covid19ImpactEstimator = (data) => {
    const estimator = chain(

        // Challenge 1
        estimateCurrentlyInfected,
        estimateProjectedInfections,

        // Challenge 2
        estimateSevereCases,
        estimatedBedspaceAvailability
    );
    return estimator({
        data: {},
        impact: {},
        severeImpact: {}
    });
};
export default covid19ImpactEstimator;
