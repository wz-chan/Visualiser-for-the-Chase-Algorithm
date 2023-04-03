import { fRule } from './fRUle.js';

// create test cases for fRule, input: tableau, FD, output: updated tableau. And print out the results of the test cases in a readable format.

let tableau, FD, updatedTableau;

// test case 1
tableau = {
        columns: ['A', 'B', 'C', 'D'],
        rows: [
                ['a1', 'a2', 'b3', 'b4'],
                ['a1', 'a2', 'b7', 'b8'],
                ['b9', 'b10', 'b11', 'b12'],
                ['b13', 'b14', 'b15', 'b16'],
        ]
};

FD = {
        lhs: ['A', 'B'],
        rhs: ['C', 'D'],
        mvd: false
};

updatedTableau = fRule(tableau, FD);

// console.log(`Applying FD ${FD.lhs} -> ${FD.rhs} to the tableau:`);
// console.log(updatedTableau);


// test case 2 (ref: Example 8.19 in the textbook)
tableau = {
        columns: ['A1', 'A2', 'A3', 'A4'],
        rows: [
                ['a1', 'a2', 'a3', 'b1'],
                ['b2', 'a2', 'b3', 'b1'],
                ['a1', 'a2', 'b3', 'b4'],
        ]
};

FD = {
        lhs: ['A2', 'A4'],
        rhs: ['A3'],
        mvd: false
};

updatedTableau = fRule(tableau, FD);

// console.log(`Applying FD ${FD.lhs} -> ${FD.rhs} to the tableau:`);
// console.log(updatedTableau);

tableau = updatedTableau;

FD = {
        lhs: ['A1', 'A2'],
        rhs: ['A4'],
        mvd: false
};

updatedTableau = fRule(tableau, FD);

console.log(`Applying FD ${FD.lhs} -> ${FD.rhs} to the tableau:`);
console.log(updatedTableau);

