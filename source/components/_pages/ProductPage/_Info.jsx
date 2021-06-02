import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import s from "./product.scss";

import TEXT_PRODUCT from 'texts/product'
import TEXT from 'texts/main'
import { Wrapper } from 'components/Page';

import { findProductByCoverAndBindingType } from 'libs/helpers'
import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'
import { productsSelector } from "./selectors";
// import { Wrapper } from "components/Page";
import VideoBlock from "components/VideoBlock";

const ProductInfo = ( props ) => {

    const { match: { params: type }, productsSelector } = props;

    if ( !productsSelector ) return null;

    let priceFloor = 0; // Цена для данного типа ОТ ...

    const
        // Все фотокниги
        productsList = productsSelector,

        // Выбранный тип продукта (фотокниги)
        currentProduct = findProductByCoverAndBindingType( {
                                                               products: productsList,
                                                               bindingType: type.bindingType,
                                                               coverType: type.coverType
                                                           } ),

        // Количество страниц для выбранного продукта
        pagesQuantity = <span>
                            <small>{TEXT.FROM}</small>&nbsp;
                            {currentProduct.pages.min}&nbsp;
                            <small>{TEXT.TO}</small>&nbsp;
                            {currentProduct.pages.max}
                        </span>,

        // Доступные форматы для выбранного продукта
        formats = currentProduct.formats.map( ( format, key ) => {
            if ( priceFloor === 0 || format.price < priceFloor ) priceFloor = format.price;
            return (<span key={key}>
                {format.width}
                <small>x</small>
                {format.height}
                {currentProduct.formats.length !== (key + 1) && ', '}
            </span>)
        } ),

        infoData = {
            HARD_GLUE: {
                image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_GLUE[1].src,
                title: TEXT.PHOTOBOOK_HARD_GLUE,
                info: [
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_GLUE[0].src, text: TEXT_PRODUCT.PHOTOBOOK_HARD_GLUE_TEXT[0], h2: true },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_GLUE[2].src, text: TEXT_PRODUCT.PHOTOBOOK_HARD_GLUE_TEXT[1] },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_GLUE[3].src, text: TEXT_PRODUCT.PHOTOBOOK_HARD_GLUE_TEXT[2] },
                ],
                lastText: TEXT_PRODUCT.PHOTOBOOK_LAST_LAST_TEXT[0],
                video: 'ZpcEoQrH-DE'
            },
            HARD_SPRING: {
                image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_SPRING[1].src,
                title: TEXT.PHOTOBOOK_HARD_SPRING,
                info: [
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_SPRING[0].src, text: TEXT_PRODUCT.PHOTOBOOK_HARD_SPRING_TEXT[0], h2: true },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_SPRING[3].src, text: TEXT_PRODUCT.PHOTOBOOK_HARD_SPRING_TEXT[1] },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.HARD_SPRING[2].src, text: TEXT_PRODUCT.PHOTOBOOK_HARD_SPRING_TEXT[2] },
                ],
                lastText: TEXT_PRODUCT.PHOTOBOOK_LAST_LAST_TEXT[1],
                video: 'zhndP48MNCw'
            },
            SOFT_GLUE:  {
                image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_GLUE[1].src,
                title: TEXT.PHOTOBOOK_SOFT_GLUE,
                info: [
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_GLUE[0].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_GLUE_TEXT[0], h2: true },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_GLUE[2].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_GLUE_TEXT[1] },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_GLUE[3].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_GLUE_TEXT[2] },
                ],
                lastText: TEXT_PRODUCT.PHOTOBOOK_LAST_LAST_TEXT[2],
                video: 'AUW7atomh-8'
            },
            SOFT_SPRING:  {
                image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_SPRING[1].src,
                title: TEXT.PHOTOBOOK_SOFT_SPRING,
                info: [
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_SPRING[2].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_SPRING_TEXT[0], h2: true },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_SPRING[3].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_SPRING_TEXT[1] },
                ],
                lastText: TEXT_PRODUCT.PHOTOBOOK_LAST_LAST_TEXT[3],
                video: 'zeSYzZjzzTc'
            },
            SOFT_CLIP:  {
                image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_CLIP[1].src,
                title: TEXT.PHOTOBOOK_SOFT_CLIP,
                info: [
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_CLIP[0].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_CLIP_TEXT[0], h2: true },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_CLIP[2].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_CLIP_TEXT[1] },
                    { image: TEXT_PRODUCT.PHOTOBOOK_IMAGES.SOFT_CLIP[3].src, text: TEXT_PRODUCT.PHOTOBOOK_SOFT_CLIP_TEXT[2] },
                ],
                lastText: TEXT_PRODUCT.PHOTOBOOK_LAST_LAST_TEXT[4],
                video: 'cfv-mdLpctM'
            },
        },

        currentProductInfo = infoData[type.coverType.toUpperCase()+'_'+type.bindingType.toUpperCase()];

        const ProductInfoBlock = ( { text, image, isLeft, header, h2 = false } ) => {
            return (
                <div className={`${s.productInfoBlock} ${isLeft ? s.left : ''}`}>
                    <div className={s.productInfoBlockImage} style={{ backgroundImage: `url(${image})` }}/>
                    <div className={s.productInfoBlockInfo}>
                        { header && <h1 className={s.productInfoBlockHeader}>{header}</h1>}
                        { h2 && <h2 className={s.productInfoBlockText}>{text}</h2>}
                        { !h2 && !header && <div className={s.productInfoBlockText}>{text}</div>}
                    </div>
                </div>)
        };

    return currentProductInfo && (
        <Wrapper>
            <div className={s.productInfo}>

                <ProductInfoBlock header={currentProductInfo.title}
                                  image={currentProductInfo.image}/>

                <div className={s.productInfoMain}>
                    <div className={s.productInfoMainItem}>
                        <div className={s.productInfoMainLabel}>
                            {TEXT_PRODUCT.PAGES_QUANTITY}
                        </div>
                        <div className={s.productInfoMainValue}>
                            {pagesQuantity}
                        </div>
                    </div>
                    <div className={s.productInfoMainItem}>
                        <div className={s.productInfoMainLabel}>
                            {TEXT.FORMATS}
                        </div>
                        <div className={s.productInfoMainValue}>
                            {formats}
                        </div>
                    </div>
                    <div className={s.productInfoMainItem}>
                        <h3 className={s.productInfoMainLabel}>
                            {TEXT.PRICE}
                        </h3>
                        <div className={s.productInfoMainValue}>
                            <small>{TEXT.FROM}</small>&nbsp;
                            {priceFloor}&nbsp;
                            <small>{TEXT.VALUE_RUB}</small>
                        </div>
                    </div>
                </div>

                {currentProductInfo.info.map( ( item, key ) => <ProductInfoBlock
                                                                        text={item.text}
                                                                        image={item.image}
                                                                        isLeft={key % 2 === 0}
                                                                        h2={item.h2}
                                                                        key={key}/> )}

                <div className={s.productInfoLast}>
                    {TEXT_PRODUCT.PHOTOBOOK_LAST_TEXT.map((item, i)=><p key={i}>{item}</p>)}
                    <p>{currentProductInfo.lastText}</p>
                </div>

                <VideoBlock hash={currentProductInfo.video}/>

            </div>
        </Wrapper>
    ) || null;
};

export default withRouter( connect(
    state => ({
        productsSelector: productsSelector( state, PRODUCT_TYPE_PHOTOBOOK ),
    }),
    dispatch => ({})
)( ProductInfo ) );