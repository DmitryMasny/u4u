import React, { Fragment, useEffect, useState, useRef, useMemo, memo } from 'react';
//import { NavLink } from 'react-router-dom'
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import ResizableRect from 'components/_3dParty/react-resizable-rotatable-draggable-touch';
import { selectContent } from './selectors';
import { getOutsizeRectSizeAfterTurn, turnXY, degrees_to_radians } from 'libs/geometry';
import { simpleID } from "__TS/libs/tools";

//import { productUpdateContentPositionAction } from "components/_pages/PosterEditor/actions";
//import { IconError } from "components/Icons";
import styled from "styled-components";
import { createBackgroundLinkMiddle, createBackgroundLinkOrig } from "__TS/libs/backgrounds";

import { COLORS } from "const/styles";
//import LINKS_MAIN from "config/links";
//import { NAV } from "const/help";
import { modalProductPhotoQualityAction } from 'actions/modals';
import { actionUpdateLayoutReady } from './actions';

import { setAddNotGoodPhoto, setDeleteNotGoodPhoto, setAddNotAcceptedPhoto, setDeleteNotAcceptedPhoto } from '__TS/components/Editor/_actions';

import {
    backgroundConfigSelector
} from "__TS/selectors/backgrounds";

const PagePhotoDrawInner = ( { url, clipPathId,clipPathIdParrentBlock,
                               mirroring,
                               positionX, positionY,
                               positionW, positionH,
                               positionR, bgColor,
                               blockPositionX,
                               blockPositionY,
                               blockPositionW,
                               blockPositionH,
                               isPattern,
                               patternWidth,
                               proportionPhoto,
                               onClick, preview = false, pdf = false, ratio = 0, dangerQuality, errorQuality } ) => {

    if ( !ratio && !preview && !pdf ) return null;
    const timeout = useRef( null );
    const bgIdUnique = useRef( 'bgPagePatterns_' + simpleID() );

    const [imageWidth, setImageWidth] = useState( parseInt( positionW * ratio ) );

    useEffect( () => {
        if ( !pdf && !preview ) {
            if ( timeout.current ) clearTimeout( timeout.current );
            timeout.current = setTimeout( () => {
                                      setImageWidth( parseInt( positionW * ratio ) )
                                  }, 500 );
        }
    }, [positionW, ratio] );

    //расчет позиции фотографии фона
    const position = {
        x: positionX,
        y: positionY,
        width: positionW,
        height: positionH
    }

    //расчет позиции заливки фона
    const bgColorPosition = {
        x: blockPositionX,
        y: blockPositionY,
        width: blockPositionW,
        height: blockPositionH
    }

    //формируем цвет
    const color = useMemo( () => {
        return {
            rgb: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
            a: bgColor.a
        }
    }, [bgColor] );

    const mirroringParams = useMemo(()=> {
        if ( !mirroring ) return '';
        return `scale(-1, 1) translate(${(positionX*2 + positionW) * -1}, 0)`;
    }, [mirroring, positionX, positionY, positionW, positionH] )

    const transform = `rotate(${positionR}  ${positionX + positionW / 2} ${positionY + positionH / 2}) ${mirroringParams}`;

    const pattern = useMemo( () => {
        if ( isPattern ) {
            const patternHeight = patternWidth / proportionPhoto;
            return <>
                        <defs>
                            <pattern id={bgIdUnique.current} x={position.x} y={position.y} width={patternWidth}
                                     height={patternHeight}
                                     patternUnits="userSpaceOnUse">
                                <image {...position}
                                       x={0}
                                       y={0}
                                       width={patternWidth}
                                       height={patternHeight}
                                       xlinkHref={url}
                                       onClick={onClick}
                                />
                            </pattern>
                        </defs>
                        <rect {...position} fill={`url(#${bgIdUnique.current})`} clipPath={`url(#${clipPathId})`}/>
                    </>
        };

        return null;

    }, [isPattern, position, patternWidth, proportionPhoto, url] );


    //для генерации PDF
    if ( pdf ) {
        return <>
                    <rect clipPath={`url(#${clipPathId})`} {...bgColorPosition} fill={color.rgb} />
                    {pattern ? pattern :
                        url ? <image {...position}
                               transform={transform}
                               xlinkHref={url}
                               onClick={onClick}
                        /> : null
                    }
              </>
    //для отрисовки в редакторе
    } else {
        return <g clipPath={`url(#${clipPathIdParrentBlock})`}>
                    <rect clipPath={`url(#${clipPathId})`} {...bgColorPosition} fill={color.rgb} />
                    {pattern ? pattern :
                        url ? <image {...position}
                               transform={transform}
                               href={url}
                               onClick={onClick}
                               clipPath={`url(#${clipPathId})`}
                        /> : null
                    }
                </g>
    }
};
const PageBackgroundDraw = ( { c, cut, mirroring, formatDPI, contentId, pageId, pageX, pageY, setUpdateBlockParams,  pageW, pageH, blockId, blockPosition, currentControlElementId, setControlIdOnElement, ratio, topDelta, leftDelta, preview = false, pdf = false, state = null, dispatch = null} ) => {

    dispatch = dispatch || useDispatch();

    const backgroundConfig = state ? backgroundConfigSelector( state ) : useSelector( backgroundConfigSelector );
    const content = state ? selectContent( state, contentId ) : useSelector( state => selectContent( state, contentId ) );
    const blockPositionLast = useRef( blockPosition );

    //если не нашли контент, не рендерим
    if ( !content ) return null;

    const [proportionPhoto, proportionPhotoSet] = useState( content.pxWidth / content.pxHeight );


    //состояние управляющего элемента
    const [control, setControl] = useState( null );

    const calculatePositionStructure = ( content ) => {
        return {
            x: content.x + blockPosition.left,
            y: content.y + blockPosition.top,
            width: content.w,
            height: content.h,
            rotate: 0,
            //cut: cut && cut.left || 2
        }
    }

    //состояние контента
    const [ position, setPosition ] = useState( calculatePositionStructure( content ) );

    //показ сообщения о плохом качестве фото при растягивании
    const [ photoDpiWarning, photoDpiWarningSet ] = useState( false );

    //показ сообщения о запрете печати фотографии низкого разрешения
    const [ photoDpiCantPrint, photoDpiCantPrintSet ] = useState( false );

    useEffect( () => {
        blockPositionLast.current = blockPosition;
    }, [content.w, content.h, content.x, content.y] );

    //обвновляем статус продукта в layout
    useEffect( () => {
        dispatch( actionUpdateLayoutReady( !photoDpiCantPrint ) );
    }, [photoDpiCantPrint] );

    useEffect( () => {
        setPosition( calculatePositionStructure( content ) );
        setControlData();
    }, [blockPosition.left, blockPosition.top, blockPosition.width, blockPosition.height, c, content, content.w, content.h, content.left, content.right, currentControlElementId] );

    //устанавливаем координаты блока управления
    const setControlData = () => {
        //находим центр блока
        const blockPositionCx = blockPosition.left + (blockPosition.width  / 2),
              blockPositionCy = blockPosition.top  + (blockPosition.height / 2);

        //находим позицию угла фотографии
        const pos = turnXY( { x: position.x,
                              y: position.y,
                              rotate: position.rotate,
                              cx: blockPositionCx,
                              cy: blockPositionCy
        });

        //находим позицию центра фотографии
        const posCxCy = turnXY( { x: position.x + (position.width / 2),
                                  y: position.y + (position.height / 2),
                                  rotate: position.rotate,
                                  cx: blockPositionCx,
                                  cy: blockPositionCy
        });
        //находим позицию угла элемента управления
        const posControlLocal = turnXY( { x: pos.x,
                                          y: pos.y,
                                          rotate: position.rotate * -1,
                                          cx: posCxCy.x,
                                          cy: posCxCy.y
        });

        //утанавливаем данные в state блока управления
        return setControl( {
                               top: posControlLocal.y * ratio + topDelta,
                               left: posControlLocal.x * ratio + leftDelta,
                               width: position.width * ratio,
                               height: position.height * ratio,
                               rotateAngle: position.rotate,
                               aspectRatio: content.w / content.h
                           } );
    };


    const setControlPosition = () => {
        //устанавливаем в redux
        setControlIdOnElement( content.id );

        setControlData();
    };

    const handleRotate = () => {};
    const handleDrag = ( deltaX, deltaY ) => {
        let left = control.left + deltaX,
            top  = control.top + deltaY,
            topSVG = (top - topDelta) / ratio,
            leftSVG = (left - leftDelta) / ratio;

        //TODO сделать корректное позицирование при повороте блока

        //находим центр блока
        //const blockPositionCx = blockPosition.left + (blockPosition.width  / 2),
        //      blockPositionCy = blockPosition.top  + (blockPosition.height / 2);

        //повернем блок управления на угол поворота
        /*
        const turnedPoint = turnXY( {
                                    x: leftSVG,
                                    y: topSVG,
                                    rotate: position.rotate,
                                    invertCalc: false,
                                    cx: leftSVG + (position.width / 2),
                                    cy: topSVG + (position.height / 2)
                                  });

        */
        /*
        //сдвинем по углу поворота управляющего блока
        const turnedPoint2 = turnXY( {
                                        x: leftSVG, //turnedPoint.x,
                                        y: topSVG, //turnedPoint.y,
                                        rotate: position.rotate,
                                        invertCalc: false,
                                        cx: blockPositionCx,
                                        cy: blockPositionCy
                                    });
        /*
        const pos = turnXY( {
                                    x: leftSVG,
                                    y: topSVG,
                                    rotate: position.rotate,
                                    invertCalc: true,
                                    cx: posCxCy.x,
                                    cy: posCxCy.y
                                });*/

        //находим позицию фотографии относительно поворота блока
        const t = turnXY({
                             tX: leftSVG,
                             tY: topSVG,
                             rotate: position.rotate,
                             invertCalc: true,
                             //cx: position.width / 2,
                             //cy: position.height / 2
                         });
/*
        //находим позицию центра фотографии
        const posCxCy = turnXY( {
                                  x: t.x + (position.width / 2),
                                  y: t.y + (position.height / 2),
                                  rotate: position.rotate,
                                  cx: blockPositionCx,
                                  cy: blockPositionCy
                                });

        //находим позицию фотографии относительно поворота блока
        const x = turnXY({
                             x: t.x,
                             y: t.y,
                             rotate: position.rotate * -1,
                             invertCalc: false,
                             cx: posCxCy.x,
                             cy: posCxCy.y
                         });
*/
        //const x = t;
        /*
        setDot( {
                    x: t.x * ratio + leftDelta,
                    y: t.y * ratio + topDelta,
                    cx: 0,
                    cy: 0,
                } );
        */
        leftSVG = t.x;
        topSVG = t.y;

        //определяем, не выходит ли контент за пределы блока

        if ( leftSVG > blockPosition.left ) {
            leftSVG = blockPosition.left;
            left = leftSVG * ratio + leftDelta;
        }
        if ( topSVG > blockPosition.top ) {
            topSVG = blockPosition.top;
            top = topSVG * ratio + topDelta;
        }
        if ( leftSVG + position.width < blockPosition.width + blockPosition.left ) {
            leftSVG = blockPosition.width + blockPosition.left - position.width;
            left = leftSVG * ratio + leftDelta;
        }
        if ( topSVG + position.height < blockPosition.height + blockPosition.top ) {
            topSVG = blockPosition.height + blockPosition.top - position.height;
            top = topSVG * ratio + topDelta;
        }

        setControl( { ...control, top, left } );
        setPosition( { ...position, y: topSVG, x: leftSVG } );
    };
    const handleResize = ( style, isShiftKey, type ) => {
        let { top, left, width, height } = style;

        /*
        top = Math.round( top );
        left = Math.round( left );
        width = Math.round( width );
        height = Math.round( height );
        */


        
        //назначаем размеры и координаты в SVG единицах измерения
        let topSVG = (top - topDelta) / ratio,
            leftSVG = (left - leftDelta) / ratio,
            widthSVG = width / ratio,
            heightSVG = height / ratio;

        //общет ширины, если меньше нужной
        const setWidth = () => {
            //компенсируем разницу в размерах
            const delta = blockPosition.left - position.x;

            widthSVG = blockPosition.width + delta;
            heightSVG = widthSVG / control.aspectRatio;
            width = widthSVG * ratio;
            height = heightSVG * ratio;
        };

        //общет высоты, если меньше нужной
        const setHeight = () => {
            const delta = blockPosition.top - position.y;
            heightSVG = blockPosition.height + delta;
            widthSVG = heightSVG * control.aspectRatio;
            width = widthSVG * ratio;
            height = heightSVG * ratio;
        };

        //если ширина или высота меньше блока, вызываем их пересчет
        if ( widthSVG < blockPosition.width ) setWidth();
        if ( heightSVG < blockPosition.height ) setHeight();

        //если правая или нижняя стороны меньше, чем размер блока, вызываем пересчет
        if ( leftSVG + widthSVG < blockPosition.left + blockPosition.width ) setWidth();
        if ( topSVG + heightSVG < blockPosition.top + blockPosition.height ) setHeight();

        //если левая сторона имее координату больше блока
        if ( leftSVG > blockPosition.left ) {
            leftSVG = blockPosition.left;
            left = leftSVG * ratio + leftDelta;
        }

        //если нижняя сторона имее координату больше блока
        if ( topSVG > blockPosition.top ) {
            topSVG = blockPosition.top;
            top = topSVG * ratio + topDelta;
        }

        setControl( { ...control, top, left, width, height } );
        setPosition( {
                         ...position,
                         y: topSVG,
                         x: leftSVG,
                         width: widthSVG,
                         height: heightSVG,
                     } );
    };
    const handlerStart = () => {};
    const handlerStop = () => {
        setUpdateBlockParams( {
                                  contentPhoto: {
                                      id: content.id,
                                      x: position.x - blockPosition.left,
                                      y: position.y - blockPosition.top,
                                      w: position.width,
                                      h: position.height
                                  }
                              } );

        // dispatch( productUpdateContentPositionAction( {
        //                                                   contentId: contentId,
        //                                                   x: position.x,
        //                                                   y: position.y,
        //                                                   w: position.width,
        //                                                   h: position.height
        //                                               } ) );
    };

    const url = useMemo( () => {

        if ( !content.backgroundId ) return null;

        if ( pdf ) {
            return createBackgroundLinkOrig( {
                                                 id: content.backgroundId,
                                                 ext: content.backgroundType,
                                                 backgroundConfig: backgroundConfig
                                             } );
        } else {
            return createBackgroundLinkMiddle( {
                                                   id: content.backgroundId,
                                                   ext: content.backgroundType,
                                                   backgroundConfig: backgroundConfig
                                               } );
        }
    }, [content.backgroundId] );

    return  <Fragment>
                <PagePhotoDrawInner clipPathId={currentControlElementId === content.id || pdf ? ('clip_print_' + pageId) : ('clip_print_block_' + contentId) }
                                    clipPathIdParrentBlock={'clip_photo_block_' + contentId}
                                    url={url}
                                    bgColor = {content.bgColor}
                                    mirroring = {mirroring}
                                    positionX = {position.x}
                                    positionY = {position.y}
                                    positionW = {position.width}
                                    positionH = {position.height}
                                    positionR = {position.rotate}
                                    blockPositionX = {blockPosition.left}
                                    blockPositionY = {blockPosition.top}
                                    blockPositionW = {blockPosition.width}
                                    blockPositionH = {blockPosition.height}
                                    isPattern = {content.isPattern}
                                    patternWidth = {content.patternWidth}
                                    proportionPhoto= {proportionPhoto}
                                    preview={preview}
                                    ratio={ratio}
                                    pdf={pdf}
                                    dangerQuality={!pdf && !preview && photoDpiWarning && !photoDpiCantPrint}
                                    errorQuality={!pdf && !preview && photoDpiCantPrint}
               />

                {/* строим в портале */}
                {content.backgroundId && control && currentControlElementId === content.id && ReactDOM.createPortal(
                    <>
                        <ResizableRect
                            {...control}
                            zoomable='nw, ne, se, sw'
                            aspectRatio={proportionPhoto}
                            // minWidth={10}
                            // minHeight={10}
                            rotatable={false}
                            // onRotateStart={this.handleRotateStart}
                            onRotate={handleRotate}
                            onRotateEnd={handlerStop}
                            // onResizeStart={this.handleResizeStart}
                            onResize={handleResize}
                            onResizeEnd={handlerStop}
                            onDragStart={handlerStart}
                            onDrag={handleDrag}
                            onDragEnd={handlerStop}
                            colorOrange={true}
                            isActive={currentControlElementId === content.id}
                        />
                    </>,
                    document.querySelector( '#layoutControlBlock' ))}
            </Fragment>
};

export default PageBackgroundDraw;