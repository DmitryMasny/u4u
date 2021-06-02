import React, { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
//import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import {IMG_DIR} from "config/dirs";

import {
    selectCurrentPages,
    selectBlocks,
    selectCurrentFormatId,
    selectCurrentFormatDPI,
    selectCurrentFormat,
    selectIsLibraryResizing,
    selectCalculateAreaSize,
    selectCurrentControlElementId,
    selectCurrentControlElementType,
    selectIsCompletedSelector,
    selectIsHaveContentSelector,
    isMagneticSelector,
    selectCurrentArea
} from './selectors';
import styled from 'styled-components';

import PageConstructor, { PageConstructorPreview } from './PageConstructor';
import PageBlocksConstructor from './PageBlocksConstructor';
import PageShadowDefs from './PageShadowDefs';
import { actionSetCurrentControlElementId } from "./actions";
//import { Btn } from "components/_forms";
//import { IconZoomIn, IconZoomOut, IconView, IconImageCover } from "components/Icons";
import { COLORS } from 'const/styles'
//import { hexToRgbA } from "libs/helpers";
import PageRuler from "./_PageRuler";
import PaddingInfo from "./_PaddingInfo";
import CutLines from "./_CutLines";
import { barCodeAsString } from "config/svg";
//import { notAcceptedPhotosSelector } from "__TS/components/Editor/_selectors";

import { setRatioAction } from "__TS/components/Editor/_actions";
import { calculateSpring } from "__TS/libs/tools";
import { productLayoutSlug } from "../../__TS/selectors/layout";
import { SLUGS } from "../../const/productsTypes";

import { isPuzzle, isCalendar } from 'libs/helpers';

import Barcode, { getBarcodeSizes, getBarcodeOffset } from "./_Barcode";

/** styles */

const SvgLayout = styled.svg`
    fill: white;
`;
const DivControlLayout = styled.div`
    top: 0;
    left: 0;
    position: absolute;
    z-index: 200;
`;
const DivInfoLayout = styled.div`
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
`;

const SvgWrap = styled.div`
    height: 100%;
    width: 100%;
    //width: 100vw;
    //height: calc(100vh - 70px);
    padding: 0;
    .page-ruler, .padding-info {
      opacity: 0;
      pointer-events: none;
    }
    .padding-info-text {
      opacity: 0;
      transition: opacity .33s ease-out;
    }
    .show {
      opacity: 1;
      transition: opacity .33s ease-out;
    }
`;
/*
const ViewControlPanel = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: flex-end;
    z-index: 7;
    .viewControlBtn{
        margin-left: 10px;
        background-color: #fff;
        height: 32px;
        width: 32px;
        padding: 0;
        border-radius: 16px;
        box-shadow: 1px 2px 4px ${hexToRgbA( COLORS.BLACK, .2 )};
        opacity: .7;
        transition: opacity .1s ease-out;
        &:hover {
            opacity: 1;
        }
        .noMob {
            ${({theme}) => theme.media.xs`
                display: none;
            `}
        }
    }
`;

const TransformWrapperStyled = styled(TransformWrapper)`
    overflow: auto;
`;*/


/**
 * Строим зоны (развороты) areas
 * @param layout
 */
const AreaConstructor = ( { windowSize, preview = false, previewPage = false, pdf = false, state = null, dispatch = null, debugMode = false, areaNum = null, areaId = null, empty, disableBarcode = false, renderBarcodeOnPage = false, isPuzzlePreview = false } ) => {

    //debugMode = true;

    const defaultScaleRation = 1;
    //получаем текущий выбранный разворот
    //const currentTurn = useSelector( state => selectCurrentTurn( state ) );


    const [spring, setSpring] = useState( null );

    const [scaleAndPositionData, setScaleAndPositionData] = useState( {
                                                                          scale: defaultScaleRation,
                                                                          positionX: 0,
                                                                          positionY: 0
                                                                      } );
    //данные для расчета конвертации из PX в SVG юниты и обратно
    const [svgToPixelDataSource, setSvgToPixelDataSource] = useState( {
                                                                          ratio: 0,
                                                                          topDelta: 0,
                                                                          leftDelta: 0
                                                                      } );
    const [svgToPixelData, setSvgToPixelData] = useState( {
                                                              ratio: 0,
                                                              topDelta: 0,
                                                              leftDelta: 0
                                                          } );

    const { w: turnWidth, h: turnHeight } = state ? selectCalculateAreaSize( state ) : useSelector( state => selectCalculateAreaSize( state ) ); //получаем размеры разворота
    const area = state ? selectCurrentArea( state ): useSelector( selectCurrentArea ); //получаем текущую area
    const currentPages = state ? selectCurrentPages( state, areaNum, areaId ) : useSelector( state => selectCurrentPages( state, areaNum,areaId ) ); //получаем текущие страницы области
    const formatId = state ? selectCurrentFormatId( state ) : useSelector( state => selectCurrentFormatId( state ) );  //получаем id формата
    const format = state ? selectCurrentFormat( state ) : useSelector( state => selectCurrentFormat( state ) );  //получаем формат
    const formatDPI = state ? selectCurrentFormatDPI( state ) : useSelector( state => selectCurrentFormatDPI( state ) );  //получаем id формата
    const blocks = state ? selectBlocks( state ) : useSelector( state => selectBlocks( state ) ); //получаем все блоки из редакса
    const isLibraryResizing = state ? false : useSelector( state => selectIsLibraryResizing( state ) ); //получаем все блоки из редакса
    const currentControlElementId = state ? selectCurrentControlElementId( state ) : useSelector( state => selectCurrentControlElementId( state ) );
    const currentControlElementType = state ? selectCurrentControlElementType( state ) : useSelector( state => selectCurrentControlElementType( state ) );
    const selectIsCompleted = state ? selectIsCompletedSelector( state ) : useSelector( state => selectIsCompletedSelector( state ) );
    const selectIsHaveContent = state ? selectIsHaveContentSelector( state ) : useSelector( state => selectIsHaveContentSelector( state ) );
    const layoutSlug = state ? productLayoutSlug( state ) : useSelector( state => productLayoutSlug( state ) );

    const isMagnetic = state ? false : useSelector( state => isMagneticSelector( state ) );

    const isMobile = state ? false : useSelector( state => state.global.windowIsMobile );

    //является ли layout пазлом
    const isLayoutPuzzle = useMemo( () => isPuzzle( layoutSlug ), [layoutSlug] );
    const isLayoutCalendar = useMemo( () => isCalendar( layoutSlug ), [layoutSlug] );

    //const productSlug = state ? productSlugSelector( state ) : useSelector( state => productSlugSelector( state ) );

    let blocksMerged = []; //массив блоков в зоне
    //let pagesShadows = []; //массив теней

    const c = format.cuts;
    const padding = format.padding && format.padding.left; // TODO: пока одно значение для всех сторон

    //скрываем управляющий блок
    const hideTransformBox = () => {
        //if ( currentControlElementType !== 'background' ) {
            dispatch( actionSetCurrentControlElementId( 0 ) );
        //}
    };

    const calculatePositionOnSvgByPixelPosition = useCallback( ( { x, y } ) => {

        if ( !pdf && !preview ) {
            const libraryBlock = document.querySelector( '#libraryBlock' );
            const editorHeaderBlock = document.querySelector( '#editorHeader' );
            const editorPagesBlock = document.querySelector( '#editorPages' );
            const editorSubMenuBlock = document.querySelector( '#editorHeader' );

            const libWidth = !isMobile && libraryBlock ? libraryBlock.clientWidth || 0 : 0;
            const libHeight = isMobile && libraryBlock ? libraryBlock.clientHeight || 0 : 0;

            const editorHeader = (editorHeaderBlock ? editorHeaderBlock.clientHeight || 0 : 0)
                + isMobile ? (
                    editorPagesBlock ? editorPagesBlock.clientHeight || 0 : 0
                ) : (
                    editorSubMenuBlock ? editorSubMenuBlock.clientHeight || 0 : 0
                );

            return {
                x: (x - svgToPixelData.leftDelta - libWidth) / svgToPixelData.ratio,
                y: (y - svgToPixelData.topDelta - editorHeader) / svgToPixelData.ratio
            };

            // console.log('===<>===',{
            //     x: x,
            //     lib: {
            //         libHeight: libHeight,
            //         libWidth: libWidth
            //     },
            //     ratio: svgToPixelData.ratio,
            //     y: y,
            //     delta: {
            //         lD: svgToPixelData.leftDelta,
            //         tD: svgToPixelData.topDelta,
            //     },
            //     editorHeader: editorHeader,
            //     temp: temp
            // });
        }
        return {
            x: x,
            y: y
        }
    }, [svgToPixelData] );

    const pagesBackgrounds = currentPages.map( ( page, i ) => {
        //добавляем блоки в массив, предварительно добавив к ним координаты блока родителя (нужно для послещующей математики) и
        //id страницы родителя

        blocksMerged.push( page.blocksList.map( blockId => {
            const b = blocks[ blockId ];
            b.pageX = page.x;
            b.pageY = page.y;
            b.pageW = page.w;
            b.pageH = page.h;
            //b.pageId = page.pageId;
            b.pageId = page.id;
            return b;
        } ) );

        //добавляем тень на страницу
        // if ( !preview && !pdf ) pagesShadows.push( <PageConstructor page={page} key={i * 1000} shadow={true} cuts={c}/> );
        //TODO: Отключено до востребования. После включения проверить в Safari

        if ( preview || pdf ) {
            return <PageConstructorPreview page={page} key={i} cuts={c} pdf={pdf} padding={padding} preview={preview}/>;
        } else {
            return <PageConstructor areaId={area.id} calculatePositionOnSvgByPixelPosition={calculatePositionOnSvgByPixelPosition} page={page} key={i} cuts={c} pdf={pdf} padding={padding} preview={preview} selectIsCompleted={selectIsCompleted} selectIsHaveContent={selectIsHaveContent} hideTransformBox={()=>hideTransformBox()}/>;
        }
    });


    const layoutBlockSize = useRef(null);
    const svgBlockSize = useRef(null);
    // const viewer = useRef(null);

    if ( !preview && !pdf) {
        //эффект на изменение размеров окна
        useEffect( () => {
            const resizeSVGtimeout = setTimeout( () => {
                if ( layoutBlockSize && layoutBlockSize.current ) {
                    const { width: widthPx, height: heightPx } = layoutBlockSize.current.getBoundingClientRect(),
                          { width: svgWidthPx, height: svgHeightPx } = svgBlockSize.current.getBoundingClientRect();

                    const ratio = (widthPx / turnWidth),
                        topDelta = (svgHeightPx / 2 - heightPx / 2),
                        leftDelta = (svgWidthPx / 2 - widthPx / 2);

                    setSvgToPixelDataSource( { ratio: ratio / scaleAndPositionData.scale,
                        topDelta: topDelta / scaleAndPositionData.scale,
                        leftDelta: leftDelta / scaleAndPositionData.scale, } );
                    setSvgToPixelData( {
                        ratio: ratio / scaleAndPositionData.scale,
                        topDelta:  topDelta * scaleAndPositionData.scale + scaleAndPositionData.positionY,
                        leftDelta: leftDelta * scaleAndPositionData.scale + scaleAndPositionData.positionX
                    } );

                    setRatioAction( ratio / scaleAndPositionData.scale );
                }
            });

            hideTransformBox();

            // viewer && viewer.fitToViewer && viewer.fitToViewer();

            return () => {
                if ( resizeSVGtimeout ) clearTimeout( resizeSVGtimeout );
            };

        }, [windowSize && windowSize.width, windowSize && windowSize.height, isLibraryResizing,
            format.id,
            format.height,
            format.width
        ] );


        useEffect( () => {
            const ratio = svgToPixelDataSource.ratio * scaleAndPositionData.scale / defaultScaleRation;

            setSvgToPixelData( {
                                   ratio: ratio,
                                   topDelta: svgToPixelDataSource.topDelta * scaleAndPositionData.scale / defaultScaleRation + scaleAndPositionData.positionY,
                                   leftDelta: svgToPixelDataSource.leftDelta * scaleAndPositionData.scale / defaultScaleRation + scaleAndPositionData.positionX
                               } );

            setRatioAction( ratio );
        }, [scaleAndPositionData, formatId, format, isLibraryResizing] );

        useEffect( () => {
            if ([
                SLUGS.CALENDAR_WALL_FLIP,
                SLUGS.CALENDAR_TABLE_FLIP
            ].some(x => x === layoutSlug)) {
                setSpring( calculateSpring({w: turnWidth}, turnWidth, layoutSlug === SLUGS.CALENDAR_WALL_FLIP ? 18 : 0) );
            }
        },[layoutSlug, format]);
    }


    dispatch = dispatch || useDispatch();

    // Обновить размеры после навигации вида по рабочей области
    const setControlIdOnElement = ( event ) => {
        if ( event === false || event.target.id === "book" || event.target.id === "bookRect" ) {
            hideTransformBox();
        }
    };

    /*
    const setPanScale = ( transformData ) => {
        setScaleAndPositionData({
                                    scale:  transformData.scale,
                                    positionX: transformData.positionX,
                                    positionY: transformData.positionY
                                });
        setControlIdOnElement( false );
    };*/
    const viewControlHandler = ( event, action ) => {
        hideTransformBox();
        setTimeout( () => {
            if ( action ) action( event );
        });
    };

    const largeSide = Math.max( turnWidth, turnHeight );
    const SVG_PADDING = Math.floor( largeSide / 20 + 15 ) + (padding ? padding * 1.5 : 0),
          SVG_SHADOW = Math.floor( SVG_PADDING / Math.sqrt( largeSide ) ) * 2;

    let viewBox = '';
    let cuts = null;
    let widthW = 0;
    let heightW = 0;
    let barcodeSizes = null;

    if ( pdf ) {

        const smallCuts = layoutSlug && [
            SLUGS.CALENDAR_WALL_SIMPLE,
            SLUGS.CALENDAR_WALL_FLIP,
            SLUGS.CALENDAR_TABLE_FLIP,
            SLUGS.PUZZLE
        ].some(x => x === layoutSlug)

        const cutSize = smallCuts ? 3 : 4;  // длина метки
        // Отступ линии обреза. Пока только для пазлов, в дальнейшем может задавать это параметром в админке
        const cutsPadding = (layoutSlug === SLUGS.PUZZLE && !isPuzzlePreview) ? 6 : padding || 0;

        const cutOffset = c.outside ? (smallCuts ? 1 : 2) : (padding ? -4 : -2);   // отступ меток от обрезного формата

        //считаем отсупы от обрезного формата, чтобы понять границы документа
        // ! условие придется переписать если padding окажется меньше чем отступы под метку!

        // Сейчас граница идет либо по значению padding либо -
        // по выпуску за обрез или концу метки когда она выходит дальше линии обреза.
        // ниже к этому может прибавится отступ под баркод
        const
            leftW = padding ? padding * -1 : Math.max( c.left, (cutSize + cutOffset + cutsPadding) ) * -1,
            topW = padding ? padding * -1 : Math.max( c.top, (cutSize + cutOffset + cutsPadding) ) * -1,
            rightW = padding ? padding : Math.max( c.right, (cutSize + cutOffset + cutsPadding) ),
            bottomW = padding ? padding : Math.max( c.bottom, (cutSize + cutOffset + cutsPadding) );

        //считаем высоту и ширину layout, без учета BarCode
        widthW  = turnWidth - leftW + rightW;
        heightW = turnHeight - topW + bottomW;

        //рисуем метки обреза
        cuts = <CutLines strokeWidth={padding ? 1 : .5} size={cutSize} offset={cutOffset} left={0 - cutsPadding} right={turnWidth + cutsPadding} top={0 - cutsPadding} bottom={turnHeight + cutsPadding}/>;

        //координаты штрих-кода
        barcodeSizes = getBarcodeSizes({
            pageWidth: turnWidth,
            pageHeight: turnHeight,
            disableBarcode: disableBarcode && !renderBarcodeOnPage,         // Не показывать баркод
            disableRotate: renderBarcodeOnPage,                             // Располагать всегда внизу страницы (НЕ ПОВОРАЧИВАТЬ)
            scale: renderBarcodeOnPage ? .5 : 0,                            // Изменить масштаб ( 0 - выкл.)
            longSideBarcode: format.barcodePosition === 'LONG_SIDE',        // Распологать баркод по длинной стороне
            barcodeOffset: getBarcodeOffset({renderBarcodeOnPage, padding, layoutSlug})     // Отступ наружу от формата (если минус, то отступ внутрь)
        });

        //пересчитаем размеры layout, с учетом BarCode
        if ( !disableBarcode && barcodeSizes ) {
            if ( barcodeSizes.rotateBarcode ) {
                const barcodeRight = barcodeSizes.barcodeLeft + barcodeSizes.barcodeHeight - leftW;
                if ( barcodeRight > widthW ) widthW = barcodeRight;
            } else {
                const barcodeBottom = barcodeSizes.barcodeTop + barcodeSizes.barcodeHeight - topW;
                if ( barcodeBottom > heightW ) heightW = barcodeBottom;
            }
        }

        //выставляем значения viewBox
        viewBox = `${leftW} ${topW} ${widthW} ${heightW}`;

    } else if ( preview ) {
        viewBox = `0 0 ${turnWidth} ${turnHeight}`
    } else {
        viewBox = `${SVG_PADDING * -1} ${SVG_PADDING * -1} ${turnWidth + SVG_PADDING*2} ${turnHeight + SVG_PADDING*2}`
    }

    const SVG_RENDER = <SvgLayout ref={svgBlockSize}
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                  xmlns="http://www.w3.org/2000/svg"
                                  id="book"
                                  width={pdf ? `${widthW}mm` : '100%'}
                                  height={pdf ? `${heightW}mm` : '100%'}
                                  viewBox={viewBox}
                                  onClick={event => setControlIdOnElement(event)}
        >

        {/* рисуем прозрачный блок для определения размеров в px и ratio*/}
        {!preview && !pdf && <rect width={turnWidth}
                                   height={turnHeight}
                                   fill={'transparent'}
                                   x={0}
                                   y={0}
                                   ref={layoutBlockSize}
                                   id="bookRect"
        />}

        {/* рисуем Defs теней*/}
        {!preview && !pdf && <PageShadowDefs />}
        {!preview && !pdf &&
        <filter id="pageShadow"
                x={SVG_PADDING * -1} y={SVG_PADDING * -1}
                width={turnWidth + SVG_PADDING * 2} height={turnHeight + SVG_PADDING * 2}>

            {/*<feDropShadow dx={Math.round(SVG_SHADOW / .06)/100} dy={Math.round(SVG_SHADOW / .04)/100} stdDeviation={SVG_SHADOW}*/}
                          {/*floodColor={COLORS.BLACK} floodOpacity=".4"/>*/}

            <feGaussianBlur in="SourceAlpha" stdDeviation={SVG_SHADOW}/>
            <feOffset dx={Math.round(SVG_SHADOW / .06)/100} dy={Math.round(SVG_SHADOW / .04)/100} result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>

        </filter>}

        {!preview && !pdf && spring &&
        <pattern id="editorSpring" patternUnits="userSpaceOnUse" width={spring.w} height={spring.h} y={spring.y} x={spring.x}>
            <image xlinkHref={`${IMG_DIR}common/spring-ring.png`} x="0" y="0" width={spring.w} height={spring.h}/>
        </pattern>}

        {/* рисуем страницу (подложку) */}
        {pagesBackgrounds}

        {/* строим блоки */}
        {!empty &&<PageBlocksConstructor blocks={blocksMerged}
                               svgToPixelData={svgToPixelData}
                               turnWidth={turnWidth}
                               turnHeight={turnHeight}
                               state={state}
                               dispatch={dispatch}
                               preview={preview}
                               previewPage={previewPage}
                               pdf={pdf}
                               formatDPI={formatDPI}
                               isMagnetic={isMagnetic}
                               cuts={c}
        />}

        {/* рисуем тень на странице */}
        {/*{!preview && !pdf && pagesShadows}*/}

        {/* рисуем метки */}
        {pdf && cuts}

        {!preview && !pdf &&
        <PageRuler
            show={!currentControlElementId}
            size={{
                x: 0,
                y: 0,
                w: turnWidth,
                h: turnHeight,
                ratio: svgToPixelData.ratio,
                padding:  padding
            }}
            config={{
                offset: 2,
                fontSize: 12,
                height: 8
            }}
        />
        }
        {!preview && !pdf &&
            <PaddingInfo
                show={currentControlElementId}
                size={{
                    x: 0,
                    y: 0,
                    w: turnWidth,
                    h: turnHeight,
                    ratio: svgToPixelData.ratio,
                    padding:  padding
                }}
                config={{
                    text: 'Область для натяжки',
                    color: padding ? '#658ad8' : COLORS.DANGER,
                    fontSize: 12,
                    height: 8
                }}
            />
        }

        {!preview && !pdf && spring && spring.rigelPath && <path d={spring.rigelPath} fill="#dce5ef" /> }
        {!preview && !pdf && spring && (spring.rigelPath ?
            <>
                <rect fill={ `url(#editorSpring)` } x={ spring.x } y={ spring.y } width={ spring.halfWidth } height={ spring.h }/>
                <rect fill={ `url(#editorSpring)` } x={ spring.x2 } y={ spring.y } width={ spring.halfWidth } height={ spring.h }/>
            </>
                : <rect fill={ `url(#editorSpring)` } x={ spring.x } y={ spring.y } width={ spring.fullWidth } height={ spring.h }/>
        ) }


        {pdf && barcodeSizes && <Barcode {...barcodeSizes} debugMode={debugMode} />}

    </SvgLayout>;

    //Если рисуем превью или pdf, обвязка не нужна, просто возвращаем SVG
    if ( preview || pdf ) return SVG_RENDER;

    return (
        <>
            <SvgWrap>
                {SVG_RENDER}
            </SvgWrap>
            <DivControlLayout id={'layoutControlBlock'}/>
            <DivInfoLayout id={'layoutInfoBlock'}/>
        </>
    )


/*
    return <TransformWrapperStyled
        id={'transform-wrapper'}
        options={{ minScale: .3, maxScale: 1 , limitToWrapper: true}}
        onWheelStop={setPanScale}
        onWheelStart={hideTransformBox}
        onPanningStop={setPanScale}
        onPanningStart={hideTransformBox}
        // onZoomChange={onZoomChangeHandler}
        doubleClick={{ disabled: true }}
        scalePadding={{size: 0}}
        wheel={{ step: 150 }}
        zoomIn={{ step: 10 }}
        zoomOut={{ step: 10 }}
        onClick={event => setControlIdOnElement( event )}
    >
        {({zoomIn, zoomOut, resetTransform}) => (
            <React.Fragment>
                <ViewControlPanel>
                    {currentControlElementId && <Btn className="viewControlBtn noMob" intent="minimal" onClick={hideTransformBox}><IconImageCover/></Btn> || null}
                    <Btn className="viewControlBtn" intent="minimal" onClick={(e)=>viewControlHandler(e, zoomIn)}><IconZoomIn/></Btn>
                    <Btn className="viewControlBtn" intent="minimal" onClick={(e)=>viewControlHandler(e, zoomOut)}><IconZoomOut/></Btn>
                    <Btn className="viewControlBtn" intent="minimal" onClick={(e)=>viewControlHandler(e, resetTransform)}><IconView/></Btn>
                </ViewControlPanel>
                <TransformComponent>
                    <SvgWrap>
                        {SVG_RENDER}
                    </SvgWrap>
                </TransformComponent>
                <DivControlLayout id={'layoutControlBlock'}/>
                <DivInfoLayout id={'layoutInfoBlock'}/>
            </React.Fragment>)}
    </TransformWrapperStyled>;
 */
};

export default memo( AreaConstructor );



/*
<rect width={'30mm'}
      height={'30mm'}
      x={"5mm"}
      y={"7mm"}
      style={{fill: 'red', stroke: 'green', strokeWidth: 1}}
/>
 */


/*
 * Типизация входящих данных
 *
TurnsConstructor.propTypes = {
    turns: arrayOf( shape({
                              id: string.isRequired,
                              type: string.isRequired,
                              pages: object.isRequired
                          }))
};
*/