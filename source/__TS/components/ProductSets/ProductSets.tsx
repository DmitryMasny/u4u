// @ts-ignore
import React from 'react';

import Spinner from '__TS/components/_misc/Spinner';


// @ts-ignore
// import { useSelector } from "react-redux";
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';

import ProductSet from './_ProductSet';



/** Interfaces */
interface Props {
    isMobile: boolean; //флаг мобильного устройства
    isAdmin?: boolean; //показан в админке
    productSetsList: any; //список коллекций витрины
    onSelect: (id: string, name: string)=>any;    // выбор коллекции
    onCreate?:(id: string, name: string)=>any;    //создание коллекции
}


/** Styles */
const ProductSetsStyled = styled('div')`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    min-height: 300px;
    margin-bottom: 30px;
`;
const StyledEmptyWrap = styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 30px;
    width: 100%;
`;

/**
 * Список продуктов витрины
 */
const ProductSets: React.FC<Props> = ({productSetsList, isMobile, isAdmin, onSelect, onCreate}) => {

    if (!productSetsList || productSetsList === 'loading') return <ProductSetsStyled>
        <StyledEmptyWrap>
            <Spinner/>
        </StyledEmptyWrap>
    </ProductSetsStyled>;

    if (!productSetsList.length) return <ProductSetsStyled>
        <StyledEmptyWrap>
            {onCreate ? <ProductSet isNew onSelect={onCreate}/> : <h3>нет продуктов</h3>}
        </StyledEmptyWrap>
    </ProductSetsStyled>;

    return <ProductSetsStyled>
        {onCreate && <ProductSet isNew onSelect={onCreate}/>}
        {productSetsList.map((p) => <ProductSet ProductSet={p} onSelect={onSelect} key={p.id} isAdmin={isAdmin}/>)}
    </ProductSetsStyled>;
};

export default ProductSets;
