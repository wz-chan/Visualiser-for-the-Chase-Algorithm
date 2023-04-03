import { chaseMinCover } from './chaseMinCover.js';
import { prettyPrintC, prettyPrintResult } from './helpers.js';

let relation, C, resultPhrase;
let outputEl = document.getElementById('output');

// test case 1
relation = ['A', 'B', 'C', 'D', 'E'];
C = [
        {
            lhs: ['A', 'B'],
            rhs: ['C'],
            mvd: false
        },
        {
                lhs: ['C', 'D'],
                rhs: ['E'],
                mvd: false
        },
        {
                lhs: ['E'],
                rhs: ['A'],
                mvd: false
        }
];

resultPhrase = `With relation ${relation} is C = ${prettyPrintC(C)} a minimal cover? `;
prettyPrintResult(chaseMinCover(relation, C), outputEl, resultPhrase);

// test case 2
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['B'],
                mvd: false
        },
        {
                lhs: ['B'],
                rhs: ['C'],
                mvd: false
        },
        {
                lhs: ['C'],
                rhs: ['D'],
                mvd: false
        },
        {
                lhs: ['A', 'B'],
                rhs: ['C', 'D'],
                mvd: true
        }
];

// resultPhrase = `With relation ${relation} is C = ${prettyPrintC(C)} a minimal cover? `;
// prettyPrintResult(chaseMinCover(relation, C), outputEl, resultPhrase);

// test case 3
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['B'],
                mvd: false
        },
        {
                lhs: ['B'],
                rhs: ['C'],
                mvd: false
        },
        {
                lhs: ['C', 'D'],
                rhs: ['A'],
                mvd: true
        }
]

// resultPhrase = `With relation ${relation} is C = ${prettyPrintC(C)} a minimal cover? `;
// prettyPrintResult(chaseMinCover(relation, C), outputEl, resultPhrase);
