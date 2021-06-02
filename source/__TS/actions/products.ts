// @ts-ignore
import { store } from "components/App";
// @ts-ignore
import { graphQL } from 'server/graphql';
// @ts-ignore
import { productGetPostersAdapter } from 'server/adapters/posters';
// @ts-ignore
import camelcaseKeysDeep from 'camelcase-keys-deep';
import {
    //PRODUCT_TYPES_GET,
    //PRODUCT_SELECTED_DATA_PUT,
    //PRODUCT_GET_THEME_DATA,
    //PRODUCT_PUT_THEME_DATA,
    //PRODUCT_CREATE_POSTER,
    //PRODUCT_PUT_PRODUCT_DATA,
    //PRODUCT_UPDATE_PRODUCT_DATA,
    MY_PRODUCTS_RESET_DEFAULT_STATE,
    PRODUCT_TYPES_PUT,
    PRODUCT_SET_SELECTED,
    FORMAT_SET_SELECTED,
    FORMAT_SET_ROTATION,
    OPTION_SET_SELECTED
    // @ts-ignore
} from 'const/actionTypes';

//получаем диспетчер Redux
const dispatch = store.dispatch;

/**
 * Запрашиваем все продукты с сервера
 */
export const productGetProductsFromServerAction = (): any => {
    graphQL.get({
        // fake: '1',
        adapter: productGetPostersAdapter,
        data:`
            poster_products: getAllPosterProduct{
                id
                name
                description
                product_info
                product_images
                product_slug
                visible
                product_group {
                    slug
                    name
                }
                formats: format_set {
                    id
                    name
                    width
                    height
                    format_slug
                    dpi
                    allow_rotate
                    barcode_position
                    sort_order     
                    visible               
                    format_options: formatoption_set {
                        id
                        price
                        default_price
                        sort_order                        
                        option {
                            id
                            name
                            description
                            technical_description
                            option_slug
                            type
                            option_category {
                                id
                                name
                                description
                                sort_order
                            }
                        }
                    }
                }
            }
          `
    })
    .then( response => {
        dispatch({
            type: PRODUCT_TYPES_PUT,
            payload: response
        });
    })
    .catch( err => {
        console.log( 'ОШИБКА', err );
    });
};


//устанавливаем выбранный продукт
export const productSetSelectByIdAction = ( { selectedId, productSlug }: { selectedId: string | number, productSlug: string } ) => dispatch( {
    type: PRODUCT_SET_SELECTED,
    payload:  {
        id: selectedId,
        productSlug: productSlug
    }
});

//устанавливаем выбранный формат
export const productSetFormatSelectByIdAction = ( { id, productSlug }: { id: string | number, productSlug: string } ) => dispatch( {
    type: FORMAT_SET_SELECTED,
    payload:  {
        id: id,
        productSlug: productSlug
    }
});

//устанавливаем поворот или нет
export const productSetFormatRotationAction = ( { productSlug, formatId, formatWidth, formatHeight }: { productSlug: string, formatId: string | number, formatWidth: string | number, formatHeight: string | number } ) => dispatch( {
    type: FORMAT_SET_ROTATION,
    payload:  {
        productSlug: productSlug,
        formatId: formatId,
        formatWidth: formatWidth,
        formatHeight: formatHeight
    }
});

//устанавливаем опцию как выбранную
export const productSetOptionAction = ( { productSlug, id, filterId, formatId }: { productSlug: string, id: string | number, filterId: string | number, formatId: string | number } ) => dispatch( {
    type: OPTION_SET_SELECTED,
    payload:  {
        productSlug: productSlug,
        id: id,
        filterId: filterId,
        formatId: formatId
    }
});
//сбрасываем на исходное значение данные раздела "Мои проекты"

export const resetMyProjectToDefaultStateAction = () => dispatch( {
    type: MY_PRODUCTS_RESET_DEFAULT_STATE
});
