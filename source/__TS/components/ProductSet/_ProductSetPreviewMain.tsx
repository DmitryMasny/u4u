// @ts-ignore
import React, { useState } from 'react';

// @ts-ignore
import styled, {css} from 'styled-components';
// @ts-ignore
import {COLORS} from 'const/styles';

// @ts-ignore
import {IconView} from "components/Icons";
// @ts-ignore
import Pencil from "components/Pencil";
// @ts-ignore
import ProductPreview from "__TS/components/_misc/ProductPreview";
// @ts-ignore
import {IMG_DIR} from "config/dirs";

import {VIEW_OPTIONS} from "./_config";
import ViewOption from "./_ViewOption";

// @ts-ignore
import {hexToRgbA} from 'libs/helpers';



/** Interfaces */
interface Props {
    svg: string;            // svg превью продукта
    size?: {
        w: number;
        h: number;
    };           // размер для просчета соотношения превьюшки
    options?: any;       // опции продукта
    showPreviewAction?: ()=> any;       // Показать превью в модалке
    isMobile?: boolean;       // isMobile
}
interface IView {
    src: boolean;
    perspective: boolean;
    perspectiveOrigin: boolean;
    cursorPointer: boolean;
    isMobile: boolean;
}


const PosterPreviewStyled = styled('div')`
   max-width: calc((80vh - 200px) * 1.6);
   margin: 0 auto;
   #spa-top & {
        height: 100%; 
        min-height: 220px;
   }
   .showPreviewText {
      width: 100%;
      padding: 10px;
      color: ${COLORS.TEXT_PRIMARY};
      text-align: center;
      cursor: pointer;
      &:hover{
          color: ${COLORS.PRIMARY};
      }
   }
`;
const View = styled('div')`
    margin: 0 auto 5px;
    padding-bottom: calc( 320/486 * 100%);
    width: 100%;
    text-align: center;
    border-radius: 2px;
    background-color: ${COLORS.ATHENSGRAY};
    background-size: cover;
    background-position: center;
    overflow: hidden;
    ${({src}: IView)=>src && `background-image: url(${src})`};
    perspective: ${({perspective}: IView)=>perspective ?`${perspective}px` : `500px`};
    ${({perspectiveOrigin}: IView)=>perspectiveOrigin && `perspective-origin: ${perspectiveOrigin[0]}% ${perspectiveOrigin[1]}%`};
    ${({cursorPointer}: IView)=>cursorPointer && css`
        cursor: pointer;
        .hoverBlock{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${hexToRgbA(COLORS.TEXT, .25)};
            opacity: 0;
            transition: opacity .2s ease-out;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            fill: #fff;
            z-index: 7;
            &:hover {
              opacity: 1;
            }
            .hoverBlockText {
              padding: 10px;
              text-align: center;
              font-weight: bold;
              text-shadow: 1px 1px 3px ${hexToRgbA(COLORS.TEXT, .33)};
            }
        }
    `};

    .viewInner{
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 30px;
        right: 30px;
        &.pointer {
          cursor: pointer;
        }
        ${({ theme}) => theme.media.sm`
            top: 10px;
            bottom: 10px;
            left: 20px;
            right: 20px;
        `}
    }
`;
const AllViewsPanel = styled('div')`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: ${({svg})=>svg ? 0 : '15px'};
    min-height: 50px;
`;
const PencilStyled = styled(Pencil)`
    position: absolute;
    right: -2%;
    bottom: 0;
    z-index: 5;
    ${({ theme}) => theme.media.sm`
        right: -15px;
    `}
`;


const ProductSetPreviewMain: React.FC<Props> =  ( { size, options, svg, showPreviewAction, isMobile } ) => {

    const [selectedView, setSelectedView] = useState( VIEW_OPTIONS[ 0 ] );

    // if (size.rotated) [size.w, size.h] = [size.h, size.w];
    let w: number = 0, h: number = 0, x: number = 0, y: number = 0, scale: number = 1;
    const k: number = size.w / size.h;

    // Расчет размеров для SVG в процентах
    if ( k > 1) {   //горизонтальные пропорции
        w = 100;
        h = Math.round( size.h / size.w * 1000 ) / 10;
        y = Math.round( (100 - h) / .2 ) / 10;
        if (selectedView.size) scale =  Math.round(100 * size.w / selectedView.size)/100;
    } else {   //вертикальные пропорции или квадрат
        h = 100;
        w = Math.round( k * 1000 ) / 10;
        x = Math.round( (100 - w) / .2 ) / 10;
        if (selectedView.size) scale =  Math.round(100 * size.h / selectedView.size)/100;
    }

    // высота карандаша = (размер реал. карандаша(mm)) / (высота продукта в превью(mm)) * 100% высоты svg постера
    const pencilHeight: number =  Math.round(180 / size.h * h);

    const glance: boolean = options && options.lamination && options.lamination.optionSlug !== 'LAMINATION_NO';
    const canvas: boolean = options && options.paper && options.paper.optionSlug === 'CANVAS_MAT';

    const views = VIEW_OPTIONS.filter((item) => {
        const hide =  item.max && (size.w > item.max[0] || size.h > item.max[1]) || item.min && (size.w + size.h < item.min);
        if (hide && item.id === selectedView.id) setSelectedView( VIEW_OPTIONS[ 0 ] );

        return !hide;
    });


    return <PosterPreviewStyled svg={!!svg}>
        <View src={selectedView.src} svg={!!svg}
              perspectiveOrigin={selectedView.position && selectedView.position.po}
              perspective={selectedView.position && selectedView.position.p}
              cursorPointer={!!showPreviewAction}
              onClick={showPreviewAction}>
            <div className="viewInner">
                <ProductPreview size={{w, h, x, y}}
                                scale={scale}
                                svg={svg}
                                position={selectedView.position}
                                glance={glance}
                                canvas={canvas}
                />
                {selectedView.id === 'pencil' && <PencilStyled height={pencilHeight}/>}
            </div>
            <div className="hoverBlock">
                <IconView size={48}/>
                <div className="hoverBlockText">Просмотр</div>
            </div>
        </View>
        {!isMobile && <AllViewsPanel svg={!!svg}>
            {views && views.length > 1 && views.map((item) =>
                <ViewOption selectAction={setSelectedView}
                            item={item}
                            hide={item.max && (size.w > item.max[0] || size.h > item.max[1]) || item.min && (size.w + size.h < item.min)}
                            active={item.id === selectedView.id}
                            key={item.id}/>)}
        </AllViewsPanel>}
    </PosterPreviewStyled>
};

export default ProductSetPreviewMain;



