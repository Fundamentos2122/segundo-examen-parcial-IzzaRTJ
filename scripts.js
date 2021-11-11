
const LS_keyChain = "TaskKeyChain";
var modal = document.getElementById("modal");
const task_space = document.getElementById("tasks-space")
var openbtn = document.getElementById("btn-nuevo");


var keychain = [];
var task_list = [];

var attr_toggel = "data-toggle";
var attr_target = "data-target";
const attr_dismiss = "data-dismis";

var class_modal = "modal";
var class_show = "show";

document.addEventListener("DOMContentLoaded",function(){
    let modalopenbuttons = document.querySelectorAll(`[${attr_toggel}='${class_modal}']`);
    modalopenbuttons.forEach(btn => {
        btn.addEventListener("click",openModal);
    })

    loadTasks();



})
/**
 * Muestra un modal
 * @param {PointerEvent} e 
 */
function openModal(e){
    let modal_selector = e.target.getAttribute(attr_target);

    let modal = document.querySelector(modal_selector);

    modal.style.display="block";

    modal.classList.add(class_show)
};

/**
 * cierra modal
 * @param {PointerEvent} e 
 */
 function closeModal(e){
    let modal_selector = e.target.getAttribute(attr_dismiss);

    let modal = document.querySelector(modal_selector);

    modal.clasdList.remove(class_modal)
};

function loadTasks(){

    let keys = localStorage.getItem(LS_keyChain);
    if(keys === null)
        return;

    keychain = JSON.parse(keys);

    keychain.forEach(task_key =>{
        let task_json = localStorage.getItem(task_key);
        let task_data = JSON.parse(task_json);
        console.log(task_data);
        addToList(task_data);
        //task_list.push(task_data);
        //funcion para cargar las tareas
    });

};

function printTaskList(){

}

function examplesave(){
    var ejemplo = [];

    ejemplo.push("uno");
    ejemplo.push("dos");
    ejemplo.push("tres");
    ejemplo.push("cuatro");
    console.log(ejemplo);

    var jsoneje = JSON.stringify(ejemplo);

    console.log(jsoneje);

    localStorage.setItem("ejemjson",jsoneje);
    localStorage.setItem("ejemarre",ejemplo);

    var backjson = localStorage.getItem("ejemjson");
    var backarre = localStorage.getItem("ejemarre");

    console.log("modo json ",backjson);
    console.log("modo arreglo ",backarre);

    var jsonarreglo = JSON.parse(backjson);

    console.log(jsonarreglo);

    jsonarreglo.forEach(element => {
        console.log(element);
    });
}

function completeTask(){

}

var modal = document.getElementById("modal");
var close_btn = document.getElementById("modal-close-btn");

var newtask_form = document.getElementById("new-task");


document.addEventListener("DOMContentLoaded",function(){
    console.log("modal button script, loaded");
    console.log(new Date());
    close_btn.addEventListener("click",function(){
        closeModal();
    })

    newtask_form.addEventListener("submit",function(e){
        saveNewTask(e)
    })

});

function closeModal(){
    modal.style.display = "none";
    emptyForm();
}

function emptyForm(){
    newtask_form["title"].value = null;
    newtask_form["description"].value = null;
    var fechas = document.querySelector('input[type="date"]');
    fechas.value = "2021-01-01";
}

/**
 * guarda los datos en localStorage y agrega la nueva tarea a la pantalla
 * @param {PointerEvent} e 
 */
function saveNewTask(e){
    e.preventDefault();
    //creamos un objeto que contendra la informacion relevante de la tarea
    var tempdate = document.querySelector('input[type="date"]');

    var data = {
        title : newtask_form["title"].value, 
        description : newtask_form["description"].value, 
        date : tempdate.value, 
        complete : false,
        id : dateToKey()
    };

    //generamos una llave para la informacion de la tarea y la guardamos en el localstorage
    var datajson = JSON.stringify(data);
    localStorage.setItem(data.id,datajson);

    //agregamos la nueva llave al arreglo de llaves actual y guardamos el llavero en el localstorage
    keychain.push(data.id);
    var keyjson = JSON.stringify(keychain);
    localStorage.setItem(LS_keyChain,keyjson);
    addToList(data);
    //cerramos  el modal
    closeModal();
};

/**
 * funcion para crear una llave apartir de la fecha actual, regresa una cadena
 */
function dateToKey(){
    let today = new Date();
    let keydate = today.getDay().toString() + "-" 
                + today.getMonth().toString() + "-" 
                + today.getFullYear().toString() + "/" 
                + today.getHours().toString() + ":"
                + today.getMinutes().toString() + ":"
                + today.getSeconds  ().toString();
    console.log(keydate);
    return keydate;
}

/**
 * funcion para agregar la nueca tarea a la lista de tareas
 * @param {Object} data 
 */
function addToList(data)
{
    newtask = document.createElement("div");
    newtask.className = ("col-12");
    newtask.innerHTML = `
    <div class="col-12" style="border-top: 1px solid gray;" id="${data.id}">
        <div class="row">
            <div class="col-12 col-md-8">
                ${data.title}
            </div>
            <div class="col-12 col-md-4 toLeft">
                ${data.date}
            </div>
            <div class="col-12">
                ${data.description}
            </div>
            <div class="col-12 toLeft">
                <input type="checkbox" name="checkbox" data-toggle = "" data-target="#${data.id}">
                <label for="checkbox">Completa</label>
            </div>
        </div>
    </div>`
    task_space.appendChild(newtask);
}