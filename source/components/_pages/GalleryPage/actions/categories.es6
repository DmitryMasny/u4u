import { GALLERY_SET_CATEGORIES, GALLERY_GET_CATEGORIES } from 'const/actionTypes';

//получение категорий с сервера
export const getCategoriesAction = () => (
    {
        type: GALLERY_GET_CATEGORIES,
        payload: {
            actions: {
                inProgress: () => ({ type: 0 }),
                inSuccess: ( { response } ) => ({type: GALLERY_SET_CATEGORIES, payload: response}),
                inFail: () => ({ type: 0 })
            }
        }
    }
);