import { setupTableauForRelationSchemes } from './setupTableau.js';

import { 
        convertMVDsToJDs, 
        isFD, 
        isJD, 
        prettyPrintJD, 
        snapshotOfTableau, 
        checkIfTableauChanged,
        doesTableauHaveARowOfDistinguishedVariables,
} from './helpers.js';

import { fRule } from './fRule.js';
import { jRule } from './jRule.js';

export function chaseLosslessDecomposition(relation, C, relationSchemes) {
        let steps = [];
        // step 1: setup the tableau for the relationSchemes based on the relation
        let tableau = setupTableauForRelationSchemes(relation, relationSchemes);
        // create a JD from the relationSchemes
        let JD = {
                relationSchemes,
        };

        steps.push({
                description: `Setup tableau to test if join dependency ${prettyPrintJD(JD)} is implied`,
                tableau: snapshotOfTableau(tableau),
        });

        let processedC = convertMVDsToJDs(relation, C);
        
        // step 2: loop through the dependencies and apply F-rule for FDs and J-rule for JDs. Repeat until no changes are made to the tableau.

        let iterations = 0;
        let tableauChanged = true;
        while (tableauChanged && iterations < 7) {
                tableauChanged = false;

                for (let i = 0; i < processedC.length; i++) {
                        let currentDependency = processedC[i];
                        let initialTableau = snapshotOfTableau(tableau);

                        if (isFD(currentDependency)) {
                                tableau = fRule(tableau, currentDependency);
                                if (checkIfTableauChanged(initialTableau, tableau)) {
                                        tableauChanged = true;
                                        steps.push({
                                                description: `Apply F-rule to ${currentDependency.lhs} -> ${currentDependency.rhs}`,
                                                tableau: snapshotOfTableau(tableau),
                                        });
                                        continue;
                                }

                        }

                        if (isJD(currentDependency)) {
                                tableau = jRule(tableau, currentDependency);
                                if (checkIfTableauChanged(initialTableau, tableau)) {
                                        tableauChanged = true;
                                        steps.push({
                                                description: `Apply J-rule to ${prettyPrintJD(currentDependency)}`,
                                                tableau: snapshotOfTableau(tableau),
                                        });
                                        continue;
                                }
                        }

                }

                steps.push({
                        description: `Tableau after iteration ${iterations}`,
                        tableau: snapshotOfTableau(tableau),
                });

                iterations++;
        }


        // step 4: return the tableau
        
        // return { isLossless: true, steps: [], finalTableau: tableau };
        let isLossless = doesTableauHaveARowOfDistinguishedVariables(tableau);

        return {
                result: isLossless,
                steps,
                finalTableau: tableau,
        };
}
