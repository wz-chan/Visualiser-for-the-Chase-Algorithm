import { 
        convertMVDsToJDs,
        isFD,
        isMVD,
} from './helpers.js';

import { 
        chaseEntailmentFDWithDistinguishedVariables,
        chaseEntailmentMVD,
} from './chaseEntailment.js';

// Given a relation and a candidate for minimal cover C, return if this is a minimal cover or not.
export function chaseMinCover(relation, C) {
        // for every FD or MVD in C, see if its entailed by C - {FD or MVD}. If we find one that is entailed, then C is not a minimal cover so return false
        // else return true
        let overallSteps = [];

        for (let i = 0; i < C.length; i++) {
                let dependency = C[i];
                let CWithoutDependency = [...C];
                CWithoutDependency.splice(i, 1);

                if (isFD(dependency)) {
                        let { result: dependencyIsEntailed, steps } = chaseEntailmentFDWithDistinguishedVariables(relation, CWithoutDependency, dependency);
                        
                        console.log('FD steps', steps);

                        overallSteps = [...overallSteps, ...steps];

                        if (dependencyIsEntailed) {
                                return {
                                        result: false,
                                        steps: overallSteps,
                                        finalTableau: {
                                                columns: [],
                                                rows: [],
                                        },
                                };
                        }
                }

                if (isMVD(dependency)) {
                        let { result: dependencyIsEntailed, steps } = chaseEntailmentMVD(relation, CWithoutDependency, dependency);

                        console.log('MVD steps', steps);

                        overallSteps = [...overallSteps, ...steps];

                        if (dependencyIsEntailed) {
                                return {
                                        result: false,
                                        steps: overallSteps,
                                        finalTableau: {
                                                columns: [],
                                                rows: [],
                                        },
                                };
                        }
                }
        }

        return {
                result: true,
                steps: overallSteps,
                finalTableau: {
                        columns: [],
                        rows: [],
                },
        };
}
