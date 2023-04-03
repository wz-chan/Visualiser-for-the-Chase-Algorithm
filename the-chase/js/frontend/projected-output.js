import {chase} from "../backend/chase.js";
import {TASK_PROJECTED_DEPENDENCIES, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE} from "../backend/global.js";

function getRelationFromInput(inputObj) {
  let relation = "{" + inputObj.chase.projected_dependencies.relation.attribute.toString();
  relation = relation.replaceAll("," , ", ") + "}";
  return relation;
}

function getDependenciesFromInput(inputObj) {
  let dependencies = "{";
  let dependenciesArr = inputObj.chase.projected_dependencies.dependency;
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

function getProjectionFromInput(inputObj) {
  let projection = "{" + inputObj.chase.projected_dependencies.projection.attribute.toString();
  projection = projection.replaceAll("," , ", ") + "}";
  return projection;
}

function showInputForProjected(inputObj) {
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
  
  let projection = document.createElement("p");
  let projectionText = "Projection: " + getProjectionFromInput(inputObj);
  node = document.createTextNode(projectionText);
  projection.appendChild(node);
  
  document.getElementById("userInputFields").append(relation, dependencies, projection);
}

function getArgsFromInputObj(inputObj) {
  let relation = convertToArray(inputObj.chase.projected_dependencies.relation.attribute);
  
  let dependenciesArr = convertToArray(inputObj.chase.projected_dependencies.dependency);
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
  
  let projection = convertToArray(inputObj.chase.projected_dependencies.projection.attribute);
  let projectionObj = {projection: projection};
  
  return {relation: relation, dependencies: dependencies, projection: projectionObj};
}

function getResultFromOutputObj(outputObj) {
  let resultArr = outputObj.result;
  let result = "{";
  for (let i = 0; i < resultArr.length; i++) {
    let symbol = "";
    if (resultArr[i].mvd) {
      symbol = " →→ ";
    } else {
      symbol = " → ";
    }
    result += "{" + resultArr[i].lhs + symbol + resultArr[i].rhs + "}";
    if (i != resultArr.length - 1) {
      result += ",";
    }
  }
  result = result.replaceAll("," , ", ") + "}";
  
  return result;
}

function showResultForProjected(inputObj) {
  let args = getArgsFromInputObj(inputObj);
  
  let output = chase(args.relation, args.dependencies, TASK_PROJECTED_DEPENDENCIES,
    TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, args.projection);
  console.log(output);
  
  let result = getResultFromOutputObj(output);
  let relation = getRelationFromInput(inputObj);
  let dependencies = getDependenciesFromInput(inputObj);
  let projection = getProjectionFromInput(inputObj);
  let title = "Given Relation " + relation + " with Dependencies " + dependencies;
  let outputText = "The Projected Dependencies for the Projection " + projection + " is " + result;
  
  let step = document.createElement("div");
  step.className = "step";
  let stepInfo = document.createElement("h3");
  stepInfo.appendChild(document.createTextNode(title));
  step.append(stepInfo)
  let outputElement = document.createElement("p");
  let node = document.createTextNode(outputText);
  outputElement.appendChild(node);
  step.append(outputElement);
  document.getElementById("output").append(step);
  
  document.getElementById('output').style.display = "block";
}

export async function showOutputForProjected() {
  let inputObj = await convertInputXmlToObj("fileForProjected");
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

  showInputForProjected(inputObj);
  showResultForProjected(inputObj);
}