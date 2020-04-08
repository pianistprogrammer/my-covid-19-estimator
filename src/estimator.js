const covid19ImpactEstimator = (data) => {

    let estimateCurrentlyInfected = (data) => {
        return {
            data: data.reportedCases,
            impact: {
                currentlyInfected: reportedCases * 10
            },
            severeImpact: {
                currentlyInfected: reportedCases * 50
            }
        }
    }
    let estimateProjectedInfections = (data) => {
        const currentlyInfectedEstimate = estimateCurrentlyInfected();
        const periodType = data.periodType;
        if (periodType == 'days') {
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
        else if (periodType == 'weeks') {
            return {
                data: data,
                impact: {
                    infectionsByRequestedTime: currentlyInfectedEstimate.impact.currentlyInfected * Math.floor(Math.pow(2, 0.3) * 7)
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
    }
    let estimateSevereCases = (data) => {

        const projectedInfections = estimateProjectedInfections();
        return {
            data: data,
            impact: {
                severeCasesByRequestedTime: projectedInfections.impact.infectionsByRequestedTime * 0.15,
                hospitalBedsByRequestedTime: 0.35 * data.totalHospitalBeds - severeCasesByRequestedTime
            },
            severeImpact: {
                severeCasesByRequestedTime: projectedInfections.severeImpact.infectionsByRequestedTime * 0.15,
                hospitalBedsByRequestedTime: data.totalHospitalBeds * 512 - severeCasesByRequestedTime
            }
        }
    }
};

export default covid19ImpactEstimator;
