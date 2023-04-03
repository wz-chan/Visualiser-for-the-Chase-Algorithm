import { TASK_LOSSLESS_DECOMPOSITION, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, TYPE_SIMPLE_CHASE } from "../backend/global";

const task = TASK_LOSSLESS_DECOMPOSITION

/**
 * TEST CASE 1
 * Expected: True
 */
const relation1 = ['A', 'B', 'C', 'D'];
const fds1 = [
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
    lhs: ['A'],
    rhs: ['D'],
    mvd: false
  }
]
const otherInfo1 = {
  relationSchemes: [
    ['A', 'B'],
    ['B', 'C'],
    ['A', 'D']
  ] 
}
chase(relation1, fds1, task, TYPE_SIMPLE_CHASE, otherInfo1)
chase(relation1, fds1, task, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, otherInfo1)

/**
 * TEST CASE 2
 * Expected: True
 */
const relation2 = ['A', 'B', 'C', 'D'];
const fds2 = [
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
    lhs: ['D'],
    rhs: ['B'],
    mvd: false
  }
]
const otherInfo2 = {
  relationSchemes: [
    ['A', 'B'],
    ['B', 'C'],
    ['B', 'D']
  ] 
}
chase(relation2, fds2, task, TYPE_SIMPLE_CHASE, otherInfo2)
chase(relation2, fds2, task, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, otherInfo2)

/**
 * TEST CASE 3
 * Expected: False
 */
const relation3 = ['A', 'B', 'C', 'D', 'E', 'G'];
const fds3 = [
  {
    lhs: ['A', 'B'],
    rhs: ['C'],
    mvd: false
  },
  {
    lhs: ['A', 'C'],
    rhs: ['B'],
    mvd: false
  },
  {
    lhs: ['A', 'D'],
    rhs: ['E'],
    mvd: false
  },
  {
    lhs: ['B'],
    rhs: ['D'],
    mvd: false
  },
  {
    lhs: ['B', 'C'],
    rhs: ['A'],
    mvd: false
  },
  {
    lhs: ['E'],
    rhs: ['G'],
    mvd: false
  }
]
const otherInfo3 = {
  relationSchemes: [
    ['A', 'B'],
    ['B', 'C'],
    ['A', 'B', 'D', 'E'],
    ['E', 'G']
  ] 
}
chase(relation3, fds3, task, TYPE_SIMPLE_CHASE, otherInfo3)
chase(relation3, fds3, task, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, otherInfo3)
