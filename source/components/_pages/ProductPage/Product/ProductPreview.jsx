import React, { useState, memo, useMemo} from 'react';

import styled, {css} from 'styled-components';
import {COLORS} from 'const/styles';

import ProductPreview from "__TS/components/_misc/ProductPreview";
import Pencil from "components/Pencil";
import {IMG_DIR} from "config/dirs";
import {hexToRgbA} from "libs/helpers";


const PosterPreviewStyled = styled.div`
   max-width: calc((80vh - 200px) * 1.6);
   min-width: 300px;
   margin: 0 auto;
   ${({svg, inProductConfig})=> svg && !inProductConfig && css`
        height: 100%; 
        min-height: 220px;
    `};
   ${({inModal})=> inModal && css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: calc((100vh - 200px) * 1.6);
        min-height: 100px;
        height: 100%;
    `};
`;
const View = styled.div`
    margin: 0 auto 5px;
    padding-bottom: calc( 320/486 * 100%);
    width: 100%;
    text-align: center;
    border-radius: 2px;
    background-color: ${({inModal})=> inModal ? 'transparent' : COLORS.ATHENSGRAY};
    background-size: cover;
    background-position: center;
    overflow: hidden;
    ${({src})=>src && `background-image: url(${src})`};
    perspective: ${({perspective})=>perspective ?`${perspective}px` : `120vw`};
    ${({perspectiveOrigin})=>perspectiveOrigin && `perspective-origin: ${perspectiveOrigin[0]}% ${perspectiveOrigin[1]}%`};

   ${({inModal, aspect})=> inModal && css`
        margin: 0;
        // padding-bottom: ${aspect >= 1 ? '100%' : 0};
        // padding-right: ${aspect < 1 ? '100%' : 0};
        // width: ${aspect < 1 ? 0 : '100%'};
        // height: ${aspect < 1 ? '100%' : 0};
        overflow: visible;
    `};
    .viewInner{
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 20px;
        right: 20px;
        margin: auto;
        //max-height: calc(100vh - 200px);
    }
`;
const AllViewsPanel = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: ${({svg})=>svg ? 0 : '15px'};
    min-height: 50px;
`;

const StyledViewOption = styled.div`
    width: 68px;
    height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: inset 0 0 0 1px ${hexToRgbA(COLORS.TEXT, .2)};
    ${({preview})=>preview ? `background-image: url(${preview})` : `background-color: ${COLORS.ATHENSGRAY}`};
    border: 3px solid white;
    opacity: 1;
    transition: border-color .1s ease-out, opacity .2s ease-out;
    ${({active})=>active ? css`
        border-color: ${COLORS.WARNING};
        box-shadow: none;
    ` :
    css`
        cursor: pointer;
        &:hover{
            opacity: .9;
        }
    `
    }
`;

const VIEW_OPTIONS = [
    {id: 'pencil' },
    {
        id: 'white-n-chair',
        preview: `${IMG_DIR}posters/preview_1.jpg`,
        src: `${IMG_DIR}posters/view_1.jpg`,
        size: 2200,
        max: [1500, 1500],
        min: 1600,
        position: {
            x: 10, y: 0,
        }
    },
    {
        id: 'yellow',
        preview: `${IMG_DIR}posters/preview_4.jpg`,
        src: `${IMG_DIR}posters/view_4.jpg`,
        size: 3500,
        max: [2500, 1500],
        min: 1900,
        position: { x: 0, y: 0, }
    },
    {
        id: 'blue-livingroom',
        preview: `${IMG_DIR}posters/preview_5.jpg`,
        src: `${IMG_DIR}posters/view_5.jpg`,
        size: 3200,
        max: [2000, 1400],
        min: 1900,
        position: { x: 0, y: 0, }
    },
    {
        id: 'grey',
        preview: `${IMG_DIR}posters/preview_6.jpg`,
        src: `${IMG_DIR}posters/view_6.jpg`,
        size: 2100,
        max: [2200, 1100],
        min: 1900,
        position: { x: 10, y: 0}
    },
    {
        id: 'violet',
        preview: `${IMG_DIR}posters/preview_7.jpg`,
        src: `${IMG_DIR}posters/view_7.jpg`,
        size: 3000,
        max: [2200, 1100],
        min: 1900,
        position: {x: 5, y: 0}
    },
    // {
    //     id: 'beton-bed',
    //     preview: `${IMG_DIR}posters/preview_8.jpg`,
    //     src: `${IMG_DIR}posters/view_8.jpg`,
    //     size: 3500,
    //     max: [1200, 1100],
    //     min: 1000,
    //     position: {x: 7, y: -26, ry: -25, p: 200, po: [60, 48]}
    // },
];

const ViewOption = memo( ( props ) => {
    return <StyledViewOption onClick={() => props.selectAction( props.item )}{...props}/>
});

const ProductPreviewMain = memo( ({ src, size, options, svg, inProductConfig = false,  productSlug, inModal, noShadow } ) => {

    const [selectedView, setSelectedView] = useState( VIEW_OPTIONS[ 0 ] );

    let w = 0, h = 0, x = 0, y = 0, scale = 1;
    size.k = size.w / size.h;

    // Расчет размеров для SVG в процентах
    if ( size.k > 1) {   //горизонтальные пропорции
        w = 100;
        h = Math.round( size.h / size.w * 1000 ) / 10;
        y = Math.round( (100 - h) / .2 ) / 10;
        if (selectedView.size) scale =  Math.round(100 * size.w / selectedView.size)/100;
    } else {   //вертикальные пропорции или квадрат
        h = 100;
        w = Math.round( size.k * 1000 ) / 10;
        x = Math.round( (100 - w) / .2 ) / 10;
        if (selectedView.size) scale =  Math.round(100 * size.h / selectedView.size)/100;
    }

    // высота карандаша = (размер реал. карандаша(mm)) / (высота продукта в превью(mm)) * 100% высоты svg постера
    const pencilHeight =  Math.round(180 / size.h * h);

    const glance = options && options.lamination && options.lamination.optionSlug !== 'LAMINATION_NO';
    const canvas = options && options.paper && (options.paper.optionSlug === 'CANVAS_MAT' || options.paper.optionSlug === 'CANVAS_60');
    const views = VIEW_OPTIONS.filter((item) => {
        const hide =  item.max && (size.w > item.max[0] || size.h > item.max[1]) || item.min && (size.w + size.h < item.min);
        if (hide && item.id === selectedView.id) setSelectedView( VIEW_OPTIONS[ 0 ] );

        return !hide;
    });

    const puzzleSizeType = useMemo( () => {
        const optionPuzzle = options.puzzle_size;
        return optionPuzzle && optionPuzzle.optionSlug || null;

    }, [options && options.puzzle_size] );

    return <PosterPreviewStyled svg={!!svg} inProductConfig={inProductConfig} inModal={inModal}>
                <View src={selectedView.src}
                      inModal={inModal}
                      svg={!!svg}
                      aspect={size ? size.w/size.h : 1}
                      perspectiveOrigin={selectedView.position && selectedView.position.po}
                      perspective={selectedView.position && selectedView.position.p}>
                    <div className="viewInner">
                        <ProductPreview size={{w, h, x, y}}
                                        scale={scale}
                                        svg={svg} src={src}
                                        position={selectedView.position}
                                        glance={glance}
                                        canvas={canvas}
                                        inModal={inModal}
                                        format={size}
                                        puzzleSizeType={puzzleSizeType}
                                        productSlug={productSlug}
                                        noShadow={noShadow}
                                        svgImageQuality={500} // TODO: TEMP hardcore
                        />
                        {!inModal && selectedView.id === 'pencil' && <Pencil height={pencilHeight} />}
                    </div>
                </View>
                {!inModal && <AllViewsPanel svg={!!svg}>
                    {views && views.length > 1 && views.map(
                        (item) => <ViewOption selectAction={setSelectedView}
                                              item={item}
                                              preview={item.preview}
                                              active={item.id === selectedView.id}
                                              key={item.id}/>)}
                </AllViewsPanel>}
        </PosterPreviewStyled>
});

export default ProductPreviewMain;



