import {chase} from "../backend/chase.js";
import {TASK_LOSSLESS_DECOMPOSITION, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE} from "../backend/global.js";

function getRelationFromInput(inputObj) {
  let relation = "{" + inputObj.chase.lossless_decomposition.relation.attribute.toString();
  relation = relation.replaceAll("," , ", ") + "}";
  return relation;
}

function getDependenciesFromInput(inputObj) {
  let dependencies = "{";
  let dependenciesArr = inputObj.chase.lossless_decomposition.dependency;
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

function getFragmentsFromInput(inputObj) {
  let fragments = "{";
  let fragmentsArr = inputObj.chase.lossless_decomposition.fragment;
  for (let i = 0; i < fragmentsArr.length; i++) {
    fragments += "{" + fragmentsArr[i].attribute + "}";
    if (i != fragmentsArr.length - 1) {
      fragments += ",";
    }
  }
  fragments = fragments.replaceAll("," , ", ") + "}";
  return fragments;
}

function showInputForLossless(inputObj) {
  document.getElementById('userInput').style.display = "block";
  userInputFields.replaceChildren(); // clear previous user input fields
  
  let relation = document.createElement("p");
  let relationText = "Relation: " + getRelationFromInput(inputObj);
  let node = document.createTextNode(relationText);
  relation.appendChild(node);
  
  let dependencies = document.createElement("p");
  let dependenciesText = "Dependencies: " + getDependenciesFromInput(inputObj);
  node = document.createTextNode(dependenciesText);
  dependencies.appendChild(node);
  
  let fragments = document.createElement("p");
  let fragmentsText = "Fragments: " + getFragmentsFromInput(inputObj);
  
  node = document.createTextNode(fragmentsText);
  fragments.appendChild(node);
  
  document.getElementById("userInputFields").append(relation, dependencies, fragments);
}

function getArgsFromInputObj(inputObj) {
  let relation = convertToArray(inputObj.chase.lossless_decomposition.relation.attribute);
  
  let dependenciesArr = convertToArray(inputObj.chase.lossless_decomposition.dependency);
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
  
  let fragmentsArr = inputObj.chase.lossless_decomposition.fragment;
  let fragments = [];
  for (let i = 0; i < fragmentsArr.length; i++) {
    fragments.push(convertToArray(fragmentsArr[i].attribute));
  }
  let fragmentsObj = {relationSchemes: fragments};
  return {relation: relation, dependencies: dependencies, fragments: fragmentsObj};
}

function showResultForLossless(inputObj) {
  let args = getArgsFromInputObj(inputObj);
  
  let output = chase(args.relation, args.dependencies, TASK_LOSSLESS_DECOMPOSITION,
    TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, args.fragments);
  
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
  let fragments = getFragmentsFromInput(inputObj);
  let resultStr = "";
  if (result) {
    resultStr = "Decomposition of Relation " + relation + " with Dependencies " + dependencies
      + " into Fragments " + fragments +  " is lossless";
  } else {
    resultStr = "Decomposition of Relation " + relation + " with Dependencies " + dependencies
      + " into Fragments " + fragments +  " is NOT lossless";
  }
  
  let finalTableau = output.finalTableau;
  let columns = finalTableau.columns;
  let rows = finalTableau.rows;
  createOutputStep(columns, rows, resultStr);
   
  document.getElementById('output').style.display = "block";
}

export async function showOutputForLossless() {
  let inputObj = await convertInputXmlToObj("fileForLossless");
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

  showInputForLossless(inputObj);
  showResultForLossless(inputObj);
}
