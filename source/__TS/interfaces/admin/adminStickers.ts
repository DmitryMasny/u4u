import {IlibraryItemTags} from "../../components/Library/_interfaces";
// @ts-ignore
import { IStickerConfig } from "__TS/interfaces/stickers";

/**
 * Интерфесы админки стикеров
 */

type IcurrentStickerPackStatus = 'enable'|'disable';

export interface IadminStickers {

}

export interface IadminStickerPacksPanel {
    activeId?: string;
    onSelect?: (id:string)=>any;
    onSortEnd?: ({ oldIndex, newIndex }: any)=>any;
    list?: IadminStickersList[];
    createStickerPackAction?: any;
    isInModal?: boolean;
    sort?: boolean;
    axis?: string;
}
export interface IadminStickerPacksPanelWrap {
    props?: IadminStickerPacksPanel;
}

interface IthumbSvgPng {
    svg?: string;
    src?: string;
}
export interface IadminStickersList {
    id: string;                     // id
    name: string;                   // Название стикерпака
    thumb?: IthumbSvgPng;           // Обьект иконки стикерпака
    sortIndex?: number;             // Индекс сортировки
    published?: boolean;            // Стикерпак опубликован
    // config?: any;
    // stickersCount?: number;         // кол-во стикеров в стикерпаке
}
export interface Isticker {
    id: string;
    svg?: string;                   // svg
    src?: string;                   // ссылка на картинку
    srcMedium?: string;             // ссылка на картинку
    constrainProportions?: boolean; // Сохранять пропорции
    usedAsAThumbnail?: boolean;     // Используется как превьюшка стикерпака
    selected?: boolean;             // выбран в мультивыборе
    size?: {                        // размеры картинки стикера
        width?: number;
        height?: number;
    };
    // urls?: any;                     // Урлы разных размеров
    config?: IStickerConfig;
    sortIndex?: number;             // индекс сортировки
    stickerSet?: string;            // id коллекции, к которой принадлежит стикер
    tags?: IlibraryItemTags;        // метки
}


export interface IcurrentStickerPack {
    id: string;
    stickersList?: Isticker[],
    stickerList?: Isticker[],   // При получении стикеров продукта другое название =(
    thumb?: IthumbSvgPng;
    name?: string;
    isLoading?: boolean;
    status: IcurrentStickerPackStatus;
    changesCount?: number;
    config: any;
    iconFrom?: any;
}

export interface IadminCurrentStickerPack {
    onSelectStickerAction?: any;
    showAddStickersModalAction?: any;
    showMoveStickersModalAction?: any;
    showConstrainProportionsAction?: any;
}
