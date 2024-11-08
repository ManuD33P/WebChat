// src/hooks/useWindowWidth.js
import { useState, useEffect } from 'react';

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        // Definir la función que actualiza el ancho de la ventana
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Establecer el ancho inicial de la ventana
        handleResize();

        // Añadir el evento de redimensionar
        window.addEventListener('resize', handleResize);

        // Limpieza del evento de redimensionar
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth;
};

export default useWindowWidth;
