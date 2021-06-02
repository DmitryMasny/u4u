// @ts-ignore
import React, { useMemo, memo, useEffect } from 'react';
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';
// @ts-ignore
import styled, { css } from 'styled-components';
// @ts-ignore
import { useDrag, DragSourceMonitor } from 'react-dnd';

/** Styles */

const ShapeBlock = styled( 'div' )`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    margin: 0 -3px;
    width: 100%;    
    //transform: rotate3d(0, 0, 0, 0);
`;

const Shape = styled( 'div' )`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 5px;
    user-select: none;
    height: 140px;
    width: 140px;
    cursor: pointer;
    background: transparent;
    & svg {
        width: 100%;
        height: 100%;
    }
`;

const ShapeDiv = styled( 'div' )`
    width: 130px;
    height: 130px;
    //transform: rotate3d(0, 0, 0, 0); //для принудительной отрисовки видеоадаптером, ускоряет обработку
    ${ ( { isDragging }: { isDragging: boolean } ) => isDragging && css`
          position: fixed;
          z-index: 777;
          pointer-events: none;
    `};
`;

const SHAPE_COLOR = '#1278ca';
const SHAPE_FILL = '#a7cff5';
const SHAPE_SIZE = 500;
const SHAPE_BORDER = 10;
const SHAPE_RADIUS = 80;

const SHAPE_SIZE_PERCENT = 100;

const shapesSvg = [
    {
        id: '1',
        svg: `<defs>
                    <ellipse cx="50%" 
                             cy="50%"  
                             rx="50%"
                             ry="50%" 
                             id="x1" />
                    <clipPath id="circleClip1">
                        <use xlink:href="x1" />
                    </clipPath>
              </defs>
              <use xlink:href="x1" 
                   stroke="#0081C6" 
                   stroke-width="160" 
                   fill="#00D2B8" 
                   clip-path="url(#circleClip1)"
                   style="fill: ${ SHAPE_FILL };  stroke-width:${ SHAPE_BORDER }; stroke:${ SHAPE_COLOR };"
                     />
              
              `
    },
    {
        id: '2',
        svg: `<rect x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    rx="0" 
                    ry="0" 
                    style="fill: ${SHAPE_FILL}; stroke-position: inside; stroke-width:${SHAPE_BORDER}; stroke:${SHAPE_COLOR}; "/>`
    },
    {
        id: '3',
        svg: `<rect x="${SHAPE_BORDER}" 
                    y="${SHAPE_BORDER}" 
                    width="${SHAPE_SIZE - SHAPE_BORDER*2}" 
                    height="${SHAPE_SIZE - SHAPE_BORDER*2}" 
                    rx="${SHAPE_RADIUS}" 
                    ry="${SHAPE_RADIUS}" 
                    style="fill: ${SHAPE_FILL}; stroke-position: inside; stroke-width:${SHAPE_BORDER}; stroke:${SHAPE_COLOR}; "/>`
    },
    {
        id: '5',
        svg: `<path d="M ${SHAPE_SIZE/2} ${SHAPE_BORDER} L ${SHAPE_SIZE} ${SHAPE_SIZE - SHAPE_BORDER} L ${SHAPE_BORDER} ${SHAPE_SIZE - SHAPE_BORDER} z"
                    style="fill: ${SHAPE_FILL}; stroke-width:${SHAPE_BORDER}; stroke:${SHAPE_COLOR}; " />`
    }
]

/**
 * Компонент фигуры
 */
const ShapeItem = memo( ( { shape }: { shape: { id: string, svg: string } } ) => {
    const [ { isDragging, currentOffset }, drag, preview ] = useDrag( {
        item: {
            shapeId: shape.id,
            type: 'shape',
            svg: shape.svg,
            width: 130,
            height: 130
        },
        canDrag: true,
        collect: ( monitor: DragSourceMonitor ) => ( {
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
            //getDropResult: monitor.getDropResult(),
            //getItem: monitor.getItem(),
            //getItemType: monitor.getItemType(),
            //didDrop: monitor.didDrop(),
        }),
    } );

    useEffect(()=> {
        if ( isDragging ) {
            document.body.classList.add("layout-photo-not-events-off");
        } else {
            document.body.classList.remove("layout-photo-not-events-off");
        }
    }, [isDragging])

    return <Shape key={ shape.id }>
                <ShapeDiv
                    ref={ drag }
                    style={ { left: currentOffset && currentOffset.x, top: currentOffset && currentOffset.y } }
                    isDragging={ isDragging }>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="100%"
                             height="100%"
                             viewBox={ `0 0 ${SHAPE_SIZE} ${SHAPE_SIZE}` }
                             dangerouslySetInnerHTML={ { __html: shape.svg } }/>
                </ShapeDiv>
            </Shape>
})


/**
 * Библиотека фигур
 */
const ShapeLibrary: React.FC = () => {
    return useMemo( () => {
        // @ts-ignore
        return <Scrollbars>
                    <ShapeBlock>
                        {shapesSvg.map(( shape ) => <ShapeItem shape={shape} key={shape.id} />)}
                    </ShapeBlock>
                </Scrollbars>

    }, [] );
}

export default ShapeLibrary;