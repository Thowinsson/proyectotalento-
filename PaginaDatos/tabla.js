// Función para cargar el archivo CSV y convertirlo en un array de objetos
async function cargarCSV(ruta) {
    const response = await fetch(ruta);
    const data = await response.text();

    const rows = data.split('\n').map(row => row.split(','));
    const headers = rows[0]; // Encabezados de la tabla
    const rowsData = rows.slice(1); // Datos de las filas

    // Convierte cada fila en un objeto con los encabezados como claves
    return rowsData.map(row => {
        let obj = {};
        row.forEach((col, i) => {
            obj[headers[i]] = col.trim(); // Asigna las columnas a los encabezados
        });
        return obj;
    });
}

// Función para crear una tabla en HTML
function crearTabla(datos) {
    const encabezados = Object.keys(datos[0]); // Obtener las claves del primer objeto como encabezados
    const encabezadosRow = document.getElementById('encabezados');
    const cuerpoTabla = document.getElementById('cuerpoTabla');

    // Crear los encabezados de la tabla
    encabezados.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        encabezadosRow.appendChild(th);
    });

    // Crear las filas de datos
    datos.forEach(fila => {
        const tr = document.createElement('tr');
        encabezados.forEach(header => {
            const td = document.createElement('td');
            td.textContent = fila[header];
            tr.appendChild(td);
        });
        cuerpoTabla.appendChild(tr);
    });
}

// Cargar el archivo CSV y generar la tabla
document.addEventListener('DOMContentLoaded', () => {
    cargarCSV('/PaginaDatos/tablas.csv') // Cambia la ruta si es necesario
        .then(datos => {
            crearTabla(datos); // Llamar a la función para construir la tabla
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo CSV:', error);
        });
});
