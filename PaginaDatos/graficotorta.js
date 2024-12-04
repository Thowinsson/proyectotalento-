// Función para cargar el archivo CSV y convertirlo en un array de objetos
function cargarCSV(ruta) {
    return fetch(ruta)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0];
            const rowsData = rows.slice(1);

            return rowsData.map(row => {
                let obj = {};
                row.forEach((col, i) => {
                    obj[headers[i]] = col;
                });
                return obj;
            });
        });
}

// Función para generar el gráfico de torta
function generarGraficoTorta(datos) {
    const labels = [];
    const valores = [];

    // Calcular el total y porcentajes
    let total = 0;

    datos.forEach(fila => {
        const valor = parseFloat(fila['Wind (% equivalent primary energy)']) || 0;
        total += valor;
    });

    datos.forEach(fila => {
        const valor = parseFloat(fila['Wind (% equivalent primary energy)']) || 0;
        if (valor > 0) {
            labels.push(fila['Entity']);
            valores.push((valor / total * 100).toFixed(2)); // Porcentaje
        }
    });

    // Crear el gráfico de torta
    const ctx = document.getElementById('graficoTorta').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels, // Etiquetas del gráfico
            datasets: [{
                data: valores, // Datos para la torta
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: 'rgba(255, 255, 255, 1)', // Bordes de las porciones
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Cargar los datos del archivo CSV y generar el gráfico
document.addEventListener('DOMContentLoaded', () => {
    cargarCSV('../PaginaDatos/04 share-electricity-renewables.csv') // Nueva ruta del archivo CSV
        .then(datos => {
            generarGraficoTorta(datos); // Genera el gráfico con los datos del CSV
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo CSV:', error);
        });
});