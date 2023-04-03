import { isTableauFormattedCorrectly, isFDFormattedCorrectly } from './helpers.js';

export function fRule(tableau, FD) {
        console.log('fRule called', tableau, FD);
       // check that the tableau is in the correct format, throw an error if not
        if (! isTableauFormattedCorrectly(tableau)) {
                throw new Error('Tableau is not in the correct format');
        }


        if (! isFDFormattedCorrectly(FD)) {
                throw new Error('FD is not in the correct format');
        } 

        
        // for each row in the tableau, find the rows that have the same value as this row in the desired column
                // for the rows that match, update the values of the rhs columns.
                        // For each pair of rows, set the values of the columns to the value returned by the updateValues function

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
                                // console.log('found a match');
                                // // print out the row that matches 
                                // console.log('matching row: ', tableau.rows[j]);

                                // update the values in the rhs columns
                                for (let k = 0; k < FD.rhs.length; k++) {
                                        let rhsColumnIndex = tableau.columns.indexOf(FD.rhs[k]);

                                        // if the values in the rhs columns are the same, skip this column
                                        if (tableau.rows[i][rhsColumnIndex] === tableau.rows[j][rhsColumnIndex]) {
                                                continue;
                                        }

                                        let newValue = updateValues(tableau.rows[i][rhsColumnIndex], tableau.rows[j][rhsColumnIndex]);
                                        let changedValue = newValue === tableau.rows[i][rhsColumnIndex] ? tableau.rows[j][rhsColumnIndex] : tableau.rows[i][rhsColumnIndex];

                                        // create a new current row and a new checking row
                                        let newCurrentRow = tableau.rows[i];
                                        let newCheckingRow = tableau.rows[j];

                                        // update the values in the new rows
                                        newCurrentRow[rhsColumnIndex] = newValue;
                                        newCheckingRow[rhsColumnIndex] = newValue;

                                        // create an updated tableau
                                        let updatedTableau = {
                                                columns: tableau.columns,
                                                rows: []
                                        };

                                        // add the rows to the updated tableau
                                        for (let l = 0; l < tableau.rows.length; l++) {
                                                if (l === i) {
                                                        updatedTableau.rows.push(newCurrentRow);
                                                } else if (l === j) {
                                                        updatedTableau.rows.push(newCheckingRow);
                                                } else {
                                                        updatedTableau.rows.push(tableau.rows[l]);
                                                }
                                        }

                                        // print out the updated tableau
                                        // console.log('updated tableau: ', updatedTableau);

                                        // set the tableau to the updated tableau
                                        tableau = updateTableauWithNewValue(updatedTableau, changedValue, newValue);
                                }
                        }
                }
        }
        
        return removeDuplicateRows(tableau);
}

function updateTableauWithNewValue(tableau, oldValue, newValue) {

        let newTableau = {
                columns: tableau.columns,
                rows: []
        };

        // for each row in the tableau, update the value and add it to the new tableau
        for (let i = 0; i < tableau.rows.length; i++) {
                let newRow = tableau.rows[i];

                for (let j = 0; j < newRow.length; j++) {
                        if (newRow[j] === oldValue) {
                                newRow[j] = newValue;
                        }
                }

                newTableau.rows.push(newRow);
        }
        
        return newTableau;
}

function removeDuplicateRows(tableau) {
        // create a new tableau without duplicate rows and return it
        let newTableau = {
                columns: tableau.columns,
                rows: []
        };

        // add the first row to the new tableau
        newTableau.rows.push(tableau.rows[0]);

        // for each row in the tableau, check if it is already in the new tableau
        // if it is not, add it to the new tableau
        // if it is, skip it
        for (let i = 1; i < tableau.rows.length; i++) {
                let rowToAdd = tableau.rows[i];
                let rowAlreadyExists = false;

                for (let j = 0; j < newTableau.rows.length; j++) {
                        if (JSON.stringify(rowToAdd) === JSON.stringify(newTableau.rows[j])) {
                                rowAlreadyExists = true;
                        }
                }

                if (! rowAlreadyExists) {
                        newTableau.rows.push(rowToAdd);
                }
        }

        return newTableau;
}


function updateValues(valueOne, valueTwo) {
        // distinguished variables: a with subscript, e.g. a1, a2, a3, ...
        // non-distinguished variables: b with subscript, e.g. b1, b2, b3, ...

        // if both valueOne and valueTwo are distiguished variables, return the distinguished variable that has the lowest subscript
        
        let isValueOneDistiguished = valueOne[0] === 'a';
        let isValueTwoDistiguished = valueTwo[0] === 'a';
        let areBothDistiguished = isValueOneDistiguished && isValueTwoDistiguished;
        let areBothNonDistiguished = ! isValueOneDistiguished && ! isValueTwoDistiguished;
        let isOneDistiguishedAndOneNonDistiguished = ! areBothDistiguished && ! areBothNonDistiguished;

        if (areBothDistiguished) {
                let valueOneSubscript = valueOne.slice(1);
                let valueTwoSubscript = valueTwo.slice(1);
                if (valueOneSubscript < valueTwoSubscript) {
                        return valueOne;
                } else {
                        return valueTwo;
                }
        }

        // if one of the values is a distiguished variable while the other is not, return the distinguished variable
        if (isOneDistiguishedAndOneNonDistiguished) {
                if (isValueOneDistiguished) {
                        return valueOne;
                } else {
                        return valueTwo;
                }
        }

        // if both are non-distinguished variables, return the non-distinguished variable that has a lower subscript
        if (areBothNonDistiguished) {
                let valueOneSubscript = valueOne.slice(1);
                let valueTwoSubscript = valueTwo.slice(1);
                if (valueOneSubscript < valueTwoSubscript) {
                        return valueOne;
                } else {
                        return valueTwo;
                }
        }
}
