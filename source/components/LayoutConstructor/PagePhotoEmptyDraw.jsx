import React, { useMemo } from 'react';
import styled, { css } from "styled-components";
import { useDrop } from 'react-dnd';
import { addPhotoToPhotoBlockAction } from '__TS/actions/layout';

const EmptyBlockStyled = styled.rect`
     fill: rgba(196,196,196,0.5);
     stroke-width: 1;
     stroke: rgb(127,127,127);
     
    ${ ( { isOverDragCurrent } ) => isOverDragCurrent && css`
          stroke-width: 1;
          fill: #37a9ff;
          stroke: #37a9ff;
    `}
`;

const EmptyBlockTextStyled = styled.text`
     fill: rgba(64,64,64,0.75);
     font-size: ${( { ratio } ) => {
                    return ratio ? 20 - ratio * 5 : 0
                }}px;
     pointer-events: none;
     ${ ( { isOverDragCurrent } ) => isOverDragCurrent && css`
          fill: transparent;
     `} 
`;

const PagePhotoEmptyDraw = ( { position, preview, pdf, blockId, ratio } ) => {

    //не рендерим для pdf или preview
    if ( preview || pdf ) return null;

    const [{ isOverDragCurrent }, drop] = useDrop( {
                                                       accept: ['photo'],
                                                       type: 'photoBlock',
                                                       drop( item, monitor ) {
                                                           addPhotoToPhotoBlockAction( {
                                                                                           photoId: item.photoId,
                                                                                           blockId: blockId
                                                                                       } )
                                                       },
                                                       collect: ( monitor ) => ({
                                                           //isOver: monitor.isOver(),
                                                           isOverDragCurrent: monitor.isOver( { shallow: false } ),
                                                       }),
                                                   } );

    const rectParams = {
        width: position.width,
        height: position.height,
        x: position.left,
        y: position.top
    };

    const centerX = useMemo( () => position.left + position.width / 2, [position.left, position.width] );
    const centerY = useMemo( () => position.top + position.height / 2, [position.top, position.height] );
    const transform = useMemo( () => `rotate(${position.rotateAngle} ${centerX} ${centerY})`, [centerX, centerY, position.rotateAngle] );

    return  <g transform={transform}>

                <EmptyBlockStyled {...rectParams} ref={drop} isOverDragCurrent={isOverDragCurrent} />

                <EmptyBlockTextStyled {...rectParams} dominantBaseline="middle" textAnchor="middle" isOverDragCurrent={isOverDragCurrent} ratio={ratio}>
                    <tspan y={centerY} x={centerX}>Фото</tspan>
                    {/*<tspan y={centerY-30} x={centerX}>Фото</tspan>
                    <tspan dy={25} x={centerX}>сюда</tspan>
                    <tspan dy={25} x={centerX}>фотографию</tspan>*/}
                </EmptyBlockTextStyled>
            </g>

};



export default PagePhotoEmptyDraw;