// @ts-ignore
import { store } from "components/App";
// @ts-ignore
import {
    MODAL_UPLOAD_STICKERS,
    MODAL_CREATE_THEME,
    MODAL_ADMIN_THEME_PREVIEW,
    MODAL_ADMIN_THEME_COPY,
    MODAL_SIMPLE_PREVIEW,
    MODAL_UPLOAD_BACKGROUNDS,
    MODAL_DIALOG_ADD,
    MODAL_DIALOG_REMOVE
    // @ts-ignore
} from "const/actionTypes";

import { simpleID } from "../libs/tools";

//
// // @ts-ignore
// import { toast } from '__TS/libs/tools';

//получаем диспетчер Redux
const dispatch = store && store.dispatch;



/** Модалка загрузки стикеров */
export const modalUploadStickersAction  = ( o, uploadCallback ) => dispatch({
    type: MODAL_UPLOAD_STICKERS,
    payload: o ? {...o, uploadCallback: uploadCallback} : null
});

/** Модалка загрузки фонов */
export const modalUploadBackgroundsAction  = ( o, uploadCallback ) => dispatch({
    type: MODAL_UPLOAD_BACKGROUNDS,
    payload: o ? {...o, uploadCallback: uploadCallback} : null
});

/** Модалка создания темы */
export const modalCreateThemeAction  = ( show = false ) => dispatch({
    type: MODAL_CREATE_THEME,
    payload: show
});

/** Модалка превью темы */
export const modalAdminThemePreviewAction  = ( o:any = null ) => dispatch({
    type: MODAL_ADMIN_THEME_PREVIEW,
    payload: o
});

/** Модалка превью темы */
export const modalAdminThemeCopyAction  = ( o:any = null ) => dispatch({
    type: MODAL_ADMIN_THEME_COPY,
    payload: o
});

export const modalSimplePreviewAction  = ( o:any = null ) => dispatch({
    type: MODAL_SIMPLE_PREVIEW,
    payload: o
});

// Работа с быстрой модалкой - диалогом
export const dialogAddAction  = ( o:any = null ) => dispatch({
    type: MODAL_DIALOG_ADD,
    payload: o ? { id: simpleID(), ...o } : null
});
export const dialogRemoveAction  = ( id:string = '' ) => dispatch({ type: MODAL_DIALOG_REMOVE, payload: id });