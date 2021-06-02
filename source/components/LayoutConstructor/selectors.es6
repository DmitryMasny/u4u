import { createSelector } from 'reselect';

const product = state => {
    if (state.productData && state.productData.layout) {
        return state.productData.layout.layout || state.productData.layout
    } else {
        return null;
    }
}
const editor  = state => state.editor;

export const selectSelectedArea = state => state.editor && state.editor.selectedArea || 1;
export const selectBlockSize    = state => product( state ).blockSize;

export const selectCurrentControlElementId = state => state.editor && state.editor.controlElementId || 0;
export const selectCurrentControlElementType = state => state.editor && state.editor.controlElementType || '';

export const isMagneticSelector = ( state ) => editor( state ).magnetic;

//получение текущей зоны (области, разворота)
export const selectCurrentArea = createSelector(
    state => product( state ).areasList,
    state => product( state ).areas,
    ( state, areaNum ) => areaNum || selectSelectedArea( state ),
    ( areasList, areas, areaNum ) => {
        return areas[ areasList[ areaNum - 1 ] ]
    }
);

export const selectAreaByIdSelector = ( state, areaId ) => {
    const layout = product( state );
    if ( !layout ) return false;
    return layout.areas[ areaId ];
}

export const selectGetAllAreasIdsSelector = ( state ) => {
    return product( state ).areasList;
    const layout = product( state );
    if ( !layout ) return false;
    return layout.areasList;
}

//получение страниц
/*
export const selectCurrentPages = createSelector(
    state => product( state ).pages,
    selectCurrentTurn,
    ( pages, currentTurn ) =>
        currentTurn.pages.map( ( pageId ) => {
            const page = pages[ pageId ];
            page.pageId = pageId; //добавляем id страницы в объект страницы
            return page;
        } )
);*/

export const selectContent = ( state, id ) => {
    const content = product( state ).contents;
    if ( !content ) return null;

    return content[id];
};

export const selectIsCompletedSelector = ( state ) => {
    const layout = product( state );
    if ( !layout ) return false;
    return (layout.isCompleted && !!Object.keys( layout.contents ).length);
};

export const selectIsHaveContentSelector = ( state ) => {
    const layout = product( state );
    if ( !layout ) return false;
    return !!(Object.keys( layout.blocks ).length)//Object.keys( layout.contents ).length);
}


export const selectIsLibraryResizing = ( state ) => {
    return state.editor.libraryResizing;
};

export const selectBlocks = ( state ) => {
    const blocks = product( state ).blocks;
    if ( !blocks ) return [];

    return blocks;
};

export const selectCurrentFormatDPI = state => {
    const p = product( state ).format;
    return p.dpi;
};

export const selectCurrentFormatId = state => {
    const p = product( state ).format;
    return p.id;
};
export const selectCurrentFormat = state => {
    const p = product( state ).format;
    return p;
};


//получение страниц (без кеша)
export const selectCurrentPages = ( state, areaNum = null, areaId = null ) => {
    // console.log('product( state )',product( state ));

    const pages = product( state ).pages;
    const currentArea = areaId && product( state ).areas[ areaId ] || selectCurrentArea( state, areaNum );

    // console.log( 'currentArea', currentArea );

    return currentArea.pages.map( ( pageId ) => {
        const page = pages[ pageId ];
        //page.pageId = pageId; //добавляем id страницы в объект страницы
        return page;
    } )
};

//считаем размер разворота по содержамимся в нем страницам
export const selectCalculateAreaSize = createSelector(
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
)
