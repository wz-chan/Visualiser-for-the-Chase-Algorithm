import { chaseEntailmentFDWithDistinguishedVariables, chaseEntailmentMVD, chaseEntailmentSimpleChaseFD } from "./Chase/chaseEntailment.js";
import { chaseLosslessDecomposition } from "./Chase/chaseLosslessDecomposition.js";
import { chaseMinCover } from "./Chase/chaseMinCover.js";
import { chaseProjectedDependencies } from "./Chase/chaseProjectedDependencies.js";
import { chaseDP } from "./Chase/chaseDP.js";
import { TASK_ENTAILMENT, TASK_LOSSLESS_DECOMPOSITION, TASK_MINIMAL_COVER, TASK_PROJECTED_DEPENDENCIES, TASK_TEST_DEPENDENCY_PRESERVATION, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, TYPE_SIMPLE_CHASE } from "./global.js";

/**
 * This function runs the chase algorithm.
 * 
 * @param {Object} relation   Table relation.
 * @param {Object} fds        Array of functional dependencies.
 * @param {Number} task       Task to run chase algorithm for.
 * @param {Number} type       Type of chase to run.
 * @param {Object} otherInfo  Additional information required for each task.
 *                            For task TASK_ENTAILMENT, dependency to chase for.
 *                            For task TASK_LOSSLESS_DECOMPOSITION, table decomposition schemas.
 *                            For task TASK_PROJECTED_DEPENDENCIES, subset of relation.
 *                            For task TASK_MINIMAL_COVER, null.
 *                            For task TASK_TEST_DEPENDENCY_PRESERVATION, schemas of the decomposed fragments.
 * 
 * @return {Object} Result of chase and array of tableau state at each step of chase.
 */
export function chase(relation, fds, task, type, otherInfo) {
  switch (task) {
    case TASK_ENTAILMENT:
      return chaseEntailment(relation, fds, type, otherInfo);
    case TASK_LOSSLESS_DECOMPOSITION:
      return chaseLosslessDecomp(relation, fds, otherInfo);
    case TASK_PROJECTED_DEPENDENCIES:
      return chaseProjectedDep(relation, fds, otherInfo, type);
    case TASK_MINIMAL_COVER:
      return chaseMinimalCover(relation, fds);
    case TASK_TEST_DEPENDENCY_PRESERVATION:
      return chaseTestDependencyPreservation(relation, fds, otherInfo);
    default:
      break;
  }
}

function chaseEntailment(relation, fds, type, otherInfo) {
  let isMVD = otherInfo.mvd;
  if (isMVD) {
    return chaseEntailmentMVD(relation, fds, otherInfo);
  } else {
    if (type === TYPE_SIMPLE_CHASE) {
      return chaseEntailmentSimpleChaseFD(relation, fds, otherInfo);
    } else if (type === TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE) {
      return chaseEntailmentFDWithDistinguishedVariables(relation, fds, otherInfo);
    } else {
      console.log("Invalid Type");
    }
  }
}

function chaseLosslessDecomp(relation, fds, otherInfo) {
  let relationSchemes = otherInfo.relationSchemes;
  return chaseLosslessDecomposition(relation, fds, relationSchemes);
}

function chaseProjectedDep(relation, fds, otherInfo, type) {
  return chaseProjectedDependencies(relation, fds, otherInfo.projection, type);
}

function chaseMinimalCover(relation, fds) {
  return chaseMinCover(relation, fds);
}

function chaseTestDependencyPreservation(relation, fds, otherInfo) {
  return chaseDP(relation, fds, otherInfo.relationSchemes);
}
