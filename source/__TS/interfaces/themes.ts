/**
 * Интерфейсы тем
 */
// type IlibraryItemTagFileType = 'svg' | 'png';

export interface IThemes {
    themes: ITheme[];
    disabled?: boolean;
    selectAction?: any;
    selectionActive?: boolean;
    sortable?: boolean;
    disableEvents?: boolean;    // Если библиотека используется только для отображения - не подсвечивать при наведении
    thumbSize?: number;
    formatSlug?: string;
    isMobile?: boolean;
    isAdminPage?: boolean;
    // totalElements?: number;
}
export interface IThemesPage {
    isAdminPage?: boolean;
}
export interface IThemesFilters {
    isAdmin: boolean;   // На странице тем админа показываем кнопку создать
    themesSelected: IThemesSelected;
    setThemeFilter?: any;
}
export interface IThemesSelected {
    productType?: string;
    format?: string | number;
    category?: string | number;
    page?: string | number;
    themeId?: string | number;
    redirect?: boolean;
    isNewProduct?: boolean;
    init?: boolean;
}
export interface IFormatTitle {
    format: IFormat;
}
export interface IFormat {
    id: string;
    name: string;
    icon?: any;
    width?: number;
    height?: number;
}
export interface ITheme {
    id: string;
    name?: string;
    preview?: string;
    size?: any;
    selected?: boolean;
    disabled?: boolean;
    error?: boolean;
    isNamed?: boolean;          // Так как высота жестко задается, она будет зависеть, есть ли подпись под иконкой
    thumbSize?: number;
    productGroup?: string;
    tags?: IThemeTags;
}
export interface IThemeEl {
    data: ITheme;
    thumbSize?: number;
    onClick?: any;
    isAdminPage?: boolean;
    disableSort?: boolean;
    formatSlug?: string;
    index?: number;
}

export interface IThemeTags {
    published: boolean;
    isAdminPage?: boolean;
}
export interface IThemeCategories {
    isAdmin?: boolean;
    selectedCategory?: string | number;
    productType?: string;
    setCategoryAction?: any;
}
export interface ICategory {
    id: number;
    name: string;
    selected?: boolean;
    onClick: any;
    spec?: boolean;
}
export interface IThemesProductTypes {
    compact?: boolean;
    setProductTypeAction?: any;
    selectedProductType?: string;
    isAdmin?: boolean;
}