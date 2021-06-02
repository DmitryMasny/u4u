/** Interfaces */
export interface ISizeOrig {
    pxWidth: number;
    pxHeight: number;
}
export interface IPhoto {
    id?: string;
    selected?: boolean;
    url: string;
    orig: string;
    photoId: string;
    orientation: string;
    importFrom: string;
    sizeOrig: ISizeOrig;
    usedCount?: number;
}

export interface IPhotosArray {
    photosList: IPhoto[]
}