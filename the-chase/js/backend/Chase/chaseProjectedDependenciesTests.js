import { TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, TYPE_SIMPLE_CHASE } from '../backend/global.js';
import { chaseProjectedDependencies } from './chaseProjectedDependencies.js';
import { prettyPrintC } from './helpers.js';

let relation, C, projectedRelation, MVD, JD, resultPhrase;
let outputElement = document.getElementById('output');

// test case 1
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
projectedRelation = ['A', 'B', 'C']
// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. What are the FD/MVD for the projected relation ${projectedRelation}? `;
// let result = chaseProjectedDependencies(relation, C, projectedRelation, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE);

// test case 2
relation = ['A', 'B', 'C', 'D', 'E'];
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
  },
  {
    lhs: ['C'],
    rhs: ['E'],
    mvd: false
  }
]
projectedRelation = ['A', 'B', 'E'];
// resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. What are the FD/MVD for the projected relation ${projectedRelation}? `;
// let result = chaseProjectedDependencies(relation, C, projectedRelation, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE);

// test case 3
relation = ['A', 'B', 'C', 'D', 'E'];
C = [
  {
    lhs: ['A'],
    rhs: ['B'],
    mvd: false
  },
  {
    lhs: ['C'],
    rhs: ['D'],
    mvd: false
  },
  {
    lhs: ['B', 'C'],
    rhs: ['E'],
    mvd: true
  },
  {
    lhs: ['D'],
    rhs: ['A'],
    mvd: false
  }
]
projectedRelation = ['A', 'B', 'C'];
resultPhrase = `Relation ${relation} with C = ${prettyPrintC(C)}. What are the FD/MVD for the projected relation ${projectedRelation}? `;
let result = chaseProjectedDependencies(relation, C, projectedRelation, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE);

let resultText = '';
for (const F of result.result) {
  if (F.mvd) {
    resultText += F.lhs + '->>' + F.rhs + ', ';
  } else {
    resultText += F.lhs + '->' + F.rhs + ', ';
  }
}
let resultTextNode = document.createTextNode(resultText);
outputElement.appendChild(resultTextNode);