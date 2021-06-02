import React, { useEffect, useContext, Component } from 'react';
import { useSelector, useDispatch } from "react-redux";

import YaMaps from 'components/YaMaps';
import Tooltip from 'components/_forms/Tooltip';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import { DELIVERY_COMPANIES, MY_DELIVERY_PICKUP, DDELIVERY_TYPE_PVZ, DDELIVERY_TYPE_COURIER, DDELIVERY_TYPE_POCHTA, MY_DELIVERY_U4U } from 'const/myProducts';
import { modalOrderDeliveryInfoSelector } from 'selectors/modals';
import { ResizeContext } from 'contexts/resizeContext';
import s from "./index.scss";
import {ModalContext} from "components/Modal/_context";
import {TYPES} from "const/types";
import TEXT_MAIN from 'texts/main';

const getTitle = (deliveryType) =>{
    switch ( deliveryType ) {
        case MY_DELIVERY_PICKUP:
            return TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TITLE;
        case DDELIVERY_TYPE_PVZ:
            return TEXT_MY_PRODUCTS.DELIVERY_INFO_PVZ_TITLE;
        case DDELIVERY_TYPE_COURIER:
            return TEXT_MY_PRODUCTS.DELIVERY_INFO_COURIER_TITLE;
        case DDELIVERY_TYPE_POCHTA:
            return TEXT_MY_PRODUCTS.DELIVERY_INFO_POCHTA_TITLE;
        case MY_DELIVERY_U4U:
            return TEXT_MY_PRODUCTS.DELIVERY_INFO_POCHTA_TITLE;
        default: return '';
    }
};

const ModalBody = ({deliveryInfo}) =>{

    if(!deliveryInfo) return <div className='bp3-dialog-body'>Информация по заказу отсутствует</div>;

    const d = deliveryInfo.companyInfo;

    const infoArray = d && DELIVERY_COMPANIES[d.deliveryCompanyId];

    const phone = infoArray && infoArray.phone;

    switch ( deliveryInfo.deliveryType ) {
        case MY_DELIVERY_PICKUP:
            return (
                <div className={`bp3-dialog-body ${s.orderDeliveryInfoModal}`}>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TEXT_1}</p>
                    <p>
                        <Tooltip tooltip={TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TEXT_5}>
                            <span className={s.address}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TEXT_2}</span>
                        </Tooltip>
                    </p>
                    <p dangerouslySetInnerHTML={{ __html: TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TEXT_3 }}/>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TEXT_4}</p>
                    <p className={s.orderNumber}>
                        {TEXT_MY_PRODUCTS.DELIVERY_INFO_ORDER_NUMBER}: <span className={s.orderNumberValue}>{deliveryInfo.orderId}</span>
                    </p>
                    <ResizeContext.Consumer>
                        {( { media } ) => <YaMaps height={media === 'xs' ? 260 : 350}/>}
                    </ResizeContext.Consumer>
                </div>
            );

        case DDELIVERY_TYPE_PVZ:
            return (
                <div className={`bp3-dialog-body ${s.orderDeliveryInfoModal}`}>
                    {d.deliveryCompanyLogo ? <div className={s.logo} style={{backgroundImage: `url('${d.deliveryCompanyLogo}')`}}/> : null}
                    <p className={s.companyName}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PVZ_TITLE} "{d.deliveryCompanyName}"</p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PVZ_ADDRESS}: {deliveryInfo.address}</p>
                    <p>{d.description}</p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PVZ_DATE}: {d.deliveryDate}</p>
                    <p style={{'color':'red'}}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_DATE_WARNING}</p>
                    {phone && <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_COURIER_PHONE}: {phone}</p>}
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PVZ_TEXT_LAST}</p>
                    <p>
                        <a target="_blank" href={deliveryInfo.companyUrl}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_CHECK_STATUS}</a>
                    </p>
                </div>
            );

        case DDELIVERY_TYPE_COURIER:
            return (
                <div className={`bp3-dialog-body ${s.orderDeliveryInfoModal}`}>
                    {d.deliveryCompanyLogo ? <div className={s.logo} style={{backgroundImage: `url('${d.deliveryCompanyLogo}')`}}/> : null}

                    <p className={s.companyName}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_COURIER_T_N} "{d.deliveryCompanyName}"</p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_ADDRESS}: {deliveryInfo.address},</p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_DATE}: {d.deliveryDate}</p>
                    <p style={{'color':'red'}}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_DATE_WARNING}</p>
                    {phone && <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_COURIER_PHONE}: {phone}</p>}
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_COURIER_T_L}</p>
                    <p>
                        <a target="_blank" href={deliveryInfo.companyUrl}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_CHECK_STATUS}</a>
                    </p>
                </div>
            );

        case DDELIVERY_TYPE_POCHTA:
            return (
                <div className={`bp3-dialog-body ${s.orderDeliveryInfoModal}`}>
                    {d.deliveryCompanyLogo ? <div className={s.logo} style={{backgroundImage: `url('${d.deliveryCompanyLogo}')`}}/> : null}
                    <p className={s.companyName}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_POCHTA_NAME}</p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_ADDRESS}: {deliveryInfo.address}</p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_DATE}: {d.deliveryDate}</p>
                    <p style={{'color':'red'}}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_DATE_POSHTA_WARNING}</p>
                    {phone && <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_POCHTA_PHONE}: {phone}</p>}

                    { deliveryInfo.trackNumber && <p>{TEXT_MY_PRODUCTS.DELIVERY_TRACK_NUMBER}: {deliveryInfo.trackNumber}</p> }
                    {!deliveryInfo.trackNumber &&
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_POCHTA_LAST}</p>
                    }
                    <p>
                        <a target="_blank" href={deliveryInfo.companyUrl}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_POCHTA_LINK}</a>
                    </p>
                </div>
            );
        case MY_DELIVERY_U4U:
            return (
                <div className={s.orderDeliveryInfoModal}>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_U4U_DELIVERY}</p>
                    <p className={s.address2}>
                        {deliveryInfo.address}
                    </p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_INFO_PICKUP_TEXT_4}</p>
                </div>
            );
        default: return <div>-</div>
    }
};

class OrderDeliveryInfoOld extends Component {

    state = {
        deliveryType: '',
        title: ''
    };

    static  getDerivedStateFromProps(nextProps,prevState){
        if (prevState.deliveryType !== nextProps.orderDeliveryInfoSelector.deliveryType){
            return {
                deliveryType: nextProps.orderDeliveryInfoSelector.deliveryType,
                title: getTitle(nextProps.orderDeliveryInfoSelector.deliveryType)
            }
        }
        return null
    }

    render() {

        return <ModalBody deliveryInfo={this.props.orderDeliveryInfoSelector}/>
    }
}

const OrderDeliveryInfo = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const orderDeliveryInfoSelector = useSelector(modalOrderDeliveryInfoSelector);

    useEffect(() => {
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeModal, primary: true},
                {type: TYPES.DIVIDER},
            ]
        });
    },[]);


    return <OrderDeliveryInfoOld {...props} orderDeliveryInfoSelector={orderDeliveryInfoSelector} />;
};

export default OrderDeliveryInfo;