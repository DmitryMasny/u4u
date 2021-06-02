/**
 * Интерфесы библиотеки
 */
type IlibraryItemTagFileType = 'svg' | 'png' | 'jpg';

export interface Ilibrary {
    items: IlibraryItem[];
    disabled?: boolean;
    selectAction?: any;
    selectionActive?: boolean;
    sortable?: boolean;
    disableEvents?: boolean;    // Если библиотека используется только для отображения - не подсвечивать при наведении
    thumbSize?: number;
    onSortEnd?: any;
    axis?: string;
}
export interface IlibraryItem {
    id: string;
    src?: string;
    svg?: string;
    size?: any;
    selected?: boolean;
    disabled?: boolean;
    error?: boolean;
    isNamed?: boolean;          // Так как высота жестко задается, она будет зависеть, есть ли подпись под иконкой
    thumbSize?: number;
    tags?: IlibraryItemTags;
}
export interface IlibraryItemTags {
    constrainProportions?: boolean;
    useForPreview?: boolean;
    repeatBackground?: boolean;
    fileType?: IlibraryItemTagFileType;
}
export interface IimageLoaderComponent {
    constrainProportions?: boolean;
    usedAsAThumbnail?: boolean;
}