// Cargamos datos desde localStorage o inicializamos vacío
let gastos = JSON.parse(localStorage.getItem('gastos')) || {};

// Convierte "2025-06" → "Junio 2025"
function obtenerNombreMes(valor) {
    const [anio, mes] = valor.split("-");
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${meses[parseInt(mes, 10) - 1]} ${anio}`;
}

// Muestra la lista de meses ya registrados en <ul id="meses-registrados">
function mostrarMeses() {
    const ul = document.getElementById('meses-registrados');
    if (!ul) return;
    ul.innerHTML = '';

    const clavesMeses = Object.keys(gastos);
    if (clavesMeses.length === 0) {
        ul.innerHTML = '<li>No hay meses registrados aún.</li>';
        return;
    }

    clavesMeses.forEach(mes => {
        const li = document.createElement('li');
        li.textContent = obtenerNombreMes(mes);
        ul.appendChild(li);
    });
    }

// Redirige a la página de gastos (podrías agregar parámetro si quieres)
function irAGastos() {
    window.location.href = 'gastos.html';
}

// Al cargar la página, mostramos los meses registrados
document.addEventListener('DOMContentLoaded', mostrarMeses);
