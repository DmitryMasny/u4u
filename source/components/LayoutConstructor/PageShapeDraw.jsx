import React, { useEffect, useState, useMemo, memo } from 'react';
import { selectContent } from "./selectors";
import { useSelector } from "react-redux";

/**
 * Создаем стикер в layout
 * @param state
 * @param contentId
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 * @param pdf
 * @param preview
 * @returns {*}
 * @constructor
 */
const PageShapeDraw = memo(( { state = null, contentId, x, y, w, h, r, pdf, preview, mirroring, fixedProportions } ) => {
    const content = state ? selectContent( state, contentId ) : useSelector( state => selectContent( state, contentId ) );

    const mirroringParams = useMemo( () => {
        if ( !mirroring ) return '';
        return `scale(-1, 1) translate(${(x*2 + w) * -1}, 0)`

    }, [mirroring, x, y, w, h] );

    const transform = `rotate(${r} ${x + w / 2} ${y + h / 2}) ${mirroringParams}`;

    const clipPathId = useMemo( () => 'clip_print_block_' + contentId, [] );

    return <g transform={transform} x={x} y={y} clipPath={`url(#${clipPathId})`}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     width={w}
                     height={h}
                     x={x}
                     y={y}
                     viewBox={`0 0 ${w} ${h}`}
                     dangerouslySetInnerHTML={{ __html: content.svg }}
                />
           </g>
});

export default PageShapeDraw;