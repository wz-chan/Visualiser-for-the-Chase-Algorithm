import { chaseProjectedDependencies } from './chaseProjectedDependencies.js';
import { chaseEntailmentFDWithDistinguishedVariables, chaseEntailmentMVD } from './chaseEntailment.js';
import { 
        isFD, 
        isMVD,
        prettyPrintC
} from './helpers.js';

const TYPE_SIMPLE_CHASE = 1;

export function chaseDP(relation, C, relationSchemes) {
        // for each relationScheme find the projected dependencies
        // put all the projected dependencies in a list
        // loop through dependencies in C and see if they are entailed by the projected dependencies
        // if any one of them is not entailed, return false
        // if all of them are entailed, return true
        let steps = [];
        
        let projectedDependencies = [];
        for (let i = 0; i < relationSchemes.length; i++) {
                let result = chaseProjectedDependencies(relation, C, relationSchemes[i], TYPE_SIMPLE_CHASE);

                projectedDependencies.push(result.result);

                steps.push({
                        description: `Find projected dependencies for ${relationSchemes[i]}`,
                        result: result.result,
                });
        }

        // for each dependency in C, loop through the projected dependencies and see if it is entailed. If any one of them is not entailed, return false
        for (let i = 0; i < C.length; i++) {
                let isEntailed = false;
                for (let j = 0; j < projectedDependencies.length; j++) {
                        let currentProjectedDependencies = projectedDependencies[j];

                        if (isMVD(C[i])) {
                                let result = chaseEntailmentMVD(relation, currentProjectedDependencies, C[i]);

                                if (result.result) {
                                        steps.push({
                                                description: `MVD ${C[i].lhs} ->> ${C[i].rhs} is entailed by the projected dependencies ${prettyPrintC(currentProjectedDependencies)}`,
                                                result: true,
                                        });
                                        isEntailed = true;
                                        break;
                                }

                        } else if (isFD(C[i])) {
                                let result = chaseEntailmentFDWithDistinguishedVariables(relation, currentProjectedDependencies, C[i]);
                                if (result.result) {
                                        // add descript 'FD A -> B is entailed by projected dependecies prettyPrintC()
                                        steps.push({
                                                description: `FD ${C[i].lhs} -> ${C[i].rhs} is entailed by the projected dependencies ${prettyPrintC(currentProjectedDependencies)}`,
                                                result: true,
                                        });
                                        isEntailed = true;
                                        break;
                                }
                        }                 

                }

                if (!isEntailed) {
                        steps.push({
                                description: isFD(C[i]) ? `FD ${C[i].lhs} -> ${C[i].rhs} is not entailed by the projected dependencies` : `MVD ${C[i].lhs} ->> ${C[i].rhs} is not entailed by the projected dependencies`, 
                                result: false,
                        });

                        return {
                                steps,
                                result: false,
                        };

                }

        }


        steps.push({
                description: `Check if all FDs and MVDs are entailed by the projected dependencies`,
                result: true,
        });

        return {
                steps,
                result: true,
        };
}
