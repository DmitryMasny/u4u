import { ILayoutColor } from "./layout";

export interface IBackgroundConfig {
    sm: string;
    ms: string;
    md: string;
    orig: string;
    path: string;
    ext: string;
}

export interface IBackgroundPack {
    id: string;
    name: string;
    sortIndex: number;
    status: string;
    backgroundList: IBackground[];
    config: {
        background: IBackgroundConfig;
    }
}

export interface IBackground {
    id: string;
    backgroundSet: string;
    repeatBackground: boolean;
    size: {height: number, width: number};
    sortIndex: number;
    src?: string;
    tags?: any;
}

export interface IUpdateContentBackground {
    isPattern?:  boolean;            //  Патерн или нет
    patternWidth?: number;           //  Размер элемента паттерна
    patternHeight?: number;          //  Размер элемента паттерна
    bgColor?: ILayoutColor;          //  Цвет закраски фона
    mirroredX?: boolean;             //  Отражение картинки/патерна по Х
    mirroredY?: boolean;             //  Отражение картинки/патерна по Y
    opacity?: number;                //  Прозрачность картинки/патерна
}

/*
export interface IStickerPackThumb {
    type: string;
    svg?: string;
    pngId?: string;
}

export interface IStickerIconFrom {
    constrainProportions: boolean;
    width: string | null;
    height: string | null;
    id: string;
    sortIndex: number;
    stickerSet: string;
}

export interface IStickerPack {
    id: string;                     // id
    name: string;                   // Название стикерпака
    thumb: IStickerPackThumb;       // Обьект иконки стикерпака
    sortIndex: number;              // Индекс сортировки
    stickersList: string[];         // Массив id стикеров пака
}

export interface ISticker {
    id: string;                     // id
    stickerSet: string;             // id пака куда входит стикер
    svg?: string;                   // svg код сстикера
    orig?: string;                  // png url оригинал
    mid?: string;                   // png url средняя
    thumb?: string;                 // png url миниатюра
    sortIndex: number;              // Индекс сортировки
    width: number;                  // Ширина стикера
    height: number;                 // Высота стикера
    viewBoxWidth?: number;          // Ширина viewBox
    viewBoxHeight?: number;         // Высота viewBox
    constrainProportions: boolean;  // Нужно ли стикеру сохранять пропорции
    stickersList: string[];         // Массив id стикеров пака
}*/
