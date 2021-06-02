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
}

export interface IStickers {
    id?: string;
    name?: string;
    sort_index?: number
    status?: string;
    icon_from?: any;
    config?: any;
    stickerList: ISticker[];
}
export interface IStickerConfig {
    sm: string;
    ms: string;
    md: string;
    orig: string;
    path: string;
    ext: string;
}