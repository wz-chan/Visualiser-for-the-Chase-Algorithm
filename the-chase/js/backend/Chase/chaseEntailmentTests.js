import { 
        chaseEntailmentSimpleChaseFD, 
        chaseEntailmentMVD,
        chaseEntailmentFDWithDistinguishedVariables,
} from './chaseEntailment.js';

import { prettyPrintResult, prettyPrintC } from './helpers.js';

let relation, C, FD, MVD, JD, resultPhrase;
let outputElement = document.getElementById('output');

// test case 1
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['B', 'C'],
                mvd: true,
        },
        {
                lhs: ['D'],
                rhs: ['C']
        },
];
FD = {
        lhs: ['A'],
        rhs: ['C'],
        mvd: false,
};

// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. We are chasing FD = ${FD.lhs} -> ${FD.rhs}. So is it entailed? `;
// prettyPrintResult(chaseEntailmentFDWithDistinguishedVariables(relation, C, FD), outputElement, resultPhrase);
//
// test case 2
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['B'],
                mvd: true,
        },
        {
                lhs: ['B'],
                rhs: ['C'],
                mvd: true,
        },
];
MVD = {
        lhs: ['A'],
        rhs: ['C'],
        mvd: true,
};

// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. We are chasing MVD = ${MVD.lhs} ->> ${MVD.rhs}. So is it entailed? `;
// prettyPrintResult(chaseEntailmentMVD(relation, C, MVD), outputElement, resultPhrase);
//

// test case 3
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['B', 'C'],
                mvd: true,
        },
        {
                lhs: ['C', 'D'],
                rhs: ['B'],
                mvd: false,
        },
];
FD = {
        lhs: ['A'],
        rhs: ['B'],
        mvd: false,
};

// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. We are chasing FD = ${FD.lhs} -> ${FD.rhs}. So is it entailed? `;
// prettyPrintResult(chaseEntailmentFDWithDistinguishedVariables(relation, C, FD), outputElement, resultPhrase);

// test case 4
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['C'],
                mvd: false,
        },
        {
                lhs: ['C'],
                rhs: ['B'],
                mvd: false,
        }
];

FD = {
        lhs: ['A'],
        rhs: ['B'],
        mvd: false,
};

// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. We are chasing FD = ${FD.lhs} -> ${FD.rhs}. So is it entailed? `;
// prettyPrintResult(chaseEntailmentFDWithDistinguishedVariables(relation, C, FD), outputElement, resultPhrase);

// test case 5
// create C with     A → B, B → C, C → D, AB → CD
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['A'],
                rhs: ['B'],
                mvd: false,
        },
        {
                lhs: ['B'],
                rhs: ['C'],
                mvd: false,
        },
        {
                lhs: ['C'],
                rhs: ['D'],
                mvd: false,
        },
        {
                lhs: ['A', 'B'],
                rhs: ['C', 'D'],
                mvd: false,
        },
];
// create FD AB -> D 
FD = {
        lhs: ['A', 'B'],
        rhs: ['D'],
        mvd: false,
};


// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. We are chasing FD = ${FD.lhs} -> ${FD.rhs}. So is it entailed? `;
// prettyPrintResult(chaseEntailmentFDWithDistinguishedVariables(relation, C, FD), outputElement, resultPhrase);

// test case 6
relation = ['A', 'B', 'C', 'D'];
C = [
        {
                lhs: ['B'],
                rhs: ['C'],
                mvd: false,
        },
        {
                lhs: ['A'],
                rhs: ['B'],
                mvd: false,
        },
];
FD = {
        lhs: ['A'],
        rhs: ['C'],
        mvd: false,
};

resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. We are chasing FD = ${FD.lhs} -> ${FD.rhs}. So is it entailed? `;
prettyPrintResult(chaseEntailmentFDWithDistinguishedVariables(relation, C, FD), outputElement, resultPhrase);

