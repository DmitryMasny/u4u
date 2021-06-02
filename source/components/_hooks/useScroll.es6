/**
 * useScroll React custom hook
 * Usage:
 *    const scroll = useScroll();
 */

import { useState, useEffect } from "react";

export function useScroll() {
    const [scroll, setScroll] = useState(0);

    const listener = e => {
        setScroll( e.target.scrollTop );
    };

    useEffect(() => {
        const spaEl = document.getElementById( 'spa' );
        spaEl && spaEl.addEventListener("scroll", listener);
        return () => {
            spaEl && spaEl.removeEventListener( "scroll", listener );
        };
    }, []);

    return scroll;
}