import { 
        setupTableauForChasingFDWithSimpleChase, 
        setupTableauForChasingMVD,
        setupTableauForChasingFDWithDistinguishedVariables,
} from './setupTableau.js';

import { 
        convertMVDsToJDs, 
        isFD, 
        isJD, 
        prettyPrintJD, 
        snapshotOfTableau, 
        convertMVDToFragments,
        doesTableauHaveARowOfDistinguishedVariables,
        checkIfTableauChanged,
} from './helpers.js';

import { fRule } from './fRule.js';

import { jRule } from './jRule.js';

import { chaseLosslessDecomposition } from './chaseLosslessDecomposition.js';

export function chaseEntailmentSimpleChaseFD(relation, C, FD) {
        // step 1: setup the tableau for the relation based on the FD
        let tableau = setupTableauForChasingFDWithSimpleChase(relation, FD);
        let steps = [];
        steps.push({
                description: `Setup tableau to test if FD ${FD.lhs} -> ${FD.rhs} is implied. Chase FD with simple chase.`,
                tableau: snapshotOfTableau(tableau),
        });
        
        let processedC = convertMVDsToJDs(relation, C);

        let tableauChanged = true;
        let iterations = 0;

        while (tableauChanged) {
                tableauChanged = false;
 
                // step 2: loop through C and apply F-rule for each FD in C
                for (let i = 0; i < processedC.length; i++) {
                        let currentDependency = processedC[i];
                        if (isFD(currentDependency)) {
                                let initialTableau = snapshotOfTableau(tableau);
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
                                let initialTableau = snapshotOfTableau(tableau);
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

                iterations++;

                steps.push({
                        description: `Tableau after iteration ${iterations}`,
                        tableau: snapshotOfTableau(tableau),
                });

        }
        
        let result = checkSimpleChaseResult(tableau, FD);

        // step 3: return the tableau
        return {
                result,
                steps,
                finalTableau: snapshotOfTableau(tableau),
        };
}

export function chaseEntailmentFDWithDistinguishedVariables(relation, C, FD) {
        let tableau = setupTableauForChasingFDWithDistinguishedVariables(relation, FD);
        let steps = [];
        console.log('entailment', relation, C, FD);
        steps.push({
                description: `Setup tableau to test if FD ${FD.lhs} -> ${FD.rhs} is implied. Chase FD with distinguished variables.`,
                tableau: snapshotOfTableau(tableau),
        });

        let processedC = convertMVDsToJDs(relation, C);

        let tableauChanged = true;
        let iterations = 0;

        while (tableauChanged) {
                tableauChanged = false;

                for (let i = 0; i < processedC.length; i++) {
                        let currentDependency = processedC[i];
                        if (isFD(currentDependency)) {
                                let initialTableau = snapshotOfTableau(tableau);
                                tableau = fRule(tableau, currentDependency);

                                if (checkIfTableauChanged(initialTableau, tableau)) {
                                        steps.push({
                                                description: `Apply F-rule to ${currentDependency.lhs} -> ${currentDependency.rhs}`,
                                                tableau: snapshotOfTableau(tableau),
                                        });
                                        tableauChanged = true;
                                        continue;
                                }
                        }

                        if (isJD(currentDependency)) {
                                let initialTableau = snapshotOfTableau(tableau);
                                tableau = jRule(tableau, currentDependency);

                                if (checkIfTableauChanged(initialTableau, tableau)) { 
                                        steps.push({
                                                description: `Apply J-rule to ${prettyPrintJD(currentDependency)}`,
                                                tableau: snapshotOfTableau(tableau),
                                        });
                                        tableauChanged = true;
                                        continue;
                                }       
                        }
                }
                
                iterations++;

                steps.push({
                        description: `Tableau after iteration ${iterations}`,
                        tableau: snapshotOfTableau(tableau),
                });

        }

        let result = doesTableauHaveRelevantColumnOfDistinguishedVariables(tableau, FD);

        return {
                result,
                steps,
                finalTableau: snapshotOfTableau(tableau),
        };
}

export function chaseEntailmentMVD(relation, C, MVD) {
        // step 1: setup the tableau for the relation based on the MVD
        let tableau = setupTableauForChasingMVD(relation, MVD);

        let processedC = convertMVDsToJDs(relation, C);
        
        let relationSchemes = convertMVDToFragments(relation, MVD);

        return chaseLosslessDecomposition(relation, processedC, relationSchemes);
}

function doesTableauHaveRelevantColumnOfDistinguishedVariables(tableau, FD) {
        let relevantColumnIndexes = [];
        for (let i = 0; i < FD.rhs.length; i++) {
                relevantColumnIndexes.push(tableau.columns.indexOf(FD.rhs[i]));
        }


        for (let i = 0; i < tableau.rows.length; i++) {
                let currentRow = tableau.rows[i];
                for (let j = 0; j < relevantColumnIndexes.length; j++) {
                        // if return false if the value is of the form b1, b2, b3, etc.
                        if (currentRow[relevantColumnIndexes[j]].includes('b')) {
                                return false;
                        }
                }
        }

        return true;
}

function checkSimpleChaseResult(tableau, FD) {
        // tableau has columns and rows
        // FD has lhs, rhs and mvd set to false

        // loop through the tableau.rows and find the rows which have the columns in FD.lhs values in common
        let rowsToCheck = [];
        
        for (let i = 0; i < tableau.rows.length; i++) {
                let indexesToCheck = [];
                let currentRow = tableau.rows[i];

                for (let j = 0; j < FD.lhs.length; j++) {
                        indexesToCheck.push(tableau.columns.indexOf(FD.lhs[j]));
                }

                // store the values stored in the indexesToCheck columns of the current row
                let currentRowValues = [];
                for (let j = 0; j < indexesToCheck.length; j++) {
                        currentRowValues.push(tableau.rows[i][indexesToCheck[j]]);
                }

                // print out current row
                // console.log('current row: ', tableau.rows[i]);

                // for each row in the tableau (except this row), check if the values in the indexesToCheck columns match the values in the currentRowValues array
                // if they do, update the values in the rhs columns 
                for (let j = 0; j < tableau.rows.length; j++) {
                        // if this is the current row, skip it
                        let checkingRow = tableau.rows[j];

                        if (i === j) {
                                continue;
                        }

                        let relevantValues = [];

                        for (let k = 0; k < indexesToCheck.length; k++) {
                                relevantValues.push(checkingRow[indexesToCheck[k]]);
                        }

                        // console.log('relevant values: ', relevantValues);

                        if (JSON.stringify(relevantValues) === JSON.stringify(currentRowValues)) {
                                // check if rowsToCheck already contains this pair of rows
                                let alreadyExists = false;

                                for (let k = 0; k < rowsToCheck.length; k++) {
                                        if (JSON.stringify(rowsToCheck[k]) === JSON.stringify([currentRow, checkingRow])) {
                                                alreadyExists = true;
                                                break;
                                        }

                                        if (JSON.stringify(rowsToCheck[k]) === JSON.stringify([checkingRow, currentRow])) {
                                                alreadyExists = true;
                                                break;
                                        }
                                }

                                if (alreadyExists) {
                                        continue;
                                }

                                rowsToCheck.push([currentRow, checkingRow]);
                        }

                }
        }

        // for each pair of rows, check if the values in the index of the FD.rhs columns match 
        // if they do, return true
        // if they don't, return false
        
        for (let i = 0; i < rowsToCheck.length; i++) {
                let indexesToCheck = [];
                
                for (let j = 0; j < FD.rhs.length; j++) {
                        indexesToCheck.push(tableau.columns.indexOf(FD.rhs[j]));
                }

                for (let j = 0; j < indexesToCheck.length; j++) {
                        if (rowsToCheck[i][0][indexesToCheck[j]] !== rowsToCheck[i][1][indexesToCheck[j]]) {
                                return false;
                        }
                }

        }

        return true;
}
