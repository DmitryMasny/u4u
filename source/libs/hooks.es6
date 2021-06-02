import { useState, useEffect } from 'react';

/**
 * Хук подписки на нажатие клавиши
 * @param targetKey
 * @returns {boolean}
 */
function useKeyPress(targetKey) {

    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ keyCode }) {
        if (keyCode === targetKey) {
            setKeyPressed(true);
        }
    }

    const upHandler = ({ keyCode }) => {
        if (keyCode === targetKey) {
            setKeyPressed(false);
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return keyPressed;
}

export {
    useKeyPress
};