import React, { useEffect, useState, useMemo, memo } from 'react';
import { selectContent } from "./selectors";
import { useSelector } from "react-redux";
import { createStickerLinkThumb, createStickerLinkMiddle, createStickerLinkOrig } from "../../__TS/libs/sticker";
//import { IStickerConfig } from "../../__TS/interfaces/stickers";
import { stickerConfigSelector } from "../../__TS/selectors/stickers";

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
const PageStickerDraw = memo(( { state = null, contentId, x, y, w, h, r, pdf, preview, mirroring,  } ) => {

    const content = state ? selectContent( state, contentId ) : useSelector( state => selectContent( state, contentId ) );
    const stickerConfig = state ? stickerConfigSelector( state ) : useSelector( stickerConfigSelector );

    const [imageUrl, imageUrlSet] = useState( !content.svg ? (pdf ?     createStickerLinkOrig( { stickerConfig: stickerConfig, id: content.stickerId } ) : null) ||
                                                                       (preview ? createStickerLinkMiddle( { stickerConfig: stickerConfig, id: content.stickerId } ) : null) ||
                                                                                  createStickerLinkThumb( { stickerConfig: stickerConfig, id: content.stickerId } ) : null
    );

    const mirroringParams = useMemo( () => {
        if ( !mirroring ) return '';
        return `scale(-1, 1) translate(${(x*2 + w) * -1}, 0)`

    }, [mirroring, x, y, w, h] );

    const transform = `rotate(${r} ${x + w / 2} ${y + h / 2}) ${mirroringParams}`;
    const clipPathId = useMemo( () => (pdf ? 'clip_print_' : 'clip_print_block_') + contentId, [] );

    //если стикер png и не генерим для pdf, то по загрузке mid размера, ставим его за место thumb
    useEffect( () => {
        if ( !pdf && !content.svg ) {
            const img = new Image();
            const url = createStickerLinkMiddle( { stickerConfig: stickerConfig, id: content.stickerId } );
            img.src = url;
            img.onload = () => {
                imageUrlSet( url );
            }
        }
    }, []);

    return <>
                { content.svg ?
                    <g transform={transform} x={x} y={y} clipPath={`url(#${clipPathId})`}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width={w}
                             height={h}
                             x={x}
                             y={y}
                             viewBox={`0 0 ${content.viewBoxWidth} ${content.viewBoxHeight}`}
                             dangerouslySetInnerHTML={{ __html: content.svg }}
                        />
                    </g>
                    :
                    <image x={x}
                           y={y}
                           preserveAspectRatio="none"
                           width={w}
                           height={h}
                           transform={transform}
                           xlinkHref={imageUrl}
                           //onMouseMove={(event)=>console.log('mouseMove')}
                           clipPath={`url(#${clipPathId})`}
                />}
            </>
});

export default PageStickerDraw;