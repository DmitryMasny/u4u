import React, { Fragment, PureComponent, forwardRef } from 'react';

import { Wrapper } from "components/Page";
import OrdersList from "./_OrdersList";
import ProductsList from './_ProductsList';

import { Input, Btn } from 'components/_forms';

import Spinner from 'components/Spinner';
import {scrollToTop} from 'libs/helpers';

import s from './MyProductsPage.scss';
//import { IconEdit, IconChevronRight, IconBack, IconArrowBack, IconCheck } from 'components/Icons';
//import { PackageIcon, MapPinIcon } from 'components/Icons/LineIcon';

import TEXT_MY_PRODUCTS from 'texts/my_products';
import TEXT from 'texts/main';
import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART } from 'const/myProducts';
import { ORDER_PROMO,ORDER_CHECKOUT } from 'const/metrics'
import sendMetric from 'libs/metrics'
import { numberToMoneyFormat } from 'libs/helpers';

import { toast } from '__TS/libs/tools';
import { layoutParamsToProductsPosters } from "libs/layout";

/**
 * Содержимое текущего раздела
 */
export default class TabContent extends PureComponent {
    promoCodeInput = null;
    promoReserveKey = null;
    state = {
        isBiglion: this.props.useBiglionSelector || false,
        promoCodeActive: false,
        promoReserveKey: false,
        promoPinCode: false,
    };

    /**
     * рендерим лоадер
     **/
    renderLoading = () =>
        <Wrapper className={s.myProducts}>
            <div className={s.myProductsWrap}>
                <Spinner/>
            </div>
        </Wrapper>;

    /**
     * нет продуктов в этом разделе
     * type <string>
     **/
    renderNoData = ( type, err ) => {
        const noDataText = (() => {
            switch ( type ) {
                case MY_PRODUCTS_NEW:
                    return err ? TEXT_MY_PRODUCTS.NOT_COMPLETED_ERROR : TEXT_MY_PRODUCTS.NOT_COMPLETED_EMPTY;
                case MY_PRODUCTS_INORDER:
                    return err ? TEXT_MY_PRODUCTS.IN_ORDER_ERROR : TEXT_MY_PRODUCTS.IN_ORDER_EMPTY;
                case MY_PRODUCTS_DELETED:
                    return err ? TEXT_MY_PRODUCTS.DELETED_ERROR : TEXT_MY_PRODUCTS.DELETED_EMPTY;
                case MY_PRODUCTS_CART:
                    return err ? TEXT_MY_PRODUCTS.CART_ERROR : TEXT_MY_PRODUCTS.CART_EMPTY;
            }
        })();
        return <Wrapper className={s.myProducts}>
                    <div className={`${s.myProductsWrap} ${s.noData}`}>
                        {noDataText}
                    </div>
                </Wrapper>;
    };

    checkPromoCode() {
        const { data = {} } = this.props,
            promo = this.promoCodeInput.value;

        if ( promo && promo.length ) {
            sendMetric(ORDER_PROMO);
            //вырезаем пробелы, переводим в верхний регистр
            const promoCode = promo.toString().trim().toUpperCase();

            //если биглион, проверям
            if (this.state.isBiglion) {
                const reservedKey = this.promoReserveKey.value,
                      pinCode     = this.promoPinCode.value,
                      onlyNumberReservedKey = this.getBiglionPromocodeByString( reservedKey ),
                      onlyNumberPinCode     = this.getBiglionPromocodeByString( pinCode );

                if ( !reservedKey.length ) {
                    toast.error('Введите код бронирования', {
                        autoClose: 3000
                    });
                } else if ( onlyNumberReservedKey.length < 3 ) {
                    toast.error('Не корректный код бронирования', {
                        autoClose: 3000
                    });
                } else if ( !onlyNumberPinCode.length) {
                    toast.error('Введите пин-код', {
                        autoClose: 3000
                    });
                } else if ( onlyNumberPinCode.length < 4 ) {
                    toast.error('Не корректный пин-код, проверьте правильность введеного пин-кода', {
                        autoClose: 3000
                    });
                } else {
                    this.promoReserveKey.value = onlyNumberReservedKey;
                    //запрашиваем проверку промокода на сервере
                    this.props.checkPromoCodeAction( {
                                                           promo: promoCode,
                                                           orderSetId: data.id,
                                                           reserveKey: onlyNumberReservedKey,
                                                           pinCode: onlyNumberPinCode
                                                       } );
                    this.promoCodeInput.value = promoCode;
                }

            } else { //если промокод запрашиваем промокод с сервера
                this.props.checkPromoCodeAction( {
                                                     promo: promoCode,
                                                     orderSetId: data.id
                                                 } );
                this.promoCodeInput.value = promoCode;
            }
        }
    }

    /*shouldComponentUpdate( nextProps ) {
        if ( nextProps.type !== this.props.type && !(nextProps.type === MY_PRODUCTS_NEW || nextProps.type === MY_PRODUCTS_DELETED)) {
            this.clearPromoCode();
            return false;

        return true;
    };}*/

    /**
     * Убираем все символы кроме цифр и конвертируем в строку
     * @param code
     * @returns {*}
     */
    getBiglionPromocodeByString( code ) {
        if ( !code || !code.length ) return [];
        return code.replace( /[^0-9.]/g, '' ).toString();
    }

    /**
     * Приводим код купона в формат 123456-1234-1234
     * @param code
     * @returns {string}
     */
    convertBiglionCodeToCouponFormat( code ) {
        code = code.toString();
        return [ code.slice( 0, 6 ), code.slice( 6, 10 ), code.slice( 10, 14 ) ].join( '-' );
    }

    /**
     * Проверка типа введеного кода (купон или промокод?)
     * @param val
     */
    checkPromoCodeType( val ) {
        //убираем все не символы кроме a-z A-Z 0-9 _ -
        const valCleaned = val.replace( /[^\w\-]/gi, '' );

        const promoCode = this.getBiglionPromocodeByString( valCleaned );

        this.setState({
                          promoCodeActive: !!valCleaned,
                          isBiglion: promoCode.length > 13
                      },
                      () => {
                          if ( this.state.isBiglion ) {
                              this.promoCodeInput.value = this.convertBiglionCodeToCouponFormat( promoCode );
                          } else {
                              this.promoCodeInput.value = valCleaned;
                          }
                      }
        );
    };

    clearPromoCode() {
        if ( this.promoCodeInput ) this.promoCodeInput.value = '';
        this.props.clearPromoCodeAction();
        this.checkPromoCodeType([]);
    };

    checkEnterPressedOnPromoCodeInput = ( event ) => {
        //проверяем на промокод
        this.checkPromoCodeType( this.promoCodeInput.value );
        this.promoReserveKey && this.setState( { promoReserveKey: this.promoReserveKey.value && this.promoReserveKey.value.length >= 3} );
        this.promoPinCode && this.setState( { promoPinCode: this.promoPinCode.value && this.promoPinCode.value.length >= 4 } );

        //если нажали Enter, запускаем проверку промокода/купона
        if ( event.keyCode === 13 ) this.checkPromoCode();
    };

    componentWillUnmount() {
        /*
        if ( this.promoCodeInput ) {
            this.promoCodeInput.removeEventListener( 'keydown', this.checkEnterPressedOnPromoCodeInput );
            this.promoCodeInput.removeEventListener( 'input', this.checkEnterPressedOnPromoCodeInput );
            if ( this.promoReserveKey ) {
                this.promoCodeInput.removeEventListener( 'keydown', this.checkEnterPressedOnPromoCodeInput );
                this.promoCodeInput.removeEventListener( 'input',   this.checkEnterPressedOnPromoCodeInput );
            }
            if ( this.promoPinCode ) {
                this.promoCodeInput.removeEventListener( 'keydown', this.checkEnterPressedOnPromoCodeInput );
                this.promoCodeInput.removeEventListener( 'input',   this.checkEnterPressedOnPromoCodeInput );
            }
        }*/
    };
    componentDidUpdate() {
        const self = this;

        if ( this.promoCodeInput ) {
            /*
            this.promoCodeInput.addEventListener( 'keydown', this.checkEnterPressedOnPromoCodeInput );
            this.promoCodeInput.addEventListener( 'input',   this.checkEnterPressedOnPromoCodeInput );

            if ( this.promoReserveKey ) {
                this.promoReserveKey.addEventListener( 'keydown', this.checkEnterPressedOnPromoCodeInput );
                this.promoReserveKey.addEventListener( 'input',   this.checkEnterPressedOnPromoCodeInput );
            }
            if ( this.promoPinCode ) {
                this.promoPinCode.addEventListener( 'keydown', this.checkEnterPressedOnPromoCodeInput );
                this.promoPinCode.addEventListener( 'input',   this.checkEnterPressedOnPromoCodeInput );
            }
                */
            if ( !this.promoCodeInput.value.length ) this.promoCodeInput.value = this.props.promoCodeSelector;
            if ( this.promoReserveKey && !this.promoReserveKey.value.length ) this.promoReserveKey.value = this.props.promoReservedKeySelector;
            if ( this.promoPinCode && !this.promoPinCode.value.length ) this.promoPinCode.value = this.props.promoPinCodeSelector;
        }
    };
    componentDidMount() {
        this.componentDidUpdate();
    }


    render() {
        const {
            data,
            inProgress,
            toggleShowDeliveryAction,
            type,
            promoCodeInProgressSelector,
            promoCodeSelector,
            usePromoCodeSelector,
            useBiglionSelector,
            productsSelector,
            ...other
        } = this.props;

        // Данные еще не загрузились
        if ( inProgress ) {
            return this.renderLoading();
        }

        if ( data === undefined ) return null;

        const isDisabledPromoArea = promoCodeInProgressSelector || usePromoCodeSelector || useBiglionSelector || false;

        // Данных нет
        if ( !data || data.length === 0 || (data.orders && data.orders.length === 0) || data.error ) {
            return this.renderNoData( type, data && data.error );
        }

        const makeOrderHandler = () => {
            toggleShowDeliveryAction();
            scrollToTop({scrollDuration:0});
            sendMetric(ORDER_CHECKOUT);
        };

        const ApplyPromoBtn = ({primary, disabled}) =>{
            return primary ?
                <Btn intent="primary" inInput disabled={disabled} onClick={() => this.checkPromoCode()}>{TEXT.APPLY}</Btn>
                :
                <Btn disabled={disabled} inInput onClick={() => this.checkPromoCode()}>{TEXT.APPLY}</Btn>;
        };


        const dataArray = Array.isArray(data) ? data : [data]; // нам нужен массив
        const newDataArray = [...dataArray];
        let blockedOrderButton = false;

        //нет posterSelector ставим заглушку
        if ( (type === MY_PRODUCTS_NEW || type === MY_PRODUCTS_CART) && !productsSelector ) return this.renderLoading();

        const checkData = ( layout ) => {
            const mergedLayoutWithProducts = layoutParamsToProductsPosters( {
                                                                                onlyCheck: true,
                                                                                products: productsSelector,
                                                                                layout: layout
                                                                            } );

            if ( mergedLayoutWithProducts && mergedLayoutWithProducts.errors.length ) {
                layout.errors = mergedLayoutWithProducts.errors;
                mergedLayoutWithProducts.errors && mergedLayoutWithProducts.errors.map( err => {
                    if ( err.level === 'error' ) blockedOrderButton = true;
                    layout.levelError = true;
                } );
            }
        };

        if ( type === MY_PRODUCTS_NEW ) {
            newDataArray.map( layout => {
                if ( layout.productSlug ) checkData( layout );
            } );
        } else if ( type === MY_PRODUCTS_CART ) {
            newDataArray.map( o => o.orders.map( prod => {
                if ( prod.layout && prod.layout.productSlug ) checkData( prod.layout );
            }));
        }

        return (
            <Wrapper className={s.myProducts}>
                <div className={s.myProductsWrap}>
                    {(type === MY_PRODUCTS_NEW || type === MY_PRODUCTS_DELETED) &&    // Если продукты
                    <ProductsList data={newDataArray} type={type} {...other} />}

                    {!(type === MY_PRODUCTS_NEW || type === MY_PRODUCTS_DELETED) &&   // Если заказы
                    <OrdersList data={newDataArray} type={type} {...other} />}
                </div>

                {type === MY_PRODUCTS_CART && <Fragment>
                    {blockedOrderButton && <div className={s.errorMessage}>
                        В корзине присутствуют продукты, которые не могут быть заказаны в данный момент.<br />Отредактируйте их или удалите из корзины.
                    </div>}
                    <div className={s.cartFooter}>
                        <div className={s.cartFooterPromo}>
                            {this.state.isBiglion ?
                                <div className={s.cartFooterPromoLabel}>
                                    {TEXT_MY_PRODUCTS.COUPON}
                                </div>
                                :
                                <div className={s.cartFooterPromoLabel}>
                                    <span>
                                        {TEXT_MY_PRODUCTS.PROMOCODE}&nbsp;
                                    </span>
                                    <span className={s.cartFooterPromoLabelDesc}>
                                        ({TEXT_MY_PRODUCTS.PROMOCODE_DESC})
                                    </span>
                                </div>
                            }

                            <Input name="promo"
                                   className={s.cartFooterPromoForm}
                                   disabled={isDisabledPromoArea}
                                   intent={this.state.promoCodeActive ? (this.state.isBiglion ? 'success' : 'primary') : null}
                                   rightEl={!this.state.isBiglion && <ApplyPromoBtn primary={this.state.promoCodeActive} disabled={isDisabledPromoArea}/> }
                                   onChange={this.checkEnterPressedOnPromoCodeInput}
                                   ref={( r ) => this.promoCodeInput = r}
                            />

                            {this.state.isBiglion &&
                                <Fragment>
                                    <div className={s.cartFooterPromoLabel}>
                                        {TEXT_MY_PRODUCTS.RESERVED_KEY}
                                    </div>
                                    <Input name="promoReserve"
                                           className={s.cartFooterPromoForm}
                                           intent={this.state.promoReserveKey ? 'success': null}
                                           ref={(r) => this.promoReserveKey = r}
                                           disabled={isDisabledPromoArea}
                                    />
                                    <div className={s.cartFooterPromoLabel}>
                                        {TEXT_MY_PRODUCTS.PIN_CODE}
                                    </div>

                                    <Input name="promoPin"
                                           className={s.cartFooterPromoForm}
                                           rightEl={<ApplyPromoBtn intent={this.state.promoPinCode && this.state.promoReserveKey ? 'success':null}  disabled={isDisabledPromoArea}/>}
                                           intent={this.state.promoPinCode  ? 'success': null}
                                           ref={(r) => this.promoPinCode = r}
                                           disabled={isDisabledPromoArea}
                                    />
                                </Fragment>
                            }

                            {(usePromoCodeSelector || useBiglionSelector) &&
                                <div className={s.cartFooterPromoStatus}>
                                    <span>
                                        {TEXT_MY_PRODUCTS.PROMOCODE} {TEXT_MY_PRODUCTS.IS_ACTIVE}
                                    </span>
                                    <span className={s.cartFooterPromoCancel} onClick={() => this.clearPromoCode()}>
                                        {TEXT.CANCEL}
                                    </span>
                                </div>
                            }
                        </div>
                        <div className={s.cartFooterSum}>
                            <span className={s.cartFooterSumLabel}>{TEXT_MY_PRODUCTS.ORDER_SUM}: </span>
                            <span className={s.cartFooterSumValue}>{`${numberToMoneyFormat(data.totalCost)} ${TEXT.VALUE_RUB}`}</span>
                        </div>
                        {!blockedOrderButton ?
                            <Btn intent="primary" className={s.cartFooterBtn} large onClick={makeOrderHandler}>
                                {TEXT_MY_PRODUCTS.MAKE_ORDER_BTN}
                            </Btn> :
                            <Btn intent="primary" className={s.cartFooterBtnClosed} large>
                                {TEXT_MY_PRODUCTS.MAKE_ORDER_BTN}
                            </Btn>
                        }
                    </div>
                </Fragment>}

            </Wrapper>
        );
    }
}