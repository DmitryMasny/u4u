import {IlibraryItemTags} from "../../components/Library/_interfaces";

/**
 * Интерфесы админки стикеров
 */

type IcurrentBackgroundPackStatus = 'enable'|'disable';

export interface IadminBackgrounds {

}

export interface IadminBackgroundPacksPanel {
    activeId?: string;
    onSelect?: (id:string)=>any;
    onSortEnd?: ({ oldIndex, newIndex }: any)=>any;
    list?: IadminBackgroundsList[] | boolean;
    createBackgroundPackAction?: any;
    isInModal?: boolean;
    sort?: boolean;
    axis?: string;
}

export interface IadminBackgroundsList {
    id: string;                     // id
    name: string;                   // Название стикерпака
    // thumb?: IthumbSvgPng;           // Обьект иконки стикерпака
    sortIndex?: number;             // Индекс сортировки
    published?: boolean;            // Стикерпак опубликован
}
export interface Ibackground {
    id: string;
    svg?: string;                   // svg
    src?: string;                   // ссылка на картинку
    srcMedium?: string;             // ссылка на картинку
    repeatBackground?: boolean;     // Использовать как узор
    // usedAsAThumbnail?: boolean;     // Используется как превьюшка стикерпака
    selected?: boolean;             // выбран в мультивыборе
    size?: {                        // размеры картинки стикера
        width?: number;
        height?: number;
    };
    ext?: string;                   // формат файла
    // urls?: any;                     // Урлы разных размеров
    sortIndex?: number;             // индекс сортировки
    backgroundSet?: string;            // id коллекции, к которой принадлежит стикер
    tags?: IlibraryItemTags;        // метки
}


export interface IBackgroundConfig {
    sm: string;
    ms: string;
    md: string;
    orig: string;
    path: string;
    ext: string;
}

export interface IcurrentBackgroundPack {
    id: string;
    backgroundsList?: Ibackground[],
    name?: string;
    isLoading?: boolean;
    status: IcurrentBackgroundPackStatus;
    config?: IBackgroundConfig;
    sortIndex?: number;
}

export interface IadminCurrentBackgroundPack {
    onSelectBackgroundAction?: any;
    showAddBackgroundsModalAction?: any;
    showMoveBackgroundsModalAction?: any;
    showConstrainProportionsAction?: any;
}
