import React, { memo, useCallback, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { generatePath } from 'react-router';
import { useSelector } from "react-redux";

import Preview from './_Preview';
import { Btn } from 'components/_forms';

import Select from 'components/_forms/Select';
import Tooltip from "components/_forms/Tooltip";

import LINKS_MAIN from 'config/links';
import ProductName from './_ProductName';
import { ResizeContext } from 'contexts/resizeContext';
import Spinner from 'components/Spinner';

import s from './MyProductsPage.scss';
import { IconEdit, IconMoreVert } from 'components/Icons';
import TEXT_PRODUCT from 'texts/product';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import TEXT from 'texts/main';
import lexem from 'libs/lexems';
import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART } from 'const/myProducts';

import {
    numberToMoneyFormat,
    isPoster,
    isPhoto,
    isCanvas,
    productGetPrefix,
    productGetName,
    isCalendar,
    isPuzzle
} from 'libs/helpers';
import { store } from "components/App";

import { PRODUCT_STATUS_COMPLETED, PRODUCT_STATUS_IN_SHOP, PRODUCT_STATUS_OPEN } from 'const/myProducts';

import LINKS from "config/links";
import { createOrder, deletePoster, restorePoster, clonePoster, renameProduct } from "server/commands/postersCommand";
import { MY_PRODUCTS_SET_DELIVERY_BOX_SIZE } from "const/actionTypes";


// @ts-ignore
import {sendMetric, METRICS} from '__TS/libs/metrics'
import { urlParamsToString } from "__TS/libs/tools";
import { userRoleIsAdmin } from "__TS/selectors/user";


let yaMetric = null;
//если server рендер, не подключаем yandexEcommerce
if ( !process.env.server_render ) {
    yaMetric = import('libs/yandexEcommerce');
}

//import { YaMetric_AddToCart, YaMetric_RemoveFromCart } from 'libs/yandexEcommerce';
//import { MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED } from "../../../const/actionTypes";
//import { layoutParamsToProductsPosters } from "../../../libs/layout";
//import { FullScreenLoaderAction } from "../../FullScreenLoader/actions";

const productStatusMap = {           //названия и иконки статусов заказа
    // [PRODUCT_STATUS_INORDER]: {
    //     title: TEXT_MY_PRODUCTS.PRODUCT_STATUS_INORDER,
    //     className: s.statusInorder
    // },
    [ PRODUCT_STATUS_COMPLETED ]: {
        title: TEXT_MY_PRODUCTS.PRODUCT_STATUS_COMPLETED,
        className: s.statusCompleted
    },
    [ PRODUCT_STATUS_OPEN ]: {
        title: TEXT_MY_PRODUCTS.PRODUCT_STATUS_OPEN,
        className: ''
    },
    [ PRODUCT_STATUS_IN_SHOP ]: {
        title: TEXT_MY_PRODUCTS.PRODUCT_STATUS_IN_SHOP,
        className: s.statusReadonly
    }
};

/**
 * Функция создания данных продукта исходя из его типа
 */
const makeProductData = ( { thisIsNewProduct, isAdmin,
                            product, type, makeOrderAction, makeCopyAction, editProductAction, deleteProductAction, recoverProductAction,
                            removeFromCartAction, linkToNew, toggleLoader, goToCart, productSlug, clearCartAction, history
                          } ) => {
    let actions = [],
        formatValue = '',
        coverTextValue = '',
        cost = null,
        info = [],
        status = null,
        readOnly = false;

    //console.log( 'product ZZe', JSON.parse( JSON.stringify( (product) ) ) );

    // Формирование статуса продукта
    if ( thisIsNewProduct && type !== MY_PRODUCTS_CART ) {
        if ( product.isCompleted ) {
            status = productStatusMap[ PRODUCT_STATUS_COMPLETED ];
        } else {
            status = productStatusMap[ PRODUCT_STATUS_OPEN ];
        }
    } else if ( product.info ) {
            status = productStatusMap[ product.info.status ];
    }
    if (product.layout && product.layout.sellStruct && product.layout.sellStruct.readOnly) {
        status = productStatusMap[PRODUCT_STATUS_IN_SHOP];
        readOnly = true;
    }

    // Если не приходит formatName (legasy), то считаем из formatWidth и formatHeight
    if ( thisIsNewProduct ) {
        const { name, width, height } = product.layout && product.layout.format || product.format;
        formatValue = `${name} (${width}мм x ${height}мм)`;
    } else if ( product.info ) {
        if ( product.info.formatName ) {
            formatValue = product.info.formatName
        } else if ( product.info.formatWidth && product.info.formatHeight ) {
            formatValue = `${[product.info.formatWidth, product.info.formatHeight].join( 'x' )} ${TEXT.VALUE_SM}`;
        }
    }

    // Название типа переплета и ламинации или типа продукта
    let priceByOptions = 0;
    if ( thisIsNewProduct ) {
        if (product.productSlug) {
            info.push( { label: TEXT_PRODUCT.PRODUCT_TYPE, value: productGetName( product.productSlug ) } );
        }


        (product.layout && product.layout.options || product.options).map( ( option ) => {
            if ( option.price ) {

                //собираем стоимость опций, это и будет стоимость постера (используется ниже в коде)
                priceByOptions += option.price;

                info.push( {
                               label: option.name,
                               value: option.nameSelected || option.nameSelected
                           } );
            }
        } );
    } else {
        coverTextValue = product.info && product.info.coverType && lexem( 'photobook_type', product.info.coverType, product.info.bindingType );
        if ( coverTextValue ) coverTextValue += (product.info.lamination ? ` (${lexem( 'COVER', product.info.lamination.toUpperCase() )})` : '');
        info.push( { value: coverTextValue } );
    }

    // Формирование данных информации о продукте
    info.push( { label: TEXT_PRODUCT.FORMAT, value: formatValue } );
    product.info && product.info.pages && info.push( ...(product.info.pages && [{
        label: TEXT_PRODUCT.PAGES_QUANTITY,
        value: product.info.pages
    }] || []) );

    //выставляем цену
    let price = 0;
    if ( product.info && product.info.price ) {
        price = product.info.price;
    } else if ( priceByOptions ) {
        price = priceByOptions;
    }

    //добавляем информацию о теме
    if (product.theme && product.theme.name) info.push( { label: TEXT_PRODUCT.THEME, value: product.theme.name } );

    //добавляем информацию о цене
    info.push( { label: TEXT_PRODUCT.PRICE, value: `${price} ${TEXT.VALUE_RUB}` } );

    //добавляем информацию о дате заказа
    info.push( {
                   label: (type === MY_PRODUCTS_INORDER ? TEXT_MY_PRODUCTS.ORDERED : TEXT_PRODUCT.CHANGED_DATE),
                   value: product.info && product.info.changed || product.updated
               } );

    //получаем id постера, в зависимости от раздела, id лежит в разной структуре
    const posterId = product.layout && product.layout.id || product.id;

    // Если заказ готов, то его можно в корзину
    let cantOrder = product.levelError ||
                    product.layout && product.layout.levelError ||
                    product.info && product.info.status !== PRODUCT_STATUS_COMPLETED;

    if ( !cantOrder ) {
        if ( thisIsNewProduct ) {
            if ( !product.isCompleted ) {
                cantOrder = true;
            }
        }
    }

    // Формирование данных для кнопок продукта
    switch ( type ) {
        case MY_PRODUCTS_NEW:
            actions = [
                ...(!cantOrder && !readOnly) ? [{
                    title: TEXT_MY_PRODUCTS.MAKE_ORDER,
                    action: () => {
                        toggleLoader( true );
                        if ( thisIsNewProduct ) {
                            if ( isCalendar(product.productSlug) ) sendMetric(METRICS.ORDER_CALENDAR);

                            createOrder( posterId, null, null, goToCart ).then( () => {
                                toggleLoader( false );
                                clearCartAction();
                            } ).catch( ( e ) => {
                                toggleLoader( false );
                                clearCartAction();
                            });

                        } else {
                            makeOrderAction( {
                                                 id: product.id,
                                                 hash: product.hash,
                                                 callback: () => toggleLoader( false ),
                                                 goToCart: goToCart
                                             } );
                        }
                        /*
                        YaMetric_AddToCart({
                                               id: product.id,
                                               bindingType: product.info.bindingType,
                                               coverType: product.info.coverType,
                                               coverLaminationType: product.info.lamination || 'glance',
                                               format: product.info.formatName.replace('см', '').trim().replace('х','x'),
                                               price: product.info.price
                                           });
                         */
                    },
                    closeModal: true,
                    className: 'warning'
                }] : [],
                ...(!readOnly && [{
                    title: TEXT_MY_PRODUCTS.EDIT,
                    action: () => {
                        if ( thisIsNewProduct ) {
                            history.push( generatePath( LINKS.EDIT, {
                                    productId: product.layout && product.layout.id || product.id,
                                    themeParams: isAdmin && urlParamsToString({
                                        isNewProduct: true
                                    })
                                }
                            ) );
                        } else {
                            editProductAction( product.hash );
                        }
                    },
                    closeModal: true,
                }] || []),
                {
                    title: TEXT_MY_PRODUCTS.MAKE_COPY,
                    action: () => {
                        toggleLoader( true );
                        if ( thisIsNewProduct ) {
                            clonePoster( posterId ).then( () => {
                                toggleLoader( false );
                                linkToNew();
                            } ).catch( ( e ) => {
                                toggleLoader( false );
                                linkToNew();
                            } );
                        } else {
                            makeCopyAction( product.id, product.name )
                        }
                    },
                    closeModal: true,
                },
                {
                    title: TEXT_MY_PRODUCTS.DELETE,
                    action: () => {
                        toggleLoader( true );
                        if ( thisIsNewProduct ) {
                            deletePoster( posterId ).then( () => {
                                toggleLoader( false );
                            } ).catch((e)=>{
                                toggleLoader( false );
                            } );
                        } else {
                            deleteProductAction( product.id )
                        }
                    },
                    closeModal: true,
                    className: 'danger'
                },
            ];
            break;
        case MY_PRODUCTS_INORDER:
            actions = readOnly ? [] : [
                // {
                //     title: TEXT_MY_PRODUCTS.MAKE_REORDER,
                //     action: () => reOrderAction( product.id, product.name ),
                //     className: s.intentWarning
                // },
                {
                    title: TEXT_MY_PRODUCTS.MAKE_COPY,
                    action: () => {
                        toggleLoader( true );
                        if ( thisIsNewProduct ) {
                            clonePoster( posterId ).then( () => {
                                toggleLoader( false );
                                linkToNew();
                            } ).catch(( err )=>{
                                toggleLoader( false );
                                linkToNew();
                                console.error( err );
                            });
                        } else {
                            makeCopyAction( product.layoutId, product.name, linkToNew );
                        }
                    },
                    closeModal: true,
                }
            ];
            break;
        case MY_PRODUCTS_DELETED:
            actions = [
                {
                    title: TEXT_MY_PRODUCTS.RECOVER,
                    action: () => {
                        toggleLoader( true );

                        if ( thisIsNewProduct ) {
                            restorePoster( posterId ).then( () => {
                                toggleLoader( false );
                            } ).catch( ( e ) => {
                                toggleLoader( false );
                            });
                        } else {
                            recoverProductAction( product.id )
                        }

                    },
                    closeModal: true,
                }
            ];
            break;
        case MY_PRODUCTS_CART:
            actions = [
                ...(!readOnly && [{
                    title: TEXT_MY_PRODUCTS.EDIT,
                    action: () => {
                        toggleLoader( true );
                        console.log( 'АДАМ =>>> запрашиваем удаление продукта из корзины по id', product.id );
                        console.log( 'productSlug', productSlug );
                        removeFromCartAction( product.id, () => {
                            if ( thisIsNewProduct ) {
                                console.log( 'АДАМ =>>> проодукт удален из корзины, перенаправляем в редатор по id: ', product.layout.id );
                                history.push( generatePath( LINKS.EDIT, {
                                        productId: product.layout && product.layout.id,
                                        themeParams: isAdmin && urlParamsToString({
                                            isNewProduct: true
                                        })
                                    }
                                ) );
                            } else {
                                editProductAction( product.hash );
                            }
                        } );
                    },
                    closeModal: true,
                }] || []),
                {
                    title: TEXT_MY_PRODUCTS.REMOVE_FROM_ORDER,
                    action: () => {
                        toggleLoader( true );
                        removeFromCartAction( product.id, ( deliveryBoxData ) => {

                            //обновляем параметры упакеовки и веса в redux
                            store.dispatch( {
                                                type: MY_PRODUCTS_SET_DELIVERY_BOX_SIZE,
                                                payload: deliveryBoxData
                                            } );
                            /*
                            YaMetric_RemoveFromCart({
                                                        id: product.layoutId,
                                                        bindingType: product.info.bindingType,
                                                        coverType: product.info.coverType,
                                                        coverLaminationType: product.info.lamination || 'glance',
                                                        format: product.info.formatName.replace('см', '').trim().replace('х','x'),
                                                        price: product.info.price,
                                                    });

                             */
                        } );
                    },
                    closeModal: true,
                    className: 'danger'
                }
            ];
            break;
    }

    //считаем цену, скидку по биглиону и промокоду
    if ( product.cost ) {
        if ( product.discountFixed ) {
            cost = {
                discountFixed: product.discountFixed,
                oldPrice: product.cost,
                price: product.cost - product.discountFixed
            }
        } else if ( product.pageDiscount ) {
            cost = {
                pageDiscount: product.pageDiscount,
                oldPrice: product.cost,
                price: parseInt( product.cost ) - product.pageDiscount
            }
        } else if ( product.discountGiftCard ) {
            cost = {
                discountGiftCard: product.discountGiftCard,
                oldPrice: product.cost,
                price: parseInt(product.cost) - product.discountGiftCard
            }
        } else if ( product.biglionDiscount ) {
            const costOne = product.cost / product.count,
                disc = product.biglionDiscount > costOne ? costOne : product.biglionDiscount;
            cost = {
                biglionDiscount: disc,
                oldPrice: product.cost,
                price: product.cost - disc
            }
        } else if ( product.discount ) {
            cost = {
                discount: product.discount,
                oldPrice: product.cost,
                price: product.cost * ((100 - product.discount) / 100)
            }
        } else {
            cost = { price: product.cost };
        }
    }


    return {
        actions: actions,
        info: info,
        cost: cost,
        status: status,
        canOrder: !cantOrder,
        readOnly: readOnly,
    };
};

/**
 * Элемент конечной цены продукта/заказа
 */
const ProductCost = memo(( { cost } ) => {
    if ( !cost ) return null;
    let discount = null;

    if ( cost.discountFixed )    discount = <span className={s.productCostDiscount}>Промокод: -{cost.discountFixed} {TEXT.VALUE_RUB}</span>;
    if ( cost.discountGiftCard ) discount = <span className={s.productCostDiscount}>-{cost.discountGiftCard} {TEXT.VALUE_RUB}</span>;
    if ( cost.pageDiscount )     discount = <span className={s.productCostDiscount}>-{cost.pageDiscount} {TEXT.VALUE_RUB}</span>;
    if ( cost.biglionDiscount )  discount = <span className={s.productCostDiscount}>Biglion: -{cost.biglionDiscount} {TEXT.VALUE_RUB}</span>;
    if ( cost.discount )         discount = <span className={s.productCostDiscount}>Промокод: -{cost.discount}&#37;</span>;

    if ( discount ) {
        return (
            <div className={s.productValue}>
                <span className={s.productCostOld}>{numberToMoneyFormat(cost.oldPrice)} {TEXT.VALUE_RUB}</span>
                {discount}
                <span className={s.productCostTotal}>{numberToMoneyFormat(cost.price)} {TEXT.VALUE_RUB}</span>
            </div>
        )
    } else {
        return <div className={s.productValue}>{numberToMoneyFormat(cost.price)} {TEXT.VALUE_RUB}</div>;
    }
});


/**
 * Элемент блока информации о продукте
 */
const ProductInfoItem = memo(( { label, value } ) => {
    if (label === 'paper') {
        label = 'Бумага';
    } else if (label === 'LAMINATION') label = 'Ламинация';
    return (
        <div className={s.productInfoItem}>
            {label && <span className={s.productInfoLabel}>{label}:&nbsp;</span>}
            {value && <span className={s.productInfoValue}>{value}</span>}
        </div>
    );
});


/**
 * Кнопки действий продуктов
 */
const ProductActions = ({ data, mobile }) => {

    if ( !data ) return null;

    const ProductActions = ({inMenu}) => {
        return (
            <div className={s.productActions + (inMenu ? ` ${s.inMenu}`:'')}>
                {data.map( ( item, key ) => {
                    if ( !item.title ) return null;
                    const className = s.productActionBtn + (item.className ? ` ${item.className}` : '');
                    return (
                        <Btn className={className} intent={"minimal"} small key={key} onClick={item.action}>
                            {item.title}
                        </Btn>);
                } )}
            </div>
        );
    };

    if (mobile) {
        return (
            <Tooltip className={s.productActionsToggleBtn} tooltip={<ProductActions inMenu />} trigger="click" placement="bottom" intent="minimal">
                <Btn>
                    <IconMoreVert/>
                </Btn>
            </Tooltip>
        );
    } else return <ProductActions/>
};

const countsList = Array.from( Array( 100 ), ( _, x ) => x + 1 );


/**
 * Продукт (Заказ)
 */
const Product = (props) => {
    const isAdmin = useSelector( userRoleIsAdmin );

    const [ loading, setLoading] = useState(false);
    const [ productData, setProductData] = useState(null);
    // const [ thumbText, setThumbText ] = useState('');

    const toggleLoader = useCallback(( value ) => {
        setLoading( value );
    },[]);

    const handleNameChange = useCallback(( value, productSlug ) => {
        if ( isPoster( productSlug ) || isPhoto( productSlug ) || isCanvas( productSlug ) || isPuzzle( productSlug ) ) {
            renameProduct(props.data.id, value);
        } else props.changeNameAction( props.data.id, value );
    },[props.data && props.data.id]);

    const handlerSelectCount = ( count ) => {
        if ( (count + 1) === product.count ) return null;
        props.changeCountAction( props.data.id, count + 1 );
    };

    const { data: product, type, orderId, history } = props;
    const productSlug = product.layout && product.layout.productSlug || product.productSlug || 'album_old';
    const thisIsPoster = isPoster( productSlug );
    const thisIsPhoto  = isPhoto( productSlug );
    const thisIsCanvas = isCanvas( productSlug );
    const thisIsCalendar = isCalendar( productSlug );
    const thisIsPuzzle = isPuzzle( productSlug );
    const productTypeName = productGetName( productSlug );
    const thisIsNewProduct = thisIsPoster || thisIsPhoto || thisIsCanvas || thisIsCalendar || thisIsPuzzle;


    useEffect(() => {
        setProductData(makeProductData( {
            product,
            type,
            productSlug,
            history,
            thisIsNewProduct,
            clearCartAction: props.clearCartAction,
            makeOrderAction: props.makeOrderAction,
            makeCopyAction: props.makeCopyAction,
            editProductAction: props.editProductAction,
            deleteProductAction: props.deleteProductAction,
            recoverProductAction: props.recoverProductAction,
            reOrderAction: props.reOrderAction,
            removeFromCartAction: props.removeFromCartAction,
            linkToNew: () => {history.push( LINKS_MAIN.MY_PRODUCTS.replace(':tab',MY_PRODUCTS_NEW))},
            goToCart: () => {history.push( LINKS_MAIN.MY_PRODUCTS.replace(':tab',MY_PRODUCTS_CART))},
            toggleLoader: toggleLoader,
            isAdmin: isAdmin,
        } ));
    }, [ toggleLoader, props, product, type, productSlug, history, thisIsNewProduct ]);

    // useEffect(() => {
    //     setThumbText(
    //         thisIsPoster ? TEXT_MY_PRODUCTS.VIEW_POSTER
    //             : thisIsPhoto ? TEXT_MY_PRODUCTS.VIEW_PHOTO
    //             : thisIsCanvas ? TEXT_MY_PRODUCTS.VIEW_CANVAS
    //             : thisIsCalendar ? TEXT_MY_PRODUCTS.VIEW_CALENDAR
    //             : TEXT_MY_PRODUCTS.VIEW_ALBUM
    //     )
    // }, [ thisIsPoster, thisIsPhoto, thisIsCanvas, thisIsCalendar ]);

    //TODO: если вертикальная ориентация, то ограничиваем размер отображения по ширине
    let width = null;
    let height = null;
    if ( product.formatId === 4 ) {
        width = { width: 100, margin: '0 25px 0' };
        height = { minHeight: 180 }
    }

    const productName = product.userTitle || product.name || product.layout && product.layout.userTitle;

    // Показать продукт в модалке
    const showPreviewHandler = useCallback(() => {

        props.modalPreviewAlbumAction({
            getLayoutById: true,
            // getLayoutById: thisIsCalendar && !!product.layout.id, // Запросить в модалке весь layout со всеми страницами
            name: product.userTitle || product.name || product.layout && product.layout.userTitle,
            id: product.layoutId || product.layout && product.layout.id || product.id,
            svgPreview: product.layout ? ( product.layout.previewList && product.previewList[0] || product.layout.preview ) : product.previewList && product.previewList[0] || product.preview || null,
            actions: productData.actions,
            isNew: thisIsNewProduct,
            productSlug: product.layout ? product.layout.productSlug : product.productSlug,
            productTypeName: productTypeName,
            formatWidth: product.layout ? product.layout.format && product.layout.format.width : product.format && product.format.width,
            formatHeight: product.layout ? product.layout.format && product.layout.format.height : product.format && product.format.height,
        });
    }, [ product, productData && productData.actions, productTypeName ]);

    if ( !productData ) return null;
    
    return (
        <div className={s.product}>
            <div className={s.productThumbWrap} style={height} onClick={showPreviewHandler}>
                <div className={s.productThumb} style={width}>
                    <Preview product={product && product.layout || product}
                             thisIsNewProduct={thisIsNewProduct} />
                </div>
                <div className={s.productThumbText}>
                    Просмотр
                </div>
            </div>
            <div className={s.productInfoWrap}>

                <ProductName editable={type === MY_PRODUCTS_NEW && !productData.readOnly}
                             orderId={orderId}
                             id={product.id}
                             prefix={productGetPrefix( productSlug )}
                             type={productSlug}
                             productName={productTypeName}
                             name={productName}
                             status={product.status}
                             onChange={(value)=>handleNameChange(value,productSlug)} />

                <div className={s.productInfo}>
                    {Object.keys( productData.info ).map( ( prop, key ) => <ProductInfoItem
                        label={productData.info[prop].label}
                        value={productData.info[prop].value}
                        key={key}/>
                    )}
                    {productData.status && productData.canOrder &&
                        <div className={s.productInfoItem}>
                            <span className={s.productInfoLabel}>{TEXT_MY_PRODUCTS.STATUS}:&nbsp;</span>
                            <span className={`${s.productInfoValue} ${productData.status.className}`}>{productData.status.title}</span>
                        </div>
                    }
                </div>

                {(type === MY_PRODUCTS_INORDER || type === MY_PRODUCTS_CART) &&
                <>
                    <div className={s.productCount}>
                        <div className={s.productLabel}>{TEXT_MY_PRODUCTS.COUNT}:</div>
                            {type === MY_PRODUCTS_CART &&   // В корзине тираж выбирается

                            <Select className={s.productCountSelect}
                                    list={countsList.map( ( item ) => ({ id: item, name: item }) )}
                                    onSelect={handlerSelectCount}
                                    selected={product.count - 1}/>}

                            {type !== MY_PRODUCTS_CART &&   // В заказах тираж статичен
                            <div className={s.productValue}>{product.count}</div>}
                    </div>
                    <div className={s.productCost}>
                        <div className={s.productLabel}>{TEXT_PRODUCT.PRICE}:</div>
                        <ProductCost cost={productData.cost} />
                    </div>
                </>}

                {(type === MY_PRODUCTS_CART || type === MY_PRODUCTS_NEW) && (product.errors || product.layout && product.layout.errors) &&
                <div>
                    {(product.layout ? product.layout.errors : product.errors).map( ( e, i ) => {
                        const classDecoration = (e.level === 'error' ? s.productError : s.productInfo);
                        return <div key={e.text + i} className={classDecoration}>{e.text}</div>;
                    } )}
                </div>}
            </div>
            <ResizeContext.Consumer>
                {( { media } ) => (
                    <ProductActions data={productData.actions} mobile={(media === 'xs' || media === 'sm')}/>
                )}
            </ResizeContext.Consumer>

            <div className={s.productSpinner + (loading ? ` ${s.show}` : '')}>
                { loading ? <Spinner size={50} /> : null}
            </div>

        </div>);
}

export default withRouter( Product );