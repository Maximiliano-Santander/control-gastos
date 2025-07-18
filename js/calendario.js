// js/calendario.js

// Elementos del DOM
const cuerpoCalendario = document.getElementById('cuerpo-calendario');
const mesActualSpan = document.getElementById('mes-actual');
const btnPrev = document.getElementById('prev-mes');
const btnNext = document.getElementById('next-mes');
const accionesMes = document.getElementById('acciones-mes');

// Estado de fecha
dateObj = new Date();
let anio = dateObj.getFullYear();
let mes = dateObj.getMonth(); // 0 - 11

const mesesNombre = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Generar calendario dinámico
function cargarCalendario(anio, mes) {
    cuerpoCalendario.innerHTML = '';
    accionesMes.innerHTML = '';

    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicio = primerDia.getDay();

    mesActualSpan.textContent = `${mesesNombre[mes]} ${anio}`;

    const datos = JSON.parse(localStorage.getItem('gastos')) || {};
    const claveMes = `${anio}-${String(mes + 1).padStart(2, '0')}`;
    const gastosMes = datos[claveMes]?.lista || [];

    let fila = document.createElement('tr');
    // Espacios vacíos antes del primer día
    for (let i = 0; i < diaInicio; i++) fila.innerHTML += '<td></td>';

    // Generar celdas para cada día
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const celda = document.createElement('td');
        celda.textContent = dia;
        celda.classList.add('dia-calendario');

        // Filtrar gastos de este día
        const claveDia = `${claveMes}-${String(dia).padStart(2, '0')}`;
        const gastosDia = gastosMes.filter(g => g.fecha === claveDia);

        if (gastosDia.length > 0) {
            if (gastosDia.every(g => g.pagado)) celda.classList.add('dia-pagado');
            else celda.classList.add('dia-no-pagado');
        }

        // Al hacer clic, mostrar resumen mensual y detalle diario
        celda.addEventListener('click', () => {
        mostrarResumenMes(anio, mes);
        mostrarDetallesDia(anio, mes, dia);
        });

        fila.appendChild(celda);
        if ((dia + diaInicio) % 7 === 0) {
        cuerpoCalendario.appendChild(fila);
        fila = document.createElement('tr');
        }
    }
    // Fila restante
    if (fila.children.length > 0) cuerpoCalendario.appendChild(fila);

    // Mostrar resumen inicial
    mostrarResumenMes(anio, mes);
}

// Mostrar resumen visual del mes
function mostrarResumenMes(anio, mes) {
    const claveMes = `${anio}-${String(mes + 1).padStart(2, '0')}`;
    const datos = JSON.parse(localStorage.getItem('gastos')) || {};
    const mesDatos = datos[claveMes] || { sueldo: null, lista: [] };

    accionesMes.innerHTML = '';
    const resumen = document.createElement('div'); resumen.classList.add('resumen-mes');

    const totalGastos = mesDatos.lista.reduce((acc, g) => acc + g.monto, 0);
    const saldo = mesDatos.sueldo != null ? mesDatos.sueldo - totalGastos : null;

    ['Sueldo', 'Gastado', 'Saldo'].forEach((titulo, i) => {
        const valor = i === 0 ? mesDatos.sueldo : i === 1 ? totalGastos : saldo;
        const card = document.createElement('div'); card.classList.add('card');
        card.innerHTML = `<h4>${titulo}</h4><p>$${valor != null ? valor : '—'}</p>`;
        resumen.appendChild(card);
    });
    accionesMes.appendChild(resumen);

    if (mesDatos.sueldo != null) {
        const pct = Math.min((totalGastos / mesDatos.sueldo) * 100, 100);
        const barCont = document.createElement('div'); barCont.classList.add('progress-container');
        const bar = document.createElement('div'); bar.classList.add('progress-bar'); bar.style.width = `${pct}%`;
        barCont.appendChild(bar); accionesMes.appendChild(barCont);
    }
}

// Mostrar detalle de gastos de un día específico
function mostrarDetallesDia(anio, mes, dia) {
    const claveMes = `${anio}-${String(mes + 1).padStart(2, '0')}`;
    const datos = JSON.parse(localStorage.getItem('gastos')) || {};
    const gastosMes = datos[claveMes]?.lista || [];
    const claveDia = `${claveMes}-${String(dia).padStart(2, '0')}`;
    const gastosDia = gastosMes.filter(g => g.fecha === claveDia);

    const det = document.createElement('div'); det.classList.add('detalle-dia');
    det.innerHTML = `<h3>Gastos del ${dia} de ${mesesNombre[mes]} ${anio}</h3>`;

    if (!gastosDia.length) {
        det.innerHTML += '<p>No hay gastos para este día.</p>';
    } else {
        const ul = document.createElement('ul');
        gastosDia.forEach(g => {
        const li = document.createElement('li');
        li.textContent = `${g.nombre} - $${g.monto} - ${g.pagado ? '✅ Pagado' : '❌ No pagado'}`;
        ul.appendChild(li);
        });
        det.appendChild(ul);
    }
    accionesMes.appendChild(det);
}

// Navegación entre meses
btnPrev.addEventListener('click', () => { mes--; if (mes < 0) { mes = 11; anio--; } cargarCalendario(anio, mes); });
btnNext.addEventListener('click', () => { mes++; if (mes > 11) { mes = 0; anio++; } cargarCalendario(anio, mes); });

// Inicializar calendario
cargarCalendario(anio, mes);
