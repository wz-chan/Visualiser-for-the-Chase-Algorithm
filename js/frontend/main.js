function clearFileInput(taskName) {
  if (taskName === "entailment") {
    fileForEntailment.value = "";
  } else if (taskName === "lossless") {
    fileForLossless.value = "";
  } else if (taskName === "preservation") {
    fileForPreservation.value = "";
  }else if (taskName === "projected") {
    fileForProjected.value = "";
  } else if (taskName === "minimal") {
    fileForMinimal.value = "";
  } 
}

function showFeature(event, taskName) {
  document.getElementById('userInput').style.display = "none";
  document.getElementById('output').style.display = "none";
  document.getElementById('notation').style.display = "none";
  clearFileInput(taskName);
  
  let i, tabContent, tabLinks;

  tabContent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  tabLinks = document.getElementsByClassName("tabLinks");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  document.getElementById(taskName).style.display = "block";
  event.currentTarget.className += " active";
}

async function convertInputXmlToObj(fileName) {
  let inputObj = {};
  let file = document.getElementById(fileName).files[0];
  if (document.getElementById(fileName).value == "") {
    alert("Please select an input XML file!");
    return inputObj;
  }
  
  let text = await file.text();
  let parser = new XMLParser();
  try {
    inputObj = parser.parse(text, true);
  } catch(err) {
    alert("Your XML file is not well-formed:\n" + err.toString().replaceAll("Error: " , ""));
  }
  delete inputObj["?xml"];

  let str = JSON.stringify(inputObj, null, 4);
  console.log(str);
  return inputObj;
}

function convertToArray(element) {
  return element ? [].concat(element) : [];
}

function createOutputStep(columns, rows, description) {
  let step = document.createElement("div");
  step.className = "step";
  let stepInfo = document.createElement("h3");
  stepInfo.appendChild(document.createTextNode(description));
  step.append(stepInfo)
  
  let table = document.createElement("table");
  step.append(table)
  
  let tr = document.createElement('tr');
  table.appendChild(tr);
  
  for (let i = 0; i < columns.length; i++) {
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(columns[i]));
    tr.appendChild(th);
  }
  
  for (let i = 0; i < rows.length; i++) {
    let tr = document.createElement('tr');
    table.appendChild(tr);
    
    for (let j = 0; j < rows[i].length; j++) {
      let td = document.createElement('td');
      td.appendChild(document.createTextNode(rows[i][j]));
      tr.appendChild(td);
    }
  }
    
  document.getElementById("output").append(step);
}

function xmlBuilder(jsObj) {
  const builder = new XMLBuilder;
  let xmlDataStr = builder.build(jsObj);
}