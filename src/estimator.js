const estimateCurrentlyInfected = (data) => {
    return {
        data: data,
        impact: {
            currentlyInfected: data.reportedCases * 10
        },
        severeImpact: {
            currentlyInfected: data.reportedCases * 50
        }
    }
};
const estimateProjectedInfections = (data) => {
    const currentlyInfectedEstimate = estimateCurrentlyInfected();
    const { periodType } = data;
    if (periodType === 'days') {
        return {
            data: data,
            impact: {
                infectionsByRequestedTime: currentlyInfectedEstimate.impact.currentlyInfected * Math.floor(Math.pow(2, 0.3))
            },
            severeImpact: {
                infectionsByRequestedTime: currentlyInfectedEstimate.severeImpact.currentlyInfected * Math.floor(Math.pow(2, 0.3))
            }
        }
    }
    else if (periodType === 'weeks') {
        return {
            data: data,
            impact: {
                infectionsByRequestedTime: currentlyInfectedEstimate.impact.currentlyInfected * Math.floor(2 ** 0.3 * 7)
            },
            severeImpact: {
                infectionsByRequestedTime: currentlyInfectedEstimate.severeImpact.currentlyInfected * Math.floor(Math.pow(2, 0.3) * 7)
            }
        }
    }
    else {
        return {
            data: data,
            impact: {
                infectionsByRequestedTime: currentlyInfectedEstimate.impact.currentlyInfected * Math.floor(Math.pow(2, 0.3) * 30)
            },
            severeImpact: {
                infectionsByRequestedTime: currentlyInfectedEstimate.severeImpact.currentlyInfected * Math.floor(Math.pow(2, 0.3) * 30)
            }
        }
    }
};
const estimateSevereCases = (data) => {
    const projectedInfections = estimateProjectedInfections();
    return {
        data: data,
        impact: {
            severeCasesByRequestedTime: projectedInfections.impact.infectionsByRequestedTime * 0.15
        },
        severeImpact: {
            severeCasesByRequestedTime: projectedInfections.severeImpact.infectionsByRequestedTime * 0.15

        }
    }
};
const estimatedBedspaceAvailability = (data) => {
    const availability = estimateSevereCases();
    return {
        data: data,
        impact: {
            hospitalBedsByRequestedTime: 0.35 * data.totalHospitalBeds - availability.impact.severeCasesByRequestedTime
        },
        severeImpact: {
            hospitalBedsByRequestedTime: data.totalHospitalBeds * 512 - availability.impact.severeCasesByRequestedTime
        }
    }
};
const covid19ImpactEstimator = (data) => {
    const estimator = chain(

        //Challenge 1
        estimateCurrentlyInfected,
        estimateProjectedInfections,

        // Challenge 2
        estimateSevereCases,
        estimatedBedspaceAvailability
    )
    return estimator({
        data: {},
        impact: {},
        severeImpact: {}
    });
};
export default covid19ImpactEstimator;
