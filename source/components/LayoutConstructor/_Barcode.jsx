import React, { memo } from 'react';

import { barCodeAsString } from "config/svg";
import { SLUGS } from "const/productsTypes";


/**
 * Расчет размеров баркода
 */
export const getBarcodeSizes = ( { pageWidth, pageHeight, disableBarcode, disableRotate, longSideBarcode, barcodeOffset, scale } ) => {

    const barcodeWidth = 96,
        barcodeTextWidth = 30,
        barcodePadding = 4,
        barcodeFullWidth = barcodeWidth + barcodeTextWidth + barcodePadding*2,
        barcodeTopFix = 3,      // используется для сдвига, чтобы убрать в сгенерированном на сервере баркоде лишние 3мм поля сверху
        barcodeHeight = 5.2;

    const rotateBarcode = !disableBarcode && !disableRotate && (pageWidth < pageHeight) ? longSideBarcode : !longSideBarcode;

    let barcodeTop = 0, barcodeLeft = 0;

    if ( !disableBarcode ) {
        // определяем, поворачивать ли баркод, исходя из того, где длинная сторона формата, и по длинной ли стороне его распололагать

        // если сдвигаем внутрь, то отступ задается не от верхней стороны баркода, а от нижней (чтобы задатваь точный свиг не зная размер баркода)
        if ( barcodeOffset < 0 ) barcodeOffset -= barcodeHeight;

        //координаты штрих-кода
        barcodeTop = rotateBarcode ? Math.round( (pageHeight + barcodeFullWidth) / 2 - barcodeTextWidth ) : pageHeight + barcodeOffset;
        barcodeLeft = !rotateBarcode ? Math.round( (pageWidth - barcodeFullWidth) / 2 + barcodeTextWidth ) : pageWidth + barcodeOffset;
    }
    
    const barcodeTransform =
        // Позиция баркода по-умолчанию
        !disableBarcode ?
            `translate(${ barcodeLeft - (rotateBarcode ? barcodeTopFix : 0) }, ${ barcodeTop - (!rotateBarcode ? barcodeTopFix : 0) }) rotate(${ rotateBarcode > 0 ? -90 : 0 } 0 0) scale(${scale || 1})`
            :
            // Скрываем баркод
            `translate(-1000, -1000) rotate(0 0 0)`;

    return {
        barcodeWidth, barcodeTextWidth, barcodeFullWidth, barcodeHeight, barcodeTransform, barcodeTop, barcodeLeft, rotateBarcode, barcodePadding
    }

}
/**
 * Расчет отступа баркода от линии обреза ( отрицательное значение - баркод помещается внутрь и отступ считается до бижайшей стороны баркода)
 */
export const getBarcodeOffset = ( { renderBarcodeOnPage, padding, layoutSlug } ) => {
    if (padding) return Math.abs(padding - 10);  // Если есть padding
    if (renderBarcodeOnPage) return -5;             // Когда делаем баркод видимым на странице, он отступает на 5мм от нижнего края
    if (layoutSlug === SLUGS.PUZZLE) return 2;      //для пазлов делаем баркод чуть повыше чем обычно

    return 3;                                       // отступ по-умолчанию

}


/**
 * SVG компонент баркода
 */
const BarcodeElement = ({ debugMode, barcodeTextWidth, barcodeFullWidth, barcodeHeight, barcodeTransform, barcodePadding }) => {
    return <g transform={barcodeTransform}>
        <defs>
            <clipPath id={'clip_print_barcode'}>
                <rect x={barcodeTextWidth * -1 - barcodePadding} y={3} width={barcodeFullWidth} height={barcodeHeight} />
            </clipPath>
        </defs>
        <rect x={barcodeTextWidth * -1 - barcodePadding} y={3} width={barcodeFullWidth} height={barcodeHeight} fill="#fff"/>
        <g id="BARCODE" dangerouslySetInnerHTML={{__html: debugMode && barCodeAsString || null}} clipPath={`url(#clip_print_barcode)`}/>
        <text dx={barcodeTextWidth * -1} dy={7} style={{fontSize:4}} id="BARCODE_NUMBER" clipPath={`url(#clip_print_barcode)`}>{debugMode && '10507Z13819'}</text>
    </g>
};

export default memo( BarcodeElement );