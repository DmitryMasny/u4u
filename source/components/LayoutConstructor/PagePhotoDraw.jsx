import React, { Fragment, useEffect, useState, useRef, useMemo, memo } from 'react';
//import { NavLink } from 'react-router-dom'
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import ResizableRect from 'components/_3dParty/react-resizable-rotatable-draggable-touch';
import { getOutsizeRectSizeAfterTurn, turnXY, degrees_to_radians } from 'libs/geometry';
import { selectContent } from './selectors';
//import { productUpdateContentPositionAction } from "components/_pages/PosterEditor/actions";
//import { IconError } from "components/Icons";
import styled from "styled-components";
import { COLORS } from "const/styles";
//import LINKS_MAIN from "config/links";
//import { NAV } from "const/help";
import { modalProductPhotoQualityAction } from 'actions/modals';
import { actionUpdateLayoutReady } from './actions';

import { setAddNotGoodPhoto, setDeleteNotGoodPhoto, setAddNotAcceptedPhoto, setDeleteNotAcceptedPhoto } from '__TS/components/Editor/_actions';

import { calcImageSizeInBlock, checkPhotoQuality } from '__TS/libs/layout';

/*
const DivWarningMessage = styled.div`
    position: absolute;
    top: 10px;
    left: 100px;
    color: ${COLORS.DANGER};
    font-size: 17px;
    right: 100px;
    text-align: center;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    ${({theme}) => theme.media.md`
         font-size: 15px;
    `}
    ${({theme}) => theme.media.sm`
         font-size: 0;
    `}
    .moreLink {
      font-size: 15px;
      pointer-events: auto;
      color: ${COLORS.DANGER};
      text-decoration: underline;
      &:hover {
        opacity: .9;
      }
    }
`;*/

const ErrorBorder = styled.circle`
    fill: ${( { errorQuality } ) => errorQuality ? 'red' : 'orange'};    
    stroke: #6d6d6d;
    stroke-width: 1;
    //stroke-linecap: round;    
`;


const PagePhotoDrawInner = ( { url, clipPathId,clipPathIdParrentBlock,
                               mirroring,
                               positionX, positionY,
                               positionW, positionH,
                               positionR
                             , onClick, preview = false, previewPage = false, pdf = false, ratio = 0, dangerQuality, errorQuality } ) => {

    if ( !ratio && !preview && !pdf) return null;
    const timeout = useRef( null );

    const [imageWidth, setImageWidth] = useState( parseInt( positionW * ratio ) );

    useEffect( () => {
        if ( !pdf && !preview ) {
            if ( timeout.current ) clearTimeout( timeout.current );
            timeout.current = setTimeout( () => {
                                      setImageWidth( parseInt( positionW * ratio ) )
                                  }, 500 );
        }
    }, [positionW, ratio] )

    const urlImage = useMemo(() => {
        if ( pdf ) {
            //url = url + '=w0'; //для pdf
        } else if ( previewPage ) {
            url = url + '=h50'; //для превью
        } else if ( preview ) {
            url = url + '=/%IMAGESIZE%/'; //для превью
        } else {
            if ( ratio ) {
                url = url + '=w' + imageWidth; //для редактора
            } else {
                url = url + '=w0'; //для редактора
            }
        }
        return url;
    }, [imageWidth] );


    const sizeDanger = useMemo( () => {
        return 10 / ratio;
    }, [ratio] );

    const position = {
        x: positionX,
        y: positionY,
        width: positionW,
        height: positionH
    }

    const mirroringParams = useMemo(()=> {
        if ( !mirroring ) return '';
        return `scale(-1, 1) translate(${(positionX*2 + positionW) * -1}, 0)`;
    }, [mirroring, positionX, positionY, positionW, positionH] )

    const transform = `rotate(${positionR}  ${positionX + positionW / 2} ${positionY + positionH / 2}) ${mirroringParams}`;
    //для генерации PDF
    if ( pdf ) {
        return <g clipPath={`url(#${clipPathIdParrentBlock})`}>
                    <image {...position}
                               transform={transform}
                               xlinkHref={urlImage}
                               clipPath={`url(#${clipPathId})`}
                    />
                </g>
    //для отрисовки в редакторе
    } else {
        const dangerPosition = {
            cx: positionX + 15 + sizeDanger,
            cy: positionY + 15 + sizeDanger,
            r: sizeDanger
        }
        return <g clipPath={`url(#${clipPathIdParrentBlock})`}>
                    <image {...position}
                              transform={transform}
                              href={urlImage}
                              onClick={onClick}
                              clipPath={`url(#${clipPathId})`}
                    />
                    {(dangerQuality || errorQuality) && <ErrorBorder {...dangerPosition} errorQuality={errorQuality} transform={transform} clipPath={`url(#${clipPathId})`} />}
                </g>
    }
};
const PagePhotoDraw = ( { c, mirroring, formatDPI, contentId, pageId, pageX, pageY, setUpdateBlockParams,  pageW, pageH, blockId, blockPosition, currentControlElementId, setControlIdOnElement, ratio, topDelta, leftDelta, preview = false, previewPage = false, pdf = false, state = null, dispatch = null} ) => {

    dispatch = dispatch || useDispatch();

    const content = state ? selectContent( state, contentId ) : useSelector( state => selectContent( state, contentId ) );

    const [dot, setDot] = useState( null );

    const blockPositionLast = useRef( blockPosition );

    const [proportionPhoto, proportionPhotoSet] = useState( content.pxWidth / content.pxHeight );

    //состояние управляющего элемента
    const [control, setControl] = useState( null );

    const calculatePositionStructure = ( { content, blockPosition, c } ) => {
        if ( !content ) {
            console.error('calculatePositionStructure in PageContentDraw, no "content" property', content);
            return {};
        }

        //const { top, left, rotateAngle, width, height } = blockPositionLast.current;

        const proportionBlock = blockPosition.width / blockPosition.height;

        //вычисляем положение фото в блоке
        const { imgWidth, imgHeight, imgTop, imgLeft } = calcImageSizeInBlock({
                                                                                  blockW: blockPosition.width,
                                                                                  blockH: blockPosition.height,
                                                                                  blockRatio: proportionBlock,
                                                                                  imgW: content.w,
                                                                                  imgH: content.h,
                                                                                  imgX: content.x,
                                                                                  imgY: content.y,
                                                                                  imgRatio: proportionPhoto
                                                                              });

        return {
            width: imgWidth,  //photoWidthSize,
            height: imgHeight, //photoHeightSize,
            x: imgLeft + blockPosition.left, //deltaPhotoX * -1 + blockPosition.left,
            y: imgTop + blockPosition.top, //deltaPhotoY * -1 + blockPosition.top,
            rotate: blockPosition.rotateAngle || 0

            //width: content.w + (blockPosition.width - width),
            //height: content.h + (blockPosition.height - height),
            //x: content.x + blockPosition.left,
            //y: content.y + blockPosition.top,
            //width: blockPosition.width,
            //height: blockPosition.height,
            //x: blockPosition.left,
            //y: blockPosition.top
        }
    };

    //состояние контента
    const [ position, setPosition ] = useState( calculatePositionStructure( { content, blockPosition } ) );

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
        setTimeout(() => {
            checkQualityPhoto({w: position.width || content.w, h: position.height || content.h });
        });
    }, [content.w, content.h, content.pxWidth, content.pxHeight, position.width, position.height ] );

    useEffect( () => {
        setPosition( calculatePositionStructure( { content, blockPosition } ) );
        setControlData();
    }, [blockPosition.left, blockPosition.top, blockPosition.width, blockPosition.height, c, content, content.w, content.h, content.left, content.right, currentControlElementId] );

    //если не нашли контент, не рендерим
    if ( !content ) return null;

    //проверка на качество фото в блоке
    const checkQualityPhoto = ( { w, h } ) => {
        const goodQuality = checkPhotoQuality( {
                                                  dpi: formatDPI,
                                                  pxWidth: content.pxWidth,
                                                  pxHeight: content.pxHeight,
                                                  mmWidth: w,
                                                  mmHeight: h
                                              } );

        const canPrint = checkPhotoQuality( {
                                                  dpi: formatDPI / 2,
                                                  pxWidth: content.pxWidth,
                                                  pxHeight: content.pxHeight,
                                                  mmWidth: w,
                                                  mmHeight: h
                                              } );

        photoDpiWarningSet( !goodQuality );
        photoDpiCantPrintSet( !canPrint );
    };

    useEffect(()=> {
        if ( photoDpiCantPrint ) {
            setDeleteNotGoodPhoto( { id: contentId } )
            setAddNotAcceptedPhoto( content )
        } else {
            setDeleteNotAcceptedPhoto( { id: contentId } )
            if ( photoDpiWarning ) {
                setAddNotGoodPhoto( content )
            } else {
                setDeleteNotGoodPhoto( { id: contentId } )
            }
        }
    }, [photoDpiWarning, photoDpiCantPrint] );

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
                     } )
    };
    const handlerStart = () => {};
    const checkDiffData = () => {
        if ( content.x !== position.x - blockPosition.left ) return true;
        if ( content.y !== position.y - blockPosition.top ) return true;
        if ( content.w !== position.width ) return true;
        if ( content.h !== position.height ) return true;
        return false;
    }

    const handlerStop = () => {
        if ( !checkDiffData() ) {
            //устанавливаем в redux
            setControlIdOnElement( {
                                       blockId: blockId,
                                       blockType: 'photo',
                                       widthPx: position.width * ratio
                                   } );

            return;
        }

        setUpdateBlockParams( {
                                  contentPhoto: {
                                      id: content.id,
                                      x: position.x - blockPosition.left,
                                      y: position.y - blockPosition.top,
                                      w: position.width,
                                      h: position.height
                                  }
                              } );

        /*
        dispatch( productUpdateContentPositionAction( {
                                                          contentId: contentId,
                                                          x: position.x,
                                                          y: position.y,
                                                          w: position.width,
                                                          h: position.height
                                                      } ) );*/
    };
    const showQualityModal = () => {
        dispatch( modalProductPhotoQualityAction( { content, pageW, pageH } ) );
    };

    //console.log('position', position);
    //console.log('control', control);
    //console.log('ratio', ratio);

    return  <Fragment>
                <PagePhotoDrawInner clipPathId={currentControlElementId === content.id || pdf ? ('clip_print_' + pageId) : ('clip_print_block_' + contentId) }
                                    clipPathIdParrentBlock={'clip_photo_block_' + contentId}
                                    url={pdf ? content.orig || content.url : content.url}
                                    mirroring = {mirroring}
                                    positionX = {position.x}
                                    positionY = {position.y}
                                    positionW = {position.width}
                                    positionH = {position.height}
                                    positionR = {position.rotate}
                                    preview={preview}
                                    previewPage={previewPage}
                                    ratio={ratio}
                                    pdf={pdf}
                                    dangerQuality={!pdf && !preview && photoDpiWarning && !photoDpiCantPrint}
                                    errorQuality={!pdf && !preview && photoDpiCantPrint}
               />

                {/* строим в портале */}
                {dot && ReactDOM.createPortal(
                    <Fragment>
                        <div style={{left: dot.x,
                                     top: dot.y,
                                     width: 10,
                                     height: 10,
                                     background: 'green',
                                     position: 'absolute'
                        }} />
                        <div style={{left: dot.cx,
                                     top: dot.cy,
                                     width: 10,
                                     height: 10,
                                     background: 'yellow',
                                     position: 'absolute'
                        }} />
                    </Fragment>
                    , document.querySelector( '#layoutControlBlock' ))}


                {/* строим в портале предупреждающее сообщение */}
                {/*photoDpiWarning && !photoDpiCantPrint && ReactDOM.createPortal(
                    <DivWarningMessage>
                        <IconError intent="danger"/>
                        Фотография слишком растянута, возможно плохое качество при печати!&nbsp;
                        <span className="moreLink" onClick={showQualityModal}>Подробнее</span>
                    </DivWarningMessage>,
                    document.querySelector( '#layoutInfoBlock' )
                )*/}

                {/* строим в портале предупреждающее сообщение */}
                {/*photoDpiCantPrint && ReactDOM.createPortal(
                    <DivWarningMessage>
                        <IconError intent="danger"/>
                        Фотография слишком маленького размера, либо сильно растянута!<br />
                        Выберите фотографию большего размера или меньший формат полотна.
                    </DivWarningMessage>,
                    document.querySelector( '#layoutInfoBlock' )
                )*/}

                {control && currentControlElementId === content.id && ReactDOM.createPortal(
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


export default PagePhotoDraw;