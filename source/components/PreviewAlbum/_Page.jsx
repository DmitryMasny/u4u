import React from "react";

import { Background, Text, Rectangle, Image } from './_PageElements';

/**
 * Компонент
 * построение страницы альбома
 */
const page = ( {pxWidth, pxHeight, page, isFrontCover, isBackCover, isFrontLiner, isBackLiner, coverParams, isFixedCovers, isThumb} ) => {

    if (!coverParams) return null;

   //является ли страница частью обложки
    const isPartOfCover = isFrontCover || isBackCover || isFrontLiner || isBackLiner;

    let pageInner = null;

    //разбираем страницу по блокам
    if ( page ) {
        pageInner = page.map(( block, i ) => {
            switch ( block.type ) {
                case 'BACKGROUND':
                    // if (isBackLiner && block.width < 99) return null;
                    return <Background block={block} key={i} isThumb={isThumb}/>;
                case 'TEXT':
                    return <Text block={block} key={i}/>;
                case 'RECTANGLE':
                    return <Rectangle block={block} key={i}/>;
                case 'PHOTO':
                    return block.content.image ? <Image block={block} key={i} isThumb={isThumb}/> : null;
            }
        })
    }

    //формируем классы по параметрам обложки
    let cl = '';
    if ( isPartOfCover ) {
        //если твердая обложка
        if ( coverParams.hardCover ) {
            cl = 'hard';
            //если на PUR клее + лайнер, закрепляем на экране
            if ( coverParams.pur && isBackLiner ) cl += ' fixed';
        }
        if ( isFrontCover ) cl += ' front-side';
        if ( isBackCover ) cl += ' back-side';
        if ( isFrontLiner ) cl += ' front-liner';
        if ( isBackLiner ) cl += ' back-liner';
    }

    //задаем CCS классом тип крепления
    if ( coverParams.pur ) cl += ' pur';
    if ( coverParams.spring ) cl += ' spring';

    //если задан отсуп обложки от блока, вычисляем новые размеры для блока
    const width = pxWidth / 2;
    let blockWidthMultiplier = 1,
        blockHeightMultiplier = 1;

    //если обложка больше, чем блок
    if ( coverParams.moreCoverSize ) {
        cl += ' own-size';

        //если не часть обложки, вычситываем размер листа блока
        if ( !isPartOfCover ) {
            blockWidthMultiplier = blockHeightMultiplier = (1 - coverParams.moreCoverSize / 100);
        } else {
            //для блока обложки нужно скорректировать длинну, ибо мы не учитываем толщину корешка
            blockWidthMultiplier = (1 - (coverParams.moreCoverSize / 2) / 100);
            blockHeightMultiplier = 1;
        }
    }

    // Расчет размера обреза в px исходя из формата
    const crop = blockWidthMultiplier * pxHeight/600 * ((coverParams.fmt === 2 || coverParams.fmt === 3) ? 14.28 : 9.67);

    const style = {
        width: width * blockWidthMultiplier,
        height: pxHeight * blockHeightMultiplier
    };
    const innerStyle = {
        width: width * blockWidthMultiplier + crop*2,
        height: pxHeight * blockHeightMultiplier + crop*2,
        left: crop * -1,
        top: crop * -1,
        position: 'absolute'
    };

    const pageClass = 'block-preview-album__page ' + cl,
        //получаем отступ для твердой обложки. Если отсуп 0 или обложка не твердая, то возвращаем null
        depth = (isPartOfCover && coverParams.hardCover ? coverParams.moreCoverSize || null : null);

    return (<div className={pageClass} depth={depth} style={style}>
                <div className="block-preview-album__page-inner" style={innerStyle}>
                    {pageInner}
                </div>
            </div>);
    /*
     return (<div className={pageClass} depth={depth}>
     {pageInner} <img className="null-image" src={nullImgUrl} />
     </div>);
     */
};

export default page;