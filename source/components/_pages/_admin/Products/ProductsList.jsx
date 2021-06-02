import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import styled from 'styled-components'
import {COLORS} from 'const/styles'
import { IconEdit, IconEyeOff2, IconPlusRound } from 'components/Icons'

import {productsSelector, productsInProgressSelector} from "./_selectors";
import {getProductsByTypeAction} from "./_actions";
import {hexToRgbA} from "libs/helpers";
import Navbar from "components/Navbar";
import {PRODUCT_TABS} from "./_config";
import ProductsLinks from "./ProductsLinks";
import { PRODUCT_TYPES } from 'const/productsTypes';
import TEXT_MAIN from "texts/main";


/** Styles */
const ProductsWrapStyled = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    .name {
        font-size: 21px;
    }
    .list {
         background-color: ${COLORS.ATHENSGRAY};
    }
`;
const ProductsListStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 20px;
`;
const ProductStyled = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 200px;
    height: 200px;
    margin: 10px;
    padding: 10px;
    background-color: ${COLORS.WHITE};
    color: ${({isNew})=>isNew ? COLORS.NEPAL : COLORS.TEXT};
    fill: ${({isNew})=>isNew ? COLORS.NEPAL : COLORS.TEXT};
    opacity: ${({disabled})=>disabled ? .5 : 1};
    box-shadow: 0 1px 4px 1px ${hexToRgbA(COLORS.BLACK,.1)};
    cursor: pointer;
    &:hover {
        box-shadow: 0 2px 10px 1px ${hexToRgbA(COLORS.BLACK,.2)};
        color: ${COLORS.TEXT_PRIMARY};
        fill: ${COLORS.TEXT_PRIMARY};
    }
    .image {
        display: flex;
        align-items: center;
        height: 120px;
    }
    .name {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        text-align: center;
    }
`;

// Навигация по разным группам продуктов. Последний пункт - Опции
const PRODUCT_TYPES_TABS = [
    {id: PRODUCT_TYPES.OTHER,       title: TEXT_MAIN.NEW_PRODUCTS,},
    {id: PRODUCT_TYPES.POSTER,      title: TEXT_MAIN.POSTERS,},
    {id: PRODUCT_TYPES.PHOTO,       title: TEXT_MAIN.PHOTOS,},
    {id: PRODUCT_TYPES.CANVAS,      title: TEXT_MAIN.CANVASES,},
    {id: PRODUCT_TYPES.CALENDAR,    title: TEXT_MAIN.CALENDARS,},
    {id: PRODUCT_TYPES.PUZZLE,      title: TEXT_MAIN.PUZZLES,},
    // {id: PRODUCT_TYPES.OTHER,       title: TEXT_MAIN.OTHERS,},
    {id: 'divider', divider: true},
    {id: 'options',       title: TEXT_MAIN.OPTIONS,},   // Опции
];

/**
 * Список продукта одного типа
 */
// const ProductsWrap = ({products, selectAction}) => {
//     return <ProductsWrapStyled>
//         <div className="name">{products.name}</div>
//         <div className="list">
//             {products.list.map((item)=>
//                 <Product data={item} selectAction={selectAction} key={item.id}/>
//             )}
//         </div>
//     </ProductsWrapStyled>
// };
/**
 * Продукт (в списке)
 */
const Product = ({data, selectAction}) => {
    return <ProductStyled onClick={()=>selectAction(data.id)} isNew={!data.id} disabled={!data.visible}>
        <div className="image">
            { data.id ? data.visible ? <IconEdit/> : <IconEyeOff2/> : <IconPlusRound/>  }
        </div>
        <div className="name">
            {data.name}
        </div>
    </ProductStyled>
};

/**
 * Все продукты
 */
const ProductsList = ({history, setUrl}) => {
    const [tab, setTab] = useState(PRODUCT_TYPES.OTHER);
    // const isMobile = useSelector( state => windowIsMobileSelector( state ) );
    const products = useSelector( productsSelector );
    const productsInProgress = useSelector( productsInProgressSelector );

    useEffect(() => {
        if (tab === 'options') {
            history.push( '/admin/options/');
        }
        if ( !products && !productsInProgress ) {
            getProductsByTypeAction();
        }
    }, [products, tab]);

    const setCurrentProductIdAction = (id) => {
        const seletedProduct = products && products.poster && products.poster.find((item)=>item.id === id);
        setUrl({ productId: id || 'new', tab: PRODUCT_TABS.ABOUT, format: null, name: seletedProduct && seletedProduct.name });
    };

    if (!products) return  null;

    return <div>

        <Navbar selectTabAction={setTab}
                currentTab={tab}
                isMobile={false}
                tabs={PRODUCT_TYPES_TABS}
                margin={"bottom"}
            // height={49}
                disabled={false}
        />
        <ProductsListStyled>
            <Product data={{name: 'Создать новый продукт'}} selectAction={setCurrentProductIdAction}/>
            {products[tab] && products[tab].map((p)=> <Product data={p} selectAction={(id)=>setCurrentProductIdAction(id)} key={p.id}/> )}
        </ProductsListStyled>
        { tab === 'other' && <ProductsLinks/>}
    </div>
};

export default ProductsList;