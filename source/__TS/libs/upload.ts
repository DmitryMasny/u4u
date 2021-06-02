import {
    modalUploadStickersAction,
    modalUploadBackgroundsAction,
} from "__TS/actions/modals";

/**
 * Загрузка стикеров
 */
export const uploadSticker = ( o ) => new Promise((resolve, reject) => {

    modalUploadStickersAction(o, (data) => {
        if (data) {
            resolve(data);
        } else reject();
    });

});
/**
 * Загрузка фонов
 */
export const uploadBackground = ( o ) => new Promise((resolve, reject) => {

    modalUploadBackgroundsAction(o, (data) => {
        if (data) {
            resolve(data);
        } else reject();
    });

});