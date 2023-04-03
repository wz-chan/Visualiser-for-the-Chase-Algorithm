export function isTableauFormattedCorrectly(tableau) {
        if (!tableau.columns || !tableau.rows) {
                return false;
        }

        if (tableau.columns.length !== tableau.rows[0].length) {
                return false;
        }

        return true;
}

export function isFDFormattedCorrectly(FD) {
        if (!FD.lhs || !FD.rhs) {
                return false;
        }

        if (FD.mvd) {
                return false;
        }

        return true;
}

export function isJDFormattedCorrectly(JD) {
        if (!JD.relationSchemes || !JD.relationSchemes.length) {
                return false;
        }
        
        // NOTE: We are only allowing up to 3 relation schemes per JD for now
        if (JD.relationSchemes.length > 3) {
                return false;
        }

        return true;
}

export function convertMVDToFragments(relation, MVD) { 
        // convert the MVD to a JD
        // let X be MVD.lhs
        // let Y be MVD.rhs
        // let Z be the columns in relation that are not in X or Y
        // let the JD be *[[X,Y], [X,Z]]
        // Create an array of fragments and put XY and XZ in it

        let X = MVD.lhs;
        let Y = MVD.rhs;
        let Z = [];
        for (let i = 0; i < relation.length; i++) {
                let currentColumn = relation[i];
                if (!X.includes(currentColumn) && !Y.includes(currentColumn)) {
                        Z.push(currentColumn);
                }
        }

        return [[...X, ...Y], [...X, ...Z]];
}

export function isFD(dependency) {
        if (dependency.relationSchemes) {
                return false;
        }

        if (dependency.mvd) {
                return false;
        }

        return true;
}

export function isJD(dependency) {
        if (dependency.lhs) {
                return false;
        }

        if (! dependency.relationSchemes) {
                return false;
        }

        return true;
}

export function isMVD(dependency) {
        if (! dependency.mvd) {
                return false;
        }

        return true;
}


export function convertMVDsToJDs(relation, C) {
        let processedC = [];

        for (let i = 0; i < C.length; i++) {
                let FD = C[i];
                // if FD is undefined, skip it
                if (!FD) {
                        continue;
                }

                if (FD.mvd) {
                        let JD = {
                                relationSchemes: convertMVDToFragments(relation, FD),
                        }

                        processedC.push(JD);
                } else {
                        processedC.push(FD);
                }
        }

        return processedC;
}

export function snapshotOfTableau(tableau) {
        return JSON.parse(JSON.stringify(tableau));
}

export function checkIfTableauChanged(initialTableau, newTableau) {
        if (initialTableau.rows.length !== newTableau.rows.length) {
                return true;
        }

        for (let i = 0; i < initialTableau.rows.length; i++) {
                for (let j = 0; j < initialTableau.rows[i].length; j++) {
                        if (initialTableau.rows[i][j] !== newTableau.rows[i][j]) {
                                return true;
                        }
                }
        }

        return false;
}


export function doesTableauHaveARowOfDistinguishedVariables(tableau) {
        // tableau has columns and rows
        // return true if we find at least one row where all the values in the row array are strings that start with 'a'

        let hasRowOfDistinguishedVariables = false;

        for (let i = 0; i < tableau.rows.length; i++) {
                let row = tableau.rows[i];

                let hasDistinguishedVariable = true;

                for (let j = 0; j < row.length; j++) {
                        let value = row[j];

                        if (typeof value === 'string' && value.startsWith('a')) {
                                continue;
                        }

                        hasDistinguishedVariable = false;
                        break;
                }

                if (hasDistinguishedVariable) {
                        hasRowOfDistinguishedVariables = true;
                        break;
                }

        }

        return hasRowOfDistinguishedVariables;
}


/*
 * PRETTY PRINT 
*/

export function prettyPrintJD(JD) {
        // take in an object that has relationSchemes as a property with an array of arrays where each array reprsents a fragment
        // return a string that looks like *[fragment1, fragment2, ...]

        let JDString = '*[';
        for (let i = 0; i < JD.relationSchemes.length; i++) {
                JDString += '[';
                for (let j = 0; j < JD.relationSchemes[i].length; j++) {
                        JDString += JD.relationSchemes[i][j];
                        if (j < JD.relationSchemes[i].length - 1) {
                                JDString += ', ';
                        }
                }
                JDString += ']';
                if (i < JD.relationSchemes.length - 1) {
                        JDString += ', ';
                }
        }

        JDString += ']';

        return JDString;
}

export function prettyPrintResult(result, outputElement, resultPhrase) {
        for (let i = 0; i < result.steps.length; i++) {
                let stepNumber = i + 1;
                let stepDescription = result.steps[i].description;
                let stepTableau = result.steps[i].tableau;

                let stepElement = document.createElement('div');
                stepElement.innerHTML = `<p>Step ${stepNumber}: ${stepDescription}</p>`;
                let stepTableElement = document.createElement('table');
                let stepTableHeader = document.createElement('tr');
                for (let j = 0; j < stepTableau.columns.length; j++) {
                        let stepTableHeaderCell = document.createElement('th');
                        stepTableHeaderCell.innerHTML = stepTableau.columns[j];
                        stepTableHeader.appendChild(stepTableHeaderCell);
                }
                stepTableElement.appendChild(stepTableHeader);
                for (let j = 0; j < stepTableau.rows.length; j++) {
                        let stepTableRow = document.createElement('tr');
                        for (let k = 0; k < stepTableau.rows[j].length; k++) {
                                let stepTableRowCell = document.createElement('td');
                                stepTableRowCell.innerHTML = stepTableau.rows[j][k];
                                stepTableRow.appendChild(stepTableRowCell);
                        }
                        stepTableElement.appendChild(stepTableRow);
                }
                stepElement.appendChild(stepTableElement);
                outputElement.appendChild(stepElement);
        }

        let resultElement = document.createElement('div');
        resultElement.innerHTML = `<p>${resultPhrase} ${result.result ? 'Yes' : 'No'}</p>`;
        let resultTableElement = document.createElement('table');
        let resultTableHeader = document.createElement('tr');
        for (let j = 0; j < result.finalTableau.columns.length; j++) {
                let resultTableHeaderCell = document.createElement('th');
                resultTableHeaderCell.innerHTML = result.finalTableau.columns[j];
                resultTableHeader.appendChild(resultTableHeaderCell);
        }
        resultTableElement.appendChild(resultTableHeader);
        for (let j = 0; j < result.finalTableau.rows.length; j++) {
                let resultTableRow = document.createElement('tr');
                for (let k = 0; k < result.finalTableau.rows[j].length; k++) {
                        let resultTableRowCell = document.createElement('td');
                        resultTableRowCell.innerHTML = result.finalTableau.rows[j][k];
                        if (result.finalTableau.rows[j][k].startsWith('a')) {
                                resultTableRowCell.style.backgroundColor = 'yellow';
                        }
                        resultTableRow.appendChild(resultTableRowCell);
                }
                resultTableElement.appendChild(resultTableRow);
        }
        resultElement.appendChild(resultTableElement);
        outputElement.appendChild(resultElement);
}

export function prettyPrintC(C) {
        // Take in an array C that has FDs, MVDs, and JDs
        // if FD (means have lhs array, rhs array and mvd is false), return a string: "lhs -> rhs"
        // if MVD (means have lhs array, rhs array and mvd is true), return a string: "lhs ->> rhs"
        // if JD (means have relationSchemes array), return a string: "*[fragment1, fragment2, ...]" (use the prettyPrintJD function)
        // concatenate all of the strings together with a comma and space in between

        let CString = '';
        for (let i = 0; i < C.length; i++) {
                if (C[i].mvd) {
                        CString += prettyPrintMVD(C[i]);
                } else if (C[i].lhs) {
                        CString += prettyPrintFD(C[i]);
                } else {
                        CString += prettyPrintJD(C[i]);
                }
                if (i < C.length - 1) {
                        CString += ', ';
                }
        }

        return CString;
}

function prettyPrintFD(FD) {
        return `${FD.lhs} -> ${FD.rhs}`;
}

function prettyPrintMVD(MVD) {
        return `${MVD.lhs} ->> ${MVD.rhs}`;
}
