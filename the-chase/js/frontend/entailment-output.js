import {chase} from "../backend/chase.js";
import {TASK_ENTAILMENT, TYPE_SIMPLE_CHASE, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE} from "../backend/global.js";

function getRelationFromInput(inputObj) {
  let relation = "{" + inputObj.chase.entailment.relation.attribute.toString();
  relation = relation.replaceAll("," , ", ") + "}";
  return relation;
}

function getDependenciesFromInput(inputObj) {
  let dependencies = "{";
  let dependenciesArr = inputObj.chase.entailment.dependency;
  for (let i = 0; i < dependenciesArr.length; i++) {
    let symbol = "";
    if (dependenciesArr[i].type.toLowerCase() === "functional") {
      symbol = " → ";
    } else if (dependenciesArr[i].type.toLowerCase() === "multivalued") {
      symbol = " →→ ";
    }
    dependencies += "{" + dependenciesArr[i].lhs.attribute + "}"
      + symbol + "{" + dependenciesArr[i].rhs.attribute + "}";
    if (i != dependenciesArr.length - 1) {
      dependencies += ",";
    }
  }
  dependencies = dependencies.replaceAll("," , ", ") + "}";
  return dependencies;
}

function getDependencyChasedFromInput(inputObj) {
  let dependencyChased = "";
  let symbol = "";
  if (inputObj.chase.entailment.dependency_chased.type.toLowerCase() === "functional") {
    symbol = " → ";
  } else if (inputObj.chase.entailment.dependency_chased.type.toLowerCase() === "multivalued") {
    symbol = " →→ ";
  }
  dependencyChased += "{" + inputObj.chase.entailment.dependency_chased.lhs.attribute
    + "}" + symbol + "{" + inputObj.chase.entailment.dependency_chased.rhs.attribute + "}";
  dependencyChased = dependencyChased.replaceAll("," , ", ");
  return dependencyChased;
}

function showInputForEntailment(inputObj) {
  let relation = document.createElement("p");
  let relationText = "Relation: " + getRelationFromInput(inputObj);
  let node = document.createTextNode(relationText);
  relation.appendChild(node);
  
  let dependencies = document.createElement("p");
  let dependenciesText = "Dependencies: " + getDependenciesFromInput(inputObj);
  
  node = document.createTextNode(dependenciesText);
  dependencies.appendChild(node);
  
  let dependencyChased = document.createElement("p");
  let dependencyChasedText = "We want to chase: " + getDependencyChasedFromInput(inputObj);
  node = document.createTextNode(dependencyChasedText);
  dependencyChased.appendChild(node);
  
  document.getElementById("userInputFields").append(relation, dependencies, dependencyChased);
}

function getArgsFromInputObj(inputObj) {
  let relation = convertToArray(inputObj.chase.entailment.relation.attribute);

  let dependenciesArr = convertToArray(inputObj.chase.entailment.dependency);
  let dependencies = [];
  for (let i = 0; i < dependenciesArr.length; i++) {
    let lhs = convertToArray(dependenciesArr[i].lhs.attribute);
    let rhs = convertToArray(dependenciesArr[i].rhs.attribute);
    
    let mvd = false;
    if (dependenciesArr[i].type.toLowerCase() === "multivalued") {
      mvd = true;
    }
    dependencies.push({lhs: lhs, rhs: rhs, mvd: mvd});
  }
  
  let typeValue = document.querySelector('input[name="chaseType"]:checked').value;
  let type = 0;
  if (typeValue === "simple") {
    type = TYPE_SIMPLE_CHASE;
  } else if (typeValue === "distVar") {
    type = TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE;
  }
  
  let lhs = convertToArray(inputObj.chase.entailment.dependency_chased.lhs.attribute);
  let rhs = convertToArray(inputObj.chase.entailment.dependency_chased.rhs.attribute);
  let mvd = false;
    if (inputObj.chase.entailment.dependency_chased.type.toLowerCase() === "multivalued") {
      mvd = true;
    }
  let dependencyChased = {lhs: lhs, rhs: rhs, mvd: mvd};
  
  return {relation: relation, dependencies: dependencies, type: type, dependencyChased: dependencyChased};
}

function showResultForEntailment(inputObj) {
  let args = getArgsFromInputObj(inputObj);
  
  let output = chase(args.relation, args.dependencies, TASK_ENTAILMENT, args.type, args.dependencyChased);
  
  let steps = output.steps;
  for (let i = 0; i < steps.length; i++) {
    let description = steps[i].description;
    let columns = steps[i].tableau.columns;
    let rows = steps[i].tableau.rows;
    createOutputStep(columns, rows, description);
  }
  
  let result = output.result;
  let relation = getRelationFromInput(inputObj);
  let dependencies = getDependenciesFromInput(inputObj);
  let dependencyChased = getDependencyChasedFromInput(inputObj);
  let resultStr = "";
  if (result) {
    resultStr = "Dependency " + dependencyChased + " is satisfied by Relation " + relation + " with Dependencies " + dependencies;
  } else {
    resultStr = "Dependency " + dependencyChased + " is NOT satisfied by Relation " + relation + " with Dependencies " + dependencies;
  }
  
  let finalTableau = output.finalTableau;
  let columns = finalTableau.columns;
  let rows = finalTableau.rows;
  createOutputStep(columns, rows, resultStr);
   
  document.getElementById('output').style.display = "block";
}

export async function showOutputForEntailment() {
  let inputObj = await convertInputXmlToObj("fileForEntailment");
  if (inputObj === null) {
    return;
  }
  if (Object.keys(inputObj).length === 0) {
    return;
  }
  
  userInputFields.replaceChildren(); // clear previous user input
  output.replaceChildren(); // clear previous output
  
  document.getElementById('userInput').style.display = "block";
  document.getElementById('notation').style.display = "block";
  
  showInputForEntailment(inputObj);
  showResultForEntailment(inputObj);
}

export function exportResultToXml() {
}
