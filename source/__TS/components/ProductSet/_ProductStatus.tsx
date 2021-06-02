// @ts-ignore
import React from 'react';
import styled from 'styled-components';

// @ts-ignore
import {COLORS} from 'const/styles';

// @ts-ignore
import {getOptionCategoryName} from 'libs/helpers';

/** Interfaces */
interface Props {
    selectedFormat: any;
    selectedOptions: any;
    productSlug: string;
}

const StyledProductStatus = styled('div')`
    width: 100%;
    margin-bottom: 15px;
    .item {
        display: block;
        margin-bottom: 3px;
    }
    .label {
        color: ${COLORS.TEXT_INFO};
    }
    .price {
        color: ${COLORS.TEXT_INFO};
    }
`;

/**
 * Конструктор опций продукта
 */
const ProductStatus: React.FC<Props> = ({ selectedFormat, selectedOptions, productSlug }) => {

    if ( !selectedFormat || !selectedOptions ) return null;

    let status = [{
        label: 'Формат',
        value: `${selectedFormat.width} мм x ${selectedFormat.height} мм`,
        price: 0
    }];

    const options = Object.keys(selectedOptions).map(( key ) => {
        const o = selectedOptions[key];
        return o ? {
            label: getOptionCategoryName(o.name, productSlug),
            value: o.optionName,
            price: o.name === 'paper' ? 0 : o.price
        } : null
    } ).filter( ( x ) => x );

    status = [...status, ...options];

    return <StyledProductStatus>
        {status.map((item, key) =>
            <span className={'item'} key={key}>
                        {item.label && <span className={'label'}>{item.label}:&nbsp;</span>}
                {item.value && <span className={'value'}>{item.value}</span>}
                {/*{!!item.price && <span className={'price'}>&nbsp;{key > 1 ? '+' : ''}{item.price}руб.</span>}*/}
                    </span>
        )}
    </StyledProductStatus>
};

export default ProductStatus;
