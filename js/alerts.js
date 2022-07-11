//Register import 
import { deleteClient } from './apirest.js'

//Register functions
function messageAlert( title, icon ) {
    Swal.fire({
        toast: true,
        title: title,
        position: 'center',
        background: '#F5F5F5',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        icon: icon,
        showClass: {
            popup: 'animate__animated animate__zoomIn' 
        },
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        }
    })
}

function successDB(message) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
    })
}

function errorDB(message) {
    Swal.fire({
        icon: 'error',
        title: 'Disculpa las molestias',
        text: 'Algo salió mal en la base de datos',
        confirmButtonColor: '#0084ff',
        confirmButtonText: 'REGRESAR',
        footer: `<p class='footerAlert'>Tipo: ${message}</p>`,
    })
}

function confirmDelete(id) {
    Swal.fire({
        title: '¿Deseas eliminar este registro?',
        showCancelButton: true,
        confirmButtonText: 'ELIMINAR',
        cancelButtonText: 'CANCELAR',
        confirmButtonColor: "#0084ff",
      }).then((result) => {
        if (result.isConfirmed) {
            deleteClient(id)
        } 
    })
}

//Register exports
export { messageAlert, successDB, errorDB, confirmDelete }