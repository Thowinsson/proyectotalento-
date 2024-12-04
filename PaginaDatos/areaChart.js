// Función para cargar el archivo CSV y convertirlo en un array de objetos
async function cargarCSV(ruta) {
    const response = await fetch(ruta);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const rowsData = rows.slice(1);

    return rowsData.map(row => {
        let obj = {};
        row.forEach((col, i) => {
            obj[headers[i]] = col.trim();  // Trim para quitar espacios extra
        });
        return obj;
    });
}

// Función para generar el gráfico de área
function generarGraficoArea(datos) {
    const labels = [];  // Años
    const energiaRenovable = [];  // Energía renovable total
    const energiaConvencional = [];  // Energía convencional (Other)

    // Extraemos los datos del CSV
    datos.forEach(fila => {
        labels.push(fila['Year']);  // Año

        // Energía renovable (Solar + Wind + Hydro)
        const solar = parseFloat(fila['Solar Generation - TWh']) || 0;
        const wind = parseFloat(fila['Wind Generation - TWh']) || 0;
        const hydro = parseFloat(fila['Hydro Generation - TWh']) || 0;
        const renovable = solar + wind + hydro;
        energiaRenovable.push(renovable);

        // Energía convencional (Other - TWh)
        const convencional = parseFloat(fila['Geo Biomass Other - TWh']) || 0;  // "Geo Biomass Other" es la columna de energía convencional
        energiaConvencional.push(convencional);
    });

    // Crear el gráfico de área
    const ctx = document.getElementById('graficoArea').getContext('2d');
    new Chart(ctx, {
        type: 'line',  // Tipo de gráfico área
        data: {
            labels: labels,  // Etiquetas de los años
            datasets: [
                {
                    label: 'Energía Renovable (Solar + Eólica + Hidro) - TWh',
                    data: energiaRenovable,
                    borderColor: 'rgba(75, 192, 192, 1)',  // Línea de energía renovable
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Área bajo la línea de energía renovable
                    fill: true,
                },
                {
                    label: 'Energía Convencional (Otros) - TWh',
                    data: energiaConvencional,
                    borderColor: 'rgba(255, 99, 132, 1)',  // Línea de energía convencional
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Área bajo la línea de energía convencional
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.raw} TWh`;  // Muestra el valor de energía en TWh
                        }
                    }
                }
            }
        }
    });
}

// Cargar los datos del archivo CSV y generar el gráfico
document.addEventListener('DOMContentLoaded', () => {
    cargarCSV('/PaginaDatos/02 modern-renewable-energy-consumption.csv')  // Ruta al archivo CSV
        .then(datos => {
            generarGraficoArea(datos);  // Genera el gráfico con los datos del CSV
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo CSV:', error);
        });
});
