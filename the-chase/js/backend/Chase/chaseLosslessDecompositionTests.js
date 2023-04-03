import { chaseLosslessDecomposition } from './chaseLosslessDecomposition.js';
import { prettyPrintResult, prettyPrintC } from './helpers.js';

let relation, C, relationSchemes;

// test case 1
relation = ['A1', 'A2', 'A3', 'A4'];
C = [];
relationSchemes = [
        ['A1', 'A2'],
        ['A2', 'A3'],
        ['A3', 'A4'],
];

// console.log(`Applying chaseLosslessDecomposition to relation ${relation} with C = ${C} and relationSchemes = ${relationSchemes}:`);
// console.log(chaseLosslessDecomposition(relation, C, relationSchemes));


// test case 2
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['D'],
        },
        {
                relationSchemes: [
                        ['A', 'B'],
                        ['B', 'C', 'D'],
                ]
        },
];
relationSchemes = [
        ['A', 'B'],
        ['B', 'C'],
        ['A', 'D'],
];

console.log(`Applying chaseLosslessDecomposition to relation ${relation} with C = ${C} and relationSchemes = ${relationSchemes}:`);
let result = chaseLosslessDecomposition(relation, C, relationSchemes);
prettyPrintResult(result, document.getElementById('output'), `Applying chaseLosslessDecomposition to relation ${relation} with C = ${prettyPrintC(C)} and relationSchemes = ${relationSchemes}:`);

