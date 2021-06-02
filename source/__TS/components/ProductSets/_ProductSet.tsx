// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
// import { useSelector } from "react-redux";
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';
// @ts-ignore
import {hexToRgbA} from 'libs/helpers';
// @ts-ignore
import {IconPlusRound} from 'components/Icons';


import ProductSetPreview from './_ProductSetPreview';


/** Interfaces */
interface Props {
    ProductSet?: {       //данные коллекции
        id: string;
        name: string;
        preview: string;
        status: string;
    };                  //данные коллекции
    isNew?: boolean;     //это кнопка создания новой коллекции
    isAdmin?: boolean;   //Показан в "Мой магазин"
    onSelect: (id: string, name?: string)=>any;    // выбор коллекции
}


/** Styles */
const ProductSetStyled = styled('div')`
    display: block;
    position: relative;
    width: 25%;
    max-width: 260px;
    padding: 5px;
    ${({theme}) => theme.media.md`
        width: 33%;
    `}
    ${({theme}) => theme.media.sm`  
        width: 50%;
    `}
    ${({theme}) => theme.media.xs`
        width: 100%;
    `}
    .inner {
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      padding: 10px;
      cursor: pointer;
      transition:  box-shadow .1s ease-out;
      .name {
          text-align: center;
          padding: 10px;
      }
      .iconWrap{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 230px;
        fill: ${COLORS.NEPAL};
        transition: fill .1s ease-out, transform .1s ease-out;
      }
      &:hover {
          box-shadow: 1px 2px 7px ${hexToRgbA(COLORS.BLACK, .12)};
          transition:  box-shadow .2s ease-out;
        .name {
          color: ${COLORS.PRIMARY};
        }
        .iconWrap {
            transform: scale(1.2);
            fill: ${COLORS.PRIMARY};
        }
        svg {
            opacity: .92;
        }
      }
      &:active {
        transform: translateY(1px);
         box-shadow: 0 0 3px ${hexToRgbA(COLORS.BLACK, .2)}
      }
    }
    .status {
        position: absolute;
        top: 10px;
        right: 0;
        font-size: 14px;
        text-transform: uppercase;
        color: #fff;
        background-color: ${COLORS.SUCCESS};
        padding: 2px 5px;
        border-radius: 10px;
        box-shadow: 1px 3px 4px rgba(83, 165, 41, 0.25);
    }
`;

/**
 * Продукт витрины
 */
const ProductSet: React.FC<Props> = ({ProductSet, onSelect, isNew, isAdmin}) => {

    return isNew ?
        <ProductSetStyled>
            <div className="inner createNew" onClick={()=>onSelect('new', 'Создание коллекции')}>
                <div className="iconWrap"><IconPlusRound size={48}/></div>
                <div className="name">Создать коллекцию</div>
            </div>
        </ProductSetStyled>
        :
        <ProductSetStyled>
            <div className="inner" onClick={()=>onSelect(ProductSet.id, ProductSet.name)}>
                <ProductSetPreview svg={ProductSet.preview}/>
                <div className="name">{ProductSet.name}</div>
            </div>
            {isAdmin && ProductSet.status === 'published' && <div className="status">Опубликован</div>}
        </ProductSetStyled>;
};

export default ProductSet;
