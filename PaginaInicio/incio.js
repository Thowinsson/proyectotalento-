document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario y el mensaje de agradecimiento
    const form = document.getElementById("formSugerencias");
    const mensajeAgradecimiento = document.getElementById("mensajeAgradecimiento");

    // Escuchar el evento de envío del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        // Mostrar el mensaje de agradecimiento
        mensajeAgradecimiento.style.display = "block";

        // Limpiar el formulario 
        form.reset();
    });
});
