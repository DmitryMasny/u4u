/**
 * Константы редактора
 */

// Размеры панелей
export const EDITOR_SIZES = {
    HEADER:     40,         // Высота шапки
    HEADER_XS:  40,         // Высота шапки xs
    ACTION_PANEL:     0,//62,   // Высота панели инструментов
    ACTION_PANEL_XS:  0,//40,   // Высота панели инструментов xs
    LIBRARY_SHIFT_SIZE: 10, // Толщина полоски сдвига библиотеки
    LIBRARY_SHIFT_SIZE_XS: 10, // Толщина полоски сдвига библиотеки (моб.)
    LIBRARY_WIDTH:  320,    // Ширина библиотеки
    LIBRARY_MAX_WIDTH:  700,// max Ширина библиотеки
    LIBRARY_MIN_WIDTH:  150,// min Ширина библиотеки
    LIBRARY_HEIGHT:  250,   // Высота библиотеки (моб.)
    LIBRARY_MAX_HEIGHT: 550,// max Высота библиотеки (моб.)
    LIBRARY_MIN_HEIGHT: 150,// min Высота библиотеки (моб.)
    BTN_HEIGHT: 40,         // default высота кнопки
    NAV_PANEL_HEIGHT: 39,   // высота панели навигации
    NAV_PANEL_HEIGHT_XS: 49,   // высота панели навигации

    PAGES_LAYOUT_HEIGHT: 50,        // высота конкретно страницы layout
    PAGES_MOBILE_LAYOUT_HEIGHT: 20,        // высота конкретно страницы layout [mob]
    PAGES_PAGE_PADDING: 5,  // поля страницы в панели страниц
    PAGES_PAGE_MARGIN: 3,   // отступы страницы в панели страниц
    PAGES_TITLE_HEIGHT: 10, // отступ под текст
    PAGES_TITLE_SIZE: 10,   // размер шрифта
    PAGES_PAGE_HEIGHT: 0,           // высота одной страницы в панели страниц (РАСЧЁТ)
    PAGES_MOBILE_PAGE_HEIGHT: 0,    // высота одной страницы в панели страниц (РАСЧЁТ) [mob]
    PAGES_SLIDER_ITEM_HEIGHT: 0,    // высота обертки одной страницы в панели страниц (РАСЧЁТ)
    PAGES_MOBILE_SLIDER_ITEM_HEIGHT: 0,    // высота обертки одной страницы в панели страниц (РАСЧЁТ) [mob]
    PAGES_HEIGHT:  0,               // Высота панели страниц (РАСЧЁТ)
    PAGES_MOBILE_HEIGHT:  0,               // Высота панели страниц (РАСЧЁТ)
    PAGES_SCROLLBAR_HEIGHT: 15,     // Высота скроллбара панели страниц

};

EDITOR_SIZES.PAGES_PAGE_HEIGHT = EDITOR_SIZES.PAGES_LAYOUT_HEIGHT + EDITOR_SIZES.PAGES_TITLE_HEIGHT + EDITOR_SIZES.PAGES_PAGE_PADDING*2;
EDITOR_SIZES.PAGES_SLIDER_ITEM_HEIGHT = EDITOR_SIZES.PAGES_PAGE_HEIGHT + EDITOR_SIZES.PAGES_PAGE_MARGIN*2;
EDITOR_SIZES.PAGES_HEIGHT = EDITOR_SIZES.PAGES_SLIDER_ITEM_HEIGHT + EDITOR_SIZES.PAGES_SCROLLBAR_HEIGHT;

EDITOR_SIZES.PAGES_MOBILE_PAGE_HEIGHT = EDITOR_SIZES.PAGES_MOBILE_LAYOUT_HEIGHT + EDITOR_SIZES.PAGES_TITLE_HEIGHT + EDITOR_SIZES.PAGES_PAGE_PADDING*2;
EDITOR_SIZES.PAGES_MOBILE_SLIDER_ITEM_HEIGHT = EDITOR_SIZES.PAGES_MOBILE_PAGE_HEIGHT + EDITOR_SIZES.PAGES_PAGE_MARGIN*2;
EDITOR_SIZES.PAGES_MOBILE_HEIGHT = EDITOR_SIZES.PAGES_MOBILE_SLIDER_ITEM_HEIGHT;

// табы - разделы редактора
export const EDITOR_TABS = {
    //THEME:      'theme',      // Тема
    PHOTOS:     'photos',       // Фотографии
    BACKGROUNDS: 'backgrounds', // Фоны
    TEXT:       'text',         // Текст
    FRAMES:     'frames',       // Рамки
    STICKERS:   'stickers',     // Стикеры
    TEMPLATES:  'templates',    // Шаблоны,
};

export const TIME_SAVE_INTERVAL: number = 10000000000; //ms
export const LS_RECOVER_LAYOUT: string = 'layout_recover_data'; //local storage save