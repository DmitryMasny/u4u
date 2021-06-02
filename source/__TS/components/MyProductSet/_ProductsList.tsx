// @ts-ignore
import React from 'react';
import styled from 'styled-components';
// @ts-ignore
import {COLORS} from 'const/styles';
// @ts-ignore
import {Select} from 'components/_forms';


import ProductsListItem from './_ProductsListItem';



/** Interfaces */
interface Props {
    list: IListProps[];                  // список продуктов
    onSelect: (id: string)=> any;       // выбор продукта
    onRemove?: (id: string)=> any;       // удаление продукта из коллекции
    inProductSet?: boolean;              // Этот продукт добавлен в список продуктов коллекции
    disabled?: boolean;                 // Нельзя менять (на публикации)
}

interface IListProps {
    id: number;
    formatSlug: string;
    layoutId: string;
    layoutData: ILayoutData;
    priceExtra: string;
    productSet: number
    productSlug: string;
    status: string;
}

interface ILayoutData {
    format: {
        id: string;
        width: string;
        height: string;
    }
    id: string;
    options: any
    preview: string;
    productId: string;
    productSlug: string;
    sellStruct: ISellStruct;
}
interface ISellStruct {
    copyFrom: string;
    designedBy: string;
    priceExtra: number
    readOnly: boolean
}

/** Styles */
const StyledProductsList = styled('div')`
    display: flex;
    flex-wrap: wrap;

`;

/**
 * Блок фильтра (выбора опции) продукта витрины
 */
const ProductsList: React.FC<Props> = ({list, onSelect, onRemove, inProductSet, disabled}) => {

    if (!list) return null;

    return <StyledProductsList >
        {list.map((item)=>item &&
            <ProductsListItem
                productData={item}
                onSelectProduct={onSelect}
                onRemoveProduct={onRemove}
                inProductSet={inProductSet}
                disabled={disabled}
                key={item.id}
            />)}
    </StyledProductsList>;
};

export default ProductsList;



