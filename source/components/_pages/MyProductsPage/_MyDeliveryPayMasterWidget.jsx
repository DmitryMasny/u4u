import React, { Component,Fragment } from 'react';
import {ddeliveryDataConverter } from 'libs/myProductsConverters';

// import s from './MyProductsPage.scss';



/**
 * DDelivery callback
 * @param data {city,contacts,delivery,deliveryDate} - данные с виджета при выборе доставки
 * @param setDelivery - action изменяющий свойства delivery в redux
 * @param id - id заказа в корзине
 */
const ddeliveryCallback = ( { city, contacts, delivery, deliveryDate }, setDelivery, id ) => {

    // Заполняем обратно телефон и ФИО данными из Виджета
    if ( contacts ) {
        let o = {};
        if ( contacts.fullName ) {
            const n = contacts.fullName.trim().split( ' ' );
            o = {
                name: (n[ 0 ] ? n[ 0 ].trim() : ""),
                surname: (n[ 1 ] ? n[ 1 ].trim() : ""),
                fathername: (n[ 2 ] ? n[ 2 ].trim() : "")
            };

        }
        if (contacts.phone) o.phone = (contacts.phone.length > 10 ? contacts.phone.substr( 1 ) : contacts.phone);

        setDelivery( o );
    }

    if ( !delivery ) return null;

    let convertedDeliveryData = ddeliveryDataConverter({city,contacts,delivery,deliveryDate, id });

    //console.log('convertedDeliveryData',convertedDeliveryData);

    setDelivery(convertedDeliveryData);

    /*
       $scope.ddeliveryIsOk = true;

       //Обновляем цены
       $scope.totalCost = $scope.formatPrice(this.total_cost - $scope.discountPrice + this.delivery.price);
       $scope.deliveryPrice.current = $scope.deliveryPrice.ddelivery = this.delivery.price;*/

};



/**
 * Виджет DDelivery
 */
class MyDeliveryPayMasterWidget extends Component {

    state = {
        loaded: false
    };

    componentDidMount() {

        if ( process.env.server_render ) return null;

        // if (window.DDeliveryWidgetCart ) return;

        setTimeout( () => {
            this.setState( { loaded: true } );
        }, 500 );

        // Вставляем скрипт ddelivery в HEAD (КОСТЫЛЬ)
        // const script = document.createElement("script");
        // script.src = "https://paymaster.ru/ru-RU/widget/Basic/1?LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&LMI_PAYMENT_AMOUNT=100&LMI_PAYMENT_DESC=Test+payment&LMI_CURRENCY=RUB";
        // script.async = true;
        // document.head.appendChild(script);

        // Проверка на загрузку скрипта
        // const DDeliveryWidgetInterval = setInterval(()=>{
        //     if ( !!window.DDeliveryWidgetCart ){
        //         clearInterval(DDeliveryWidgetInterval);
        //         this.setState({loaded: true});
        //     }
        // },500);


        document.write( '<style>.pmwidget * {padding:0; margin:0;} .pmwidget {width:628px; margin:10px 0; font:normal normal 13px/17px Verdana; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 5px White inset; padding:13px 13px 6px 13px; border:1px solid #bbb; border-radius:5px; background:#f8f8f8 url(https://paymaster.ru/content/img/widget/bg.gif) repeat-x scroll left bottom;} .pmwidget h1 {font:normal normal 20px/25px Tahoma; color:#333; margin:0 0 10px 0;} .pmwidget p {color:#333; margin:0 0 7px 0;} .pmwidget p strong {font-weight:bold; color:#555;} .pmwidget .payList p {color:#464646; margin:5px 5px 10px 5px;} .pmwidget .pm-item {outline:none; color:#666; float:left; width:145px; height:72px; text-align:center; padding:0 0; text-decoration:none; border:1px solid #d2d2d2; border-radius:5px; background-color:#fff; margin:0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); margin-bottom:11px;} .pmwidget .pm-item:hover {background-color:#fff; border:1px solid #1b7398; box-shadow:0 1px 1px rgba(0,0,0,0.2);} .pmwidget .pm-item:active {box-shadow:0 1px 6px rgba(0,0,0,0.4) inset; margin-bottom:10px; margin-top:1px;} .pmwidget .pm-item img {border:0;} .pmwidget .clearfix {clear:both;} .pmAmount input {width:80px;} .payList {margin-left: -7px;} .pmwidget-cb {} .pmwidget-cb .payList {position:relative; padding-bottom:28px;} .pmwidget-cb .payList ul {position:absolute; margin:0; width:100%;} .pmwidget-cb .payList ul {border:1px solid #d2d2d2; border-radius:5px; background:#fff; margin:0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);} .pmwidget-cb .payList ul li {display:none; padding:4px 8px; list-style:none; cursor:pointer; clear:both; overflow:hidden; zoom:1;} .pmwidget-cb .payList ul li:hover {background-color: #eee;} .pmwidget-cb .payList ul li:hover a {color:#000;} .pmwidget-cb .payList ul li:first-child {display:block; margin-right:10px; background: transparent url(https://paymaster.ru/content/img/widget/arrow.gif) right 12px no-repeat; font-weight:bold;} .pmwidget-cb .payList ul li:first-child:hover {background-image:url(https://paymaster.ru/content/img/widget/arrow-hover.gif);} .pmwidget-cb .payList ul li a {text-decoration:none; color:#666;} .pmwidget-cb .payList ul li a img {margin-right:10px; border:none; width:32px;} .pmwidget-cb .payList ul li a.pos-middle {vertical-align:-50%;} .pmheader,.pmdesc,.pmamount,.pmpaymenttype,.pmlogo {display:none} </style><div class="pmwidget" style="display: none; min-width: "><a href="http://paymaster.ru/" class="pmlogo"></a><h1 class="pmheader"> Выберите способ оплаты</h1><p class="pmdesc"><strong>Описание:</strong> Test payment</p><p class="pmamount"><strong>Сумма:&nbsp;</strong> 100,00&nbsp;RUB</p><label class="pmpaymenttype"> Способ оплаты:</label><div class="payList"><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=8&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="8" class="pm-item paySystem" title="Альфа-банк"><img src="https://paymaster.ru/Content/img/logos/alfabank.gif" alt="" title="Альфа-банк"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=22&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="22" class="pm-item paySystem" title="ВТБ24"><img src="https://paymaster.ru/Content/img/logos/vtb24.gif" alt="" title="ВТБ24"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=24&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="24" class="pm-item paySystem" title="Русский Стандарт Банк"><img src="https://paymaster.ru/Content/img/logos/brs.gif" alt="" title="Русский Стандарт Банк"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=64&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="64" class="pm-item paySystem" title="Промсвязьбанк"><img src="https://paymaster.ru/Content/img/logos/psb-paymaster.png" alt="" title="Промсвязьбанк"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=93&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="93" class="pm-item paySystem" title="Банковская карта"><img src="https://paymaster.ru/Content/img/logos/bankcards.png" alt="" title="Банковская карта"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=300&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="300" class="pm-item paySystem" title="WebMoney"><img src="https://paymaster.ru/Content/img/logos/webmoney.gif" alt="" title="WebMoney"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=46&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="46" class="pm-item paySystem" title="QIWI-кошелек"><img src="https://paymaster.ru/Content/img/logos/qiwi_h.png" alt="" title="QIWI-кошелек"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=30&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="30" class="pm-item paySystem" title="Яндекс.Деньги"><img src="https://paymaster.ru/Content/img/logos/yandex.gif" alt="" title="Яндекс.Деньги"/></a><a href="https://paymaster.ru/ru-RU/Payment/Init?LMI_PAYMENT_SYSTEM=140&amp;LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&amp;LMI_CURRENCY=RUB&amp;LMI_PAYMENT_AMOUNT=100.00&amp;LMI_PAYMENT_DESC=Test+payment&amp;LMI_OPEN_INVOICE=0&amp;LMI_SIM_MODE=0" rel="140" class="pm-item paySystem" title="Сбербанк Онлайн"><img src="https://paymaster.ru/Content/img/logos/140_126_sberbank_1.png" alt="" title="Сбербанк Онлайн"/></a><div class="clearfix"></div></div><form id="pmwidgetForm" method="POST" action="https://paymaster.ru/ru-RU/Payment/Init"><div><input type="hidden" name="LMI_MERCHANT_ID" value="1b745d20-5e85-43bf-929f-c8eeaa14c7f5"/><input type="hidden" name="LMI_CURRENCY" value="RUB"/><input type="hidden" name="LMI_PAYMENT_AMOUNT" value="100.00"/><input type="hidden" name="LMI_PAYMENT_DESC" value="Test payment"/><input type="hidden" name="LMI_PAYMENT_SYSTEM" id="pmwidgetPS" /></div></form></div> ' );
        (function () {
            function loadScript ( url, callback ) {
                if ( typeof jQuery != "undefined" ) {
                    callback();
                    return;
                }
                var script = document.createElement( "script" );
                script.type = "text/javascript";
                if ( script.readyState ) {
                    script.onreadystatechange = function () {
                        if ( script.readyState == "loaded" || script.readyState == "complete" ) {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {script.onload = function () {callback();};}
                script.src = url;
                document.getElementsByTagName( "head" )[0].appendChild( script );
            }

            loadScript( 'https://paymaster.ru/Scripts/jquery-1.5.1.min.js', function () {
                if ( typeof jQuery.fn.pmwidget == "undefined" ) jQuery.fn.pmwidget = function ( options ) {
                    var settings = jQuery.extend( {
                        count: '0',
                        columns: '4', /*showlogo: true,showdesc: true,showheader: true,showpmtype: true,*/
                        comboxboxWidth: 400
                    }, options );
                    if ( this.hasClass( "pmwidgetDone" ) ) {
                        this.show();
                        return;
                    }
                    this.addClass( "pmwidgetDone" );
                    this.each( function () {
                        var $pmwidget = jQuery( this );
                        var $box = $pmwidget.find( ".payList" );
                        var $moreLink = jQuery( '<a href=\"javascript://" class="pm-item more"><img src="https://paymaster.ru/Content/img/more_ru.gif" alt="Показать еще"></a>' );
                        var $hideLink = jQuery( '<a href=\"javascript://" class="pm-item hide"><img src="https://paymaster.ru/Content/img/hide_ru.gif" alt="Скрыть"></a>' );
                        var count = settings.count - 1;
                        var $combo = jQuery( "ul", $pmwidget );
                        var $paymentType = jQuery( "label", $pmwidget );
                        var type = $combo.length != 0 ? "combobox" : "";
                        /*jQuery(".pmlogo", $pmwidget).css("display", settings.showlogo ? "block" : "none");jQuery("p:first", $pmwidget).css("display", settings.showdesc ? "block" : "none");jQuery("h1", $pmwidget).css("display", settings.showheader ? "block" : "none");$paymentType.css("display", settings.showpmtype ? "block" : "none");*/
                        switch ( type ) {
                            case "combobox":
                                $pmwidget.addClass( "pmwidget-cb" );
                                $pmwidget.css( "width", settings.comboxboxWidth + "px" );
                                $paymentType.hide();
                                jQuery( "li a img", $combo ).each( function () {jQuery( this ).parent().addClass( "pos-middle" );} );
                                jQuery( "li:first", $combo ).before( "<li><a href=\"javascript://\">" + $paymentType.html().replace( ":", "" ) + "</a></li>" );
                                jQuery( "li:first", $combo ).click( function () {
                                    jQuery( "li", $combo ).show( 200 );
                                    return false;
                                } );
                                jQuery( "li:first a", $combo ).css( "vertical-align", "top" );
                                jQuery( document ).bind( "click", function () {jQuery( "li:not(:first)", $combo ).hide( 200 );} );
                                break;
                            default:
                                $pmwidget.css( "width", Math.max( 157 * settings.columns, 220 ) + "px" );
                                if ( count >= 0 ) {
                                    $pmwidget.find( ".paySystem:gt(" + count + ")" ).hide();
                                    if ( settings.count < $pmwidget.find( ".paySystem" ).length ) {
                                        $box.find( "div.clearfix" ).before( $hideLink );
                                        $hideLink.hide();
                                        $box.find( "div.clearfix" ).before( $moreLink );
                                    }
                                }
                                break;
                        }
                        var startHeight = $box.height();
                        $moreLink.click( function () {
                            $box.find( ".more" ).hide();
                            $box.find( ".paySystem, .hide" ).show();
                            var height = $box.height();
                            $box.find( ".paySystem:gt(" + count + "), .hide" ).hide();
                            $box.css( "height", startHeight + "px" ).stop().animate( { height: height + "px" }, 400, "linear", function () {
                                $box.css( "height", "auto" );
                                $box.find( ".paySystem, .hide" ).fadeIn( 400 );
                            } );
                        } );
                        $hideLink.click( function () {
                            $box.find( ".paySystem:gt(" + count + "), .hide" ).fadeOut( 400, function () {
                                $box.find( ".more" ).fadeIn( 400 );
                                $box.stop().animate( { height: startHeight + "px" }, 400, "linear", function () {$box.css( "height", "auto" );} );
                            } );
                        } );
                        $pmwidget.find( ".paySystem" ).click( function () {
                            var amInput = $pmwidget.find( "#pmOpenAmount" );
                            if ( amInput.length > 0 ) {
                                if ( amInput.val().match( /^\s*\d+.?\d*\s*$/ ) ) $pmwidget.find( "input[name='LMI_PAYMENT_AMOUNT']" ).val( amInput.val() ); else {
                                    alert( 'Укажите, пожалуйста, корректную сумму платежа' );
                                    return false;
                                }
                            } else return true;
                            $pmwidget.find( "input#pmwidgetPS" ).val( jQuery( this ).attr( "rel" ) );
                            $pmwidget.find( "#pmwidgetForm" ).submit();
                            return false;
                        } );
                    } );
                    this.show();
                };
                jQuery( ".pmwidget" ).pmwidget();
            } );
        })();
        document.write( '' );



    }
    // shouldComponentUpdate(nextProps, nextState){
    //
    // }

    render(){
        return <div id="paymaster-widget">
            {!this.state.loaded && <div>Загрузка</div>}
            <script type='text/javascript' src='https://paymaster.ru/ru-RU/widget/Basic/1?LMI_MERCHANT_ID=1b745d20-5e85-43bf-929f-c8eeaa14c7f5&LMI_PAYMENT_AMOUNT=100&LMI_PAYMENT_DESC=Test+payment&LMI_CURRENCY=RUB'/>
        </div>;
    }

}

export default MyDeliveryPayMasterWidget;