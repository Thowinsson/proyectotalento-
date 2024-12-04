function calcularImpacto() {
    // Obtener el consumo mensual del usuario
    const consumoMensual = parseFloat(document.getElementById('consumo').value);

    // Validar entrada
    if (isNaN(consumoMensual) || consumoMensual <= 0) {
        document.getElementById('resultado').textContent = "Por favor, ingrese un valor válido.";
        return;
    }

    // Datos del archivo (total de TWh en 2021)
    const totalDatoArchivo = 72; // Ejemplo: Total de energía generada en Colombia 2021 (TWh)

    // Calcular el consumo anual del usuario en TWh
    const totalUsuarioTWh = (consumoMensual / 1000) * 12;

    // Calcular el porcentaje respecto al total del país
    const consTotalPorcentaje = (totalUsuarioTWh * 100) / totalDatoArchivo;

    // Mostrar resultados
    document.getElementById('resultado').textContent = 
        `Tu consumo anual es de ${totalUsuarioTWh.toFixed(4)} TWh. Esto representa aproximadamente el ${consTotalPorcentaje.toFixed(2)}% del consumo total de ${totalDatoArchivo} TWh en Colombia durante 2021.`;
}