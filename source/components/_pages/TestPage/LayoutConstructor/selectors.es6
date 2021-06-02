import { createSelector } from 'reselect'

const product = state => state.editor.productData;

export const selectSelectedTurn = state => state.editor.selectedTurn || 1;
export const selectBlockSize    = state => product( state ).blockSize;

//получение разворота
export const selectCurrentTurn = createSelector(
    state => product( state ).turns,
    selectSelectedTurn,
    ( turns, turnNum ) => turns[ turnNum - 1 ]
);

//получение страниц
export const selectCurrentPages = createSelector(
    state => product( state ).pages,
    selectCurrentTurn,
    ( pages, currentTurn ) =>
        currentTurn.pages.map( ( pageId ) => {
            const page = pages[ pageId ];
            page.pageId = pageId; //добавляем id страницы в объект страницы
            return page;
        } )
);

//считаем размер разворота по содержамимся в нем страницам
export const selectCalculateTurnSize = createSelector(
    selectCurrentPages,
    ( pages ) => {
        let w0 = 0,
            h0 = 0,
            w1 = 0,
            h1 = 0;

        pages.map( ( page ) => {
            if ( w0 < page.x ) w0 = page.x;
            if ( h0 < page.y ) w0 = page.y;

            const w = page.x + page.w;
            const h = page.y + page.h;
            if ( w1 < w ) w1 = w;
            if ( h1 < h ) h1 = h;
        });

        if ( w0 < 0 ) w1 += w0;
        if ( h0 < 0 ) h1 += h0;
        return { w: w1, h: h1 }
    }
);