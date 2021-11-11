
const LS_keyChain = "TaskKeyChain";
const modal = document.getElementById("modal");
const task_space = document.getElementById("tasks-space")
const openbtn = document.getElementById("btn-nuevo");
const see_all = document.getElementById("see-all");
const close_btn = document.getElementById("modal-close-btn");
const newtask_form = document.getElementById("new-task");

var keychain = [];
var task_list = [];

const attr_toggle = "data-toggle";
const attr_target = "data-target";
const attr_dismiss = "data-dismis";
const class_modal = "modal";
const class_task = "task"
const class_show = "show";
const class_hide = "hide";
const class_complete = "complete";
const name_complete = "complete";

document.addEventListener("DOMContentLoaded",function(){

    console.log("Script listos para correr");
    console.log(new Date());
    loadTasks();

    let modalopenbuttons = document.querySelectorAll(`[${attr_toggle}='${class_modal}']`);

    modalopenbuttons.forEach(btn => { btn.addEventListener("click",openModal); });

    close_btn.addEventListener("click",closeModal);

    newtask_form.addEventListener("submit",saveNewTask);

    let complete_checkboxes = document.querySelectorAll(`[${attr_toggle}='${class_task}']`);

    complete_checkboxes.forEach(btn => { 
        btn.addEventListener("click",function(){
            acomplete(btn);
        })});

    see_all.addEventListener("click",function(){showAll(see_all);});

})
/**
 * funcion que edita una tarea a completada, buscara el elemento perenenciente al identificador en attr_target del checkbox
 * agregando la clase complete. ocultara la tarea si es posible.
 * @param {checkbox} box 
 */
function acomplete(box)
{
    console.log(box);
    let task_selector = box.getAttribute(attr_target);
    let tasktarget = document.getElementById    (task_selector);
    console.log(tasktarget);
    if(box.checked)
    {
        tasktarget.classList.add(class_complete);
        if(!see_all.checked)
            tasktarget.classList.add(class_hide);
    }
        
    else{
        tasktarget.classList.remove(class_complete);
        tasktarget.classList.remove(class_hide);
    }
    updateLStask(tasktarget,box.checked);
}

/**
 * muestra todas las tareas, incluyendo las que se completaron
 * @param {checkbox} box 
 */
function showAll(box){  
    task_list.forEach(element => {
        if(box.checked)
            element.classList.remove(class_hide);
        else{  
            if(element.classList.contains(class_complete))
                element.classList.add(class_hide);
        }
    });
}

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

/**
 * carga un llavero del localstorage para cargar todas las tareas guardadas.
 */
function loadTasks(){

    let keys = localStorage.getItem(LS_keyChain);
    if(keys === null)
        return;

    keychain = JSON.parse(keys);

    keychain.forEach(task_key =>{
        let task_json = localStorage.getItem(task_key);
        let task_data = JSON.parse(task_json);
        addToList(task_data);
    });

};

/**
 * Regresa el  formulario de nueva tarea a un estado por defecto
 */
function emptyForm(){
    newtask_form["title"].value = null;
    newtask_form["description"].value = null;
    var fechas = document.querySelector('input[type="date"]');
    fechas.value = "2021-01-01";
}

/**
 * Toma los datos del formulario y los usa para crear un objeto, el cual guardara la informacion relevante
 * de una tarea en el localstorage.
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

    console.log(data);

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
    let keydate = "key" + today.getDay().toString() + "-" 
                + today.getMonth().toString() + "-" 
                + today.getFullYear().toString() + "/" 
                + today.getHours().toString() + ":"
                + today.getMinutes().toString() + ":"
                + today.getSeconds  ().toString();
    console.log(keydate);
    return keydate;
}

/**
 * funcion para agregar una tarea, creada o cargada a la pagina
 * @param {Object} data 
 */
function addToList(data)
{
    newtask = document.createElement("div");
    newtask.className = "col-12 task";
    let check = null;
    if(data.complete){
        newtask.classList.add(class_complete,class_hide);
        check = "checked";
    }
        
    newtask.id = data.id;
    newtask.innerHTML = `
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
                <input type="checkbox" name="checkbox" ${check} data-toggle="task" data-target="${data.id}">
                <label for="checkbox">Completa</label>
            </div>
        </div>`
    task_list.push(newtask);
    task_space.appendChild(newtask);
    
}

/**
 * funcion para actualizar los datos en el localstorage cuando una tarea se completa o se cambia.
 * @param {Object} data la informacion del elemento
 * @param {boolean} checked un booleano acorde al checkbox del elemento
 */
function updateLStask(data,checked){
    let djson = JSON.parse(localStorage.getItem(data.id));
    djson.complete = checked;
    let backjson = JSON.stringify(djson);
    localStorage.setItem(data.id,backjson);

}