import React, { memo } from 'react';
import styled from 'styled-components';

import {COLORS} from 'const/styles'

import {SLUGS} from 'const/productsTypes'


const DATA = {
    [SLUGS.POSTER_SIMPLE]: {
        print: { label: 'Печать', value: 'цифровая печать' },
        printDpi: { label: 'Разрешение печати', value: '300 dpi' },
        paper: { label: 'Бумага', value: 'гладкая мелованная 250 гр/м2 или художественная Pergraphica 250 гр/м2' },
        lamination: { label: 'Ламинация', value: 'тонкая глянцевая ламинация 28 mic' },
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза' },
    },
    [SLUGS.POSTER_PREMIUM]: {
        print: { label: 'Печать', value: 'широкоформатная струйная печать' },
        printDpi: { label: 'Разрешение печати', value: '2880 х 1440 dpi' },
        paper: { label: 'Бумага', value: 'матовая/глянцевая 210–240 гр/м2' },
        lamination: { label: 'Ламинация', value: 'глянцевая 28 mic для форматов А4, А3, А2, В2, 297х297, 420х420, 464х202, 1150х500' },
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза' },
    },
    [SLUGS.PHOTO_SIMPLE]: {
        print: { label: 'Печать', value: 'широкоформатная струйная печать' },
        printDpi: { label: 'Разрешение печати', value: '2880 х 1440 dpi' },
        paper: { label: 'Фотобумага', value: 'матовая/сатинированная/глянцевая 180–190 гр/м2' },
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза' },
    },
    [SLUGS.PHOTO_PREMIUM]: {
        print: { label: 'Печать', value: 'широкоформатная струйная печать' },
        printDpi: { label: 'Разрешение печати', value: '2880 х 1440 dpi' },
        paper: { label: 'Фотобумага', value: ' матовая/сатинированная/глянцевая 210–240 гр/м2' },
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза' },
    },
    [SLUGS.POSTER_CANVAS]: {
        print: { label: 'Печать', value: 'широкоформатная струйная печать' },
        printDpi: { label: 'Разрешение печати', value: '2880 х 1440 dpi' },
        paper: { label: 'Холст', value: 'матовый натуральный льняной холст долгого хранения' },
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза' },
    },
    default: {
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза' },
    },
};

/**
 * Styles
 */
const StyledProductDescription = styled.div`
    width: 100%;
    overflow: hidden;
    margin: 10px 0;
    ${({ theme }) => theme.media.sm`
        flex-direction: column;
    `}
    .productDescription {
      padding: 2px 0;
      .label {
          color: ${COLORS.TEXT_INFO};
      }
    }
    .title {
        display: flex;
        align-items: center;
        font-size: 21px;
        text-transform: uppercase;
    }
`;

const ProductDescriptionItem = ({label, value}) => {
    if (!label || !value) return null;
    return <div className="productDescription">
        <span className="label">{label}:</span> <span className="value">{value}</span>
    </div>;
};

const ProductDescription = memo(( {productSlug, data = {}, title, options} ) => {

    if ( !productSlug && productSlug !== 0 ) return null;
    const currentDescription = data[productSlug] || data.default || DATA[productSlug] || DATA.default;
    return (
        <StyledProductDescription>
            {title && <h3 className="title">{title}</h3>}
            {[
                currentDescription.print,
                currentDescription.printDpi,
                typeof currentDescription.paper === "function" ? currentDescription.paper(options && options.paper) : currentDescription.paper,
                currentDescription.lamination,
                currentDescription.pack,
                currentDescription.time,
                currentDescription.delivery,
            ].map((item, i)=> item && <ProductDescriptionItem label={item.label} value={item.value} key={i}/>)}
        </StyledProductDescription>
    );
});

export default ProductDescription;