// @ts-ignore
import React from 'react';
// @ts-ignore
import styled from 'styled-components';

// @ts-ignore
import {COLORS} from 'const/styles'
// @ts-ignore
import {paragrafyText} from 'libs/helpers'


/** Interfaces */
interface Props {
    title: any;
    title2: any;
    info: any;
    formats: any;
    productSlug?: string;
}
interface ProductInfoBlockProps {
    text?: string;
    image?: string;
    isLeft?: boolean;
    header?: string;
}

/**
 * Styles
 */
const StyledProductInfo = styled('div')`
        background-color: ${COLORS.ATHENSGRAY};
`;
const StyledProductInfoBlock = styled('div')`
    display: flex;
    width: 100%;
    background-color: ${COLORS.ATHENSGRAY};
    overflow: hidden;
    ${({ theme }) => theme.media.sm`
        flex-direction: column;
    `}
    .image {
        display: flex;  
        align-items: flex-start;
        justify-content: center;
        width: 50%;  
        order: ${({isLeft})=>isLeft ? 1 : 2};
        ${({ theme }) => theme.media.sm`
            order: 1;
            width: 100%;
            &>img{
              border-bottom: none;
            }
        `}
    }
    .info {
        display: flex;
        padding: 20px;
        position: relative;
        flex: 1 1 auto;
        width: 50%;  
        order: ${({isLeft})=>isLeft ? 2 : 1};
        ${({ theme }) => theme.media.sm`
            order: 2;
            width: 100%;
            padding: 10px 20px;
        `}
    }
    .text {
        height: 100%;
        font-size: 18px;
        font-weight: 200;
        width: auto;
        padding: 30px 50px 0;
        ${({ theme }) => theme.media.md`
            padding: 20px;
        `}
        ${({ theme }) => theme.media.xs`
            font-size: 16px;
            font-weight: normal;
            padding: 0 0 15px;
        `}
        ul li:before {
             content:  "■";
             color: ${COLORS.TEXT_INFO};
        }
    }
    .headerWrap {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        padding: 0;
        margin-left: 50px;
        .header {
            font-size: 42px;
            font-weight: 600;
            line-height: 1.4em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .description {
             font-size: 18px;
             font-weight: 200;
             padding-right: 20px;
             //color: ${COLORS.MUTE};
        }
        ${({ theme }) => theme.media.md`
            margin-left: 20px;
        `}
        ${({ theme }) => theme.media.sm`
            position: static;
            width: auto;
            .header {
                  font-size: 36px;
            }
        `}
        ${({ theme }) => theme.media.xs`
            margin-left: 0;
            .header {
                  font-size: 36px;
            }
            .description {
                 font-size: 14px;
                 padding-right: 0;
            }
        `}
    }
`;
const StyledroductInfoMain = styled('div')`
    text-align: center;
    padding: 30px 60px;
    background-color: #fff;
    h3{
        text-transform: uppercase;
        font-weight: 200;
        margin: 0;
    }
`;

/**
 * Если это ссылка на googleusercontent.com, проверяет урл, ставит постфикс размера
 * @param url
 * @param width
 * @param height
 * @returns {String}
 */
const checkGooleImageUrl = ( {url, width = 900, height}: any ) => {
    if (!url) return null;
    const last3 = url.slice(-3);
    // @ts-ignore
    if (['jpg, peg, png'].some((x)=>x === last3) || Number.isInteger(last3)) {

    } else {
        const size = height ? `=h${height}` : `=w${width}`;
        return url + size || url;
    }
};

const ProductInfoBlock: React.FC<ProductInfoBlockProps> = ({ text, image, isLeft, header }) => {

    return (
        <StyledProductInfoBlock isLeft={isLeft}>
            {image && <div className='image'>
                <img src={image} alt={ header || text && text.slice(0,100) }/>
            </div>}
            <div className='info'>
                {header ?
                    <div className='headerWrap'>
                        <div className="header">{header}</div>
                        <div className="description">{text}</div>
                    </div>
                    :
                    (
                        text[0] === '<'  ?
                        <div className='text' dangerouslySetInnerHTML={{__html: text}}/>
                            :
                        <div className='text'>{paragrafyText(text.split('\n'))}</div>
                    )
                }
            </div>
        </StyledProductInfoBlock>)
};

const ProductInfo: React.FC<Props> = ({title, title2, info}) => {

    if ( !info ) return null;

    return (
        <StyledProductInfo>

            <ProductInfoBlock header={title}
                              text={info[0].description}
                              image={checkGooleImageUrl({url: info[0].url})} />


            <StyledroductInfoMain>
                <h3>{title2}</h3>
            </StyledroductInfoMain>

            {info.slice(1, info.length).map((infoItem, key) =>
                <ProductInfoBlock text={infoItem.description}
                                  image={checkGooleImageUrl({url: infoItem.url})}
                                  isLeft={key % 2 === 0}
                                  key={key}/>)}

        </StyledProductInfo>
    );
};

export default ProductInfo;