//получение всех типов продуктов
export const productsSelector = ( state, type ) => state.products[ type ];

//получение выбранных данных продукта
export const productsSelectedSelector = ( state, type ) => state.products.selected[ type ];

//получение превью темы по формату
export const productsSelectedThemeSelector = ( state, type, formatId ) => {
    const productSelected = state.products.selected[ type ];

    if ( !productSelected || !productSelected.theme ) return null;

    const groupId = productSelected.groupId;

    if ( !formatId ) formatId = productSelected.formatId;

    return productSelected.theme[ `preview_format_${groupId}_${formatId}` ];
};

//получение id группы выбранного продукта
export const productsSelectedGroupIdSelector = ( state, type ) => {
    const productSelected = state.products.selected[ type ];

    if ( !productSelected || !productSelected.theme ) return null;

    return productSelected.groupId;
};

//получение id группы выбранного продукта
export const productsSelectedLoadingThemesSelector = ( state, type ) => {
    const productSelected = state.products.selected[ type ];
    if ( !productSelected ) return null;

    return productSelected.loadingThemes;
};