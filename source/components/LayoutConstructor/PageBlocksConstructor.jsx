import React, { Fragment, useState, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import PageBlockDraw from "./PageBlockDraw";
import PuzzleFrontLayers from "./PuzzleFrontLayers";
import { selectCurrentControlElementId } from "./selectors";
import { actionSetCurrentControlElementId, actionUpdateBlockParams } from "./actions";
import  { updateBlockWithContentAction }  from "__TS/actions/layout";
import { getOutsizeRectSizeAfterTurn } from 'libs/geometry';

import { isPuzzle } from 'libs/helpers';

import { productSlugSelector, productFormatSlugSelector, productPuzzleOptionTypeSelector } from "__TS/selectors/layout";

const LineMagnetizedLine = styled.line`
    stroke: rgba(255,0,0,0.5);
    stroke-width: 1;
    stroke-dasharray: 0.5%;
`;

const MAGNETIZED_DELTA = 5;

const PageBlocksConstructor = ( { formatDPI, isMagnetic, blocks, svgToPixelData, turnWidth, turnHeight, state = null, dispatch = null, preview = false, previewPage = false, pdf = false, cuts } ) => {
    //если не массив, не рендерим
    if ( !Array.isArray( blocks ) ) return null;

    //состояния для линий примагничивания и карты линий
    const [verticalMagnetizedLine, setVerticalMagnetizedLine] = useState( null );
    const [horizontalMagnetizedLine, setHorizontalMagnetizedLine] = useState( null );
    const [mapOfMagnetized, setMapOfMagnetized] = useState( null );

    const productSlug = state ? productSlugSelector( state ) : useSelector( productSlugSelector );
    const productFormatSlug = state ? productFormatSlugSelector( state ) : useSelector( productFormatSlugSelector );

    const puzzleSizeType = isPuzzle(productSlug) ?
        (state ? productPuzzleOptionTypeSelector( state ) : useSelector( productPuzzleOptionTypeSelector ))
        : false;

    //функция составления карты магнитных линий
    const calculateMagnetizedMap = () => {
        let m = {
            w: [],
            h: []
        };
        //включено ли примагничиивание
        if ( !isMagnetic ) {
            setMapOfMagnetized( m );
            return;
        }

        const pos = ( n, id ) => ({
            min: n - MAGNETIZED_DELTA,
            max: n + MAGNETIZED_DELTA,
            use: n,
            id: id
        });

        let pageXBorders = [],
            pageYBorders = [];

        //функция для работы с границами страниц
        const setPageBorders = ( block ) => {
            const pageX = block.pageX - cuts.left;
            if ( !~pageXBorders.indexOf( pageX ) ) {
                pageXBorders.push( pageX );
                m.w.push( pos( pageX, 0 ) );
            }

            const pageXRight = block.pageX + block.pageW + cuts.right;
            if ( !~pageXBorders.indexOf( pageXRight ) ) {
                pageXBorders.push( pageXRight );
                m.w.push( pos( pageXRight, 0 ) );
            }

            const pageY = block.pageY - cuts.top;
            if ( !~pageYBorders.indexOf( pageY ) ) {
                pageYBorders.push( pageY );
                m.h.push( pos( pageY, 0 ) );
            }

            const pageYBottom = block.pageY + block.pageH + cuts.top;
            if ( !~pageYBorders.indexOf( pageYBottom ) ) {
                pageYBorders.push(  pageYBottom );
                m.h.push( pos( pageYBottom, 0 ) );
            }
        };

        //функция для работы с границами страниц
        const setPageCenter = ( block ) => {
            const pageXCenter = (block.pageX + block.pageW / 2);
            m.w.push( pos( pageXCenter, 0 ) );

            const pageYCenter = (block.pageY + block.pageH / 2);
            m.h.push( pos( pageYCenter, 0 ) );
        };

        blocksConcatenated.map(( block ) =>{
            let x1 = block.x + block.pageX;
            let x2 = x1 + block.w;
            let y1 = block.y + block.pageY;
            let y2 = y1 + block.h;

            if ( block.r ) {
                const o = getOutsizeRectSizeAfterTurn( { x1, x2, y1, y2, deg: block.r } );
                x1 = o.x1;
                x2 = o.x2;
                y1 = o.y1;
                y2 = o.y2;
            }

            m.w.push( pos( x1, block.id ) );
            m.w.push( pos( x2, block.id ) );
            m.h.push( pos( y1, block.id ) );
            m.h.push( pos( y2, block.id ) );
            setPageBorders( block );
            setPageCenter( block );
        });


        m.w.sort( ( a, b ) => a.use - b.use );
        m.h.sort( ( a, b ) => a.use - b.use );

        setMapOfMagnetized( m );
    };

    //получаем из Redux id элемента, для которого рисуется управляющий элемент
    const currentControlElementId = state ? selectCurrentControlElementId( state ) : useSelector( state => selectCurrentControlElementId( state ) );

    //устанавливаем в Redux id элемента, для которого рисуется управляющий элемент
    dispatch = dispatch || useDispatch();
    const setControlIdOnElement = ( { blockId, blockType, widthPx = 0} ) => dispatch( actionSetCurrentControlElementId( {
                                                                                                                blockId,
                                                                                                                blockType,
                                                                                                                widthPx
                                                                                                            } ) );



    //обновляем данные блока в redux и на сервере
    const setUpdateBlockParams = ( params ) => {

        updateBlockWithContentAction( params );

        //dispatch( actionUpdateBlockParams( data ) );
    }

    //соединяем block в плоскую структуру массива
    const blocksConcatenated = [].concat.apply( [], blocks );

    //console.log('blocksConcatenated', JSON.parse(JSON.stringify(blocksConcatenated)));

    //сортируем по z-index
    /*
    blocksConcatenated.sort((a, b) => {
        if ( !a.zIndex ) a.zIndex = 0;
        if ( !b.zIndex ) b.zIndex = 0;
        return a.zIndex - b.zIndex;
    });*/

    const layoutFrontLayer = useMemo( () => {
        if ( pdf ) return null;

        if ( isPuzzle( productSlug ) && puzzleSizeType ) {
            return <PuzzleFrontLayers formatSlug={productFormatSlug} puzzleSizeType={puzzleSizeType} />;
        }
    }, [productSlug, puzzleSizeType] )

    return <Fragment>
               {blocksConcatenated.map(( block, index) => <PageBlockDraw key={block.id}
                                                                         turnWidth={turnWidth}
                                                                         turnHeight={turnHeight}
                                                                         setUpdateBlockParams={setUpdateBlockParams}
                                                                         mapOfMagnetized={mapOfMagnetized}
                                                                         calculateMagnetizedMap={calculateMagnetizedMap}
                                                                         verticalMagnetizedLine={verticalMagnetizedLine}
                                                                         horizontalMagnetizedLine={horizontalMagnetizedLine}
                                                                         setVerticalMagnetizedLine={setVerticalMagnetizedLine}
                                                                         setHorizontalMagnetizedLine={setHorizontalMagnetizedLine}
                                                                         block={block}
                                                                         setControlIdOnElement={setControlIdOnElement}
                                                                         svgToPixelData={svgToPixelData}
                                                                         currentControlElementId={currentControlElementId}
                                                                         preview={preview}
                                                                         previewPage={previewPage}
                                                                         pdf={pdf}
                                                                         state={state}
                                                                         cuts={cuts}
                                                                         formatDPI={formatDPI}
                                                                         dispatch = {dispatch} />)}


               {layoutFrontLayer}
               {verticalMagnetizedLine !== null &&
                  <LineMagnetizedLine x1={verticalMagnetizedLine}
                                      x2={verticalMagnetizedLine}
                                      y1={0}
                                      y2={turnHeight}
                  />
               }
               {horizontalMagnetizedLine !== null &&
                    <LineMagnetizedLine x1={0}
                                        x2={turnWidth}
                                        y1={horizontalMagnetizedLine}
                                        y2={horizontalMagnetizedLine}
                    />
               }
           </Fragment>
};

export default PageBlocksConstructor;