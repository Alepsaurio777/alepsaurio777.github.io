document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('boton-no').addEventListener('click', function() {
        // Cambiar el color del texto y hacer que rebote
        const pregunta = document.getElementById('pregunta');
        pregunta.style.color = 'purple';
        pregunta.style.animation = 'rebotar 1s ease infinite';

        // Mostrar la TNT y hacer la animación de explosión
        const tnt = document.getElementById('tnt');
        tnt.style.display = 'block';

        // Cambiar el fondo de la página a blanco
        document.body.style.animation = 'cambiarFondo 3s forwards';

        // Desaparecer el contenido
        setTimeout(function() {
            pregunta.style.animation = 'desaparecerTexto 2s forwards'; // Desvanecer la pregunta
            const botones = document.querySelectorAll('.boton');
            botones.forEach(boton => boton.style.animation = 'desaparecerTexto 2s forwards'); // Desvanecer los botones
        }, 1500); // Espera para que explote la TNT antes de desvanecer el contenido

        // Mostrar el mensaje después de la explosión de la TNT
        setTimeout(function() {
            // Mostrar el mensaje de que la página explotó
            document.getElementById('mensaje').style.display = 'block';
        }, 2500); // Mostrar el mensaje después de 2.5 segundos (cuando explota la TNT)
        
        // Opcional: Redirigir después de un retraso o agregar algún mensaje adicional
        setTimeout(function() {
            // Puedes redirigir a otra página o hacer algo más después de la animación
            // window.location.href = 'otra_pagina.html'; // Redirigir si lo deseas
        }, 4000); // Después de que explota la TNT
    });
});
