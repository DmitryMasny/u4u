import React, {useEffect, useState, useRef, memo} from 'react';
import styled, { css } from 'styled-components';

import {Link} from "react-router-dom";
// import {Btn} from "components/_forms";
import {COLORS} from "const/styles";

/** Styles **/
const ProductImageStyled = styled.div`
    position: absolute;
    height: 100%;
    width: 50%;
    right: ${({isRight})=>isRight ? 'auto' : '50%'};
    left: ${({isRight})=>isRight ? '50%' : 'auto'};
    top: 0;
    background-image: url(${({url})=>url});
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: contain;
    transition: opacity 1s ease-in-out;
    ${({theme}) => theme.media && theme.media.sm`
        position: static;
        margin-top: 10px;
        width: 100%;
        height: 200px;
    `};
    ${({animate})=>animate && css`
      opacity: 0;
    `}
`;
const ProductInfoStyled = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 50%;
    height: 100%;
    top: 0;
    left: ${({isRight})=>isRight ? 'auto' : '50%'};
    right: ${({isRight})=>isRight ? '50%' : 'auto'};
    padding: 20px;
    opacity: 1;
    transform: translateX(0);
    transition: opacity 1s ease-out, transform .7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    ${({isRight})=>isRight ? css`
        padding-left: 50px;
    ` : css`
        padding-right: 50px;
    `
    };
    ${({theme}) => theme.media && theme.media.sm`
        position: static;
        width: 100%;
        height: auto;
        padding: 10px 30px 30px;
    `};
    ${({animate})=>animate && css`
        opacity: 0;
        transform: translateY(${()=> animate === 'in' ? 150 : 0}px);
    `}
  .header{
    font-size: 24px;
    margin-bottom: 10px;
    ${({theme}) => theme.media && theme.media.md`
          font-size: 21px;
    `}
  }
  .text{
    margin-bottom: 15px;
    ${({theme}) =>theme.media && theme.media.lg`
        font-size: 15px;
    `}
    ${({theme}) => theme.media && theme.media.md`
        font-size: 14px;    
        margin-bottom: 10px;
    `}
  }
`;
const ProductTypeCardBg = styled.div`
    position: absolute;
    left: -20px;
    right: -20px;
    top: -20px;
    bottom: -20px;
    background: url(${({url})=>url}) center no-repeat;
    background-size: cover;
    filter: progid:DXImageTransform.Microsoft.blur(pixelradius=15);
    filter: blur(15px);
    z-index: -1;
    opacity: .2;
`;

const ProductTypeCardStyled = styled.div`
    position: relative;
    width: 100%;
    flex-shrink: 0;
    background: ${COLORS.ATHENSGRAY};
    z-index: 1;
`;
const LinkStyled = styled(Link)`
    color: ${COLORS.TEXT};
    //background-color: rgba(255,255,255,.2);
    border-bottom: 2px solid ${COLORS.NEPAL};
    transition: border-bottom .1s ease-out;
    &:hover {
        color: ${COLORS.TEXT_PRIMARY};
        border-bottom-color: ${COLORS.TEXT_PRIMARY};
    }
`;

/**
 * Карточка типа продукта с главной страницы
 */
const ProductTypeCard = memo(( {data, isRight, active} ) => {
    const [animate, setAnimate] = useState('in');
    const tt = useRef(null);

    useEffect(()=>{
        setAnimate(active ? null : animate ? 'in' : 'out');
        if (animate === 'out' && !active && tt.current ) clearTimeout(tt.current);
        return ()=>{
            if (tt.current) clearTimeout(tt.current);
        }
    },[active]);

    useEffect(()=>{
        if (animate === 'out') tt.current = setTimeout(setAnimate( 'in'), 500);
    },[animate]);

    if (!data) return null;

    return  (
        <ProductTypeCardStyled>
            <ProductImageStyled url={data.imageUrl} isRight={isRight} animate={animate}/>
            <ProductInfoStyled isRight={isRight} animate={animate}>
                <h2 className="header">
                    <LinkStyled to={data.link}>
                        {data.title}
                    </LinkStyled>
                </h2>
                <div className="text">{data.text}</div>
            </ProductInfoStyled>
            {/*<ProductTypeCardBg url={data.imageUrl}/> TODO: вернуть, когда можно будет грузить png   */}
        </ProductTypeCardStyled>

    );
});

export default ProductTypeCard;
