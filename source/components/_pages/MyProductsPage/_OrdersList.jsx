import React, { Fragment, memo } from 'react';
//import { useDispatch, useSelector } from "react-redux";

import ProductsList from './_ProductsList';
import OrderDeliveryInfo from './_OrderDeliveryInfo';


import s from './MyProductsPage.scss';
import { IconCheck, IconOffice, IconDelivery, IconPrint } from 'components/Icons';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import { ORDER_STATUS_INWORK, ORDER_STATUS_COMPLETED, ORDER_STATUS_U4U_READY, ORDER_STATUS_DONE, ORDER_STATUS_CART} from 'const/myProducts';

//import OfficeWorkInfo from 'components/WarningBlock/23feb';

/**
 * Статус заказа
 */
const OrderStatus = ( { status } ) => {
    if ( !status ) {
        console.log( 'Ошибка! Статус не получен' );
        return null;
    }
    const className = s.orderStatus + (status.className ? ` ${status.className}` : ''); // нам нужен массив
    return (
        <span className={className}>
            {status.icon}
            <span className={s.orderStatusLabel}>{status.label}</span>
        </span>
    );
};

/**
 * Список заказов (в одном заказе может быть несколько продуктов)
 */
const OrdersList = memo(( { data, type, ...other } ) => {
    //const dispatch = useDispatch();

    //let posterSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPE_POSTER, dispatch ) );

    const orderStatusMap = {           //названия и иконки статусов заказа
        [ORDER_STATUS_INWORK]: {
            label: TEXT_MY_PRODUCTS.ORDER_STATUS_INWORK,
            className: s.statusInwork,
            icon: <IconPrint size={18}/>
        },
        [ORDER_STATUS_COMPLETED]: {
            label: TEXT_MY_PRODUCTS.ORDER_STATUS_COMPLETED,
            className: s.statusCompleted,
            icon: <IconDelivery size={18}/>
        },
        [ORDER_STATUS_U4U_READY]: {
            label: TEXT_MY_PRODUCTS.ORDER_STATUS_U4U_READY,
            className: s.statusCompleted,
            icon: <IconOffice size={18}/>
        },
        [ORDER_STATUS_DONE]: {
            label: TEXT_MY_PRODUCTS.ORDER_STATUS_DONE,
            className: s.statusDone,
            icon: <IconCheck size={18}/>
        }
    };

    const dataArray = data.length ? data : [data]; // нам нужен массив

    return (
        <Fragment>
            {/*<OfficeWorkInfo />*/}
            {dataArray.map( order => {
                if ( !order.orders ) return null;

                return (
                    <div key={order.id} className={s.ordersList}>
                        <div className={s.ordersListHead}>
                            <div className={s.ordersListNumber}>
                                <span className={s.ordersListNumberText}>{TEXT_MY_PRODUCTS.ORDER} </span>
                                <span className={s.ordersListNumberSign}>№ </span>
                                <span className={s.ordersListNumberId}>{order.id}</span>
                            </div>
                            {order.status !== ORDER_STATUS_CART && <OrderStatus status={orderStatusMap[order.status]}/>}
                        </div>
                        <ProductsList data={order.orders} orderId={order.id} type={type} {...other}  />
                        <OrderDeliveryInfo delivery={order.delivery} orderId={order.id} totalCost={order.totalCost}/>
                    </div>
                );
            } )}
        </Fragment>);
});

export default OrdersList;