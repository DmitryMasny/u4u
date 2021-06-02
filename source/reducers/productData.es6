import createReducer from "./createReducer";

import {
    EDITOR_UPDATE_BLOCK_DATA,
    PRODUCT_PUT_PRODUCT_DATA,
    PRODUCT_UPDATE_PRODUCT_DATA,
    PRODUCT_UPDATE_CONTENT_PHOTO,
    PRODUCT_UPDATE_CONTENT_POSITION,
    PRODUCT_UPDATE_ITERATION,
    EDITOR_UPDATE_ACTION_READY_STATUS,
    EDITOR_SET_SELECTED_AREA,
    PRODUCT_SET_IS_COMPLETED,
    PRODUCT_CLEAR_DATA,
    PRODUCT_AREA_SET_LIST_IDS,
    PRODUCT_RESET_CHANGES_COUNT
} from 'const/actionTypes';
import { updateLayoutContent, updatePositionLayoutContent } from "libs/layout";


export default createReducer(
    /*
    {
        id: '654932154982436',
        userId: '0123571113',
        name: 'Постернейм',
        type: 'poster',
        format: {
            id: 'A0',
            name: 'A0',
            price: 3000,
            type: 'A0',
            sizeType: 'fix',
            allow_rotate: true,
            w: 841,
            h: 1189
        },
        areas: {
            'poster-12t749de-adb7-4136-48d4-ydr506b5dde4': {
                type: 'poster',
                paper_allows: [
                    {
                        id: 'poster_paper',
                        min: 1,
                        max: 1,
                        'default': 1
                    },
                    {
                        id: 'lux_paper',
                        min: 1,
                        max: 1,
                        'default': 1
                    }
                ],
                print_options: {
                    cropTop: 3,
                    cropBottom: 3,
                    cropLeft: 3,
                    cropRight: 3
                },
                pages: [
                    'page-9d8e6967-32fb-23fa-42fb-049bd52a72b0'
                ]
            }
        },
        areasList: [
            'poster-12t749de-adb7-4136-48d4-ydr506b5dde4'
        ],
        pages: {
            'page-9d8e6967-32fb-23fa-42fb-049bd52a72b0': {
                id: 'page-9d8e6967-32fb-23fa-42fb-049bd52a72b0',
                type: 'poster_page',
                disabled: true,
                shadow: 'none',
                w: 841,
                h: 1189,
                x: 0,
                y: 0,
                blocksList: [
                    'block-9d222f80-4726-2f92-9cd8-15968fc489aa'
                ],
                pageId: 'page-9d8e6967-32fb-23fa-42fb-049bd52a72b0'
            }
        },
        content: {
            'content-6d761ad2-e8e5-7f7a-78bf-9d2f17f4d4b6': {
                id: 'content-6d761ad2-e8e5-7f7a-78bf-9d2f17f4d4b6',
                type: 'photo',
                x: -473,
                y: 0,
                w: 1793,
                h: 1195,
                pxWidth: 1500,
                pxHeight: 1000,
                r: 0,
                photoId: '5d67ca3c5c828a0006190f07',
                url: 'https://lh3.googleusercontent.com/sUViTyODuagqMKzZHr6jP_6Q3q0mfEthO60r5JDC7jBu47TMoFPESO3zMZqsvVOrDfsyzkhE_xnSoDzUb66_Scc',
                import_from: null
            }
        },
        blocks: {
            'block-9d222f80-4726-2f92-9cd8-15968fc489aa': {
                id: 'block-9d222f80-4726-2f92-9cd8-15968fc489aa',
                type: 'background',
                disableActivity: true,
                x: -3,
                y: -3,
                w: 847,
                h: 1195,
                r: 0,
                content: 'content-6d761ad2-e8e5-7f7a-78bf-9d2f17f4d4b6',
                pageX: 0,
                pageY: 0,
                pageW: 841,
                pageH: 1189,
                pageId: 'page-9d8e6967-32fb-23fa-42fb-049bd52a72b0'
            }
        },
        options: {
            paper: {
                id: 'id-poster_paper',
                include: 1,
                count_price: 0,
                fix_price: 0,
                name: 'Бумага для постера',
                type: 'poster_paper',
                props: {
                    size: 'format',
                    paper_thickness: 0.2,
                    paper_density: 200,
                    info: 'Описание бумаги'
                },
                optionName: 'Бумага'
            },
            lamination: {
                id: 'id-no',
                include: 0,
                count_price: 0,
                fix_price: 0,
                name: 'Нет',
                type: 'no',
                props: {},
                optionName: 'Ламинирование'
            },
            round_corners: {
                id: 'id-no',
                include: 0,
                count_price: 0,
                fix_price: 0,
                name: 'Нет',
                type: 'no',
                props: {},
                optionName: 'Закругленные углы'
            }
        }
    }
    */
    null
    ,
    {
        //Создать продукт - запись
        [ PRODUCT_CLEAR_DATA ]:
            ( state ) => {
                return { ...state, photos: null, stickers: null, layout: null }
            },
        [ PRODUCT_PUT_PRODUCT_DATA ]:
            ( state, { payload } ) => {
            // console.log('PRODUCT_PUT_PRODUCT_DATA', payload);
                let layout = payload && payload.layout ? { ...payload.layout } : null;

                //если данные пришли с сервера и нужно обновить тольтко saveIteration, обновляем только
                //saveIteration и updated
                if ( !payload.forceUpdate && layout && payload && payload.fromServer && state && state.layout ) {
                    if ( layout.id === state.layout.id ) {
                        layout = { ...state.layout };
                        //console.log( 'JSON.stringify( layout.photoIds )', JSON.stringify( layout.photoIds ) );
                        //console.log( 'JSON.stringify( state.layout.photoIds',JSON.stringify( state.layout.photoIds ) );
                        if ( JSON.stringify( layout.photoIds ) === JSON.stringify( state.layout.photoIds ) ) {
                            layout.saveIteration = payload.layout.saveIteration;
                            layout.updated = payload.layout.updated;
                            console.log( 'Меняем только saveIteration' );
                        }
                    }
                }

                /*
                let isLayoutActually = false;
                if ( payload && payload.layout && payload.layout ) {
                    let payloadLayoutUpdateDate = null;
                    if (payload.layout.updated) {
                        payloadLayoutUpdateDate = new Date( payload.layout.updated );
                    }
                    if ( !state || !state.layout || !payloadLayoutUpdateDate) {
                        isLayoutActually = true;
                    } else {
                        if ( state && state.layout && state.layout.updated ) {
                            const stateLayoutUpdateDate = new Date( state.layout.updated );
                            console.log('сравнение!');
                            if ( stateLayoutUpdateDate.getTime() < payloadLayoutUpdateDate.getTime() ) {
                                isLayoutActually = true;
                            }
                        } else {
                            isLayoutActually = true;
                        }
                    }
                }

                console.log('isLayoutActually', isLayoutActually);

                if ( isLayoutActually ) {
                    payload.layout.updated = new Date();
                    if (state && state.layout !== payload.layout.saveIteration !== state.layout.saveIteration) {
                        payload.layout = { ...payload.layout, saveIteration: state.layout.saveIteration };
                    }
                }
                */
                // console.log('PRODUCT_PUT_PRODUCT_DATA', payload);

                //мержим фото
                /*
                let photos = payload.photos;
                if ( state && state.photo && payload.photos) {

                    photos = payload.photos.map(( photo ) => {

                        return {...photo, ...state}

                    });
                }*/

                return {
                    ...state,
                    ...(layout ? {layout: layout} : {}),
                    ...(payload.photos ? {photos: payload.photos} : {}),
                    changesCount: (state && state.changesCount || 0) + 1,
                    // ...(payload.stickers ? {stickers: state ? :{
                    //     ...state.stickers,
                    //     theme: payload.stickers
                    // }} : {}),
                };
            },

        [ PRODUCT_RESET_CHANGES_COUNT ]:
            ( state ) => {
                return {
                    ...state,
                    changesCount: 0
                };
            },

        //Обновить продукт
        [ PRODUCT_UPDATE_PRODUCT_DATA ]:
            ( state, { payload } ) => {
                return state;
                // console.log('PRODUCT_UPDATE_PRODUCT_DATA', payload);
                // const updatedData = updateLayoutFormat( payload, state ) || {};
                // console.log('updatedData',updatedData);
                // return {
                //     ...state,
                //     ...updatedData
                // }
            },

        [ PRODUCT_AREA_SET_LIST_IDS ]:
            ( state, { payload } ) => {
                const layout = { ...state.layout };
                layout.areasList = payload;
                return {...state, layout: layout}
            },
        //Обновить контент продукта
        [ PRODUCT_UPDATE_CONTENT_PHOTO ]:
            ( state, { payload } ) => {
                const updatedContent = updateLayoutContent( {
                                                                data: state,
                                                                photo: payload.photo || null,
                                                                id: payload.id || null
                                                            } ) || null;
                return {
                    ...state,
                    ...{ counter: state.counter ? ++state.counter : 1 },
                    ...updatedContent && { contents: updatedContent } || {}
                }
            },

        //Обновить координаты контента продукта
        [ PRODUCT_UPDATE_CONTENT_POSITION ]:
            ( state, { payload } ) => {
                const updatedContentPosition = updatePositionLayoutContent( {
                                                                contents:  state.contents,
                                                                contentId: payload.contentId,
                                                                x: payload.x,
                                                                y: payload.y,
                                                                w: payload.w,
                                                                h: payload.h
                                                            } ) || null;
                return {
                    ...state,
                    ...{ counter: state.counter ? ++state.counter : 1 },
                    ...{ contents: updatedContentPosition }
                }
            },
        //Обновляем данные блока
        /*
        * payload : {
        *   id - id блока
        *   pageId - id страницы
        *   pageId - id страницы
        * }
        * */
        [ EDITOR_UPDATE_BLOCK_DATA ]: ( state, { payload } ) => {
            // console.log('EDITOR_UPDATE_BLOCK_DATA payload', payload);
            const productData = { ...state.productData };

            if ( productData && productData.pages ) {
                const page = productData.pages[ payload.pageId ];

                page.blocks = page.blocks.map( ( block ) => {
                    if ( block.id === payload.id ) {
                        return payload;
                    }
                    return block;
                })
            }
            return {...state, productData: productData}
        },

        [ EDITOR_UPDATE_ACTION_READY_STATUS ]: ( state, { payload } ) => {
            return { ...state, isCompleted: payload, counter: state.counter + 1 }
        },

        [ PRODUCT_UPDATE_ITERATION ]: ( state, { payload } ) => {
            console.log( 'PRODUCT_UPDATE_ITERATION payload =>', payload );
            return { ...state, saveIteration: payload }
        }
    }
);