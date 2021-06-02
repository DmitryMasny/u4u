import {
    MY_PRODUCTS_NEW,
    MY_PRODUCTS_INORDER,
    MY_PRODUCTS_DELETED,
    MY_PRODUCTS_CART,
    ORDER_STATUS_CART,
    PRODUCT_STATUS_INORDER,
    MY_DELIVERY_PICKUP,
    MY_DELIVERY_DDELIVERY,
    DDELIVERY_TYPE_PVZ,
    DDELIVERY_TYPE_COURIER,
    DDELIVERY_TYPE_POCHTA,
    DELIVERY_COMPANIES
} from 'const/myProducts';

import { timeConverter } from 'libs/converters'
import {PRODUCT_STATUS_COMPLETED, PRODUCT_STATUS_OPEN, PRODUCT_STATUS_IN_WORK } from 'const/myProducts';

/**
 конвертируем массив продуктов и заказов с сервера (legacy)
 [
 {id: 'INDEX', path: '/abc/',  component: ..., exact: ..., ext: true},
 {id: 'INFO',  path: '/info/', component: ..., exact: ...}
 ]
 в нужный вид:
 {
        INDEX: {path: '/abc/', ext: true},
        INFO: {path: '/info/', ext: false}
    }

 **/

// Формирование заказов
export const myOrdersConverter = ( ordersArray ) => {
    let inOrder = [],
        cart = [],
        delO = {};

    if ( ordersArray && ordersArray.length > 0 ) {
        for ( let i = 0; i < ordersArray.length; i++ ) {

            const { id, status, totalCost, created, delivery, deliveryBoxSize, orders } = ordersArray[ i ];

            //если нет заказов, или не массив или пустой массив, переходим на следующую итерацию цикла
            if ( !orders || !Array.isArray( orders ) || !orders.length ) continue;

            const item = {
                id: id,
                status,
                totalCost,
                //imgUrl: 'https://u4u.ru/media/prodprev/3316/5_02c54ee6-ac61-439b-a0d6-ba5919806acf.jpg', //TODO: тут все сложней,
                created: timeConverter( created ),
                orders: ordersConverter( orders ),
            };

            if ( !cart.length && (status === ORDER_STATUS_CART) ) {
                cart = item;
                delO = { boxSize: deliveryBoxSize };

                /*
                if ( delivery ) delO = {
                    address: delivery.address,
                    companyInfo: delivery.company_info,
                    id: delivery.id,
                    type: getDeliveryTypeForTab( delivery.delivery_type ),
                    date: delivery.date,
                    name: delivery.name || '',
                    surname: delivery.surname || '',
                    fathername: delivery.fathername || '',
                    email: delivery.email || '',
                    phone: delivery.phone || '',
                    comment: delivery.comment || '',
                    price: delivery.price,
                    // trackNumber: delivery.track_number,
                    boxSize: delivery_box_size
                };*/
            } else {
                if ( delivery ) {
                    item.delivery = {
                        address: delivery.address,
                        companyInfo: delivery.companyInfo,
                        id: delivery.id,
                        deliveryType: delivery.deliveryType,
                        date: delivery.date,
                        // name: delivery.name,
                        // surname: delivery.surname,
                        // fathername: delivery.fathername,
                        // email: delivery.email,
                        // phone: delivery.phone,
                        // comment: delivery.comment,
                        price: delivery.price,
                        trackNumber: delivery.trackNumber,
                    };

                    if ( delivery.companyInfo && delivery.companyInfo.deliveryCompanyId ) item.delivery.companyUrl = getCompanyUrl( delivery.companyInfo.deliveryCompanyId, delivery.trackNumber );
                    //delO = { boxSize: delivery_box_size };
                    inOrder.push( item );
                }
            }
        }
    }

    //удаляем данные о скидках из корзины, если уже приходят с сервера (они не нужны)
    if (cart && cart.orders) {
        cart.orders = cart.orders.map((item) => {
            item.biglionDiscount = null;
            item.discount = null;
            return item;
        });
    }

    return { orders: inOrder, cart: cart, delivery: delO };
};

// Формирование продуктов
export const myProductsConverter = ( productsArray ) => {
    if ( !productsArray || !productsArray.layouts || !productsArray.layouts.length ) return null;

    let products = [];

    for ( let i = 0; i < productsArray.layouts.length; i++ ) {

        const { id, hash, fmt, name, coverType, bindingType, formatName, numPages, priceInfo, changed, status, pages, coverLaminationTypes } = productsArray.layouts[ i ];
            if (status === PRODUCT_STATUS_COMPLETED || status === PRODUCT_STATUS_OPEN || status === PRODUCT_STATUS_IN_WORK){
                products.push( {
                    random: Math.random(),
                    id: id,
                    hash: hash,
                    formatId: fmt,
                    previewCover: pages && pages[ 0 ] || null,
                    //imgUrl: 'https://u4u.ru/media/prodprev/3316/5_02c54ee6-ac61-439b-a0d6-ba5919806acf.jpg', //TODO: тут все сложней
                    name: name,
                    info: {
                        coverType: coverType && coverTypeConverter( coverType ),
                        bindingType: bindingType,
                        formatName: formatName,
                        lamination: coverLaminationTypes,
                        // formatWidth: 30, // Если есть format_name то не используются
                        // formatHeight: 30,
                        pages: numPages,
                        price: priceInfo.totalCost,
                        changed: timeConverter( changed ),
                        status: status,
                    }
                } );
            }
        }

    //
    //  TODO: Poster test data
    //
    // products.unshift( {
    //     random: Math.random(),
    //     id: 'id324y358743',
    //     type: 'poster',
    //     hash: 'hash',
    //     imgUrl: 'https://lh3.googleusercontent.com/QXIy4rDi0u-q3Gz8vSEAZycfSGYT3wz2U10MDQmm-YQ8xiWQE_eiX0gApxvjiqE2NN-B046SZ7JtnxFQ2eMG5gQJ',
    //     imgPosition: {x: -.6, y:0, w:2.1, h:1.12},
    //     name: 'Пример постера',
    //     info: {
    //         lamination: 'mat',
    //         formatWidth: 40, // Если есть format_name то не используются
    //         formatHeight: 60,
    //         price: 555,
    //         changed: '03.01.2020',
    //         status: "OPEN",
    //     }
    // } );

    return products;
};

// Формирование изменения тиража в корзине
export const myCartCountDataConverter = ( order ) => {
    if ( !order ) return null;

    return {
        order: {
            id: order.id,
            cost: order.cost,
            count: order.count,
            //discount: order.discount,
            deliveryBoxSize: order.deliveryBoxSize
        },
        totalCost: order.totalCost
    };
};

// Формирование позиции заказа
const ordersConverter = ( ordersArray ) => {
    if ( !ordersArray || ordersArray.length < 1 ) return null;
    let orders = [];
    for ( let i = 0; i < ordersArray.length; i++ ) {
        const order = ordersArray[ i ];
        //console.log('order ' + i + ': ', order);
        const orderObj = {
            id: order.id,
            hash: order.hash,
            formatId: order.fmt || 0,
            layoutId: order.layoutId,
            name: order.layoutName,
            previewCover: order.cover && order.cover || null,
            //imgUrl: 'https://u4u.ru/media/prodprev/3316/5_02c54ee6-ac61-439b-a0d6-ba5919806acf.jpg',
            count: order.count,
            ...order.discount && { discount: order.discount },
            cost: order.cost,
            // status: order.status,
            info: {
                coverType: order.coverType && coverTypeConverter( order.coverType ),
                bindingType: order.bindingType,
                formatName: order.formatName,
                lamination: order.coverLaminationTypes,
                // formatWidth: 30, // Если есть format_name то не используются
                // formatHeight: 30,
                pages: order.numPages,
                price: order.price,
                changed: timeConverter( order.changed )
            }
        };

        if ( order.layout ) orderObj.layout = order.layout;

        //устанавливаем скидки для промокода и биглиона
        switch ( order.discountType ) {
            case 'u4u_page_discount':
                orderObj.pageDiscount = order.discount;
                break;
            case 'biglion_coupon':
                orderObj.biglionDiscount = order.discount;//order.coupon_discount_sum;
                break;
            case 'u4u_promo_fixed':
                orderObj.discountFixed = order.discount;
                break;
            case 'u4u_gift_card':
                orderObj.discountGiftCard = order.discount;
                break;
            case 'u4u_promo':
                orderObj.discount = order.discount;
                break;
            default:
                break;
        }

        orders.push( orderObj );
    }

    //console.log('orders', orders);
    return orders;
};

// Конвертирование данных с виджета ddelivery для отправки на сервер
export const ddeliveryDataConverter = ( { city = {}, contacts = {}, delivery, deliveryDate, id } ) => {

    let o = {};

    console.log(' delivery.deliveryCompanyName,',  delivery.deliveryCompanyName);

    switch ( parseInt( delivery.type ) ) {

        //Пункт выдачи заказов
        case 1:
            let point = delivery.point;
            // $scope.deliveryAddressType = 'Выбрана точка самовывоза: ';
            // $scope.deliveryAddress = '"' + point.delivery_company_name + '" по адресу: ' + data.city.name + ' ' + point.address;
            // $scope.deliveryAddressDescription = point.description;
            o = {
                id: id,
                deliveryPointId: point.id,
                address: city.name + ', ' + point.address,
                price: delivery.totalPrice,    //цена доставки в пункт самовывоза
                deliveryCompanyId: delivery.deliveryCompanyId,//комания доставки
                toCityFias: city.fias,   //fias города
                toCityKladr: city.kladr, //kladr города
                companyInfo: {
                    ...point,
                    deliveryCompanyId: delivery.deliveryCompanyId,//комания доставки
                    name : delivery.deliveryCompanyName,
                    // description_in: point.description,
                    //toCityId: city.fias,   //id города TODO: (передаем fias города)
                    toCityFias: city.fias,   //fias города
                    toCityKladr: city.kladr, //kladr города
                    city: city.name,
                }
            };
            break;

        //Курьерская доставка
        case 2:
        //Доставка почтой
        case 3:
            var address =  contacts.address,
                addressFull = [city.name, address.street, address.building, address.apartment].join( ', ' );

            o = {
                id: id,
                address: addressFull,                 //полный адресс
                toPostalCode: address.index || "",    //индекс
                toStreet: address.street  || "",      //улица
                toHouse: address.building || "",      //дом
                toFlat: address.apartment || "",      //квартира
                toCityFias: city.fias,      //передаем fias города,
                toCityKladr: city.kladr,    //передаем kladr города,
                cityName: city.name,        //наименование города
                price: delivery.totalPrice, //цена доставки
                deliveryCompanyId: delivery.deliveryCompanyId,//комания доставки
                pickupCompanyId: delivery.pickupCompanyId, //компания забора
                companyInfo: {
                    ...delivery,    // TODO: Избыточные данные
                    toCityFias: city.fias,
                    toCityKladr: city.kladr,
                    toStreet: address.street  || "",
                    toHouse: address.building || "",
                    toFlat: address.apartment || "",
                    city: city.name || ""
                }
            };

            break;
    }

    const deliveryTypeMap = {
        '1': DDELIVERY_TYPE_PVZ,
        '2': DDELIVERY_TYPE_COURIER,
        '3': DDELIVERY_TYPE_POCHTA,
    };

    o = {
        ...o,
        deliveryType: deliveryTypeMap[ delivery.type ],
        sessionId: id
    };

    return o;
};

// Формирование правильного типа обложки
const coverTypeConverter = ( coverType ) => (coverType.split( '_' )[ 0 ].toLowerCase());

// Формирование правильного типа доставки для таба
const getDeliveryTypeForTab = ( type ) => {
    if ( [DDELIVERY_TYPE_PVZ, DDELIVERY_TYPE_COURIER, DDELIVERY_TYPE_POCHTA].some( x => x === type ) ) {
        return MY_DELIVERY_DDELIVERY;
    } else return MY_DELIVERY_PICKUP;
};

// Формирование ссылки на компанию доставки
const getCompanyUrl = ( id, trackNumber ) => {
    const company = DELIVERY_COMPANIES[ id ];
    if ( !company ) return null;
    return (company.trek && trackNumber) ? (company.url + trackNumber) : company.url;
};

