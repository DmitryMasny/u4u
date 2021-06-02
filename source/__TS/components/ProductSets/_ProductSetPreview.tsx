// @ts-ignore
import React from 'react';
import styled from 'styled-components';


/** Interfaces */
interface Props {
    svg: string     //svg превью
}


/** Styles */
const ProductSetPreviewStyled = styled('div')`
    display: block;
    width: 100%;
    height: 230px;
`;

/**
 * svg превью продукта витрины
 */
const ProductSetPreview: React.FC<Props> = ({svg}): any => {
    return <ProductSetPreviewStyled dangerouslySetInnerHTML={{ __html: svg.replace('/%IMAGESIZE%/', 'w230') }}/>;
};

export default ProductSetPreview;
