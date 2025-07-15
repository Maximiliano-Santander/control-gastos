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

// Mostrar formulario solo si hay sueldo o gastos
function actualizarFormularioGasto() {
    const dataMes = gastos[mesActual] || { sueldo: null, lista: [] };
    if ((dataMes.sueldo !== null && !isNaN(dataMes.sueldo)) || dataMes.lista.length > 0) {
        formularioGasto.style.display = 'block';
    } else {
        formularioGasto.style.display = 'none';
    }
}

// Selección del mes
mesRegistro.addEventListener('change', () => {
    mesActual = mesRegistro.value;

    if (mesActual) {
        mesMostrada.textContent = mesActual;
        mostrarGastosPorMes(mesActual);
        actualizarFormularioGasto();
    }
});

const btnGuardarSueldo = document.getElementById('btn-guardar-sueldo');

btnGuardarSueldo.addEventListener('click', () => {
    const nuevoSueldo = parseFloat(inputSueldo.value);
    if (!mesActual) return;

    if (!gastos[mesActual]) {
        gastos[mesActual] = { sueldo: null, lista: [] };
    }

    gastos[mesActual].sueldo = isNaN(nuevoSueldo) ? null : nuevoSueldo;
    localStorage.setItem('gastos', JSON.stringify(gastos));
    mostrarGastosPorMes(mesActual);
    actualizarFormularioGasto();

    inputSueldo.disabled = true;
    btnGuardarSueldo.disabled = true;
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

    if (!gastos[mesActual]) {
        gastos[mesActual] = { sueldo: null, lista: [] };
    }

    gastos[mesActual].lista.push(nuevoGasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));

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
            <button onclick="eliminarGasto('${mes}', ${index})" id="delete">Eliminar</button>`;

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

    actualizarFormularioGasto();
}

// Eliminar gasto seleccionado
function eliminarGasto(mes, index) {
    gastos[mes].lista.splice(index, 1);

    if (gastos[mes].lista.length === 0 && !gastos[mes].sueldo) {
        delete gastos[mes];
    }

    localStorage.setItem('gastos', JSON.stringify(gastos));
    mostrarGastosPorMes(mes);
}

// Iniciar
window.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date();
    const mesHoy = hoy.toISOString().slice(0, 7);
    mesRegistro.value = mesHoy;
    mesRegistro.dispatchEvent(new Event('change'));
});
