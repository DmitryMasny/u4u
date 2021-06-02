import WS from 'server/ws.es6';
import { generateAllProductPDF,  } from "components/LayoutConstructor/preview.js";
import LINKS_MAIN from "config/links";
import { clearCartAction, getProductsFromServerAction } from 'components/_pages/MyProductsPage/actions';
import { MY_PRODUCTS_CART, MY_PRODUCTS_NEW } from "const/myProducts";
import { store } from "components/App";
import { toast } from '__TS/libs/tools';
import {
    MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED,
    MY_PRODUCTS_MOVE_PRODUCT_TO_CART,
    MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED,
    MY_PRODUCTS_CHANGING_PRODUCT_NAME
} from "const/actionTypes";
import TEXT_MY_PRODUCTS from "../../texts/my_products";
import { Btn } from "../../components/_forms";
import React from "react";

export const clonePoster =( layoutId ) => new Promise( ( resolve, reject ) => {
    WS.clonePoster( layoutId ).then( ( answer ) => {
        store.dispatch( getProductsFromServerAction( MY_PRODUCTS_NEW ) );
        resolve();
    } ).catch( ( error ) => {
        toast.error( 'Не удалось создать копию', { autoClose: 4000 } );
        reject( error );
        console.log( "error", error );
    } );
});


export const restorePoster =( layoutId ) => new Promise( ( resolve, reject ) => {
    WS.restorePoster( layoutId ).then(( answer )=>{
        store.dispatch( {
                            type: MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED,
                            payload: layoutId
                        });
    } ).catch( ( error ) => {
        toast.error( 'Не удалось востановить', { autoClose: 4000 } );
        console.log( "error", error );
    } );
});


export const deletePoster =( layoutId ) => new Promise( ( resolve, reject ) => {
    WS.deletePoster( layoutId ).then(( answer )=>{
        store.dispatch( {
                            type: MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED,
                            payload: layoutId
                        });
    } ).catch( ( error ) => {
        toast.error( 'Не удалось удалить', { autoClose: 4000 } );
        console.log( "error", error );
    } );
});

/**
 * Переименование продукта
 */
export const renameProduct =( layoutId, newName ) => new Promise( ( resolve, reject ) => {
    WS.renameProduct( layoutId, newName ).then(( answer )=>{
        store.dispatch( {
                            type: MY_PRODUCTS_CHANGING_PRODUCT_NAME,
                            payload: {id: layoutId, userTitle: answer.userTitle}
                        });
    } ).catch( ( error ) => {
        toast.error( 'Не удалось удалить', { autoClose: 4000 } );
        console.log( "error", error );
    } );
});

/**
 * создание заказа
 * @param layoutId
 * @param history
 * @param layout
 * @param goToCart
 * @returns {Promise}
 */
export const createOrder = ( layoutId, history = null, layout = false, goToCart = false, debugMode = false ) => new Promise( ( resolve, reject ) => {
    //метод создания заказа
    const createOrder = ( layout ) => {
        const state = {
            productData: {
                layout
            }
        };

        //генерим pdf в виде строки
        const svgPdfArray = generateAllProductPDF( state, true, debugMode );

        if ( debugMode ) {
            const copyToClipboard = str => {
                const el = document.createElement('textarea');
                el.value = str;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            };
            copyToClipboard( svgPdfArray );
            toast.success(
                <div>
                    <div style={{marginBottom: '5px'}}>SVG массив скопирован в буфер обмена</div>
                </div>,
                { autoClose: 3000 } );
            //console.log( 'SVG:' );
            //console.log( svgPdfArray );
            return null;
        }

        //отправляем на сервер запрос на создания layout
        WS.setLayoutPosterToOrder( layoutId, svgPdfArray ).then( ( result ) => {
            //очищаем корзину
            store.dispatch( clearCartAction() );

            //если передается объект history, значи делаем переадресацию на корзину
            if ( history ) {
                //делаем переадресацию на корзину
                history.push( LINKS_MAIN.MY_PRODUCTS.replace( ':tab', MY_PRODUCTS_CART ) );

            } else {
                //убираем продукт из списка новых
                store.dispatch( {
                                    type: MY_PRODUCTS_MOVE_PRODUCT_TO_CART,
                                    payload: layoutId
                                } );

                //показываем тостер о том, что товар положен в корзину с возмржностью перейти в корзину
                toast.success(
                    <div>
                        <div style={{marginBottom: '5px'}}>{TEXT_MY_PRODUCTS.MAKE_ORDER_SUCCESS}</div>
                        <Btn small intent={"success"} onClick={goToCart}>{TEXT_MY_PRODUCTS.MAKE_ORDER_SUCCESS_LINK}</Btn>
                    </div>,
                    { autoClose: 4000 } );
            }

            //возвращаем промис
            resolve();
        } ).catch( ( err ) => {
            toast.error( 'Не удалось создать заказ', { autoClose: 4000 } );
            //возвращаем промис
            reject( err );
            console.log( 'xxx b64svg error', err );
        });
    };

    if ( !layout ) {
        //получаем постер по Id
        WS.getLayoutPoster( layoutId ).then( (layout) => {
                createOrder( layout )
            } ).catch( err => reject( err ) );
    } else {
        createOrder( layout );
    }
});
