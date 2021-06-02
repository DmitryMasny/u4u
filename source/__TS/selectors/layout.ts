//получение данных продукта (layout)
//import { IPhoto } from "../interfaces/photo";
import {
    ILayout,
    ILayoutContents,
    ILayoutBlock,
    ILayoutContentText,
    ILayoutArea,
    ILayoutPages, ILayoutPage, ILayoutBlocks
    // @ts-ignore
} from "__TS/interfaces/layout";

import {
    getParentBlock,
    getParentPage,
    getParentArea,
    getAreaIndex
    // @ts-ignore
} from '__TS/libs/layout'

export const productLayoutSelector = ( state: any ): ILayout | null => {
    return state.productData && state.productData.layout && state.productData.layout.layout || state.productData && state.productData.layout || null;
}

//получение типа продукта
export const productSlugSelector = ( state: any ): string | null => {
    const layout: ILayout | null = productLayoutSelector( state );
    return layout && layout.productSlug || null;
}

export const productFormatSlugSelector = ( state: any ): string | null => {
    const layout: ILayout | null = productLayoutSelector( state );
    const format =  layout && layout.format
    return format && format.formatSlug || null;
}

export const productPuzzleOptionTypeSelector = ( state: any ): string | null => {
    const layout: ILayout | null = productLayoutSelector( state );
    const options =  layout && layout.options
    const optionItem = options && options.filter( item => item.name === 'puzzle_size' ) || [];

    if ( optionItem.length ) {
        return optionItem[ 0 ].optionSlug;
    }

    return null;
}




export const productLayoutAreasListSelector = ( state: any ): string[] | [] => {
    const layout: ILayout | null = productLayoutSelector( state );
    return layout && layout.areasList || [];
}

export const productLayoutFormatSizeSelector = ( state: any ): { width: number, height: number } => {
    const layout: ILayout | null = productLayoutSelector( state )
    const format =  layout && layout.format

     return {
         width: format && format.width && parseInt( format.width ) || 1,
         height: format && format.height && parseInt( format.height ) || 1,
    }
}
export const productLayoutFormatDPISelector = state => {
    const layout: ILayout | null = productLayoutSelector( state )
    const format =  layout && layout.format

    return format && format.dpi;
};


export const productLayoutIsCompletedSelector = ( state: any ): boolean => {
    const layout:ILayout | null = productLayoutSelector( state );

    if ( layout && layout.isCompleted ) {
        return true
    }
    return null;
}
export const productLayoutSlug = ( state: any ): string => {
    const layout:ILayout | null = productLayoutSelector( state );
    return layout && layout.productSlug || '';
}

export const productLayoutGroupSlugSelector = ( state: any ): string => {
    const layout:ILayout | null = productLayoutSelector( state );

    return layout && layout.productGroupSlug || '';
}

export const productLayoutThemeId = ( state: any ): string => {
    const layout:ILayout | null = productLayoutSelector( state );

    return layout && layout.themeId || layout && layout.theme && layout.theme.id || '';
}

export const productLayoutParentThemeIdSelector = ( state: any ): string => {
    const layout:ILayout | null = productLayoutSelector( state );

    return layout && layout.theme && layout.theme.layoutParentId || '';
}

export const contentLayoutByBlockIdSelector = ( state: any, id: string | number ): any => {
    const layout:ILayout | null = productLayoutSelector( state );
    const block: ILayoutBlock | null = layout.blocks[ id ];

    if ( !block ) return null;

    return contentLayoutSelector( state, block.content );
}
export const layoutBlockSelector = ( state: any, id: string | number ): any => {
    const layout:ILayout | null = productLayoutSelector( state );
    return layout.blocks[ id ] || null;
}

export const layoutBlocksListSelector = ( state: any, onlyEmpty: boolean = false ): ILayoutBlock[] => {
    const layout:ILayout | null = productLayoutSelector( state );
    const list = Object.keys(layout.blocks).map( k => layout.blocks[k]);
    return onlyEmpty ? list.filter( x => x.type === 'photo' && !x.content ) : list;
}

export const numsOfAreasSelector = ( state: any): number => {
    const layout:ILayout | null = productLayoutSelector( state );
    return layout.areasList && layout.areasList.length || 1;
}

export const backgroundIdBySelectedAreaNumber = ( state: any, selectedAreaNumber: number ): string => {
    const layout: ILayout | null = productLayoutSelector( state );
    const areaList: string[] = productLayoutAreasListSelector( state );
    if ( areaList && Array.isArray( areaList ) ) {
        const selectedArea: string = areaList[ selectedAreaNumber - 1 ];

        const area: ILayoutArea = layout.areas[ selectedArea ];
        const selectedPageId: string = area.pages[ 0 ]; //TODO для фотокниг брать тоже 0 страницу?
        const selectedPage = layout.pages[ selectedPageId ];
        const blocsList = selectedPage.blocksList;

        for ( const blockId of blocsList ) {
            const block: ILayoutBlock = layout.blocks[ blockId ];
            if ( block.type === 'background') {
                if ( block.content ) {
                    return block.content;
                }
                break;
            }
        }
    }
    return null;
}

export const contentLayoutSelector = ( state: any, id: string ): any => {
    const layout:ILayout | null = productLayoutSelector( state );
    const content:ILayoutContents = layout.contents;

    if ( !content || !id ) return null;

    return content[ id ] || null;
};

/** Получить блок где лежит конкретный контент */
export const blockOfContentSelector = ( state: any, contentId: string ): ILayoutBlock => {
    const layout:ILayout | null = productLayoutSelector( state );
    return getParentBlock( { layout, contentId })
};
/** Получить страницу где лежит конкретный блок */
export const pageOfBlockSelector = ( state: any, blockId: string ): ILayoutPage => {
    const layout:ILayout | null = productLayoutSelector( state );
    return getParentPage( { layout, blockId })
};
/** Получить область где лежит конкретная страница */
export const areaOfPageSelector = ( state: any, pageId: string ): ILayoutArea => {
    const layout:ILayout | null = productLayoutSelector( state );
    return getParentArea( { layout, pageId })
};
/** Получить страницу где лежит контент */
export const pageOfContentSelector = ( state: any, contentId: string ): ILayoutPage => {
    const block = blockOfContentSelector(state, contentId )
    return pageOfBlockSelector( state, block.id )
};

/** Получить область где лежит контент */
export const areaOfContentSelector = ( state: any, contentId: string ): ILayoutArea => {
    const page = pageOfContentSelector( state, contentId )
    return areaOfPageSelector( state, page.id )
};

/** Получить область где лежит контент */
export const areaOfBlockSelector = ( state: any, blockId: string ): ILayoutArea => {
    const page = pageOfBlockSelector( state, blockId )
    return areaOfPageSelector( state, page.id )
};

/** Получить номер страницы */
export const areaIndexByAreaIdSelector = ( state: any, areaId: string ): number => {
    const layout:ILayout | null = productLayoutSelector( state );
    return getAreaIndex({ layout, areaId })
};

export const fontPropSelector = ( state: any, contentId: string, propName: string ) => {
    if ( !contentId || !propName ) return null;
    const content: ILayoutContentText = contentLayoutSelector( state, contentId );

    return content && content[propName] || null;
}

export const fontFamilyIdByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'fontFamilyId')

export const fontSizeByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'size')

export const fontLineHeightByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'lineHeight')

export const fontFontByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'bold')

export const fontItalicByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'italic')

export const fontHorizontalByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'horizontal')

export const fontVerticalByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'vertical')

export const fontColorByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'color')

export const fontBgColorByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'bgColor')

export const fontPaddingByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'padding')

export const fontBorderRadiusByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'borderRadius')

export const fontFontShadowSizeByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'shadowSize')

export const fontFontShadowColorByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'shadowColor')

export const fontFontStrokeSizeByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'strokeWidth')

export const fontFontStrokeColorByContentIdSelector = ( state: any, contentId: string ) =>
    fontPropSelector(state, contentId, 'strokeColor')


export const changesCountSelector = ( state: any ) => state.productData && state.productData.changesCount || 0