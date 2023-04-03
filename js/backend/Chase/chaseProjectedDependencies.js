// import { TYPE_SIMPLE_CHASE } from "../backend/global.js";
import { chaseEntailmentFDWithDistinguishedVariables, chaseEntailmentMVD, chaseEntailmentSimpleChaseFD } from "./chaseEntailment.js";

const TYPE_SIMPLE_CHASE = 1;

function closure(fds, schema) {
  let closure = new Set(schema);
  let is_result_modified = true;
  while (is_result_modified) {
    is_result_modified = false;
    for (const dependency of fds) {
      let lhs = dependency.lhs;
      let rhs = dependency.rhs;
      if (lhs.every(e => closure.has(e))) {
        if (!rhs.every(e => closure.has(e))) {
          rhs.forEach(e => closure.add(e))
          is_result_modified = true;
        }
      }
    }
  }
  return Array.from(closure);
}

export function chaseProjectedDependencies(relation, fds, projectedRelation, type) {
  let steps = [];
  // 1. T is the eventual output set of FDs
  let T = [];
  steps.push({
    description: "1. Let T be the eventual output set of functional dependencies."
  });

  // get all subsets of projectedRelation
  const allSubsets = [[]];
  for (const element of projectedRelation) {
    const subsets = [];
    for (const subset of allSubsets) {
      subsets.push(subset.concat(element));
    }
    allSubsets.push(...subsets);
  }
  steps.push({
    description: "2a. Get all subsets of projected relation."
  });

  // 2. compute closure for each subset
  // add to T all nontrivial FDs X->A such that A is both in closure and in projectedRelation
  for (const X of allSubsets) {
    let closureX = closure(fds, X);
    for (const A of closureX) {
      if (!X.includes(A) && projectedRelation.includes(A)) {
        const nontrivialFD = {
          lhs: X,
          rhs: [A],
          mvd: false
        };
        if (T.find(e => e.lhs == nontrivialFD.lhs && e.rhs == nontrivialFD.rhs && e.mvd == nontrivialFD.mvd) === undefined) {
          T.push(nontrivialFD);
        }
      }
    }
  }
  steps.push({
    description: "2b. Compute closure for each subset." + 
                "Add to T all non-trivial functional dependencies X->A such that A is both in the closure and the projected relation."
  })
  
  // 3. get minimal basis by
  // 3a. remove F if it can be derived from others
  // check if T-{F} entails F
  let Tchanged = true;
  while (Tchanged) {
    Tchanged = false;
    for (const F of T) {
      const idx = T.indexOf(F);
      let Tcopy = [...T];
      Tcopy.splice(idx, 1);
      var chase;
      if (F.mvd) {
        chase = chaseEntailmentMVD(projectedRelation, Tcopy, F);
      } else if (type == TYPE_SIMPLE_CHASE) {
        chase = chaseEntailmentSimpleChaseFD(projectedRelation, Tcopy, F);
      } else {
        chase = chaseEntailmentFDWithDistinguishedVariables(projectedRelation, Tcopy, F);
      }
      if (chase['result']) {
        // remove F
        T.splice(idx, 1);
        Tchanged = true;
      }
    }

    for (const F of T) {
      let Y = F.lhs;
      if (Y.length < 2) {
        continue;
      }
      let B = F.rhs;
  
      // if Z->B can be derived from T, then replace Y->B with Z->B
      for (let i = 0; i < Y.length; i++) {
        const Z = [...Y];
        Z.splice(i, 1);
        let subFD = {
          lhs: Z,
          rhs: B,
          mvd: F.mvd
        }
        var chase;
        if (subFD.mvd) {
          chase = chaseEntailmentMVD(projectedRelation, T, subFD);
        } else if (type == TYPE_SIMPLE_CHASE) {
          chase = chaseEntailmentSimpleChaseFD(projectedRelation, T, subFD);
        } else {
          chase = chaseEntailmentFDWithDistinguishedVariables(projectedRelation, T, subFD);
        }
        if (chase['result']) {
          // replace Y->B with Z->B
          const idx = T.indexOf(F);
          if (T.find(e => e.lhs == subFD.lhs && e.rhs == subFD.rhs && e.mvd == subFD.mvd) === undefined && idx > -1) {
            T[idx] = subFD;
            Tchanged = true;
            break;
          } else if (idx > -1) {
            // subFD already exists, so remove current
            T.splice(idx, 1);
            Tchanged = true;
            break;
          }
        }
      }
    }
  }
  steps.push({
    description: "3. Find the minimal basis of T by:\n" + 
                "3a. Use the chase for entailement to remove functional dependencies that can be derived from other functional dependencies.\n" +
                "3b. Use the chase for entailment to simplify the LHS of the functional dependencies."
  });
  return {
    result: T
  }
}
