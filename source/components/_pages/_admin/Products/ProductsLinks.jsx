import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import styled from 'styled-components';

import { productsSelector } from "./_selectors";
import { generateProductUrl } from "__TS/libs/tools";


/** Styles */
const ProductsLinksStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 10px 0;
    .group {
        display: flex;
        flex-direction: column;
        padding: 5px;
    }
    .item {
      padding: 5px 10px;
    }
`;


/**
 * Ссылки на продукты для админа
 */
const ProductsLinks = () => {
    const [ productsList, setProductsList ] = useState( [] );
    const products = useSelector( productsSelector );

    useEffect( () => {
        if (products) setProductsList(Object.values( products ));
    }, [ products ] );

    return <ProductsLinksStyled>
        { productsList && productsList.map( ( group ) => (
            <div className="group">
                { group && group.map( ( item ) => <NavLink className="item" to={ generateProductUrl({productType: item.id}) } key={item.id}>
                    { item.name }
                </NavLink> )}
            </div>
        ) ) }
    </ProductsLinksStyled>
};

export default ProductsLinks;