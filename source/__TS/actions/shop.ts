// @ts-ignore
import { store } from "components/App";

// @ts-ignore
import { generateAllProductPDF  } from "components/LayoutConstructor/preview.js";

// @ts-ignore
import {
    MY_SHOP_GET_PRODUCTSET,
    MY_SHOP_SET_PRODUCTSET,
    MY_SHOP_PRODUCTSET_CREATE,
    MY_SHOP_PRODUCTSET_UPDATE,
    MY_SHOP_PRODUCTSET_DELETE,
    MY_SHOP_GET_PRODUCTSETS_PAGE,
    MY_SHOP_SET_PRODUCTSETS_PAGE,
    MY_SHOP_PRODUCTSET_CHANGE_STATUS,
    MY_SHOP_CLEAR_DATA,
    MY_SHOP_SET_PAGE,
    ALL_SHOP_CLEAR_DATA,

    SHOP_GET_PRODUCTSET_CATEGORIES,
    SHOP_SET_PRODUCTSET_CATEGORIES,
    SHOP_GET_PRODUCTSETS_PAGE,
    SHOP_SET_PRODUCTSETS_PAGE,
    SHOP_GET_FILTERS,
    SHOP_SET_FILTERS,
    SHOP_PUT_FILTERS,
    SHOP_GET_PRODUCTSET,
    SHOP_SET_PRODUCTSET,
    SHOP_BUY_PRODUCT,

    MY_PRODUCTS_SET_PRODUCTS,
    MY_PRODUCTS_GET_PRODUCTS,
    MY_PRODUCTS_CLEAR_MY_CART
// @ts-ignore
} from "const/actionTypes";

// @ts-ignore
//import {MY_PRODUCTS_CART, MY_PRODUCTS_INORDER} from "const/myProducts";
// @ts-ignore
import { myProductsConverter } from "libs/myProductsConverters";
// @ts-ignore
import camelcaseKeysDeep from 'camelcase-keys-deep';
// @ts-ignore
import { toast } from '__TS/libs/tools';
// @ts-ignore
import WS from "server/ws";

import { getProductSetAdminAdapter, getProductSetAdapter } from "../adapters/shop";

//получаем диспетчер Redux
const dispatch = store.dispatch;

interface IsetShopPage {
    category?: string;
    productType?: string;
    format?: string;
    page?: string;
}


/**
 * Экшены для витрины
 */
export const getShopPageAction = ( { category, productType, format, page } ) => {
    // const state = store.getState()
    let key = 'category:' + ( category || 0 ) + '-productType:' + ( productType || 0 ) + '-format:' + ( format || 0 ) + '-page:' + ( page || 0 );

    return dispatch( {
        type: SHOP_GET_PRODUCTSETS_PAGE,
        payload: {
            ...( category && { category: category } || {} ),
            ...( productType && { product_slug: productType } || {} ),
            ...( format && { format_slug: format } || {} ),
            ...( page && { page: page } || {} ),
            actions: {
                inProgress: () => {
                    return {
                        type: SHOP_SET_PRODUCTSETS_PAGE, payload: {
                            key: key,
                            results: 'loading',
                            totalElements: 0,
                        }
                    }
                },
                inSuccess: ( { response } ) => {
                    return {
                        type: SHOP_SET_PRODUCTSETS_PAGE, payload: {
                            key: key,
                            results: response.results || [],
                            totalElements: response.count,
                            currentPage: page,
                        }
                    }
                },
                inFail: ( err ) => {
                    return { type: SHOP_SET_PRODUCTSETS_PAGE, payload: { error: err } }
                }
            }
        }
    } );
};

export const getShopFiltersAction = () => {

    return dispatch( {
        type: SHOP_GET_FILTERS,
        payload: {
            actions: {
                inProgress: () => {
                    return { type: SHOP_PUT_FILTERS, payload: 'loading' }
                },
                inSuccess: ( { response } ) => {
                    return { type: SHOP_PUT_FILTERS, payload: response }
                },
                inFail: ( err ) => {
                    return { type: SHOP_PUT_FILTERS, payload: { error: err } }
                }
            }
        }
    } );
};

export const setShopFiltersAction = ( { category, productType, format, page }: IsetShopPage ): any => {

    return dispatch( {
        type: SHOP_SET_FILTERS,
        payload: { category, productType, format, page }
    } );
};

/**
 * Экшены для товара витрины
 */

export const getProductsetAction = ( { id } ) => {
    return dispatch( {
        type: SHOP_GET_PRODUCTSET,
        payload: {
            urlParams: [ id ],
            actions: {
                inSuccess: ( { response } ) => {
                    return { type: SHOP_SET_PRODUCTSET, payload: getProductSetAdapter( response ) }
                },
                inFail: ( err ) => {
                    return { type: SHOP_SET_PRODUCTSET, payload: { id: id, error: err } }
                }
            }
        }
    } );
};


export const buyProductAction = ( { id, layoutId, callback, layout } ) => {
    return dispatch( {
        type: SHOP_BUY_PRODUCT,
        payload: {
            urlParams: [ id, 'buy' ],
            layout_id: layoutId,
            actions: {
                inSuccess: ( { response } ) => {


                    // createOrder( posterId, null, null, goToCart ).finally( () => {
                    //     toggleLoader( false );
                    //     clearCartAction();
                    // } );


                    //метод создания заказа
                    const createOrder = ( layout ) => {
                        const svgPdfArray = generateAllProductPDF( { productData: layout } );

                        //отправляем на сервер запрос на создания layout
                        WS.setLayoutPosterToOrder( response.buyLayoutId, svgPdfArray ).then( wsResponse => {
                            // console.log('wsResponse',wsResponse);

                            //очищаем корзину
                            dispatch( {
                                type: MY_PRODUCTS_CLEAR_MY_CART
                            } );

                            //делаем переадресацию на корзину и показываем тостер
                            callback && callback();


                        } ).catch( ( err ) => {
                            dispatch( {
                                type: MY_PRODUCTS_CLEAR_MY_CART
                            } );
                        } );
                    };

                    if ( !layout ) {
                        //получаем постер по Id
                        WS.getLayoutPoster( response.buyLayoutId ).then( layout => createOrder( layout ) )
                            .catch( err => console.log( 'err', err ) );
                    } else {
                        createOrder( layout );
                    }

                },
                inFail: ( err ) => {
                    // return { type: SHOP_SET_PRODUCTSET, payload: {error: err} }
                }
            }
        }
    } );
};


/**
 * Экшены для витрины дизайнера
 */
export const getProductSetsPage: any = ( page ) => dispatch( {
    type: MY_SHOP_GET_PRODUCTSETS_PAGE,
    payload: {
        ...( page && { page: page } || {} ),
        actions: {
            inSuccess: ( { response } ) => {
                return {
                    type: MY_SHOP_SET_PRODUCTSETS_PAGE, payload: {
                        page: page || 1,
                        results: response.results || [],
                        totalElements: response.count,
                    }
                }
            },
            inFail: ( err ) => {
                return { type: MY_SHOP_SET_PRODUCTSETS_PAGE, payload: { error: err } }
            }
        }
    }
} );

/**
 * Экшены для товара витрины дизайнера
 */
// Получение коллекции дизайнера
export const getProductSetAction = ( id: string ) => dispatch( {
    type: MY_SHOP_GET_PRODUCTSET,
    payload: {
        urlParams: [ id ],
        actions: {
            inSuccess: ( { response } ) => {
                return { type: MY_SHOP_SET_PRODUCTSET, payload: getProductSetAdminAdapter( response ) }
            },
            inFail: ( err ) => {
                return { type: MY_SHOP_SET_PRODUCTSET, payload: { error: err } }
            }
        }
    }
} );

// Выбор страницы
export const setPageAction = ( page ) => dispatch( {
    type: MY_SHOP_SET_PAGE,
    payload: page
} );

// Получение продуктов юзера
export const getUserProductsAction = () => dispatch( {
    type: MY_PRODUCTS_GET_PRODUCTS,
    payload: {
        actions: {
            inFail: () => ( {
                type: MY_PRODUCTS_SET_PRODUCTS,
                payload: { tabs: [ 'new' ], [ 'new' ]: { error: true } }
            } ),
            inSuccess: ( { response } ) => {

                if ( response.layouts && response.layouts.length ) {
                    response.layouts = response.layouts.map( item => {
                        delete ( item[ '_id' ] );
                        return item;
                    } );
                }

                WS.getPosters().then( wsResponse => {
                    const result = [ ...myProductsConverter( camelcaseKeysDeep( response ) ) ];

                    wsResponse.layouts.map( lo => {
                        //убираем все удаленные
                        if ( lo.layout.isDeleted ) return;

                        lo.layout.random = Math.random();
                        result.push( lo.layout );
                    } );
                    //сортируем таб
                    result.sort( ( a, b ) => ( b.lastChanged - a.lastChanged ) );

                    dispatch( {
                        type: MY_PRODUCTS_SET_PRODUCTS,
                        payload: { tabs: [ 'new' ], [ 'new' ]: result }
                    } );

                } ).catch( ( err ) => {

                    dispatch( {
                        type: MY_PRODUCTS_SET_PRODUCTS,
                        payload: {
                            tabs: [ 'new' ],
                            [ 'new' ]: myProductsConverter( camelcaseKeysDeep( response ) )
                        }
                    } );
                } );
                return null;
            }
        }
    }
} );


/**
 * Создать коллекцию
 */
export const createProductSetAction: ( productSet: any, callback?: any ) => any = ( productSet, callback ) => dispatch( {
    type: MY_SHOP_PRODUCTSET_CREATE,
    payload: {
        name: productSet.name,
        category: productSet.category || 'first_category',
        layout_id_list: productSet.products.map( ( p ) => p.id ),
        preview_from: productSet.previewFrom || productSet.products[ 0 ].id,
        actions: {
            inSuccess: ( { response } ) => {
                callback && callback( response && response.productSetId );
                // callback && callback(response.productSetId);
                toast.success( `Продукт ${ productSet.name } создан` );
                return { type: MY_SHOP_CLEAR_DATA }
            },
            inFail: ( err ) => {
                callback && callback();
                toast.error( 'Ошибка создания продукта' );
                return { type: MY_SHOP_CLEAR_DATA }

                // return { type: MY_SHOP_SET_PRODUCTSET, payload: {error: err} }
            }
        }
    }
} );

/**
 * Обновить коллекцию
 */
export const updateProductSetAction = ( productSet, callback ) => dispatch( {
    type: MY_SHOP_PRODUCTSET_UPDATE,
    payload: {
        urlParams: [ productSet.id ],
        name: productSet.name,
        category: productSet.category || 'first_category',
        layout_id_list: productSet.products.map( ( p ) => p.id ),
        preview_from: productSet.previewFrom || productSet.products[ 0 ].id,
        actions: {
            inSuccess: ( { response } ) => {
                callback && callback( productSet.id );
                toast.success( `Продукт ${ productSet.name } изменён` );
                return { type: MY_SHOP_CLEAR_DATA }
            },
            inFail: ( err ) => {
                callback && callback();
                toast.error( 'Ошибка изменения продукта' );
                return { type: MY_SHOP_CLEAR_DATA }
            }
        }
    }
} );

/**
 * Удалить коллекцию
 */
export const deleteProductSetAction = ( id, callback ) => dispatch( {
    type: MY_SHOP_PRODUCTSET_DELETE,
    payload: {
        urlParams: [ id ],
        actions: {
            inSuccess: ( { response } ) => {
                callback && callback();
                toast.success( `Продукт удален` );
                return { type: MY_SHOP_CLEAR_DATA }
            },
            inFail: ( err ) => {
                callback && callback();
                toast.error( 'Ошибка удаления продукта' );
                return { type: MY_SHOP_CLEAR_DATA }
            }
        }
    }
} );

/**
 * Поменять статус коллекции
 */
export const changeStatusProductSetAction = ( id, status, callback ) => dispatch( {
    type: MY_SHOP_PRODUCTSET_CHANGE_STATUS,
    payload: {
        urlParams: [ id, 'change_status' ],
        status: status || 'published',
        actions: {
            inSuccess: ( { response } ) => {
                callback && callback( id );
                toast.success( status === 'published' ? 'Продукт опубликован' : 'Продукт снят с публикации' );
                return { type: ALL_SHOP_CLEAR_DATA }
            },
            inFail: ( err ) => {
                callback && callback();
                toast.error( 'Ошибка изменения статуса продукта' );
                return { type: MY_SHOP_CLEAR_DATA }
            }
        }
    }
} );


/**
 * Получение категорий
 */
export const getProductSetCategoriesAction = () => dispatch( {
    type: SHOP_GET_PRODUCTSET_CATEGORIES,
    payload: {
        actions: {
            inSuccess: ( { response } ) => {
                return { type: SHOP_SET_PRODUCTSET_CATEGORIES, payload: response }
            },
            inFail: ( err ) => {
                return { type: SHOP_SET_PRODUCTSET_CATEGORIES, payload: { error: err } }
            }
        }
    }
} );
