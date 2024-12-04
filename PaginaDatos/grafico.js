// Función para cargar el archivo CSV y convertirlo en un array de objetos
function cargarCSV(ruta) {
    return fetch(ruta)
        .then(response => response.text()) // Obtener el contenido como texto
        .then(data => {
            // Convertir el CSV a un array de objetos
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0]; // Primer fila como encabezado
            const rowsData = rows.slice(1); // El resto es la data

            // Crear un array de objetos con las filas y los encabezados
            return rowsData.map(row => {
                let obj = {};
                row.forEach((col, i) => {
                    obj[headers[i]] = col;
                });
                return obj;
            });
        });
}

// Función para generar el gráfico de barras
function generarGrafico(datos) {
    const labels = [];
    const valores = [];

    // Extraer las etiquetas y valores del archivo CSV
    datos.forEach(fila => {
        labels.push(fila['Entity']);
        valores.push(parseFloat(fila['Wind (% equivalent primary energy)']) || 0); // Asegúrate de que los valores sean números
    });

    // Crear el gráfico con Chart.js
    const ctx = document.getElementById('graficoBarras').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Etiquetas del gráfico
            datasets: [{
                label: 'Energía Producción (%) por Fuente',
                data: valores, // Datos para las barras
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje de Energía (%)'
                    }
                }
            }
        }
    });
}

// Cargar los datos del archivo CSV y generar el gráfico
document.addEventListener('DOMContentLoaded', () => {
    cargarCSV('PaginaDatos\archivoColombia.csv') // Cambia la ruta si es necesario
        .then(datos => {
            generarGrafico(datos); // Genera el gráfico con los datos del CSV
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo CSV:', error);
        });
});
