import createReducer from "./createReducer";
import { EDITOR_TABS } from '__TS/components/Editor/_config'
import { selectLibraryItem } from 'libs/helpers'

import {
    EDITOR_NEXT_TURN,
    EDITOR_PREV_TURN,
    EDITOR_SET_TAB,
    EDITOR_TOGGLE_PAGES_PANEL,
    EDITOR_SET_PHOTOS_LIBRARY,
    EDITOR_SET_THEMES_LIBRARY,
    EDITOR_SET_TEXT_LIBRARY,
    EDITOR_SET_FRAMES_LIBRARY,
    EDITOR_SET_STICKERS_LIBRARY,
    EDITOR_SET_TEMPLATES_LIBRARY,
    EDITOR_SET_PHOTOS_LIBRARY_SELECTION,
    EDITOR_SET_THEMES_LIBRARY_SELECTION,
    EDITOR_SELECT_THEME,
    EDITOR_SELECT_PHOTO,
    EDITOR_SET_CONTROL_ELEMENT_ID,
    EDITOR_UPDATE_BLOCK_DATA,
    EDITOR_TOGGLE_PHOTO_SHOW_ONLY_USED,

    EDITOR_ADD_NOT_GOOD_PHOTO,
    EDITOR_DELETE_NOT_GOOD_PHOTO,
    EDITOR_ADD_NOT_ACCEPTED_PHOTO,
    EDITOR_DELETE_NOT_ACCEPTED_PHOTO,
    EDITOR_CLEAR_NOT_GOOD_AND_NOT_ACCEPTED_PHOTO,


    EDITOR_SET_LIBRARY_RESIZING,
    EDITOR_SET_MAGNETIC,
    EDITOR_RATIO,
    EDITOR_SET_FULLSCREEN_LOADER,
    EDITOR_SET_SELECTED_AREA,
    SET_EXIT_CONFIRM_MODAL
} from 'const/actionTypes';


export default createReducer(
    {
        tab : EDITOR_TABS.PHOTOS,
        pagesPanelExpand: false,
        libraryResizing: false,
        magnetic: true,
        notGoodPhotos: {},
        notAcceptedPhotos: {},

        // Содержимое библиотек
        photosLibrary: null,
        themesLibrary: null,
        textLibrary: null,
        framesLibrary: null,
        stickersLibrary: null,
        templatesLibrary: null,

        // Редактирование темы в редакторе
        themeId: '',
        themeFormats: null,
        themeName: null,
        themeCategory: null,
        themeIsPublished: true,

        // Последний выбранный элемент в библиотеке
        lastSelectedPhoto: null,
        lastSelectedTheme: null,

        // Режим выделения в библиотеке
        photosLibrarySelection: null,
        themesLibrarySelection: null,
        templatesLibrarySelection: null,

        selectedArea: 1,
        selectedPage: 1,
        controlElementId: 0,
        controlElementType: '',
        controlWidthPx: 0, //TODO выпилить, так как есть ratio

        ratio: 1,

        photoLibraryShowOnlyNotUsed: false,

        fullscreenLoader: true,     // лоадер на всю страницу редактора
        exitConfirmModal: null,
        /*
        productData: {
            id: '123456-12345-1234',
            userId: '3453453453453454345',
            type: 'poster',
            themeId: '5434345354332234244',
            name: 'Название постера',
            format: {
                w: 200, //мм
                h: 200  //мм
            },
            coverType: '', //???
            lamination: 'gloss',
            photos: [],
            backgrounds: [],
            stickers: [],

            turns: [
                {
                    id: 'turn-id-1',
                    type: 'page',
                    pages: [
                        'page-id-1',
                    ]
                }
            ],
            content: {
                'cont-1': {
                    type: 'photo',
                    x: 0, //координата Х в мм
                    y: 0, //координата Y в мм,
                    w: 200, //110.04484302, //ширина в мм,
                    h: 327.13936439, //180, //высота в мм
                    r: 0,  //угол поворота
                    url: 'https://lh3.googleusercontent.com/5m3dvCpW0ZPsAoFpuquGfDNDD6gQide5PxCdb8H-VkcS0qHc3iPXmoQFFfuEVF1bqvPbAAPti8VFEaJLkL9_JZZ5=w1000'
                }
            },
            pages: {
                'page-id-1': {
                    x: 0, //позиция страницы по горизонтали
                    y: 0, //позиция страницы по вертикали
                    w: 200, //ширина страницы вертикали
                    h: 200, //высота страницы по вертикали

                    shadow: 'none',
                    blocks: [
                        {
                            id: 'block-id-1',
                            type: 'empty',
                            disableActivity: true, //запрещаем перемещать поворачивать и менять размеры
                            x: 0, //координата Х в мм
                            y: 0, //координата Y в мм
                            w: 200, //ширина в мм
                            h: 200, //высота в мм
                            r: 0,  //угол поворота

                            zIndex: 5, //глубина
                            content: 'cont-1'
                        },
                    ]
                }
            }
        },

        /*
        productData: {
            id: '123456-12345-1234',
            userId: '3453453453453454345',
            type: 'photobook',
            themeId: '5434345354332234244',
            name: 'Название фотокниги',
            format: {
                w: 200, //мм
                h: 200  //мм
            },
            blockSize: { //размер одного turn (разворота) блока
                w: 400, //мм
                h: 200  //мм
            },
            coverType: 'hard-cover', //???
            lamination: 'gloss',
            photos: [],
            backgrounds: [],
            stickers: [],

            turns: [
                {
                    id: 'turn-id-1',
                    type: 'page',
                    pages: [
                        'page-id-1',
                        'page-id-2',
                        //'page-id-3'
                    ]
                }
            ],
            pages: {
                'page-id-1': {
                    x: 0, //позиция страницы по горизонтали
                    y: 0, //позиция страницы по вертикали
                    w: 200, //ширина страницы вертикали
                    h: 200, //высота страницы по вертикали
                    shadow: 'right',
                    blocks: [
                        {
                            id: 'block-id-1',
                            type: 'empty',
                            x: 10, //координата Х в мм
                            y: 10, //координата Y в мм
                            w: 50, //ширина в мм
                            h: 40, //высота в мм
                            r: 25,  //угол поворота

                            oTop: 0,    //верхняя грань в мм
                            oLeft: 0,   //левая грань в мм
                            oRight: 0,  //правая грань в мм
                            oWBottom: 0, //нижняя грань в мм

                            zIndex: 5 //глубина
                        },
                        {
                            id: 'block-id-2',

                            type: 'empty',

                            x: 50, //координата Х в мм
                            y: 50, //координата Y в мм
                            w: 75, //ширина в мм
                            h: 90, //высота в мм
                            r: 0,  //угол поворота

                            oTop: 0,    //верхняя грань в мм
                            oLeft: 0,   //левая грань в мм
                            oRight: 0,  //правая грань в мм
                            oWBottom: 0, //нижняя грань в мм

                            zIndex: 3 //глубина
                        },
                        {
                            id: 'block-id-6',

                            type: 'empty',

                            x: 30, //координата Х в мм
                            y: 40, //координата Y в мм
                            w: 80, //ширина в мм
                            h: 70, //высота в мм
                            r: 0,  //угол поворота

                            oTop: 0,    //верхняя грань в мм
                            oLeft: 0,   //левая грань в мм
                            oRight: 0,  //правая грань в мм
                            oWBottom: 0, //нижняя грань в мм

                            zIndex: 2 //глубина
                        },
                    ]
                },
                'page-id-2': {
                    x: 200, //позиция страницы по горизонтали
                    y: 0, //позиция страницы по вертикали
                    w: 200, //ширина страницы вертикали
                    h: 200, //высота страницы по вертикали
                    shadow: 'left',
                    blocks: [
                        {
                            id: 'block-id-3',
                            type: 'empty',
                            x: 10, //координата Х в мм
                            y: 10, //координата Y в мм
                            w: 30, //ширина в мм
                            h: 70, //высота в мм
                            r: 0,  //угол поворота

                            oTop: 0,    //верхняя грань в мм
                            oLeft: 0,   //левая грань в мм
                            oRight: 0,  //правая грань в мм
                            oWBottom: 0, //нижняя грань в мм

                            zIndex: 1 //глубина
                        }
                    ]
                },
                'page-id-3': {
                    x: 200, //позиция страницы по горизонтали
                    y: 200, //позиция страницы по вертикали
                    w: 200, //ширина страницы вертикали
                    h: 200, //высота страницы по вертикали
                    shadow: 'top',
                    blocks: [
                        {
                            id: 'block-id-4',
                            type: 'empty',
                            x: 50, //координата Х в мм
                            y: 10, //координата Y в мм
                            w: 130, //ширина в мм
                            h: 70, //высота в мм
                            r: 0,  //угол поворота

                            oTop: 0,    //верхняя грань в мм
                            oLeft: 0,   //левая грань в мм
                            oRight: 0,  //правая грань в мм
                            oWBottom: 0, //нижняя грань в мм

                            zIndex: 4 //глубина
                        }
                    ]
                }
            }
        },
         */
    },
    {

        [EDITOR_RATIO]:
            ( state, { payload } ) => ({ ...state, ratio: payload.ratio }),

        [EDITOR_ADD_NOT_GOOD_PHOTO]:
            ( state, { payload } ) => {
                const notGoodPhoto = state.notGoodPhotos;
                notGoodPhoto[ payload.id ] = payload;
                return { ...state, notGoodPhotos: notGoodPhoto}
            },
        [EDITOR_DELETE_NOT_GOOD_PHOTO]:
            ( state, { payload } ) => {
                const notGoodPhoto = state.notGoodPhotos;
                delete (notGoodPhoto[ payload.id ]);
                return { ...state,
                    notGoodPhotos: notGoodPhoto
                }
            },
        [EDITOR_ADD_NOT_ACCEPTED_PHOTO]:
            ( state, { payload } ) => {
                const notAcceptedPhotos = state.notAcceptedPhotos;
                notAcceptedPhotos[ payload.id ] = payload;
                return { ...state, notAcceptedPhotos: notAcceptedPhotos}
            },
        [EDITOR_DELETE_NOT_ACCEPTED_PHOTO]:
            ( state, { payload } ) => {
                const notAcceptedPhotos = state.notAcceptedPhotos;
                delete (notAcceptedPhotos[ payload.id ]);
                return { ...state,
                    notAcceptedPhotos: notAcceptedPhotos
                }
            },
        [EDITOR_CLEAR_NOT_GOOD_AND_NOT_ACCEPTED_PHOTO]:
            ( state ) => {
                return { ...state,
                    notGoodPhotos: {},
                    notAcceptedPhotos: {}
                }
            },
        [EDITOR_NEXT_TURN]: //следующий разворот
            ( state ) => {
                const currentTurn = state.selectCurrentTurnShown,
                      turnsCount = state.productData.turns.length,
                      turn = currentTurn < turnsCount ? currentTurn + 1 : currentTurn;

                return { ...state, selectCurrentTurnShown: turn}
            },
        [EDITOR_PREV_TURN]: //предыдущий разворот
            ( state ) => {
                const currentTurn = state.selectCurrentTurnShown,
                      turn = currentTurn > 1 ? currentTurn - 1 : currentTurn;
                return { ...state, selectCurrentTurnShown: turn }
            },

        // Выбрать таб
        [EDITOR_SET_TAB]:
            (state, {payload}) => ({ ...state, tab: payload }),
        // Уставаливаем текущую выбранную Area
        [EDITOR_SET_SELECTED_AREA]:
            ( state, { payload } ) => ({ ...state, selectedArea: payload }),
        // Выбрать таб
        [EDITOR_SET_MAGNETIC]:
            (state, {}) => ({ ...state, magnetic: !state.magnetic }),
        // Активен ли ресайз
        [EDITOR_SET_LIBRARY_RESIZING]:
            (state, {payload}) => ({ ...state, libraryResizing: payload }),
        // Свернуть/Развернуть панель страниц
        [EDITOR_TOGGLE_PAGES_PANEL]:
            (state) => ({ ...state, pagesPanelExpand: !state.pagesPanelExpand }),
        // Модалка подтверждения выхода
        [SET_EXIT_CONFIRM_MODAL]:
            (state, { payload }) => ({ ...state, exitConfirmModal: payload }),

        [EDITOR_SET_CONTROL_ELEMENT_ID]:
            ( state, { payload } ) => {
                let useTab = state.tab;

                //устанавливаем нужный таб
                switch( payload.blockType ) {
                    case 'photo': useTab = EDITOR_TABS.PHOTOS; break;
                    case 'text': useTab = EDITOR_TABS.TEXT; break;
                    case 'sticker': useTab = EDITOR_TABS.STICKERS; break;
                    case 'shape': useTab = EDITOR_TABS.SHAPES; break;
                    case 'background': useTab = EDITOR_TABS.BACKGROUNDS; break;
                }

                return {
                    ...state,
                    tab: useTab,
                    controlWidthPx: payload.widthPx,
                    controlElementId: payload.blockId,
                    controlElementType: payload.blockType
                }
            },
        [EDITOR_TOGGLE_PHOTO_SHOW_ONLY_USED]:
            ( state ) => ({ ...state, photoLibraryShowOnlyNotUsed: !state.photoLibraryShowOnlyNotUsed }),

        /**
         * Библиотеки
         */
        // Запись в библиотеку Фотографий
        [EDITOR_SET_PHOTOS_LIBRARY]:
            (state, {payload}) => ({ ...state, photosLibrary: (state.photosLibrary && payload.add) ? [...state.photosLibrary, ...payload.list] : [...payload.list] }),
        // Запись в библиотеку Фонов
        [EDITOR_SET_THEMES_LIBRARY]:
            (state, {payload}) => ({ ...state, themesLibrary: (state.themesLibrary && payload.add) ? [...state.themesLibrary, ...payload.list] : [...payload.list] }),
        // Запись в библиотеку Текста
        [EDITOR_SET_TEXT_LIBRARY]:
            (state, {payload}) => ({ ...state, textLibrary: payload }),
        // Запись в библиотеку Рамок
        [EDITOR_SET_FRAMES_LIBRARY]:
            (state, {payload}) => ({ ...state, framesLibrary: payload }),
        // Запись в библиотеку Стикеров
        [EDITOR_SET_STICKERS_LIBRARY]:
            (state, {payload}) => ({ ...state, stickersLibrary: payload }),
        // Запись в библиотеку Шаблонов
        [EDITOR_SET_TEMPLATES_LIBRARY]:
            (state, {payload}) => ({ ...state, templatesLibrary: payload }),

        // Мультивыбор фоток вкл./выкл.
        [EDITOR_SET_PHOTOS_LIBRARY_SELECTION]:
            (state, {payload}) => ({ ...state, photosLibrarySelection: !state.photosLibrarySelection }),
        // Мультивыбор фонов вкл./выкл.
        [EDITOR_SET_THEMES_LIBRARY_SELECTION]:
            (state, {payload}) => ({ ...state, themesLibrarySelection: !state.themesLibrarySelection }),
        // Мультивыбор шаблонов вкл./выкл.
        [EDITOR_SET_THEMES_LIBRARY_SELECTION]:
            (state, {payload}) => ({ ...state, templatesLibrarySelection: !state.templatesLibrarySelection }),

        // Выбор фото
        [EDITOR_SELECT_PHOTO]:
            (state, { payload }) => {
                const { list, lastSelected } = selectLibraryItem({
                    itemId: payload.id,
                    shiftKey: payload.shiftKey,
                    sourceList: state.photosLibrary,
                    lastSelected: state.lastSelectedPhoto
                    // maxSelectCount: payload.max,
                });
                return ({...state, photosLibrary: list, lastSelectedPhoto:lastSelected})
            },
        // Выбор фона
        [EDITOR_SELECT_THEME]:
            (state, { payload }) => {
                const { list, lastSelected } = selectLibraryItem({
                    itemId: payload.id,
                    shiftKey: payload.shiftKey,
                    sourceList: state.themesLibrary,
                    lastSelected: state.lastSelectedTheme
                    // maxSelectCount: payload.max,
                });
                return ({...state, themesLibrary: list, lastSelectedTheme:lastSelected})
            },

        // Выбор фона
        [EDITOR_SET_FULLSCREEN_LOADER]:
            (state, { payload }) => {
                return ({...state, fullscreenLoader: payload})
            },


    }
);