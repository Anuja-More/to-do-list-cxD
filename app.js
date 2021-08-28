const toDoList = document.querySelector(".todo");
const onGoingList = document.querySelector(".ongoing");
const lists = [...document.querySelectorAll(".list")];
const addToDoForm = document.querySelector(".form__todo");
const deleteZone = document.querySelector(".delete");

let id = 1;
let toDos = [];

// example of todo loads if no to do added yet
let toDosExamples = [
  {
    id: 1,
    title: "Exemple 1",
    description: "book hotel room on Airbnb",
    tag: ["home", "holiday"],
    assignee: "avatar1",
    deadline: "12/08/2021",
    list: "todo"
  },
  {
    id: 2,
    title: "Exemple 2",
    description: "Create Home gym space",
    tag: ["home"],
    assignee: "avatar2",
    deadline: "12/07/2021",
    list: "ongoing"
  },
  {
    id: 3,
    title: "Exemple 3",
    description: "Make cookies for birthday",
    tag: ["home"],
    assignee: "avatar5",
    deadline: "12/12/2021",
    list: "done"
  }
];

// EventListeners
addToDoForm.addEventListener("submit", (e) => {
  if (!checkboxRequired()) {
    e.preventDefault();
  }
});

function cardsEvent() {
  const cards = [...document.querySelectorAll(".card")];
  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  });
}

lists.forEach((list) => {
  list.addEventListener("dragover", function (e) {
    dragOverList(list, e);
  });
  list.addEventListener("dragenter", dragEnter);
  list.addEventListener("dragleave", function (e) {
    dragLeaveList(list, e);
  });
  list.addEventListener("drop", function (e) {
    drop(list, e);
  });
});

function addEventDelete() {
  deleteZone.addEventListener("dragover", dragOver);
  deleteZone.addEventListener("dragenter", dragEnter);
  deleteZone.addEventListener("dragleave", dragLeave);
  deleteZone.addEventListener("drop", function (e) {
    deleteToDo(e);
  });
}

function deleteToDo(e) {
  e.stopImmediatePropagation();
  const id = e.dataTransfer.getData("text/plain");
  console.log("delete " + id);
  //  Filter the to do's which do not have the id of the item to delete
  let newtoDos = [...toDos].filter((item) => item.id.toString() !== id);
  toDos = newtoDos;
  localStorage.setItem("toDos", JSON.stringify(toDos));
  localStorage.setItem("id", highestIdToDo());
  const toDelete = document.querySelector(`[data-id='${id}']`);
  const parent = document.querySelector(`[data-id='${id}']`).parentNode;
  parent.removeChild(toDelete);
  nbToDoPerList();
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.getAttribute(`data-id`));
  deleteZone.classList.remove("hide");
  addEventDelete();
  setTimeout(() => {
    e.target.classList.add("hide");
  }, 0);
}

function dragEnd(e) {
  e.target.classList.remove("hide");
  deleteZone.classList.add("hide");
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragOverList(list, e) {
  e.preventDefault();
  list.classList.add("hover");
}

function dragLeaveList(list, e) {
  e.preventDefault();
  list.classList.remove("hover");
}

function drop(list, e) {
  list.classList.remove("hover");

  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.querySelector(`[data-id='${id}']`);
  changeToDoList(id, list);
  list.appendChild(draggable);
  nbToDoPerList();

  // display the draggable element
  draggable.classList.remove("hide");
}
//Finding the largest id in the array
function highestIdToDo() {
  let toDosTemp = JSON.parse(localStorage.getItem("toDos"));
  let id = 0;
  // map will return an array with all the id numbers and math.max.apply will take the larger number
  id = Math.max.apply(
    null,
    toDosTemp.map((item) => item.id)
  );
  return id >= 0 ? id : 0;
}

function changeToDoList(id, list) {
  let listName = list.className.replace(/list /i, "").replace(/ hover/i, "");
  let toDosTemp = JSON.parse(localStorage.getItem("toDos"));

  toDosTemp.filter((toDo) => toDo.id.toString() === id)[0].list = listName;

  localStorage.setItem("toDos", JSON.stringify(toDosTemp));
}

window.onload = checkToDo();

function checkToDo() {
  const parameters = location.search.substring(1).split("&");

  if (
    JSON.parse(localStorage.getItem("toDos")) === null &&
    parameters[0] === ""
  ) {
    console.log("check 1");
    console.log(JSON.parse(localStorage.getItem("toDos")));
    addToDosToList(toDosExamples);
  } else if (
    JSON.parse(localStorage.getItem("toDos")) === null &&
    parameters[0] != ""
  ) {
    addInfoToDo();
    addToDosToList(toDos);
  } else if (
    JSON.parse(localStorage.getItem("toDos")) != null &&
    parameters[0] != ""
  ) {
    toDos = JSON.parse(localStorage.getItem("toDos"));
    addInfoToDo();
    addToDosToList(toDos);
  } else if (
    JSON.parse(localStorage.getItem("toDos")) != null &&
    parameters[0] === ""
  ) {
    toDos = JSON.parse(localStorage.getItem("toDos"));
    addToDosToList(toDos);
  }
}

function addInfoToDo() {
  const parameters = location.search.substring(1).split("&");

  // to get the id saved in the localstorage
  id = JSON.parse(localStorage.getItem("id"));
  let newTodo = {};
  newTodo.id = id + 1;
  newTodo.list = "todo";
  let tags = [];

  for (x in parameters) {
    let temp = parameters[x].split("=");
    thevar = unescape(temp[0]);

    thevalue = unescape(temp[1]).replaceAll("+", " ");
    if (thevar === "tag") {
      tags.push(thevalue);
      newTodo[thevar] = tags;
    } else if (thevar === "deadline") {
      newTodo[thevar] = new Date(thevalue);
    } else {
      newTodo[thevar] = thevalue;
    }
  }

  if (!compare(newTodo, toDos[toDos.length - 1])) {
    toDos.push(newTodo);
  }
}

function addToDosToList(toDoList) {
  toDoList.forEach((toDo) => {
    const date = new Date(toDo.deadline);

    let temp = `
        <div class="card" data-id="${toDo.id}" draggable="true">
        <div class="card__content">
          <div class="content__title">
            <h3>${toDo.title}</h3>
            <img src="./images/${
              toDo.assignee
            }.png" alt="" class="img__assignee" />
          </div>
          <div class="content__text">
            <p>
             ${toDo.description}
            </p>
          </div>
          <div class="content__footer">
            <div class="footer__tags">
            ${toDo.tag
              .map(
                (tag) =>
                  `<span class="tag tag--${tag.toLowerCase()}">${tag}</span>`
              )
              .join("")}
            </div>
            <div class="footer__deadline">
              <img src="./images/timer-outline.svg" alt="" />
              <p>${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>
        `;

    document
      .querySelector(`.${toDo.list}`)
      .insertAdjacentHTML("beforeend", temp);

    cardsEvent();
  });

  localStorage.setItem("toDos", JSON.stringify(toDoList));
  toDos = toDoList;
  localStorage.setItem("id", highestIdToDo());
  nbToDoPerList();
}

// Function that compares whether the new to-do is the same as the last entry. To avoid re-creating the to-do several times when reloading a page
function compare(obj1, obj2) {
  let obj1Temp = { ...obj1 };
  let obj2Temp = { ...obj2 };

  delete obj1Temp.id;
  delete obj2Temp.id;
  delete obj1Temp.list;
  delete obj2Temp.list;

  if (JSON.stringify(obj1Temp) === JSON.stringify(obj2Temp)) {
    return true;
  } else {
    return false;
  }
}

function checkboxRequired() {
  const checkboxes = [...document.getElementsByName("tag")];
  let checked = false;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      console.log("true");
      checked = true;
    }
  });
  return checked;
}

function nbToDoPerList() {
  lists.forEach((list) => {
    const nbToDos = [...list.getElementsByClassName("card")].length;
    const pNbToDo = list.querySelector(".nbToDo");
    pNbToDo.innerText = nbToDos;
  });
}
