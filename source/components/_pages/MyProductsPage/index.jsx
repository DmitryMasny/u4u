import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

//import { store } from "components/App";

import { Page, PageInner, PageTitle } from 'components/Page';
import Tabs from 'components/Tabs';
import OnlyAuth from 'hoc/OnlyAuth';
import TabContent from './_TabContent';
import MyDelivery from "./_MyDelivery";
import { IconCart } from 'components/Icons';

import LINKS_MAIN from 'config/links';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART } from 'const/myProducts';

import { toast } from '__TS/libs/tools';

import { replaceTab } from 'libs/helpers';
import { showServerError, showBadPromocodeError } from 'libs/errors';

import {
    myProductsSelector,
    myProductsInProgressSelector,
    myProductsShowDeliverySelector,
    promoCodeSelector,
    promoCodeInProgressSelector,
    usePromoCodeSelector,
    useBiglionSelector,
    promoReservedKeySelector,
    promoPinCodeSelector,
    cartSelector
} from "./selectors";
import {
    getProductsFromServerAction,
    clearCartAction,
    makeProductOrderAction,
    makeProductCopyAction,
    deleteProductAction,
    recoverProductAction,
    reOrderProductAction,
    removeProductFromCartAction,
    changeProductCountAction,
    changeProductNameAction,
    toggleShowDeliveryAction,
    checkPromoCodeAction,
    clearPromoCodeAction,
    // checkBiglionCodeAction
} from "./actions";

import { modalSimplePreviewAction, modalPreviewAlbumAction } from 'actions/modals';
import './animate.css';

import { PRODUCT_TYPES } from "const/productsTypes";
import { productsSelector } from "../ProductPage/selectors";

/** styles */
const Attention = styled('div')`
    color: green;
    border: 1px green dashed;
    padding: 20px;
    text-align: center;
    margin: 20px 0 -10px;
`;

// Доступные к заказу типы продуктов
const allowedProductTypes = [
    PRODUCT_TYPES.POSTER,
    PRODUCT_TYPES.PHOTO,
    PRODUCT_TYPES.CANVAS,
    PRODUCT_TYPES.CALENDAR,
    PRODUCT_TYPES.PUZZLE
]

/**
 * Страница "Мои Заказы" ( + Корзина и мои фотокниги )
 */
class MyProductsPage extends Component {

    // Список табов (подразделов)
    tabs = [
        { id: MY_PRODUCTS_NEW,      title: TEXT_MY_PRODUCTS.NOT_COMPLETED, link: replaceTab( LINKS_MAIN.MY_PRODUCTS, MY_PRODUCTS_NEW ) },
        { id: MY_PRODUCTS_INORDER,  title: TEXT_MY_PRODUCTS.IN_ORDER,      link: replaceTab( LINKS_MAIN.MY_PRODUCTS, MY_PRODUCTS_INORDER ) },
        { id: MY_PRODUCTS_DELETED,  title: TEXT_MY_PRODUCTS.DELETED,       link: replaceTab( LINKS_MAIN.MY_PRODUCTS, MY_PRODUCTS_DELETED ) },
        { divider: 'это разделитель для табов' },
        { id: MY_PRODUCTS_CART,     title: TEXT_MY_PRODUCTS.CART,          link: replaceTab( LINKS_MAIN.MY_PRODUCTS, MY_PRODUCTS_CART ), icon: <IconCart/> }
    ];

    shouldComponentUpdate( nextProps ) {
        const { match: { params: { tab: nextTab } }, myProductsSelector, windowScroll } = nextProps;

        if ( this.props.windowScroll !== windowScroll ) return false;

        //Если не осуществляется запрос к серверу и нет данных таба, запрашиваем с сервера
        if ( !nextProps.inProgressSelector && !myProductsSelector ) {
            this.props.getProductsFromServerAction( nextTab );
            return false;
        }

        //если ошибка сервера
        if ( myProductsSelector && myProductsSelector.error ) {
            showServerError();
            return true;
        }

        //если корзина
        if ( nextTab === MY_PRODUCTS_CART ) {
            if ( nextProps.promoCodeSelector && (!nextProps.usePromoCodeSelector && !nextProps.useBiglionSelector) ) {
                showBadPromocodeError(); //Сообщение В корзине нет продуктов, к которым возможно применить данный промокод
                this.props.clearPromoCodeAction();
                return false;
            }

            if ( nextProps.promoCodeSelector && nextProps.promoCodeSelector !== this.props.promoCodeSelector ) {

                if ( nextProps.usePromoCodeSelector ) {
                    toast.success('Промокод активирован', {
                        autoClose: 3000
                    });

                } else if ( nextProps.useBiglionSelector ) {
                    toast.success('Купон активирован', {
                        autoClose: 3000
                    });
                }
            }
        }

        return true;
    };

    componentDidMount () {
        const { getProductsFromServerAction, toggleShowDeliveryAction } = this.props;

        let { match: { params: { tab } }, myProductsSelector } = this.props;
        if ( !tab ) tab = MY_PRODUCTS_NEW;

        // Сбрасываем окно оформления доставки на случай если оно открыто
        toggleShowDeliveryAction( false );

        // Если нет данных содержимого вкладки, запрашиваем
        if ( !myProductsSelector ) {
            getProductsFromServerAction( tab );
        } else if ( myProductsSelector.error ) showServerError(); //если ошибка сервера

    };
    render () {
        const {
            match: { params: { tab } },
            myProductsSelector,
            myProductsCartSelector,
            inProgressSelector,
            showDeliverySelector,
            promoCodeSelector,
            usePromoCodeSelector,
            useBiglionSelector,
            clearCartAction,
            makeOrderAction,
            makeCopyAction,
            deleteProductAction,
            toggleShowDeliveryAction,
            recoverProductAction,
            reOrderAction,
            removeFromCartAction,
            changeNameAction,
            changeCountAction,
            modalSimplePreviewAction,
            modalPreviewAlbumAction,
            checkPromoCodeAction,
            // checkBiglionCodeAction,
            clearPromoCodeAction,
            promoReservedKeySelector,
            promoPinCodeSelector,
            productsSelector,
            cartSelector
        } = this.props;

        const modalPreviewHandler = (data) => {

            if (data.svgPreview) {
                modalSimplePreviewAction({
                    ...data,
                    format: {
                        w: data.formatWidth,
                        h: data.formatHeight,
                    }
                });
            } else modalPreviewAlbumAction(data)
        }

        if ( !tab ) this.props.history.push( LINKS_MAIN.MY_PRODUCTS.replace( ':tab', MY_PRODUCTS_NEW ) );

        return (
            <OnlyAuth>
                <Page>
                    {!showDeliverySelector &&
                    <PageInner>

                        <Tabs tabs={this.tabs}
                              disabled={inProgressSelector}
                              defaultTab={tab}/>

                        {/*<Attention>Внимание. В новогодние праздники сроки изготовления и доставки заказов будут увеличены! Офис самовывоза U4U по адресу г. Москва, ул Красная Пресня, 28 строение 2, офис 211, с 31 декабря по 10 января работать не будет.</Attention>*/}
                        {/*<Attention>26 декабря, офис самовывоза U4U по адресу г. Москва, ул Красная Пресня, 28 строение 2, офис 211, работает с 10:00 до 18:00 </Attention>*/}
                        <TabContent data={myProductsSelector}
                                    makeOrderAction={makeOrderAction}
                                    clearCartAction={clearCartAction}
                                    makeCopyAction={makeCopyAction}
                                    editProductAction={(hash)=>{ window.location.assign( '/redaktor/#' + hash )}}
                                    deleteProductAction={deleteProductAction}
                                    recoverProductAction={recoverProductAction}
                                    reOrderAction={reOrderAction}
                                    removeFromCartAction={removeFromCartAction}
                                    changeNameAction={changeNameAction}
                                    changeCountAction={( id, count ) => changeCountAction( id, count, promoCodeSelector, cartSelector && cartSelector.id )}
                                    inProgress={inProgressSelector}
                                    modalPreviewAlbumAction={modalPreviewHandler}
                                    toggleShowDeliveryAction={toggleShowDeliveryAction}
                                    checkPromoCodeAction={checkPromoCodeAction}
                                    // checkBiglionCodeAction={checkBiglionCodeAction}
                                    clearPromoCodeAction={clearPromoCodeAction}
                                    promoCodeSelector={promoCodeSelector}
                                    usePromoCodeSelector={usePromoCodeSelector}
                                    useBiglionSelector={useBiglionSelector}
                                    promoReservedKeySelector={promoReservedKeySelector}
                                    promoPinCodeSelector={promoPinCodeSelector}
                                    productsSelector={productsSelector}
                                    type={tab}/>
                    </PageInner>}
                    {showDeliverySelector &&
                        <PageInner>
                            <MyDelivery cartData={ myProductsCartSelector } />
                        </PageInner>
                    }
                </Page>
            </OnlyAuth>);
    }
}

export default withRouter( connect(
    (state, ownProps) => {
        const { match: { params: { tab } } } = ownProps;

        const products = myProductsSelector( state, tab ),
              productsCount = products && products.orders && products.orders.length || 0;

        return {
            productsCount: productsCount, //этот параметр служит только для запуска обновления компонента
            myProductsSelector: products,
            myProductsCartSelector: myProductsSelector( state, MY_PRODUCTS_CART ),
            inProgressSelector: myProductsInProgressSelector( state ),
            showDeliverySelector: myProductsShowDeliverySelector( state ),
            promoCodeSelector: promoCodeSelector( state ),
            usePromoCodeSelector: usePromoCodeSelector( state ),
            useBiglionSelector: useBiglionSelector( state ),
            promoReservedKeySelector: promoReservedKeySelector( state ),
            promoPinCodeSelector: promoPinCodeSelector( state ),
            promoCodeInProgressSelector: promoCodeInProgressSelector( state ),
            productsSelector: productsSelector( state, allowedProductTypes ),
            cartSelector: cartSelector( state )
        }
    },
    dispatch => ({
        clearPromoCodeAction: () => {dispatch( clearPromoCodeAction() )},
        checkPromoCodeAction: ( promo ) => {dispatch( checkPromoCodeAction( promo ) )},
        // checkBiglionCodeAction: ( promo ) => {dispatch( checkBiglionCodeAction( promo ) )},
        modalSimplePreviewAction: ( o ) => {dispatch( modalSimplePreviewAction( o ) )},
        modalPreviewAlbumAction: ( o ) => {dispatch( modalPreviewAlbumAction( o ) )},
        getProductsFromServerAction: ( tab ) => dispatch( getProductsFromServerAction( tab ) ),
        clearCartAction: () => dispatch( clearCartAction() ),
        makeOrderAction: ( o ) => dispatch( makeProductOrderAction( o ) ),
        makeCopyAction: ( id, name, callback ) => dispatch( makeProductCopyAction( id, name, callback ) ),
        deleteProductAction: ( id ) => dispatch( deleteProductAction( id ) ),
        recoverProductAction: ( id ) => dispatch( recoverProductAction( id ) ),
        reOrderAction: ( id ) => dispatch( reOrderProductAction( id ) ),
        removeFromCartAction: ( id, callback ) => dispatch( removeProductFromCartAction( id, callback ) ),
        changeCountAction: ( id, count, promoCode, orderSetId ) => dispatch( changeProductCountAction( id, count, promoCode, orderSetId ) ),
        changeNameAction: ( id, name ) => dispatch( changeProductNameAction( id, name ) ),
        toggleShowDeliveryAction: ( show ) => dispatch( toggleShowDeliveryAction( show ) )
    })
)( MyProductsPage ) );