import {
    EDITOR_SET_CONTROL_ELEMENT_ID,
    EDITOR_UPDATE_BLOCK_DATA,
    EDITOR_UPDATE_ACTION_READY_STATUS
} from "const/actionTypes";

/**
 * Устанавливаем id элемента, на котором рисуем элемент управления
 */
export const actionSetCurrentControlElementId = ( { blockId, blockType, widthPx } ) => ({
    type: EDITOR_SET_CONTROL_ELEMENT_ID,
    payload: { blockId, blockType, widthPx }
});

/**
 * Обновляем данные блока
 */
export const actionUpdateBlockParams = ( data ) => ({
    type: EDITOR_UPDATE_BLOCK_DATA,
    payload: data
});

/**
 * Обновляем готовности продукта
 */
export const actionUpdateLayoutReady = ( isReady ) => ({
    type: EDITOR_UPDATE_ACTION_READY_STATUS,
    payload: isReady
});


