import createReducer from "./createReducer";
import { defaultServerState } from "./_productDefaultState";

import {
    //PRODUCT_TYPE_SET,
    //PRODUCT_FORMAT_SET,
    //PRODUCT_PAGES_SET,
    //PRODUCT_GLOSS_SET,
    PRODUCT_SELECTED_DATA_PUT,
    PRODUCT_TYPES_PUT,
    THEME_SELECTED_PUT_DATA,
    PRODUCT_PUT_THEME_DATA,
    PRODUCT_GET_THEME_DATA,
    PRODUCT_PUT_OPTIONS,
    PRODUCT_SET_SELECTED,
    FORMAT_SET_SELECTED,
    FORMAT_SET_ROTATION,
    OPTION_SET_SELECTED
} from 'const/actionTypes';

import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'
import { getProductType } from 'libs/helpers'

let defaultState = {
    selected: {},
    options: null,
    all: []
};

if ( process.env.server_render ) {
    defaultState = defaultServerState
}


defaultState.selected[PRODUCT_TYPE_PHOTOBOOK] = {
    id: 4, //4 твердая обложка на клею
    bindingType: 'glue',
    coverType: 'hard',
    formatId: 2,
    coverLaminationType: null,
    paperPagesDestiny: 170, //гр.м по умолчанию
    pages: null,
    productGroup: null,
    loadingThemes: false,
    theme: {
        name: null,
        id: null,
        preview: null
    }
};


export default createReducer(
    defaultState,
    {
        [ PRODUCT_GET_THEME_DATA ]:
            ( state ) => {
                return {
                    ...state, selected: {
                        ...state.selected,
                        [ PRODUCT_TYPE_PHOTOBOOK ]: {
                            ...state.selected[ PRODUCT_TYPE_PHOTOBOOK ],
                            loadingThemes: true,
                        }
                    }
                };
            },
        [ PRODUCT_PUT_THEME_DATA ]:
            ( state, { payload } ) => {
                const productsInGroup = {};

                if ( Array.isArray( payload.products ) ) {

                    payload.products.map( ( item ) => {
                        const { productGroup, id, previewCover, formatId } = item;

                        productsInGroup[ `preview_format_${productGroup}_${formatId}` ] = {
                            id: id,
                            preview: previewCover
                        }
                    } );
                }
                return {
                    ...state,
                    selected: {
                        ...state.selected,
                        [ payload.type ]: {
                            ...state.selected[ payload.type ],
                            loadingThemes: false,
                            theme: {
                                ...state.selected[ payload.type ].theme,
                                ...productsInGroup
                            }
                        }
                    }
                };
            },
        [ PRODUCT_TYPES_PUT ]:
            ( state, { payload } ) => {
                if ( !payload ) {
                    return state;
                }

                const productSlug = payload && payload.productSlug;

                if ( !productSlug ) {

                    let visibleProducts = {};
                    for ( let k in payload) {
                        if (payload.hasOwnProperty(k)) {
                            if (payload[k] && payload[k].length) visibleProducts[k] = payload[k].filter( p => p.visible ).map(
                                p => ({...p, formats: p.formats.filter( f => f.visible )})
                            );
                        }

                    }
                    return {
                        ...state,
                        all: Object.keys(visibleProducts).map( k => visibleProducts[k] ),
                        ...visibleProducts
                    };
                }

                return {
                    ...state,
                    [ productSlug ]: payload[productSlug]
                };
            },
        [ PRODUCT_SELECTED_DATA_PUT ]:
            ( state, { payload } ) => {
                const data = payload.data,
                      productSlug = payload.productSlug;

                return {
                    ...state,
                    selected: {
                        ...state.selected,
                        [ productSlug ]: {
                            ...state.selected[ productSlug ],
                            ...data
                        }
                    }
                };
            },
        [ THEME_SELECTED_PUT_DATA ]:
            ( state, { payload } ) => {
                return { ...state, selectedTheme: payload };
            },
        [ PRODUCT_SET_SELECTED ]:
            ( state, { payload } ) => {
                const productType = getProductType( payload.productSlug );
                if (!productType) return state;
                const product = [...state[ productType ]];

                product.setSelectedById( payload.id.toString() );

                return { ...state,
                    [ productType ]: product
                }
            },
        [ FORMAT_SET_SELECTED ]:
            (state, { payload } ) => {
                const productType = getProductType( payload.productSlug );

                const spt = state[ productType ];
                if (!spt) return  state;
                const product = [...state[ productType ]];

                product.getSelected().formats.setSelectedById( payload.id );

                return { ...state, [ productType]: product }
            },
        [ FORMAT_SET_ROTATION ]:
            (state, { payload } ) => {
                const productType = getProductType( payload.productSlug );
                if (!productType) return state;

                const product = [...state[ productType ]];

                //если есть formatId, значит задается из редактора
                if ( product && payload.formatId ) {
                    const selectedProduct = product.getNewSelected();
                    const format = selectedProduct.formats.getById( payload.formatId );

                    if ( format && parseInt( format.width ) !== parseInt( payload.formatWidth ) ) {
                        selectedProduct.rotatedFormats = true;
                        product.map( ( p ) => {
                            p.rotatedFormats = true;
                            return p;
                        } );
                    }
                } else {
                    product.map( ( p ) => {
                        if ( p.rotatedFormats ) {
                            delete (p.rotatedFormats);
                        } else {
                            p.rotatedFormats = true;
                        }
                        return p;
                    } );
                }

                return { ...state, [ productType ]: product };
            },
        [ OPTION_SET_SELECTED ]:
            (state, { payload } ) => {
                const productType = getProductType( payload.productSlug );
                const product = [...state[ productType ]];

                product.getNewSelected().formats.getById( payload.formatId )
                                        .options.getById( payload.filterId )
                                        .parameters.setSelectedById( payload.id );

                return { ...state, [ productType ]: product }

            },

    });


