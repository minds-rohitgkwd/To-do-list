// --------------------- variables  ---------------------------

const ADD_TITLE = document.getElementById("add-title");
const ADD_DESC = document.getElementById("add-desc");
const ADD_TASK = document.getElementById("add-task-btn");
const TASK_LIST = document.getElementById("task-list");
const TASK_SECTION = document.getElementById("task-section");
const DELETE_ALL = document.getElementById("delete-all-btn");
const CREATE_TASK = document.getElementById("create-task-btn");
const INPUT_TOGGLE_BTN = document.getElementById("input-toggle-btn");
const TASK_INPUT = document.getElementById("task-input-area");
const COLLAPSE = document.querySelector(".task-collapse");
const MARK_IMP = document.getElementById("mark-imp-btn");
const LIST_HEADING = document.getElementById("list-heading");

// variables for lists

const LIST_COMPLETED_BTN = document.getElementById("completed-task-lt-btn");
const LIST_ALL_BTN = document.getElementById("all-task-lt-btn");
const BADGE_COMPLETED = document.getElementById("badge-completed");

let SAVE_BTN;

// local storage variables

let task_array = JSON.parse(localStorage.getItem("task")) || [];
let data = JSON.parse(localStorage.getItem("task"));

// call to function for display list on load

renderList();

const MARK_FLAG = document.getElementById("flag-mark")


// ------------------call to Event Listeners --------------------------------

LIST_COMPLETED_BTN.addEventListener("click", renderCompletedList);
LIST_ALL_BTN.addEventListener("click", renderList);
ADD_TASK.addEventListener("click", addNewTask);

ADD_TITLE.addEventListener("input", enableAddBtn);
ADD_DESC.addEventListener("input", enableAddBtn);



//   Delete all task list

DELETE_ALL.addEventListener("click", function () {
  localStorage.clear();
  renderList();
  task_array = [];
});





//   ----------------------------------- ALL FUNCTIONS -----------------------------------


// ------- function for display completed tasks list --------------------------------

function renderCompletedList() {
  TASK_LIST.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    if (data[i].hasOwnProperty("index")) {
      TASK_LIST.innerHTML += `<li class="list-group-item d-flex align-items-center text-muted" id="list-item" >
      <i class= "fa-solid fa-square-check m-2"  id="check-box" ></i>
     
      <div class="ms-2 me-auto" >
      <div class="fw-bold text-wrap text-break">${data[i].title}</div>
        <span class="text-wrap text-break"> ${data[i].desc} </span>
      </div>
      <div class="d-flex flex-column align-items-center " id="buttons">
        <i class="fa-solid fa-pen-to-square m-3" ></i>
        <i class="fa-solid fa-trash" id="trash"  ></i>
      </div>
    </li>`;
    }
  }

  CREATE_TASK.classList.add("d-none");
  DELETE_ALL.classList.add("d-none");
  LIST_HEADING.className = "d-block";

  
}


// ---------- function for adding new task ------------------------

function addNewTask() {

  if (/\S/.test(ADD_TITLE.value) || /\S/.test(ADD_DESC.value)) {
    let task_obj = {
      title: ADD_TITLE.value,
      desc: ADD_DESC.value,
      status: "false",
    };

    COLLAPSE.classList.replace("show", "add");
    task_array.unshift(task_obj);
    updateList();
  
  }
}

//  ---------- function for enable add button -----------------------------

function enableAddBtn() {
  ADD_TASK.setAttribute("disabled", "");

  if (ADD_TITLE.value != "") {
    ADD_TASK.removeAttribute("disabled");
  }
}

// ------- function to update the list --------------------------------

function updateList() {
  localStorage.setItem("task", JSON.stringify(task_array));
  data = JSON.parse(localStorage.getItem("task"));
  renderList();

  ADD_TITLE.value = "";
  ADD_DESC.value = "";
}

// ---------- function to display the list ---------------------

function renderList() {

  CREATE_TASK.classList.remove("d-none");
  DELETE_ALL.classList.remove("d-none");
  LIST_HEADING.className = "d-none";

  data = JSON.parse(localStorage.getItem("task"));

  TASK_LIST.innerHTML = "";

  if (localStorage.length != 0) {
    for (let i = 0; i < data.length; i++) {
      TASK_LIST.innerHTML += `<li class="list-group-item d-flex align-items-center " id="list-item" >
      <i class= "fa-regular fa-square-check m-2" onclick= "markDone(${i})" id="check-box" ></i>
     
      <div class="ms-2 me-auto" >
      <div class="fw-bold text-wrap text-break">${data[i].title}</div>
        <span class="text-wrap text-break"> ${data[i].desc} </span>
      </div>
      <div class="d-flex flex-column align-items-center " id="buttons">
        <i class="fa-solid fa-pen-to-square m-3" onclick="editTask(${i})"></i>
        <i class="fa-solid fa-trash" id="trash" onclick="deleteItem(${i})" ></i>
      </div>
    </li>`;

      const LIST_ITEM = document.querySelectorAll("#list-item");
      const CHECK_BOX = document.querySelectorAll("#check-box")
      const checked_box = CHECK_BOX[i];

      if (data[i].status == "true") {
        LIST_ITEM[i].classList.add("text-muted");
        checked_box.classList.add("fa-solid")
      } else {
        LIST_ITEM[i].classList.remove("text-muted");
        checked_box.classList.remove("fa-solid")
      }
    }

    DELETE_ALL.removeAttribute("disabled");

  } else {
    TASK_LIST.innerHTML = `<p> No task added </P>`;
    DELETE_ALL.setAttribute("disabled", "");
  }
}

//     ------------- function to delete selected task-----------------

function deleteItem(i) {
  data.splice(i, 1);
  localStorage.setItem("task", JSON.stringify(data));

  renderList();
  task_array = JSON.parse(localStorage.getItem("task")) || [];
}

//    =---------------------- function to mark as done ------------------------

function markDone(i) {
  if (data[i]["status"] == "true") {
    data[i]["status"] = "false";
    delete data[i]["index"];
    localStorage.setItem("task", JSON.stringify(data));
  } else {
    data[i]["status"] = "true";
    data[i]["index"] = i;
    localStorage.setItem("task", JSON.stringify(data));
  }

  renderList();

}


//  -------------------- function to mark as important --------------------

// function markImportant(){
//   MARK_IMP.classList.toggle("fa-solid");
    
//   if(MARK_IMP.classList.contains("fa-solid")){
//     MARK_FLAG.classList.add("d-none")
//     console.log(MARK_FLAG)
//   }

// }



//   ----------- function to edit a task ----------------------

function editTask(i) {
  ADD_TITLE.value = data[i].title;
  ADD_DESC.value = data[i].desc;

  COLLAPSE.classList.add("show");

  if (document.getElementById("save-task-btn") == null) {
    addSaveBtn();

    SAVE_BTN.addEventListener("click", function () {
      data[i].title = ADD_TITLE.value;
      data[i].desc = ADD_DESC.value;
      localStorage.setItem("task", JSON.stringify(data));

      renderList();
      deleteSaveBtn();

      task_array = JSON.parse(localStorage.getItem("task")) || [];

      ADD_TITLE.value = "";
      ADD_DESC.value = "";
    });
  }
}

// ---------- function to delete the save button ------------------------

function deleteSaveBtn() {
  const target = document.querySelector("#save-task-btn");
  target.remove();
  COLLAPSE.classList.replace("show", "add");
}

// ---------- function to add save button ---------------

function addSaveBtn() {
  var save_btn = document.createElement("button");
  save_btn.textContent = "save";
  save_btn.id = "save-task-btn";
  save_btn.classList.add("btn", "btn-outline-success", "btn-sm", "m-2");
  TASK_INPUT.appendChild(save_btn);

  SAVE_BTN = document.getElementById("save-task-btn");
  SAVE_BTN.setAttribute("data-bs-dismiss", "modal");
}
