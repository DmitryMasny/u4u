// @ts-ignore
import { productGetProductsFromServerAction } from '__TS/actions/products';

let isReceivingProducts = false;
//поучение всех продуктов
export const productsSelector = ( state: any ): Array<any> | null => {

    if ( state.products.all && state.products.all.length ) {
        isReceivingProducts = false;
        return state.products.all;
    }

    //запускаем получение продуктов с сервера
    if ( !isReceivingProducts ) {
        productGetProductsFromServerAction();
        isReceivingProducts = true;
    }

    return null;
}