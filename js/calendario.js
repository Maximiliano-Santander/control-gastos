const cuerpoCalendario = document.getElementById('cuerpo-calendario');
const mesActualSpan = document.getElementById('mes-actual');
const btnPrev = document.getElementById('prev-mes');
const btnNext = document.getElementById('next-mes');
const accionesMes = document.getElementById('acciones-mes');

let hoy = new Date();
let anio = hoy.getFullYear();
let mes = hoy.getMonth(); // de 0 a 11

const mesesNombre = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function cargarCalendario(anio, mes) {
    cuerpoCalendario.innerHTML = '';

    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicio = primerDia.getDay();

    mesActualSpan.textContent = `${mesesNombre[mes]} ${anio}`;

    let fila = document.createElement('tr');
    for (let i = 0; i < diaInicio; i++) {
        fila.innerHTML += '<td></td>';
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const celda = document.createElement('td');
        celda.textContent = dia;
        celda.classList.add('dia-calendario');
        fila.appendChild(celda);

        if ((dia + diaInicio) % 7 === 0) {
        cuerpoCalendario.appendChild(fila);
        fila = document.createElement('tr');
        }
    }

    if (fila.children.length > 0) {
        cuerpoCalendario.appendChild(fila);
    }

    mostrarResumenMes(anio, mes);
}

function mostrarResumenMes(anio, mes) {
    const clave = `${anio}-${(mes + 1).toString().padStart(2, '0')}`;
    const datos = JSON.parse(localStorage.getItem('gastos')) || {};
    const mesDatos = datos[clave];

    accionesMes.innerHTML = '';

    if (mesDatos && mesDatos.lista.length > 0) {
        const div = document.createElement('div');
        div.innerHTML = `
        <h3>Gastos de ${mesesNombre[mes]} ${anio}</h3>
        <p>Sueldo: $${mesDatos.sueldo ?? 'No especificado'}</p>
        <p>Total de gastos: $${mesDatos.lista.reduce((acc, g) => acc + g.monto, 0)}</p>
        <ul>
            ${mesDatos.lista.map(g => `<li>${g.nombre} - $${g.monto} - ${g.fecha}</li>`).join('')}
        </ul>
        `;
        accionesMes.appendChild(div);
    } else {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay ningún gasto registrado para este mes.';
        const btn = document.createElement('button');
        btn.textContent = 'Registrar mes';
        btn.onclick = () => window.location.href = `gastos.html?mes=${clave}`;
        accionesMes.appendChild(mensaje);
        accionesMes.appendChild(btn);
    }
}

btnPrev.addEventListener('click', () => {
    mes--;
    if (mes < 0) {
        mes = 11;
        anio--;
    }
    cargarCalendario(anio, mes);
});

btnNext.addEventListener('click', () => {
    mes++;
    if (mes > 11) {
        mes = 0;
        anio++;
    }
    cargarCalendario(anio, mes);
});

// Inicializar
cargarCalendario(anio, mes);
