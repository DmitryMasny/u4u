
//получение категорий из state
export const galleryCategoriesSelector = state => state.gallery.categories;

//получение тем по параметрам из кеша
const getThemeDataFromStore = ( { themes, category, format, page, specProject = null} ) => {

    let key = 'category:' + (category || 0) + '-format:' + format + '-page:' + page;
    if ( specProject ) key += '-spec:' + specProject;
    return themes[ key ];
};

const checkData = ( data ) => {
    if (data && data.data) {
        return data.data;
    } else {
        return null;
    }

    //TODO: временно убираем проверку
    if (data && data.data && data.time) {
        const currentTime = + new Date();

        //console.log('Данные устарели на ', new Date(currentTime - data.time).getMinutes(), ' минут (порог 10 минут)');
        if (new Date(currentTime - data.time).getMinutes() < 1) { //если прошло не больше 10 минут
            return data.data
        }
    }
    return null;
};

export const galleryPageSelector  = state => state.gallery.page;

//export const galleryPageTotalSelector = state => state.gallery.totalPages;

export const galleryInProgressSelector = state => state.gallery.inProgress;

//получение количества страниц по текущим параметрам
export const galleryThemesTotalElementsSelector = ( state, productSlug, categoryId ) => {
    const data = galleryThemesSelector( state, productSlug, categoryId );
    return data && data.totalElements || null;
};

//получение данных темы по текущим параметрам
export const galleryThemesDataSelector = ( state, productSlug, categoryId ) => checkData( galleryThemesSelector( state, productSlug, categoryId ) );

//получение данных темы по параметрам
export const galleryThemesDataByParamsSelector = (state, params) => checkData(galleryThemesByParamsSelector(state, params));

//получиение объекта темы в разрезе категории, формата и страницы
export const galleryThemesSelector = ( state, productSlug, categoryId ) => galleryThemesByParamsSelector( state, {
    category: categoryId,
    format: state.products.selected[ productSlug ].formatId,
    page: galleryPageSelector( state )
});


//получиение объекта темы в разрезе категории, формата и страницы по параметрам
export const galleryThemesByParamsSelector = ( state, { category, format, page } ) => getThemeDataFromStore({
    themes: state.gallery.themes,
    category: category,
    format: format,
    page: page,
    specProject: specProjectSelector( state )
});


export const specProjectSelector = ( state ) => state.gallery.specProject;
//текущий спец проект
//export const galleryCurrentSpecProjectSelector = state => state.gallery.specProjectWord;
