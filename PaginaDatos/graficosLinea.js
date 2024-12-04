// Función para cargar el archivo CSV y convertirlo en un array de objetos
async function cargarCSV(ruta) {
    return fetch(ruta)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0].map(header => header.trim()); // Limpia los encabezados
            const rowsData = rows.slice(1);

            console.log('Encabezados:', headers); // Para verificar encabezados

            return rowsData.map(row => {
                let obj = {};
                row.forEach((col, i) => {
                    obj[headers[i]] = col.trim(); // Limpia los valores de cada celda
                });
                return obj;
            });
        });
}

// Función para generar el gráfico de línea
function generarGraficoLinea(datos) {
    const labels = []; // Almacena los años o fechas
    const valores = []; // Almacena los valores de la columna "Solar (% equivalent primary energy)"

    // Extraemos los datos del CSV para el gráfico de línea
    datos.forEach(fila => {
        const year = fila['Year']?.trim(); // Asegúrate de que el encabezado sea "Year"
        const solarPercentage = parseFloat(fila['Solar (% equivalent primary energy)']?.trim()) || 0; // Limpia y convierte el valor a número

        if (year && !isNaN(solarPercentage)) {
            labels.push(year);
            valores.push(solarPercentage);
        }
    });

    // Crear el gráfico de línea
    const ctx = document.getElementById('graficoLinea').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Etiquetas (años o fechas)
            datasets: [{
                label: 'Energía Solar (% equivalente)', // Etiqueta del gráfico
                data: valores, // Datos de energía solar
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fondo de la línea
                borderWidth: 2,
                fill: true, // Rellenar el área bajo la línea
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje (%)', // Etiqueta del eje Y
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año', // Etiqueta del eje X
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top', // Posición de la leyenda
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.raw}%`; // Muestra el valor en porcentaje
                        }
                    }
                }
            }
        }
    });
}

// Cargar los datos del archivo CSV y generar el gráfico
document.addEventListener('DOMContentLoaded', () => {
    cargarCSV('/PaginaDatos/14_solar-share-energy.csv') // Cambia esta ruta si es necesario
        .then(datos => {
            console.log('Datos procesados:', datos); // Verificar los datos procesados
            generarGraficoLinea(datos); // Genera el gráfico con los datos del CSV
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo CSV:', error);
        });
});
