let addOrUpdate;

window.onload = function () {
  // add event handlers for buttons
  document.querySelector("#GetButton").addEventListener("click", getAllItems);
  document.querySelector("#AddButton").addEventListener("click", addItem);
  document.querySelector("#DeleteButton").addEventListener("click", deleteItem);
  document.querySelector("#UpdateButton").addEventListener("click", updateItem);
  document.querySelector("#DoneButton").addEventListener("click", processForm);
  document
    .querySelector("#CancelButton")
    .addEventListener("click", cancelAddUpdate);

  // add event handler for selections on the table
  document.querySelector("table").addEventListener("click", handleRowClick);

  //loadMenuItemCategories();
  hideUpdatePanel();
};

function clearSelections() {
  let trs = document.querySelectorAll("tr");
  for (let i = 0; i < trs.length; i++) {
    trs[i].classList.remove("highlighted");
  }
}

function handleRowClick(e) {
  //add style to parent of clicked cell
  clearSelections();
  e.target.parentElement.classList.add("highlighted");

  // enable Delete and Update buttons
  document.querySelector("#DeleteButton").removeAttribute("disabled");
  document.querySelector("#UpdateButton").removeAttribute("disabled");
}

function cancelAddUpdate() {
  hideUpdatePanel();
}

function processForm() {
  // We need to send the data to the server.
  // We will create a JSON string and pass it to the "send" method
  // of the HttpRequest object. Then if we send the request with POST,
  // the JSON string will be included as part of the message body
  // (not a form parameter).
  let itemID = parseInt(document.querySelector("#itemIDInput").value);
  let itemCategoryID = document.querySelector("#FirstName").value;
  let description = document.querySelector("#LastName").value;
  let price = document.querySelector("#Email").value;
  let vegetarian = document.querySelector("#PhoneNumber").value;

  let obj = {
    id: itemID,
    FirstName: itemCategoryID,
    LastName: description,
    Email: price,
    PhoneNumber: vegetarian,
  };
  if (addOrUpdate == "add") {
    obj = {
      Id: itemID,
      FirstName: itemCategoryID,
      LastName: description,
      Email: price,
      PhoneNumber: vegetarian,
    };
  }
  console.log(obj);
  //let url = "menuService/items/" + itemID;
  let url = "http://localhost:3000/items/" + itemID;
  let method = addOrUpdate === "add" ? "POST" : "PUT";
  console.log(method);
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      console.log(xmlhttp.response.status);
      let resp = xmlhttp.responseText;
      console.log(resp);
      if (resp.search("ERROR") >= 0 || resp != 1) {
        alert("Unable to add or Update the item");
        console.log(resp);
      } else {
        getAllItems();
      }
    }
  };
  xmlhttp.open(method, url, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify(obj));
}

function deleteItem() {
  let id = document.querySelector(".highlighted").querySelector("td").innerHTML;
  //let url = "api/deleteItem.php";
  console.log(id);
  let url = "http://localhost:3000/items/" + id; // entity, not action
  console.log(url);
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status == 400) {
      alert(xmlhttp.status + " : cannot delete item that doesn't exist");
      getAllItems();
      return;
    }
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      let resp = xmlhttp.responseText;
      if (resp.search("ERROR") >= 0 || resp != 1) {
        alert("could not complete request");
        console.log(resp);
      } else {
        getAllItems();
      }
    }
  };
  xmlhttp.open("DELETE", url, true); // "DELETE" is the action, "url" is the entity
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();
}

function addItem() {
  // Show panel, panel handler takes care of the rest
  addOrUpdate = "add";
  resetUpdatePanel();
  showUpdatePanel();
}

function updateItem() {
  addOrUpdate = "update";
  resetUpdatePanel();
  populateUpdatePanelWithSelectedItem();
  showUpdatePanel();
}

function showUpdatePanel() {
  document.getElementById("AddUpdatePanel").classList.remove("hidden");
}

function hideUpdatePanel() {
  document.getElementById("AddUpdatePanel").classList.add("hidden");
}

// function loadMenuItemCategories() {
//   //let url = "menuService/categories";
//   let url = "http://localhost:3000/categories";
//   let xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function () {
//     if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
//       let resp = xmlhttp.responseText;
//       //console.log(resp);
//       if (resp.search("ERROR") >= 0) {
//         alert("oh no...");
//         console.log(resp);
//       } else {
//         initUpdatePanel(resp);
//       }
//     }
//   };
//   xmlhttp.open("GET", url, true);
//   xmlhttp.send();
// }

// function initUpdatePanel(text) {
//   let cats = JSON.parse(text);
//   console.log(cats);
//   let html = "";
//   for (let i = 0; i < cats.length; i++) {
//     console.log(cats[i]);
//     let id = cats[i];
//     let desc = cats[i];
//     html += "<option value='" + id + "'>" + desc + "</option>";
//     console.log();
//   }
//   document.querySelector("#categorySelect").innerHTML = html;
//   resetUpdatePanel();
// }

function resetUpdatePanel() {
  document.querySelector("#itemIDInput").value = "";
  //document.querySelectorAll("option")[0].selected = true; // select first one
  document.querySelector("#FirstName").value = "";
  document.querySelector("#LastName").value = "";
  document.querySelector("#Email").value = "";
  document.querySelector("#PhoneNumber").value = "";
}

function populateUpdatePanelWithSelectedItem() {
  let tds = document.querySelector(".highlighted").querySelectorAll("td");
  console.log(tds[4].innerHTML);
  document.querySelector("#itemIDInput").value = tds[0].innerHTML;
  document.querySelector("#FirstName").value = tds[1].innerHTML;
  document.querySelector("#LastName").value = tds[2].innerHTML;
  document.querySelector("#Email").value = tds[3].innerHTML;
  document.querySelector("#PhoneNumber").value = tds[4].innerHTML.toString();
}

// make AJAX call to PHP to get JSON data
function getAllItems() {
  // let url = "api/getAllItems.php";
  //let url = "menuService/items"; // REST-style: URL refers to an entity or collection, not an action
  let url = "http://localhost:3000/items";
  let xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      let resp = xmlhttp.responseText;
      console.log(resp);
      if (resp.search("ERROR") >= 0) {
        alert("oh no... see console for error");
        console.log(resp);
      } else {
        buildTable(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        console.log("here");
        clearSelections();
        resetUpdatePanel();
        hideUpdatePanel();
      }
    }
  };
  xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
  //   xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlhttp.send();

  // disable Delete and Update buttons
  document.querySelector("#DeleteButton").setAttribute("disabled", "disabled");
  document.querySelector("#UpdateButton").setAttribute("disabled", "disabled");
}

function buildTable(text) {
  let data = JSON.parse(text);
  console.log(data);
  let theTable = document.querySelector("table");
  let html = theTable.querySelector("tr").innerHTML;
  for (let i = 0; i < data.length; i++) {
    let temp = data[i];
    html += "<tr>";
    html += "<td>" + temp.Id + "</td>";
    html += "<td>" + temp.FirstName + "</td>";
    html += "<td>" + temp.LastName + "</td>";
    html += "<td>" + temp.Email + "</td>";
    html += "<td>" + temp.PhoneNumber + "</td>";
    html += "</tr>";
  }
  theTable.innerHTML = html;
}
