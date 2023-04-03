import { jRule } from './jRule.js';
import { prettyPrintJD } from './helpers.js';

let tableau, JD, updatedTableau;

// test case 1
tableau = {
        columns: ['A1', 'A2', 'A3', 'A4'],
        rows: [
                ['a1', 'b1', 'b2', 'a4'],
                ['a1', 'a2', 'b3', 'b4'],
                ['b5', 'a2', 'b3', 'a4'],
        ]
};

JD = {
        relationSchemes: [
                ['A1', 'A2'],
                ['A2', 'A3'],
                ['A3', 'A4'],
        ],
};

updatedTableau = jRule(tableau, JD);

// console.log(`Applying JD ${prettyPrintJD(JD)} to the tableau:`);
// console.log(updatedTableau);

// test case 2
tableau = updatedTableau;

JD = {
        relationSchemes: [
                ['A1', 'A2', 'A4'],
                ['A1', 'A3', 'A4'],
        ],
};

updatedTableau = jRule(tableau, JD);

// console.log(`Applying JD ${prettyPrintJD(JD)} to the tableau:`);
// console.log(updatedTableau);


// test case 3
tableau = {
        columns: ['A', 'B', 'C', 'D'],
        rows: [
                ['a1', 'a2', 'b1', 'b2'],
                ['b3', 'a2', 'b1', 'a4'],
                ['a1', 'b6', 'a3', 'a4'],
        ]
};

JD = {
        relationSchemes: [
                ['A', 'B', 'C'],
                ['B', 'C', 'D'],
        ],
};

updatedTableau = jRule(tableau, JD);

console.log(`Applying JD ${prettyPrintJD(JD)} to the tableau:`);
console.log(updatedTableau);
