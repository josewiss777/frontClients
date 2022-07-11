//Register imports
import { objClient, showClients, resetIdG } from "./app.js";
import { errorDB, successDB } from './alerts.js'

//Register variables and selectors
const url = 'https://apirestclients.herokuapp.com/client';

//Register functions
async function obtainClients() {  //Función para obtener los registros de la api-rest
    try {
        const response = await fetch(url)
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error)
    }
}

async function obtainClientId(id) {  //Función para obtener un registro por el ID de la api-rest
    try {
        const response = await fetch(`${url}/${id}`)
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error)
    }
}

async function newClient() { //Función para enviar un registro hacia la api-rest
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(objClient),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if(result.type === 'error') {
            errorDB(result.message)
        } 
        if(result.type === 'success') {
            successDB(result.message)
            showClients();
        }
    } catch (error) {
        console.log(error)
    }
}

async function editClient(id) { //Función para editar un registro de la api-rest
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            body: JSON.stringify( objClient ),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if(result.type === 'error') {
            errorDB(result.message)
        } 
        if(result.type === 'success') {
            successDB(result.message)
            showClients();
        } 
    } catch (error) {
        console.log(error)
    }
    resetIdG()
}

async function deleteClient(id) {  //Función para eliminar un registro de la api-rest
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if(result.type === 'error') {
            errorDB(result.message)
        } 
        if(result.type === 'success') {
            successDB(result.message)
            showClients();
        } 
    } catch (error) {
        console.log(error)
    }
}

//Register exports
export { obtainClients, obtainClientId, newClient, editClient, deleteClient }