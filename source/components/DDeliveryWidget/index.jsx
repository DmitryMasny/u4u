import React, { Component, Fragment, useEffect, useState, useRef } from 'react';
import { ddeliveryDataConverter } from 'libs/myProductsConverters';
import camelcaseKeysDeep from 'camelcase-keys-deep';
import Spinner from 'components/Spinner';


/**
 * SafeRoute callback
 * @param data {city,contacts,delivery,deliveryDate} - данные с виджета при выборе доставки
 * @param setDelivery - action изменяющий свойства delivery в redux
 * @param id - id заказа в корзине
 */
const safeRouteCallback = ( { city, contacts, delivery, deliveryDate }, setDelivery, id, cartData ) => {

    if ( !delivery ) return null;

    // Заполняем обратно телефон и ФИО данными из Виджета
    if ( contacts ) {
        let o = {};
        if ( contacts.fullName ) {
            const n = contacts.fullName.trim().split( ' ' );
            o = {
                name: (n[0] ? n[0].trim() : ""),
                surname: (n[1] ? n[1].trim() : ""),
                fathername: (n[2] ? n[2].trim() : "")
            };

        }
        if (contacts.phone) o.phone = (contacts.phone.length > 10 ? contacts.phone.substr( 1 ) : contacts.phone);

        setDelivery( o );
    }

    const deliveryDataConverted = ddeliveryDataConverter( { city, contacts, delivery, deliveryDate, id } );

    setDelivery( { ...deliveryDataConverted, ...{ totalCost: cartData.totalCost } } );

    /*
       $scope.ddeliveryIsOk = true;

       //Обновляем цены
       $scope.totalCost = $scope.formatPrice(this.total_cost - $scope.discountPrice + this.delivery.price);
       $scope.deliveryPrice.current = $scope.deliveryPrice.ddelivery = this.delivery.price;*/
};


/**
 * Виджет DDelivery New
 */
const SafeRouteWidget = ( props ) => {
    const [loaded, setLoaded] = useState( false );

    const widget = useRef();
    const widgetData = useRef();

    //componentDidMount
    useEffect( () => {
        if ( window.SafeRouteCartWidget ) {
            setLoaded( true );
            return;
        }

        // Вставляем скрипт SafeRoute в HEAD (КОСТЫЛЬ)
        if ( !process.env.server_render && !window.SafeRouteCartWidget ) {
            const script = document.createElement( "script" );
            script.src = "https://widgets.saferoute.ru/cart/api.js?new";
            script.async = true;
            document.head.appendChild( script );
        }

        // Проверка на загрузку скрипта
        const DDeliveryWidgetInterval = setInterval( () => {
            if ( !!window.SafeRouteCartWidget ) {
                clearInterval( DDeliveryWidgetInterval );
                setLoaded( true );
            }
        }, 200 );

        return () => {
            if ( widget.current ) widget.current.destruct();
        }
    },[]);

    //update loaded state

    useEffect( () => {
        if ( !loaded ) return;

        //Собираем заказы
        let ordersList = [];

        const { cartData: cart, deliveryData: delivery } = props;

        if ( !cart ) return false;

        const { orders } = cart;

        for ( let i = 0; i < orders.length; i++ ) {
            let productPrefixType = 'A';

            if ( orders[ i ].layout && orders[ i ].layout.type === 'poster' ) {
                productPrefixType = 'P';
            }

            ordersList.push( {
                                 name: orders[i].name,
                                 price: parseFloat( orders[ i ].cost ) / parseFloat( orders[ i ].count ),
                                 count: parseInt( orders[ i ].count ),
                                 vendorCode: cart.id + productPrefixType + orders[i].id
                             } )
        }

        const phone = delivery.phone ? (delivery.phone.length > 10 ? delivery.phone : "7" + delivery.phone) : "",
              name = [delivery.surname, delivery.name, delivery.fathername].join( ' ' );

        //характеристики посылки, значения по умолчанию
        let width  = 29;
        let height = 29;
        let depth  = 10;
        let weight = 0.4;
        let boxCount = 1;

        //получение значений из заказа
        if ( delivery.delivery && delivery.delivery.boxSize ) {
            width = delivery.delivery.boxSize.width;
            height = delivery.delivery.boxSize.height;
            depth = delivery.delivery.boxSize.depth;
            weight = delivery.delivery.boxSize.weight;
            boxCount = delivery.delivery.boxSize.boxCount;
        }

        try {
            widget.current = new SafeRouteCartWidget( "saferoute-widget", {
                apiScript: "/ddelivery/api_proxy/",
                products: ordersList,
                userFullName: name || '',
                userPhone: phone || '',
                width: width,     // ширина
                height: height,   // высота
                length: depth,    // длина
                weight: weight,   // вес
                itemCount: boxCount  // Количество мест в заказе
                //nppOption: false,  //считаем наложенный платеж
            } );
        } catch ( e ) {
            console.error( 'Ошибка виджета SafeRoute: ', e );
        }


        let startHeightCheck = null;
        widget.current.on( "start", () => {

            const div = document.querySelectorAll("#saferoute-widget")[0];
            const iFrame = div.querySelectorAll("iframe")[0];
            const body = iFrame.contentWindow.document.body;

            const css = '.order-price { opacity: 0 }';
            const style = document.createElement('style');
            style.type = 'text/css';

            if ( style.styleSheet ) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild( document.createTextNode( css ) );
            }

            if ( body ) {
                body.appendChild( style );
            }


            startHeightCheck = setInterval( () => {
                let height = body.clientHeight;

                if ( height < 300 ) height = 300;

                div.style.height = height + 'px';
                iFrame.style.height = height + 'px';
            }, 100);

            //if ( priceBlock ) priceBlock.style = "opacity: 0";

            //const div = document.querySelectorAll("#saferoute-widget")[0];
            //this.iFrame = div.querySelectorAll("iframe")[0];

            //this.iFrame.style.height = '700px';
            //this.setiFrameHeight();
        } );

        let div = null;
        let iFrame = null;
        let checkInterval = null;

        widget.current.on( "change", ( change ) => {

            if ( !checkInterval && !iFrame ) {
                div = document.querySelectorAll( "#saferoute-widget" )[ 0 ];
                iFrame = div.querySelectorAll( "iframe" )[ 0 ];

                if ( checkInterval ) clearInterval( checkInterval );

                checkInterval = setInterval(() => {
                    const priceBlock = iFrame.contentWindow.document.body.querySelector('#confirmation-total-price');

                    if ( !priceBlock ) return;

                    if ( priceBlock ) priceBlock.parentElement.style = "display: none";

                    clearInterval( checkInterval );
                }, 30);
            }

            //console.log( 'iFrame.clientHeight', iFrame.contentWindow.document.body.clientHeight );

            //сохраняем все данные из виджета в локальную переменную (без обновления компонента)
            widgetData.current = change;
        } );

        widget.current.on( "done", ( data ) => {

            if ( checkInterval ) clearInterval( checkInterval );
            if ( startHeightCheck ) clearInterval( startHeightCheck );
            if ( iFrame ) iFrame = null;
            if ( div ) div = null;

            if ( data && props.setDeliveryAction ) {
                safeRouteCallback( camelcaseKeysDeep( widgetData.current ), props.setDeliveryAction, cart.id, cart );
            }
        } );

        widget.current.on( "error", ( errors ) => {
            // Вызовется при возникновении ошибок при обработке запроса,
            // при передаче в виджет некорректных или неполных данных
            if ( widget.current ) widget.current.destruct();
        } );

    }, [loaded] );

    if ( !loaded ) return <>
                            <div style={{color: 'orange', paddingBottom: 10, paddingTop: 10}}>Внимание! Возможны перебои в работе виджета доставки. Если виджет не загрузился, попробуйте позже.</div>
                            <div id="saferoute-widget">
                                Загрузка виджета доставки...
                                <Spinner size={90} fill />
                            </div>
                         </>;

    return <Fragment>
                <div style={{ paddingBottom: 10 }}>При поиске города, указывайте название без "г." и иных сокращений.</div>
                <div style={{color:'red'}}>Внимание: При выборе способа доставки показана приблизительная дата получения заказа.</div>
                <div style={{color:'red', paddingBottom:10}}>Выходные дни не учитываются, поэтому сроки доставки могут быть увеличены.</div>
                <div id="saferoute-widget" />
           </Fragment>
}

export default SafeRouteWidget;