// Elementos del DOM
const mesRegistro = document.getElementById('mes-registro');
const inputSueldo = document.getElementById('input-sueldo');
const formularioGasto = document.getElementById('formulario-gasto');
const mesMostrada = document.getElementById('mes-seleccionado');
const gastoForm = document.getElementById('gasto-form');
const listaGastos = document.getElementById('lista-gastos');
const totalSpan = document.getElementById('total');

// Datos almacenados
let gastos = JSON.parse(localStorage.getItem('gastos')) || {};
let mesActual = null;

// Mostrarel formulario cuando se elige una fecha
mesRegistro.addEventListener('change', () => {
    mesActual = mesRegistro.value;
    
    if (mesActual) {
        formularioGasto.style.display = 'block';
        mesMostrada.textContent = mesActual;
        mostrarGastosPorMes(mesActual);
    }
});

inputSueldo.addEventListener('input', () => {
    const nuevoSueldo = parseFloat(inputSueldo.value);
    if (!mesActual) return;

    if (!gastos[mesActual]) {
        gastos[mesActual] = { sueldo: null, lista: [] };
    }

    gastos[mesActual].sueldo = isNaN(nuevoSueldo) ? null : nuevoSueldo;
    localStorage.setItem('gastos', JSON.stringify(gastos));
    mostrarGastosPorMes(mesActual);
});

// Agregar gasto al formulario
gastoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const fechaGasto = document.getElementById('fecha-gasto').value;
    const pagado = document.getElementById('estado').checked;

    if (!mesActual) return alert('Primero selecciona un mes');
    
    const nuevoGasto = { nombre, monto, fecha: fechaGasto, pagado };

    // crea array si no hay un array para la fecha
    if (!gastos[mesActual]) {
        gastos[mesActual] = {
            sueldo: null,
            lista: []
        };
    }

    // Guardamos el nuevo gasto
    gastos[mesActual].lista.push(nuevoGasto);
    localStorage.setItem('gastos', JSON.stringify(gastos)); // actualiza el localStorage

    // Limpiar el formulario y actualizar la lista
    gastoForm.reset();
    mostrarGastosPorMes(mesActual);
});

// Mostrar los gastos para la fecha seleccionada
function mostrarGastosPorMes(mes) {
    listaGastos.innerHTML = '';
    let total = 0;
    
    const dataMes = gastos[mes] || { sueldo: null, lista: [] };

    inputSueldo.value = dataMes.sueldo ?? '';

    const gastosMes = dataMes.lista; 

    gastosMes.forEach((gasto, index) => {
    total += gasto.monto;

    const li = document.createElement('li');
    li.innerHTML = `
        ${gasto.nombre} - $${gasto.monto} - ${gasto.fecha} - ${gasto.pagado ? '✅ Pagado' : '❌ No pagado'}
        <button onclick="eliminarGasto ('${mes}', ${index}) id="delete" ">Eliminar</button>`;

        listaGastos.appendChild(li);
    });

    totalSpan.textContent = total;

    // Mostrar sueldo y saldo si esta definido
    const infoSueldo = document.getElementById('info-sueldo');
    const sueldoSpan = document.getElementById('sueldo-mostrado');
    const saldoSpan = document.getElementById('saldo-restante');

    if (dataMes.sueldo !== null && !isNaN(dataMes.sueldo)) {
        sueldoSpan.textContent = dataMes.sueldo;
        saldoSpan.textContent = dataMes.sueldo - total;
        infoSueldo.style.display = 'block';
    } else {
        infoSueldo.style.display = 'none';
    }
}

// Eliminar gasto seleccionado
function eliminarGasto(mes, index) {
    gastos[mes].splice(index, 1);

    // si noquedan gastos para esa fecha, se borrara la fecha
    if (gastos[mes].length === 0) {
        delete gastos[mes];
    }

    localStorage.setItem('gastos', JSON.stringify(gastos));
    mostrarGastosPorMes(mes);
}


// Convertir la fecha en "Junio 2025"

function obtenerNombreMes(valor) {
    const [anio, mes] = valor.splice("_");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    return `${meses[parseInt(mes) - 1]} ${anio}`;
}

// seleccion del mes al iniciar la pagina
window.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date();
    const mesActual = hoy.toISOString().slice(0, 7);
    document.getElementById('mes-registro').value = mesActual;

    // Disparar el evento 'change' para que se carge la vista
    document.getElementById('mes-registro').dispatchEvent(new Event('change'))
})