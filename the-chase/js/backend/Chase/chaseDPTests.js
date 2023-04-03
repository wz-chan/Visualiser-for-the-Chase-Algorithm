import { chaseDP } from './chaseDP.js';

let relation, C, relationSchemes, result;

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
                rhs: ['E'],
                mvd: true
        }
]

relationSchemes= [
    ['A', 'B', 'C'],
    ['C', 'D', 'E']
];

// result = chaseDP(relation, C, relationSchemes);
// console.log(result);


relation = ['A', 'B', 'C', 'D'];
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
                lhs: ['A', 'C'],
                rhs: ['B'],
                mvd: true
        }
]
relationSchemes = [
        ['A', 'B'],
        ['C', 'D']
];
result = chaseDP(relation, C, relationSchemes);
console.log(result);


// relation = ['A', 'B', 'C', 'D'];
// const fds2 = [
//   {
//     lhs: ['A'],
//     rhs: ['B'],
//     mvd: false
//   },
//   {
//     lhs: ['B'],
//     rhs: ['C'],
//     mvd: false
//   },
//   {
//     lhs: ['C'],
//     rhs: ['D'],
//     mvd: false
//   },
//   {
//     lhs: ['D'],
//     rhs: ['B'],
//     mvd: false
//   }
// ]
// const otherInfo2 = {
//   relationSchemes: [
//     ['A', 'B'],
//     ['B', 'C'],
//     ['B', 'D']
//   ] 
// }
