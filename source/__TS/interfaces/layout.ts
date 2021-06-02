import { simpleID } from "../libs/tools";

export type TypeProductType = 'poster' | 'photo' | 'canvas';
export type IBlockOrderType = 'up' | 'down';


export interface ILayoutCuts {
    left: number;
    top: number;
    right: number;
    bottom: number;
    outside: boolean;
}

export interface ILayoutOption {
    id: string;
    formatOptionId: string;
    selectedOptionId: string;
    name: string;
    nameSelected: string;
    optionSlug: string;
    price: number;
}

export interface ILayoutPadding {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface ILayoutFormat {
    id: string;
    formatSlug: string;
    dpi: number;
    name: string;
    width: string;
    height: string;
    cuts: ILayoutCuts;
    padding: ILayoutPadding;
    barcodePosition: string;
}

export interface ILayoutPrintOptions {
    cropTop: number;
    cropBottom: number;
    cropLeft: number;
    cropRight: number;
}

export interface ILayoutArea {
    id: string;
    type: string;
    editable: boolean;
    pages: string[];
    printOptions: ILayoutPrintOptions;
}

export interface ILayoutPage {
    id: string;
    type: string;
    editable: boolean;
    w: number;
    h: number;
    x: number;
    y: number;
    blocksList?: string[];
}
export interface ILayoutBlock {
    content?: string;
    type: string;
    id?: string;
    disableActivity: boolean;
    r: number;
    w: number;
    h: number;
    x: number;
    y: number;
    fixedProportions? : boolean;
    mirroring: boolean;
}

export interface IContentTextShadowPosition {
    x: number
    y: number
}

export interface ILayoutAreas {
    [ key: string ]: ILayoutArea;
}

export interface ILayoutList {
    areaList: string[];
}

export interface ILayoutPages {
    [key: string]: ILayoutPage;
}

export interface ILayoutBlocks {
    [ key: string ]: ILayoutBlock;
}

export interface ILayoutColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface ICreateContentBackground {
    id?: string;                     // id
    backgroundType: string;          // png/jpg/fill
    backgroundId: string | null      // id картинки
    x: number;                       // позиция слева
    y: number;                       // позиция от верха
    w: number;                       // Ширина
    h: number;                       // Высота
    r: number;                       // Угол поворота фона
    pxWidth: number;                 // Ширина картинки оригинала в px
    pxHeight: number;                // Высота картинки оригинала в px
    isPattern?:  boolean;            //  Патерн или нет
    patternWidth?: number;           //  Размер элемента паттерна
    patternHeight?: number;          //  Размер элемента паттерна
    bgColor?: ILayoutColor;          //  Цвет закраски фона
    mirroredX?: boolean;             //  Отражение картинки/патерна по Х
    mirroredY?: boolean;             //  Отражение картинки/патерна по Y
    opacity?: number;                //  Прозрачность картинки/патерна
    type?: string;                   //  Тип элемента
}

export interface ILayoutContentPhoto {
    id: string;
    importFrom: string;
    orig: string;
    photoId: string;
    pxHeight: number;
    pxWidth: number;
    r: number;
    type: string;
    url: string;
    w: number;
    h: number;
    x: number;
    y: number;
}

export interface ILayoutContentText {
    id?: string;
    type: string;
    fontFamilyId: number;
    color: ILayoutColor;
    size: number;
    dx: number;
    dy: number;
    lineHeight: number;
    bold: boolean;
    italic: boolean;
    horizontal: string;
    vertical: string;
    text: string;
    textLines: string[];
    strokeColor: ILayoutColor;
    strokeWidth: number;
    padding: number;
    borderRadius: number;
    bgColor: ILayoutColor;
    shadowColor: ILayoutColor;
    shadowSize: number;
    shadowPosition: IContentTextShadowPosition;
}

export interface ILayoutContents {
    [ key: string ]: any //ILayoutContentPhoto | ILayoutContentText
}

export interface ITheme {
    id: string;
    layoutParentId: string;
    name: string;
}

export interface ILayout {
    id: string;
    name: string;
    saveIteration: number;
    productId: string;
    productSlug: string;
    description: string;
    userTitle: string;
    themeId: string;
    userId: string;
    lastChanged: number;
    isCompleted?: boolean;
    isDeleted?: boolean;
    isPaid?: boolean;
    inCart?: boolean;
    preview: string;
    theme?: ITheme;
    format: ILayoutFormat;
    options: ILayoutOption[];
    techOptions: string[],
    areasList: string[];
    areas: ILayoutAreas;
    pages: ILayoutPages;
    blocks: ILayoutBlocks;
    contents: ILayoutContents;
    photoIds: string[];
    created?: string;
    updated?: string | null;
    deleted?: string | null;
    config?: any;
    productGroupSlug?: any;
}

export interface ICreateLayout {
    id?: string;
    userId: string;
    name: string;
    productId?: string;
    productSlug?: string;
    themeLayout?: any;
    description?: string;
    format: ILayoutFormat;
    options?: ILayoutOption[];
    photoIds: string[];
    productType?: TypeProductType;
    isCreateThemeFormat?: boolean;
    productGroupSlug?: string;
}
