//Получение фотографий продукта
import { IPhoto } from "__TS/interfaces/photo";

/**
 * Селектор получения массива фотографий в библиотеке продукта
 * @param state
 */
export const productPhotosSelector = ( state: any ): IPhoto[] | null => state.productData && state.productData.photos || null;

/**
 * Селектор получения фотографии из библиотеки продукта по photoId
 * @param state
 * @param photoId
 */
export const productPhotoByIdSelector = ( state: any, { photoId }: { photoId: string } ): IPhoto => {
    const photos = <IPhoto[]>productPhotosSelector( state );

    if ( photos ) {
        //получим объект фотографии по id фотографию
        const photosObject: IPhoto[] = photos.filter( ( photo: IPhoto ) => photo.photoId === photoId );

        if ( photosObject.length ) {
            return photosObject[ 0 ]
        }
    }
    return null;
}




