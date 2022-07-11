//Register imports
import { messageAlert, confirmDelete, errorDB } from "./alerts.js";
import { newClient, editClient, obtainClients, obtainClientId } from "./apirest.js";

//Register variables and selectors
const btnClient = document.querySelector('#new-client');
const table = document.querySelector('.table-container');
const header = document.querySelector('.header');
const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
let idG = 0;
let objClient = {
    name: "",
    phone: "",
    email: "",
    basic: "checked",
    full: "",
    date: "",
};

//Register events
document.addEventListener('DOMContentLoaded', showClients);
btnClient.addEventListener('click', modalClient);
table.addEventListener('click', editDelete)

//Register functions
async function showClients() {
    cleanHTML();
    const clients = await obtainClients(); 
    if(clients.length === 0) {
        table.classList.add('none');
        header.children[0].classList.add('none');
        header.children[1].classList.remove('none');
    } 
    if(clients.length > 0) {
        table.classList.remove('none');
        header.children[0].classList.remove('none');
        header.children[1].classList.add('none');
        clients.forEach( e => {
            const { id, name, phone, email, basic, full, date } = e;
            let type;
            if(basic !== "") {
                type = 'Básico';
            }
            if(full !== "") {
                type = 'Completo';
            }
            const row = document.createElement('tr');
            const trName = document.createElement('td');
            trName.append(name);
            const trPhone = document.createElement('td');
            trPhone.append(phone);
            const trEmail = document.createElement('td');
            trEmail.append(email);
            const trType = document.createElement('td');
            trType.append(type);
            const trDate = document.createElement('td');
            trDate.append(date);
            const trActions = document.createElement('td');
            trActions.innerHTML = `<img src="../images/edit.svg" alt="editar" class="edit" id=${id}>  <img src="../images/trash.svg" alt="eliminar" class="delete" id=${id}>`
            row.append(trName);
            row.append(trPhone);
            row.append(trEmail);
            row.append(trType);
            row.append(trDate);
            row.append(trActions);
            document.querySelector('.table-container tbody').appendChild(row);
        });
    };
    if(clients.message) {
        table.classList.add('none');
        header.children[0].classList.add('none');
        header.children[1].classList.remove('none');
        errorDB(clients.message);
    };
    resetObject();
};

async function modalClient() {
    if(idG === 0) {
        moment.locale('es');  
        objClient.date = moment().format('D MMMM - YYYY');
    };
    const { name, phone, email, basic, full, date } = objClient;
    const { value:values } = await Swal.fire({
        html:  
            `<h2>Registrar nuevo cliente</h2>    
            <div class="divInputs">
                <label for="name">Nombre</label>
                <input type="text" id="name" placeholder="Nombre Cliente" value='${name}'>
                <label for="phone">Teléfono</label>
                <input type="tel" id="phone" placeholder="Teléfono Cliente" value='${phone}'>
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email Cliente" value='${email}'>
            </div>
            <div class="divRadio">
                <p>Tipo plan</p>
                <input type="radio" name="typePlan" value="Básico" ${basic}><label>Básico</label>
                <input type="radio" name="typePlan" value="Completo" ${full}><label>Completo</label>
            </div>`,
        footer: `<span>${date}</span>`,
        focusConfirm: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        backdrop: "#808080ea",
        confirmButtonText: "GUARDAR",
        confirmButtonColor: "#0084ff",
        showCancelButton: true,
        cancelButtonText: "CANCELAR",       
        showClass: {
            popup: 'animate__animated animate__bounceInLeft',
        },
        hideClass: {
            popup: 'animate__animated animate__bounceOutRight'
        },
        preConfirm: () => {
            const type = document.querySelector('input[name="typePlan"]:checked').value
            if(type === 'Básico') {
                objClient = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    basic: "checked",
                    full: "",
                    date
                }
            } else {
                objClient = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    basic: "",
                    full: "checked",
                    date
                }
            }
            return
        }
    });
    if(values) {
        validateData();
    } else {
        resetObject();
        idG = 0;
    }
}

function validateData() {
    const { name, phone, email } = objClient;
    if( name === "" || phone === "" || email === "" ) {
        messageAlert('Todos los campos son obligatorios', 'error');
        setTimeout(() => {
            modalClient();
        }, 1800);
        return;
    }
    if(email) {
        if( regularExpression.test(email) === false ) {
            messageAlert('Email no válido', 'error');
            setTimeout(() => {
                modalClient();
            }, 1800);
            return;
        } 
    }
    if(idG === 0) {
        newClient();
    } else {
        editClient(idG);
    };  
};

async function editDelete(e) {
    if(e.target.classList.contains('edit')) {
        const resultClient = await obtainClientId(e.target.id);
        if(resultClient.message) {
            errorDB(resultClient.message);
        };
        if(resultClient) {
            idG = parseInt(e.target.id);
            const { name, phone, email, basic, full, date } = resultClient;
            objClient = {
                name,
                phone,
                email,
                basic,
                full,
                date
            };
            modalClient();
        };    
    };
    if(e.target.classList.contains('delete')) {
        confirmDelete(parseInt(e.target.id));
    }
}

//Register support functions
function cleanHTML() {
    while(table.children[1].firstChild) {
        table.children[1].removeChild(table.children[1].firstChild);
    };
};

function resetObject() {
    objClient.name = "",
    objClient.phone = "",
    objClient.email = "",
    objClient.basic = "checked",
    objClient.full = "",
    objClient.date = ""
};

function resetIdG() {
    idG = 0;
};

//Register export
export { objClient, showClients, resetIdG };