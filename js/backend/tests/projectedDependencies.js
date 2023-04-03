import { TASK_PROJECTED_DEPENDENCIES, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, TYPE_SIMPLE_CHASE } from "../backend/global";

const task = TASK_PROJECTED_DEPENDENCIES

/**
 * TEST CASE 1
 * Expected: A->B, B->C
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
    lhs: ['C', 'D'],
    rhs: ['A'],
    mvd: true
  }
]
const otherInfo1 = {
  projection: ['A', 'B', 'C']
}
chase(relation1, fds1, task, TYPE_SIMPLE_CHASE, otherInfo1)
chase(relation1, fds1, task, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, otherInfo1)

/**
 * TEST CASE 2
 * Expected: A->B, C->A
 */
const relation2 = ['A', 'B', 'C', 'D', 'E'];
const fds2 = [
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
const otherInfo2 = {
  projection: ['A', 'B', 'C']
}
chase(relation2, fds2, task, TYPE_SIMPLE_CHASE, otherInfo2)
chase(relation2, fds2, task, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, otherInfo2)

/**
 * TEST CASE 3
 * Expected: A->B, B->E
 */
const relation3 = ['A', 'B', 'C', 'D', 'E'];
const fds3 = [
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
const otherInfo3 = {
  projection: ['A', 'B', 'E']
}
chase(relation3, fds3, task, TYPE_SIMPLE_CHASE, otherInfo3)
chase(relation3, fds3, task, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, otherInfo3)
