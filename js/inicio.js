let gastos = JSON.parse(localStorage.getItem('gastos')) || {};

function obtenerNombreMes(valor) {
    const [anio, mes] = valor.split("_");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    return `${meses[parseInt(mes) - 1]} ${anio}`;
}

// Muestra los meses ya registrados
function mostrarMeses() {
    const ul = document.getElementById('meses-registrados');
    ul.innerHTML = '';

    const clavesMeses = Object.keys('gastos');
    if (clavesMeses.length === 0) {
        ul.innerHTML = '<li>No hay meses registrados aún.</li>';
        return;
    }

    clavesMeses.forEach(mes => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${obtenerNombreMes(mes)}</strong>`;
        ul.appendChild(li);
    });
}

function irAGastos() {
    window.location.href = "gastos.html";
}

window.addEventListener('DOMContentLoaded', mostrarMeses);