import React, { Fragment, useEffect, useState, useMemo, useCallback,  } from 'react';
import ReactDOM from 'react-dom';
import ResizableRect from 'components/_3dParty/react-resizable-rotatable-draggable-touch';
import { getOutsizeRectSizeAfterTurn } from 'libs/geometry';
import polygonsIntersect from 'polygons-intersect';

import styled from "styled-components";
import PageBackgroundDraw from "./PageBackgroundDraw";
import PagePhotoDraw from "./PagePhotoDraw";
import PagePhotoEmptyDraw from "./PagePhotoEmptyDraw";
import PageTextDraw from "./PageTextDraw";
import PageStickerDraw from "./PageStickerDraw";
import PageShapeDraw from "./PageShapeDraw";

const SvgRect = styled.rect`
     //fill: #fafafa;
     fill: transparent;
     &:hover {
         stroke-width: 1;
         stroke: rgb(100,100,100);
     }
`;

const SvgRectBgBLock = styled.rect`
     fill: rgba(81,173,255,0.8);
`;

const SvgRectOutBLock = styled.rect`
     fill: transparent;
     stroke-width:1;
     stroke: rgba(81,173,255,0.8);
     stroke-dasharray: 5,5
`;

/**
 * Рисуем блок
 */
const PageBlocksDraw = ( { block,
                           formatDPI,
                           turnWidth,
                           turnHeight,
                           svgToPixelData,
                           setControlIdOnElement,
                           currentControlElementId,
                           verticalMagnetizedLine,
                           horizontalMagnetizedLine,
                           setVerticalMagnetizedLine,
                           setHorizontalMagnetizedLine,
                           calculateMagnetizedMap,
                           mapOfMagnetized,
                           setUpdateBlockParams,
                           state = null, dispatch = null,
                           preview = false,
                           previewPage = false,
                           pdf = false,
                           cut
                         } ) => {
    const [ control, setControl ] = useState(null);
    const [ c, setC ] = useState(1);
    const [ textHeight, setTextHeight ] = useState( block.h );

    const [ outsideDelta, setOutsideDelta ] = useState( { w: 0, h: 0 } );

    const [ position, setPosition ] = useState( {
                                              width: block.w,
                                              height: block.h,
                                              left: block.x + block.pageX,
                                              top: block.y + block.pageY,
                                              rotateAngle: block.r || 0
                                          });

    const { ratio, topDelta, leftDelta } = svgToPixelData;

    const [mouseDownEvent, mouseDownEventSet] = useState( false );

    const setControlData = () => setControl( {
                                                 top: position.top * ratio + topDelta,
                                                 left: position.left * ratio + leftDelta,
                                                 width: position.width * ratio,
                                                 height: position.height * ratio,
                                                 rotateAngle: position.rotateAngle
                                             } );

    const updateHeightHandler = useCallback(( height ) => {
        setTextHeight( height );
    }, []);

    useEffect( ()=> {
        setTextHeight( block.h );
    }, [block.h] );

    const setOutsideData = useCallback(() => {
        if ( position.rotateAngle ) {
            const o = getOutsizeRectSizeAfterTurn({ x1: position.left,
                                                    y1: position.top,
                                                    x2: position.left + position.width,
                                                    y2: position.top + position.height,
                                                    deg: position.rotateAngle
                                                  });
            const widthOutsideDelta  = (o.x2 - o.x1) - position.width;
            const heightOutsideDelta = (o.y2 - o.y1) - position.height;

            setOutsideDelta( { w: widthOutsideDelta / 2, h: heightOutsideDelta / 2 } );
        } else {
            setOutsideDelta( { w: 0, h: 0 } );
        }
    }, [position.rotateAngle]);


    useEffect( () => {
        if ( currentControlElementId === block.id ) {
            setControlData();
        }
    }, [ratio, topDelta, leftDelta, position.height] );

    useEffect( () => {
        setPosition( {
                        width: block.w,
                        height: block.h,
                        left: block.x + block.pageX,
                        top: block.y + block.pageY,
                        rotateAngle: block.r || 0
                    });
    }, [block.w, block.y, block.h, svgToPixelData.ratio] );

    //задаем id выбранного блока
    const setControlElement = ( event ) => {

        //проверяем, можем ли мы управлять блоком
        if ( block.disabled ) {
            //прокидываем собыитие далее
            //console.log('event', typeof event );
            //event.target.dispatchEvent( event.originalEvent );
            return;
        }

        const blockControlId = block.type === 'background' ? block.content : block.id;

        if ( blockControlId ) {
            //устанавливаем в redux
            setControlIdOnElement( {
                                       blockId: blockControlId,
                                       blockType: block.type,
                                       widthPx: position.width * ratio
                                   } );
        }
        setControlData();
    };

    const handleResize = ( style, isShiftKey, type ) => {
        // type is a string and it shows which resize-handler you clicked
        // e.g. if you clicked top-right handler, then type is 'tr'
        let { top, left, width, height } = style;

        top = Math.round( top );
        left = Math.round( left );
        width = Math.round( width );

        /*
        if ( altIsPressed ) {
            if ( top !== control.top ) {

                //console.log( '(control.height - height', (height - control.height));
                console.log('height', height);
                height = height - (height - control.height);
            }
        }*/

        /*
        if (block.type === 'photo') {
            height = Math.round( height );
        } else {
            height = textHeight * ratio;
        }*/

        setControl({...control, top, left, width, height });
        setPosition({...position,
                        top: (top - topDelta) / ratio,
                        left: (left - leftDelta) / ratio,
                        width: width / ratio,
                        height: height / ratio,
                    })
    };
    const handleDrag = ( deltaX, deltaY ) => {
        let left = control.left + deltaX,
            top  = control.top + deltaY,
            topSVG = (top - topDelta) / ratio,
            leftSVG = (left - leftDelta) / ratio;


// console.log('leftSVG', leftSVG);
// console.log('verticalMagnetizedLine', verticalMagnetizedLine);

        //смотрим на примагничевание
        if ( mapOfMagnetized && mapOfMagnetized.w ) {
            //console.log('mapOfMagnetized.w', mapOfMagnetized.w);

            //по горизнтали
            let magnetVertical = false;
            for ( let i = 0; i < mapOfMagnetized.w.length; i++ ) {
                const w = mapOfMagnetized.w[ i ];

                if ( block.id === w.id ) continue;

                const setVertical = ( t ) => {
                    magnetVertical = true;
                    if ( verticalMagnetizedLine === null ) {
                        left = leftSVG * ratio + leftDelta;
                        if ( verticalMagnetizedLine !== t.use ) setVerticalMagnetizedLine( t.use );
                    }
                };

                if ( leftSVG > w.min + outsideDelta.w && leftSVG < w.max + outsideDelta.w ) {
                    leftSVG = w.use + outsideDelta.w;
                    setVertical( w );
                }

                if ( (leftSVG + block.w) > w.min - outsideDelta.w && (leftSVG + block.w) < w.max - outsideDelta.w ) {
                    leftSVG = w.use - block.w - outsideDelta.w;
                    setVertical( w );
                }

                if ( (leftSVG + block.w / 2) > w.min - outsideDelta.w && (leftSVG + block.w / 2) < w.max - outsideDelta.w ) {
                    leftSVG = w.use - block.w / 2 - outsideDelta.w;
                    setVertical( w );
                }

                if ( magnetVertical ) break;
            }
            if ( !magnetVertical ) setVerticalMagnetizedLine( null );


            //по горизонтали
            let magnetHorizontal = false;
            for ( let i = 0; i < mapOfMagnetized.h.length; i++ ) {
                const h = mapOfMagnetized.h[ i ];

                if ( block.id === h.id ) continue;

                const setHorizontal = ( t ) => {
                    magnetHorizontal = true;
                    if ( horizontalMagnetizedLine === null ) {
                        top = topSVG * ratio + topDelta;
                        if ( horizontalMagnetizedLine !== t.use ) setHorizontalMagnetizedLine( t.use );
                    }
                };

                if ( topSVG > h.min + outsideDelta.h && topSVG < h.max + outsideDelta.h ) {
                    topSVG = h.use + outsideDelta.h;
                    setHorizontal( h );
                }

                if ( (topSVG + block.h) > h.min - outsideDelta.h && (topSVG + block.h) < h.max - outsideDelta.h ) {
                    topSVG = h.use - block.h - outsideDelta.h;
                    setHorizontal( h );
                }

                if ( (topSVG + block.h / 2) > h.min - outsideDelta.h && (topSVG + block.h / 2) < h.max - outsideDelta.h ) {
                    topSVG = h.use - block.h / 2 - outsideDelta.h;
                    setHorizontal( h );
                }

                if ( magnetHorizontal ) break;
            }
            if ( !magnetHorizontal ) setHorizontalMagnetizedLine( null );
        }

        setControl({ ...control, top, left });
        setPosition({ ...position, top: topSVG, left: leftSVG });
    };
    const handleRotate = ( rotateAngle ) => {
        setC( c + 1 );
        setControl( { ...control, rotateAngle } );
        setPosition( { ...position, rotateAngle } );
    };
    const handlerStart = () => {
        calculateMagnetizedMap();

        //пересчитываем дельту габаритов внешнего прямоугольника
        setOutsideData();
    };

    const checkDiffData = () => {
        if ( block.x !== position.left - block.pageX ) return true;
        if ( block.y !== position.top - block.pageY ) return true;
        if ( block.w !== position.width ) return true;
        if ( block.h !== position.height ) return true;
        if ( block.r !== position.rotateAngle ) return true;
        return false;
    }

    const handlerStop = () => {
        //определяем, были ли изменения блока для возможной передачи управления контенту
        if ( block.content && block.type === 'photo' && !checkDiffData() ) {

            //устанавливаем в redux
            setControlIdOnElement( {
                                       blockId: block.content,
                                       blockType: 'contentPhoto',
                                       widthPx: position.width * ratio
                                   } );

            return;

        }

        //обновляем данные контрольного эелемента
        setControlData();

        //убираем визуализацию линий примагничивания
        setVerticalMagnetizedLine( null );
        setHorizontalMagnetizedLine( null );

        let height = 0;

        if ( (!block.type === 'photo' &&
              !block.type === 'sticker' &&
              !block.type === 'shape') &&
               block.h < textHeight ) {
            height = textHeight;
        } else {
            height = position.height;
        }

        //обновляем данныена сервере
        setUpdateBlockParams( {
                                  block: {
                                      ...block,
                                      x: position.left - block.pageX,
                                      y: position.top - block.pageY,
                                      w: position.width,
                                      h: height,
                                      r: position.rotateAngle
                                  }
                              } );

        //обновляем обновлем данные о активном элементе
        setControlIdOnElement( {
                                   blockId: block.id,
                                   blockType: block.type,
                                   widthPx: position.width * ratio
                               } );

    };

    //собираем параметры для области обреза содержимого
    const rectParams = {
         width: position.width,
         height: position.height,
         x: position.left,
         y: position.top
     };

    //вычисляем, лежит ли блок вне страницы
    const isBlockOutsidePage = useMemo( () => {
        //получаем полигон блока после трансформации с учетом поворота
        const o = getOutsizeRectSizeAfterTurn({ x1: block.x,
                                                y1: block.y,
                                                x2: block.x + block.w,
                                                y2: block.y + block.h,
                                                deg: block.r
                                              });
        //задаем координаты полигона страницы
        const pagePolygon = [
            { x: 0, y: 0 },
            { x: turnWidth, y: 0 },
            { x: turnWidth, y: turnHeight },
            { x: 0, y: turnHeight }
        ];

        return !polygonsIntersect( pagePolygon, o.coordinatesWithRotated ).length;
    }, [block.w, block.h, block.r, block.x, block.y] );

    const blockProportion = useMemo( () => position.width / position.height, [block.h] );

    const transformRotate = `rotate(${position.rotateAngle} ${position.left + position.width / 2} ${position.top + position.height / 2})`;

    //смотрим, нужно ли сохранять пропорции (и какие), или нет
    const proportion = useMemo( () => {
        if ( block.type === 'photo' ) return false;//blockProportion;
        if ( block.type === 'sticker' || block.type === 'shape') {
            if ( block.fixedProportions ) {
                return blockProportion;
            }
        }

        return false;
    }, [] );

    const typeBlock = useMemo(()=> {
        switch ( block.type ) {
            case 'photo':
                return block.content ? 'layoutPhoto' : 'layoutPhotoEmpty';
            case 'text': return 'layoutText';
            case 'sticker': return 'layoutSticker';
            case 'shape': return 'layoutShape';
            case 'background': return 'layoutBackground';
        }
    }, [block.content, block.type] );

    //если картинка отражена
    const mirroringParams = useMemo( () => {
        if ( !block.mirroring ) return '';
        return `scale(-1, 1) translate(${(position.left * 2 + position.width) * -1}, 0)`;

    }, [block.mirroring, position.left, position.top, position.width, position.height] )

    const transform = `rotate(${position.rotateAngle * (block.mirroring ? 1 : -1)} ${position.left + position.width / 2} ${position.top + position.height / 2}) ${mirroringParams}`;

    const clipPathIdPdf = useMemo( () => pdf ? 'clip_print_' + block.pageId : null, [] );

    return <Fragment>
                {/*<g className="pageBlock" clipPath={`url(#${currentControlElementId === block.id ? ('clip_print_' + block.pageId) : ('clip_cut_' + block.pageId)})`}>*/}
                {/*<g transform={`rotate(${position.rotateAngle}  ${position.left + position.width / 2} ${position.top + position.height / 2})`}>*/}
                {/* Маска печатного формата */}
                {<clipPath id={'clip_print_block_' + block.content} data-current='clipPath'>
                    <rect x={0} y={0}
                          width={turnWidth}
                          height={turnHeight}
                          transform={transform}
                    />
                 </clipPath>}

                <g data-current={typeBlock} clipPath={clipPathIdPdf ? `url(#${clipPathIdPdf})` : null}>

                    {/*<defs>
                        <clipPath id={block.id}>
                            <rect {...rectParams} />
                        </clipPath>
                    </defs>*/}
                    {block.type === 'photo' && !pdf && !preview && currentControlElementId === block.id ?
                                                    <SvgRectBgBLock {...rectParams} transform={transformRotate} />
                                                : null}

                    {block.type === 'photo' ? <clipPath id={'clip_photo_block_' + block.content} data-current='clipPath'>
                                                    <rect {...rectParams} transform={transformRotate} />
                                              </clipPath> : null}

                    {!pdf && !preview && currentControlElementId !== block.id && isBlockOutsidePage ? <SvgRectOutBLock {...rectParams}
                                                         transform={transformRotate}
                                                     /> : null}

                    {block.content && block.type === 'shape' ? <PageShapeDraw contentId={block.content}
                                                                              mirroring={block.mirroring}
                                                                              fixedProportions={block.fixedProportions}
                                                                              pageId={block.pageId}
                                                                              preview={preview}
                                                                              pdf={pdf}
                                                                              blockHeight={block.h}
                                                                              x={position.left}
                                                                              y={position.top}
                                                                              w={position.width}
                                                                              h={position.height}
                                                                              r={position.rotateAngle}
                                                                              state = {state}
                    /> : null}

                    {block.content && block.type === 'sticker' ? <PageStickerDraw contentId={block.content}
                                                                                  mirroring={block.mirroring}
                                                                                  fixedProportions={block.fixedProportions}
                                                                                  pageId={block.pageId}
                                                                                  preview={preview}
                                                                                  pdf={pdf}
                                                                                  blockHeight={block.h}
                                                                                  x={position.left}
                                                                                  y={position.top}
                                                                                  w={position.width}
                                                                                  h={position.height}
                                                                                  r={position.rotateAngle}
                                                                                  state = {state}
                    /> : null}

                    {block.content && block.type === 'text' ? <PageTextDraw contentId={block.content}
                                                                             mirroring={block.mirroring}
                                                                             pageId={block.pageId}
                                                                             preview={preview}
                                                                             pdf={pdf}
                                                                             blockHeight={block.h}
                                                                             x={position.left}
                                                                             y={position.top}
                                                                             w={position.width}
                                                                             h={position.height}
                                                                             r={position.rotateAngle}
                                                                             state = {state}
                                                                             updateHeightHandler={updateHeightHandler}
                                                                             controlWidthPx={control && control.width}
                                                               /> : null}


                    {!block.content && block.type === 'photo' ? <PagePhotoEmptyDraw preview={preview}
                                                                                    pdf={pdf}
                                                                                    ratio={ratio}
                                                                                    position={position}
                                                                                    blockId={block.id}

                    /> : null}

                    {block.content && block.type === 'background' ? <PageBackgroundDraw c={c}
                                                                              blockId={block.id}
                                                                              pageId={block.pageId}
                                                                              blockPosition={position}
                                                                              contentId={block.content}
                                                                              pageX={block.pageX}
                                                                              pageY={block.pageY}
                                                                              pageW={block.pageW}
                                                                              pageH={block.pageH}
                                                                              ratio={ratio}
                                                                              topDelta={topDelta}
                                                                              leftDelta={leftDelta}
                                                                              currentControlElementId={currentControlElementId}
                                                                              setControlIdOnElement={setControlIdOnElement}
                                                                              preview={preview}
                                                                              pdf={pdf}
                                                                              cut={cut}
                                                                              state = {state}
                                                                              formatDPI={formatDPI}
                                                                              dispatch = {dispatch}
                                                                              turnWidth={turnWidth}
                                                                              turnHeight={turnHeight}
                                                                              setUpdateBlockParams={setUpdateBlockParams}
                    /> : null}

                    {block.content && block.type === 'photo' ? <PagePhotoDraw c={c}
                                                                              blockId={block.id}
                                                                              pageId={block.pageId}
                                                                              mirroring={block.mirroring}
                                                                              blockPosition={position}
                                                                              contentId={block.content}
                                                                              pageX={block.pageX}
                                                                              pageY={block.pageY}
                                                                              pageW={block.pageW}
                                                                              pageH={block.pageH}
                                                                              ratio={ratio}
                                                                              topDelta={topDelta}
                                                                              leftDelta={leftDelta}
                                                                              currentControlElementId={currentControlElementId}
                                                                              setControlIdOnElement={setControlIdOnElement}
                                                                              preview={preview}
                                                                              previewPage={previewPage}
                                                                              pdf={pdf}
                                                                              state = {state}
                                                                              formatDPI={formatDPI}
                                                                              dispatch = {dispatch}
                                                                              turnWidth={turnWidth}
                                                                              turnHeight={turnHeight}
                                                                              setUpdateBlockParams={setUpdateBlockParams}
                                                                /> : null}

                    {!pdf && !preview && currentControlElementId !== block.id ? <SvgRect {...rectParams}
                                                                                          data-current="controlActivateSVGLayout"
                                                                                          transform={transformRotate}
                                                                                          //onMouseMove={event=>{
                                                                                          //    event.defaultPrevented = false;
                                                                                          //    console.log(event)
                                                                                          //}}
                                                                                          onClick={event => setControlElement( event )}/> : null}
                </g>



                {/* строим в портале управляющий элемент */}
                {currentControlElementId === block.id && control && ReactDOM.createPortal(
                    <>
                        <ResizableRect
                            onMouseDown={event => setControlElement( event )}
                            {...control}
                            zoomable = {proportion ? 'nw, ne, se, sw' : 'nw, ne, se, sw, n, w, s, e'}
                            aspectRatio={proportion}
                            // minWidth={10}
                            // minHeight={10}
                            rotatable={true}
                            // onRotateStart={this.handleRotateStart}
                            onRotate={handleRotate}
                            onRotateEnd={handlerStop}
                            // onResizeStart={this.handleResizeStart}
                            onResize={handleResize}
                            onResizeEnd={handlerStop}
                            onDragStart={handlerStart}
                            onDrag={handleDrag}
                            onDragEnd={handlerStop}
                            isActive={currentControlElementId === block.id} //пока не используется
                        />
                    </>,
                    document.querySelector( '#layoutControlBlock' )
                )}
           </Fragment>;

};

export default PageBlocksDraw;