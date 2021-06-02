import { companyDeliveryDataById } from 'config/delivery';
//import { MY_PRODUCTS_CART} from 'const/myProducts';


// Получение раздела myProducts state
export const myProductsSelector = ( state, tab ) => state.myProducts[ tab ];

// Получение раздела cart
export const cartSelector = state => state.myProducts.cart;

// Получение количества товаров в корзине
export const myCartQuantitySelector = state => state.myProducts.cartQuantity;

// Получение статуса inProgress
export const myProductsInProgressSelector = state => state.myProducts.inProgress;

// Получение статуса показа окна оформления доставки
export const myProductsShowDeliverySelector = state => state.myProducts.showDelivery;

// Получение раздела delivery
export const myDeliverySelector = state => state.delivery;

// Получение типа доставки delivery (для табов)
export const myDeliveryTypeSelector = state => state.delivery.type;

// Получение соостояния отображения виджета доставки delivery
export const myDeliveryShowDDWidgetSelector = state => state.delivery.showDDWidget;

// Данные доставки
export const myDeliveryAddressSelector  = state => state.delivery.address;
export const myDeliveryPriceSelector    = state => state.delivery.price;
export const myDeliveryDeliveryIsPVZ    = state => state.delivery.deliveryType === 'PVZ';
export const myDeliveryCommentsSelector = state => state.delivery.comments;

//данные компании доставки (берутся статичного из объекта по id из redux)
const nullObj = {};
export const myDeliveryCompanyDataSelector = state => {
    if (state.delivery && state.delivery.companyInfo) {
        return companyDeliveryDataById[ state.delivery.deliveryCompanyId ] || nullObj;
    }
    return nullObj;
};

// Промокод
export const promoCodeSelector           = state => state.myProducts.promoCode || null;
export const promoReservedKeySelector    = state => state.myProducts.reserveKey || null;
export const promoPinCodeSelector        = state => state.myProducts.pinCode || null;
export const promoCodeInProgressSelector = state => state.myProducts.promoCodeInProgress;
export const usePromoCodeSelector        = state => state.myProducts.usePromoCode;
export const useBiglionSelector          = state => state.myProducts.useBiglion;


//export const promoCodeNameSelector       = state => state.myProducts.promoCode && state.myProducts.promoCode.name || null;
//export const promoCodeSelector           = state => state.myProducts.promoCode && state.myProducts.promoCode.discount_data || null;


/*
export const hasProductsForPromoCodeSelector = state => {

    const promos = promoCodeSelector( state ) || {};

    for (let key in promos) {
        if (promos[key] > 0) return true;
    }

    return false;
};
*/
