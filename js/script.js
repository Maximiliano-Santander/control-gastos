// Elementos del DOM
const mesRegistro = document.getElementById('mes-registro');
const inputSueldo = document.getElementById('input-sueldo');
const btnGuardarSueldo = document.getElementById('btn-guardar-sueldo');
const formularioGasto = document.getElementById('formulario-gasto');
const mesMostrada = document.getElementById('mes-seleccionado');
const gastoForm = document.getElementById('gasto-form');
const listaGastos = document.getElementById('lista-gastos');
const totalSpan = document.getElementById('total');
const infoSueldo = document.getElementById('info-sueldo');
const sueldoSpan = document.getElementById('sueldo-mostrado');
const saldoSpan = document.getElementById('saldo-restante');

// Datos almacenados
let gastos = JSON.parse(localStorage.getItem('gastos')) || {};
let mesActual = null;

// Función para formatear pesos chilenos
function formatearPesos(valor) {
    return valor != null
        ? valor.toLocaleString('es-CL')
        : '—';
}

// Ocultar inicialmente el formulario de gastos
formularioGasto.style.display = 'none';

// Leer parámetro de mes de la URL
function obtenerParametroMes() {
    const params = new URLSearchParams(window.location.search);
    return params.get('mes');
}

// Mostrar u ocultar el formulario de gastos
function actualizarFormularioGasto() {
    if (!mesActual) return;
    const datos = gastos[mesActual] || { sueldo: null, lista: [] };
    formularioGasto.style.display = (datos.sueldo !== null || datos.lista.length > 0)
        ? 'block'
        : 'none';
}

// Manejar cambio de mes seleccionado
mesRegistro.addEventListener('change', () => {
    mesActual = mesRegistro.value;
    if (!mesActual) {
        listaGastos.innerHTML = '';
        totalSpan.textContent = '0';
        actualizarFormularioGasto();
        return;
    }
    mesMostrada.textContent = mesActual;
    mostrarGastosPorMes(mesActual);
    actualizarFormularioGasto();
});

// Guarda el sueldo cuando el usuario hace clic
btnGuardarSueldo.addEventListener('click', () => {
    if (!mesActual) return;
    const nuevo = parseFloat(inputSueldo.value);
    if (!gastos[mesActual]) gastos[mesActual] = { sueldo: null, lista: [] };
    gastos[mesActual].sueldo = isNaN(nuevo) ? null : nuevo;
    localStorage.setItem('gastos', JSON.stringify(gastos));
    mostrarGastosPorMes(mesActual);
    actualizarFormularioGasto();
    inputSueldo.disabled = true;
    btnGuardarSueldo.disabled = true;
});

// Agrega un nuevo gasto
gastoForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!mesActual) return;
    const nombre = document.getElementById('nombre').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const fecha = document.getElementById('fecha-gasto').value;
    const pagado = document.getElementById('estado').checked;

    if (!gastos[mesActual]) gastos[mesActual] = { sueldo: null, lista: [] };
    gastos[mesActual].lista.push({ nombre, monto, fecha, pagado });
    localStorage.setItem('gastos', JSON.stringify(gastos));

    gastoForm.reset();
    mostrarGastosPorMes(mesActual);
});

// Elimina un gasto específico
function eliminarGasto(mes, index) {
    gastos[mes].lista.splice(index, 1);
    if (gastos[mes].lista.length === 0 && gastos[mes].sueldo == null) {
        delete gastos[mes];
    }
    localStorage.setItem('gastos', JSON.stringify(gastos));
    mostrarGastosPorMes(mesActual);
    actualizarFormularioGasto();
}

// Mostrar gastos y totales para el mes
function mostrarGastosPorMes(mes) {
    listaGastos.innerHTML = '';
    totalSpan.textContent = '0';
    if (!mes) return;

    const datos = gastos[mes] || { sueldo: null, lista: [] };
    inputSueldo.value = datos.sueldo ?? '';

    let total = 0;
    datos.lista.forEach((gasto, i) => {
        total += gasto.monto;
        const li = document.createElement('li');
        li.innerHTML = `
        ${gasto.nombre} - $${formatearPesos(gasto.monto)} - ${gasto.fecha} - ${
            gasto.pagado ? '✅ Pagado' : '❌ No pagado'}
        <button onclick="eliminarGasto('${mes}', ${i})">Eliminar</button>`;
        listaGastos.appendChild(li);
    });
    totalSpan.textContent = formatearPesos(total);

    if (datos.sueldo !== null && !isNaN(datos.sueldo)) {
        infoSueldo.style.display = 'block';
        sueldoSpan.textContent = formatearPesos(datos.sueldo);
        saldoSpan.textContent = formatearPesos(datos.sueldo - total);
    } else {
        infoSueldo.style.display = 'none';
    }
}

// Inicializa la página con el mes de la URL o el mes actual
window.addEventListener('DOMContentLoaded', () => {
    const param = obtenerParametroMes();
    const inicial = param || new Date().toISOString().slice(0, 7);
    mesRegistro.value = inicial;
    mesRegistro.dispatchEvent(new Event('change'));
});
