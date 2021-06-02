import React, { useMemo } from 'react';
import styled, { css } from "styled-components";
import { addPhotoToPageAction, addStickerToPageAction, addShapeToPageAction, addTemplateToPageAction, addBackgroundToPageAction } from '__TS/actions/layout';

import { useDrop } from 'react-dnd';

const Rect = styled.rect`
    //stroke: grey;
    //stroke-width: 0.1; 
    //pointer-events: none;
`;
const RectBlock = styled.rect`
    ${ ( { isOverDragCurrent } ) => isOverDragCurrent && css`
          //stroke-width: 1;
          //stroke: #1278ca;
      outline: ${( { isBackground, outlineBackground } ) => isBackground ? outlineBackground : 1}px solid #1278ca;
    `}
`;
const ShadowLayer = styled.rect`
    pointer-events: none;
    mix-blend-mode: multiply;
`;
const SVGBgWhite  = styled.rect`
    fill: white;
`;

const TextHelper = styled.text`
    user-select: none;  
    pointer-events: none;
`;
const PageConstructorPreview = ( { page, shadow = false, cuts={}, pdf, padding = 0 } ) => {

    const printSize = useMemo( () => ({
        w: page.w + cuts.left + cuts.right,
        h: page.h + cuts.top + cuts.bottom,
        x: cuts.left * -1,
        y: cuts.top * -1
    }), [page.w, page.h, cuts.left, cuts.right, cuts.top, cuts.bottom] );

    if ( shadow && page.shadow !== 'none') {
        return null; //TODO: Отключено до востребования. После включения проверить в Safari
        // return <ShadowLayer width={page.w}
        //                     height={page.h}
        //                     x={page.x}
        //                     y={page.y}
        //                     fill={`url(#grad_${page.shadow || 'white'})`}
        //         />
    } else if ( page.shadow !== 'none' ) {
        return <>
            <defs>
                {/* Маска печатного формата */}
                <clipPath id={'clip_print_' + page.id}>
                    <rect x={printSize.x} y={printSize.y} width={printSize.w} height={printSize.h} />
                </clipPath>

                {/* Маска обрезного формата */}
                {!pdf && <clipPath id={'clip_cut_' + page.id}>
                            <rect x={page.x} y={page.y} width={page.w} height={page.h} />
                         </clipPath>}
            </defs>
            {/*<RectBlock width={page.w + padding * 2}
                       height={page.h + padding * 2}
                       x={page.x - padding}
                       y={page.y - padding}
                       fill={'white'}
            />*/}
            <RectBlock width={page.w}
                       height={page.h}
                       x={page.x}
                       y={page.y}
                       fill={'white'}
                       //style={{ filter: 'url(#pageShadow)'}}
            />
            {!pdf && <SVGBgWhite x={page.x}
                                 y={page.y}
                                 width={page.x + page.w}
                                 height={page.x + page.h}
                                 style={{ 'fill': 'white' }} />}
        </>
    } else {
        return null;
    }
};

const PageConstructor = ( { page, areaId, calculatePositionOnSvgByPixelPosition, shadow = false, cuts={}, pdf, padding = 0, preview = false, hideTransformBox, selectIsCompleted, selectIsHaveContent } ) => {

    //if ( !preview && !pdf ) {
    const [{ isOverDragCurrent, dragItemType }, drop] = useDrop( {
                                                               accept: ['photo', 'sticker', 'shape', 'template', 'background'],
                                                               type: 'page',
                                                               drop( item, monitor ) {

                                                                   //console.log('monitor.getSourceClientOffset()',monitor.getSourceClientOffset());
                                                                   const clientOffset = monitor.getClientOffset();
                                                                   //const sourceOffset = monitor.getSourceClientOffset();
                                                                   const svgPositionDropped = calculatePositionOnSvgByPixelPosition( {
                                                                                                                                         x: clientOffset.x,
                                                                                                                                         y: clientOffset.y
                                                                                                                                     } );


                                                                   //console.log('clientOffset.x - sourceOffset.x', clientOffset.x - sourceOffset.x);
                                                                   switch ( item.type ) {
                                                                       case 'template':
                                                                           addTemplateToPageAction({
                                                                                                    sourceAreaId: item.sourceAreaId,
                                                                                                    areaId: areaId
                                                                                                })

                                                                           break;
                                                                       case 'shape':
                                                                           addShapeToPageAction({
                                                                                                    shapeId: item.shapeId,
                                                                                                    shapeSvg: item.svg,
                                                                                                    pageId: page.id,
                                                                                                    dropPosition: svgPositionDropped
                                                                                                })
                                                                           break;
                                                                       case 'photo':
                                                                           addPhotoToPageAction({
                                                                                                    photoId: item.photoId,
                                                                                                    pageId: page.id,
                                                                                                    dropPosition: svgPositionDropped
                                                                                                })
                                                                           break;
                                                                       case 'sticker':

                                                                           addStickerToPageAction({
                                                                                                    stickerId: item.stickerId,
                                                                                                    stickerSetId: item.stickerSet,
                                                                                                    pageId: page.id,
                                                                                                    dropPosition: svgPositionDropped
                                                                                                })
                                                                           break;
                                                                       case 'background':
                                                                           addBackgroundToPageAction({
                                                                                                      pageId: page.id,
                                                                                                      bgId: item.bgId,
                                                                                                      bgSetId: item.bgSetId,
                                                                                                  })
                                                                           break;
                                                                   }
                                                               },
                                                               collect: ( monitor ) => ({
                                                                   //isOver: monitor.isOver(),
                                                                   isOverDragCurrent: monitor.isOver({ shallow: false }),
                                                                   dragItemType: monitor.getItemType()
                                                               }),
                                                           } );


    const printSize = useMemo( () => ({
        w: page.w + cuts.left + cuts.right,
        h: page.h + cuts.top + cuts.bottom,
        x: cuts.left * -1,
        y: cuts.top * -1
    }), [page.w, page.h, cuts.left, cuts.right, cuts.top, cuts.bottom] );

    const frontSize = useMemo( () => {
        const max = Math.max( page.w, page.y );
        return max / 25;
    }, [page.w, page.y] )

    if ( shadow && page.shadow !== 'none') {
        return null; //TODO: Отключено до востребования. После включения проверить в Safari
        // return <ShadowLayer width={page.w}
        //                     height={page.h}
        //                     x={page.x}
        //                     y={page.y}
        //                     fill={`url(#grad_${page.shadow || 'white'})`}
        //         />
    } else if ( page.shadow !== 'none' ) {
        return <>
            <defs>
                {/* Маска печатного формата */}
                <clipPath id={'clip_print_' + page.id}>
                    <rect x={printSize.x} y={printSize.y} width={printSize.w} height={printSize.h} />
                </clipPath>

                {/* Маска обрезного формата */}
                {!pdf && <clipPath id={'clip_cut_' + page.id}>
                            <rect x={page.x} y={page.y} width={page.w} height={page.h} />
                         </clipPath>}
            </defs>
            {!pdf && !preview && <>
                <RectBlock isOverDragCurrent={isOverDragCurrent}
                           isBackground={dragItemType === 'background'}
                           outlineBackground={printSize.x * -1 + 1}
                           onClick={()=>hideTransformBox()}
                           width={page.w + padding * 2}
                           ref={drop}
                           height={page.h + padding * 2}
                           x={page.x - padding}
                           y={page.y - padding}
                           //style={{ filter: 'url(#pageShadow)'}}
                />
                {!selectIsHaveContent && <TextHelper dominantBaseline={"middle"}
                                                   textAnchor={"middle"}
                                                   x={page.w / 2}
                                                   y={page.h / 2}
                                                   fontSize={frontSize}
                                                   fill="#889db5">Перетащите фотографии сюда</TextHelper>}

            </>}
        </>
    } else {
        return null;
    }
};

{/*page.shadow === 'right' ? <image xlinkHref="http://lh3.googleusercontent.com/BaIShQBLrBWEgxHoCYFDHJDwNDbFuaVA4U_O40a28wcb4dJTLTPsvDANaGmE8roGwPqqWgW9t_r2nanITDwIatcK=h750"
                       x="110" y="0" height="100" width="100" /> : null*/}
export { PageConstructorPreview };
export default PageConstructor;