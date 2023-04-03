import {chase} from "../backend/chase.js";
import {TASK_MINIMAL_COVER, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE} from "../backend/global.js";

function getRelationFromInput(inputObj) {
  let relation = "{" + inputObj.chase.minimal_cover.relation.attribute.toString();
  relation = relation.replaceAll("," , ", ") + "}";
  return relation;
}

function getDependenciesFromInput(inputObj) {
  let dependencies = "{";
  let dependenciesArr = inputObj.chase.minimal_cover.dependency;
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

function showInputForMinimal(inputObj) {
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
  
  document.getElementById("userInputFields").append(relation, dependencies);
}

function getArgsFromInputObj(inputObj) {
  let relation = convertToArray(inputObj.chase.minimal_cover.relation.attribute);
  
  let dependenciesArr = convertToArray(inputObj.chase.minimal_cover.dependency);
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
  return {relation: relation, dependencies: dependencies};
}

function showResultForMinimal(inputObj) {
  let args = getArgsFromInputObj(inputObj);
  
  let output = chase(args.relation, args.dependencies, TASK_MINIMAL_COVER, TYPE_CHASE_WITH_DISTINGUISHED_VARIABLE, null);
  console.log(output);
  
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
  let resultStr = "";
  if (result) {
    resultStr = "Dependencies " + dependencies + " is a minimal cover for Relation " + relation;
  } else {
    resultStr = "Dependencies " + dependencies + " is NOT a minimal cover for Relation " + relation;
  }
  
  let finalTableau = output.finalTableau;
  let columns = finalTableau.columns;
  let rows = finalTableau.rows;
  createOutputStep(columns, rows, resultStr);
   
  document.getElementById('output').style.display = "block";
}

export async function showOutputForMinimal() {
  let inputObj = await convertInputXmlToObj("fileForMinimal");
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

  showInputForMinimal(inputObj);
  showResultForMinimal(inputObj);
}
