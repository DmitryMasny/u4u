// @ts-ignore
import { store } from "components/App";
import {
    ADMIN_STICKERS_GET_STICKERS,
    ADMIN_STICKERS_SET_STICKERS,
    ADMIN_STICKERS_GET_STICKER_PACK,
    ADMIN_STICKERS_SET_STICKER_PACK,
    ADMIN_STICKERS_STICKER_PACK_CREATE,
    ADMIN_STICKERS_STICKER_PACK_UPDATE,
    ADMIN_STICKERS_STICKER_PACK_DELETE,
    ADMIN_STICKERS_SET_STICKER,
    ADMIN_STICKERS_SELECT_STICKERS,
    ADMIN_STICKERS_MOVE_STICKERS,
    ADMIN_STICKERS_CLEAR,
    ADMIN_STICKERS_SELECT_STICKERPACK,
    ADMIN_STICKERS_STICKER_UPLOAD,
    ADMIN_STICKERS_ADD_UPLOADED,
    ADMIN_STICKERS_STICKER_UPDATE,
    ADMIN_STICKERS_STICKER_DELETE,
    ADMIN_THEME_STICKER_DELETE,
    ADMIN_STICKERS_STICKER_PACK_SORT,
    ADMIN_STICKERS_STICKER_SORT,
    ADMIN_STICKERS_SET_STICKER_PACK_STICKERS,
    ADMIN_STICKERS_BULK_DELETE,
    ADMIN_STICKERS_REMOVE_FROM_PACK,
// @ts-ignore
    EDITOR_STICKERS_UPDATE_STICKER,
// @ts-ignore
} from "const/actionTypes";

import {IadminStickersList, Isticker, IcurrentStickerPack,
    //IlibraryItemTags
    // @ts-ignore
} from "__TS/interfaces/admin/adminStickers";
// @ts-ignore
import {createStickerLink} from "__TS/libs/sticker";


// @ts-ignore
import { toast } from '__TS/libs/tools';

// @ts-ignore
import { arrayMove, declOfNum } from "libs/helpers";


//получаем диспетчер Redux
const dispatch = store.dispatch;


const stickerPackAdapter = (response):IcurrentStickerPack => ({
    id: response.id,
    name: response.name,
    status: response.status,
    config: response.config && response.config.sticker,
// @ts-ignore
    sortIndex: response.sortIndex,
    iconFrom: response.iconFrom,
    stickersList: response.stickerList && response.stickerList
        .map((item)=>stickersListItemAdapter(item, response.iconFrom, response.config && response.config.sticker))
        .sort((a, b) => b.sortIndex - a.sortIndex)
});

// Адаптер списка всех стикерпаков
const stickerPacksListAdapter = (response): IadminStickersList[] => response &&
response.length ?
    response
        .map((item) => stickerPacksListItemAdapter(item))
        .sort((a, b) => b.sortIndex - a.sortIndex)
    : [];

const stickerPacksListItemAdapter = (item):IadminStickersList => ({
    id: item.id,
    name: item.name,
    thumb: item.iconFrom ? {
        ...item.iconFrom,
        ...((item.iconFrom.id && item.config && item.config.sticker ) ? { src: createStickerLink({ stickerConfig: item.config.sticker, id:item.iconFrom.id , size: 'sm' }) } : {})
    } : {},
    sortIndex: item.sortIndex,
    published: item.status === 'enabled',
    // config: item.config && item.config.sticker //TODO: stickers config in redux state
    // stickersCount: item.stickers && item.stickers.length || 0,
});
// @ts-ignore
const stickersListItemAdapter = (item, iconFrom = null, config):Isticker => ({
    id: item.id,
    // svg: item.svg,
    src: createStickerLink({ stickerConfig: config, id: item.id , size: 'sm' }) ,
    srcMedium: createStickerLink({ stickerConfig: config, id: item.id , size: 'md' }) ,
    // urls: item.urls,
    // urls: {md:createStickerLink({ stickerConfig: config, id: item.id , size: 'md' })},
    constrainProportions: item.constrainProportions,
    size: {
        height: item.height,
        width: item.width,
    },
    sortIndex: item.sortIndex,
    stickerSet: item.stickerSet,
    tags: {
        constrainProportions: item.constrainProportions,
        useForPreview: iconFrom && iconFrom.id === item.id,
//         fileType: item.svg ? 'svg' : item.urls && item.urls.sm ? 'png' : '',
    }
});


/**
 * Экшены для админки стикеров
 */

/** Получить все стикерпаки */
export const getAdminStickersAction = () => {
    return dispatch({
        type: ADMIN_STICKERS_GET_STICKERS,
        payload: {
            actions: {
                inProgress: () => {
                    return { type: ADMIN_STICKERS_SET_STICKERS, payload: 'progress' }
                },
                inSuccess: ({response}) => {
                    return { type: ADMIN_STICKERS_SET_STICKERS, payload: stickerPacksListAdapter(response)};
                },
                inFail: (err)  => {
                    toast.error('Ошибка получение коллекций стикеров');
                    return { type: ADMIN_STICKERS_SET_STICKERS, payload: [] }
                }
            }
        }
    } );
};

/** Запись списка стикерпаков*/
const writeAdminStickersAction = (data) => {
    return dispatch({
        type: ADMIN_STICKERS_SET_STICKERS,
        payload: data
    } );
};

/** Получить конкретный стикерпак */
export const getCurrentStickerPackAction = (id) => {
    return dispatch({
        type: ADMIN_STICKERS_GET_STICKER_PACK,
        payload: {
            urlParams: [id],
            actions: {
                inProgress: () => {
                    return { type: ADMIN_STICKERS_SET_STICKER_PACK, payload: {
                            id: id,
                            data: {
                                id: id,
                                isLoading: true
                            }
                        }
                    }
                },
                inSuccess: ({response}) => {
                    // console.log('response',response);
                    return {
                        type: ADMIN_STICKERS_SET_STICKER_PACK,
                        payload: {
                            id: id,
                            data: stickerPackAdapter(response)
                        }
                    }
                },
                inFail: (err) => {
                    return {
                        type: ADMIN_STICKERS_SET_STICKER_PACK,
                        payload: {
                            id: id,
                            data: {error: err}
                        }
                        // return { type: ADMIN_STICKERS_SET_STICKERS, payload: {error: err} }
                    }
                }
            }
        }
    } );
};

/** Создать новый стикерпак */
export const createStickerPackAction = (name) => {
    return dispatch({
        type: ADMIN_STICKERS_STICKER_PACK_CREATE,
        payload: {
            name: name,
            status: 'disable',
            actions: {
                inSuccess: ({response}) => {
                    //console.log('createStickerPackAction response',response);
                    // callback && callback({success: response.id});
                    toast.success(`Коллекция стикеров "${name}" успешно создана`);
                    return [{
                        type: ADMIN_STICKERS_CLEAR,
                    }, {
                        type: ADMIN_STICKERS_SELECT_STICKERPACK,
                        payload: response.id
                    }]
                },
                inFail: (err) => {
                    toast.error('Ошибка создания коллекции стикеров');
                    return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                }
            }
        }
    } );
};

/** Удалить стикерпак */
export const deleteStickerPackAction = (id, callback) => {
    return dispatch({
        type: ADMIN_STICKERS_STICKER_PACK_DELETE,
        payload: {
            urlParams: [id],
            actions: {
                inSuccess: ({response}) => {
                    callback && callback();
                    return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                },
                inFail: (err) => {
                    callback && callback();
                    return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                }
            }
        }
    } );
};

/** Обновить стикерпак */
export const updateStickerPackAction = (packId, data) => {
    //console.log('data',data);
    return dispatch({
        type: ADMIN_STICKERS_STICKER_PACK_UPDATE,
        payload: {
            urlParams: [packId],
            ...data,
            actions: {
                inSuccess: ({response}) => {
                    //console.log('response',response);

                    toast.success(data.status ?
                        (data.status === 'enable' ? 'Коллекция стикеров опубликована' : 'Коллекция стикеров снята с публикации')
                        : data.icon_from ? 'Иконка коллекции стикеров обновлена'
                            :
                            `Коллекция стикеров обновлена`, {
                        autoClose: 3000
                    });

                    return {
                        type: ADMIN_STICKERS_SET_STICKER_PACK,
                        payload: {
                            id: packId,
                            data: stickerPackAdapter(response),
                            iconFrom: data.icon_from,
                            name: data.name,
                        }
                    }
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при изменении коллекции стикеров', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                }
            }
        }
    } );
};



/** Выбрать стикерпак */
export const selectStickerPackAction = (id = '') => {
    return dispatch({
        type: ADMIN_STICKERS_SELECT_STICKERPACK,
        payload: id
    } );
};



/** Сортировать стикерпак */
export const sortStickerPackAction = ({adminStickers, oldIndex, newIndex}) => {
    if (!adminStickers || !adminStickers.length) return null;
    const sortedList = arrayMove( adminStickers, oldIndex, newIndex);
    writeAdminStickersAction(sortedList);
    return dispatch({
        type: ADMIN_STICKERS_STICKER_PACK_SORT,
        payload: {
            id_list: sortedList.map((item)=>item.id),
            actions: {
                // inSuccess: ({response}) => {
                //     return {
                //         type: ADMIN_STICKERS_SET_STICKERS,
                //         payload: sortedList
                //     };
                // },
                inFail: (err) => {
                    return {
                        type: ADMIN_STICKERS_SET_STICKERS,
                        payload: stickerPacksListAdapter(adminStickers)
                    };
                }
            }
        }
    });
};


/** Загрузить стикер на сервер */
export const addUploadedStickersAction = (packId, data) => {
    //console.log('data----->',data);
    return dispatch({
        type: ADMIN_STICKERS_ADD_UPLOADED,
        payload: {
            packId: packId,
            data: data && data.map((item)=>stickersListItemAdapter(item, null, item.config && item.config.sticker))
        }
    } );
};
//
//
// /** Загрузить стикер на сервер */
// export const uploadStickerAction = ({packId, file, uploadCallback}) => {
//     return dispatch({
//         type: ADMIN_STICKERS_STICKER_UPLOAD,
//         payload: {
//             packId: packId,
//             file: file,
//             actions: {
//                 inSuccess: ({response}) => {
//                     uploadCallback({data: response});
//                     return {
//                         type: ADMIN_STICKERS_ADD_UPLOADED,
//                         payload: {
//                             packId: packId,
//                             data: stickersListItemAdapter(response)
//                         }
//                     }
//                 },
//                 inFail: (err) => {
//                     uploadCallback({error: err});
//                     // return {
//                     //     type: ADMIN_STICKERS_CLEAR,
//                     // }
//                 }
//             }
//         }
//     } );
// };


/** Выбрать стикер в списке */
export const selectStickerAction = ({packId = '', id, selected}) => {
    // console.log('setStickerAction',{packId, id, o});
    return dispatch({
        type: ADMIN_STICKERS_SET_STICKER,
        payload: {packId, id, data:{selected: selected}}
    } );
};


/** Выбрать все стикеры стикерпака */
export const selectAllStickersAction = (packId) => {
    return dispatch({
        type: ADMIN_STICKERS_SELECT_STICKERS,
        payload: {packId, deselect: false}
    } );
};

/** Снять выбор */
export const deselectStickersAction = (packId) => {
    return dispatch({
        type: ADMIN_STICKERS_SELECT_STICKERS,
        payload: {packId, deselect: true}
    } );
};

/** Сортировать стикеры набора */
export const sortStickersAction = (sortedList, packId, callback) => {
    return dispatch({
        type: ADMIN_STICKERS_STICKER_SORT,
        payload: {
            id_list: sortedList.map((item)=>item.id),
            actions: {
                inSuccess: () => {
                    return {
                        type: ADMIN_STICKERS_SET_STICKER_PACK_STICKERS, payload: {
                            packId: packId,
                            stickersList: sortedList
                        }
                    }
                },
                inFail: (err)  => {
                    callback({error: err})
                }
            }
        }
    } );
};
/** Переместить стикер в другой набор */
export const moveStickersAction = ({idList, packId}) => {
    return dispatch({
        type: ADMIN_STICKERS_MOVE_STICKERS,
        payload: {
            sticker_set_id: packId,
            id_list: idList,
            actions: {
                inSuccess: () => {
                    // @ts-ignore
                    toast.success(declOfNum(idList.length, ['Стикер перемещён', 'Стикеры перемещены', 'Стикеры перемещены']), {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_STICKERS_REMOVE_FROM_PACK,
                        payload: {idList, clearPack: packId},
                    }
                },
                inFail: (err)  => {
                    // @ts-ignore
                    toast.error('Ошибка при перемещении стикера', {
                        autoClose: 3000
                    });
                    return { type: ADMIN_STICKERS_CLEAR }
                    // return { type: ADMIN_STICKERS_SET_STICKERS, payload: {error: err} }
                }
            }
        }
    } );
};

/** Обновить стикер */
export const updateStickersAction = ({id, data, inEditor = false}) => {
    // const upStickerTags:IlibraryItemTags = {};  // Для обновления меток стикера в галерее
    // if (data.constrain_proportions) upStickerTags.constrainProportions = data.constrain_proportions;

    return dispatch({
        type: ADMIN_STICKERS_STICKER_UPDATE,
        payload: {
            urlParams: [id],
            ...data,
            actions: {
                inSuccess: ({response}) => {
                    // console.log('ADMIN_STICKERS_STICKER_UPDATE response',response);

                    toast.success('Стикер обновлен', {
                        autoClose: 3000
                    });

                    return dispatch(
                        inEditor ? {
                                type: EDITOR_STICKERS_UPDATE_STICKER,
                                payload: {
                                    id: 'theme',
                                    data: {
                                        ...response,
                                        constrainProportions: data.constrain_proportions
                                    }
                                }
                            }
                            :
                            response.id ? {
                                type: ADMIN_STICKERS_SET_STICKER,
                                payload: {
                                    id,
                                    data: stickersListItemAdapter( response, null, response.config && response.config.sticker )
                                }
                            } : {
                                type: ADMIN_STICKERS_CLEAR
                            } )
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при изменении коллекции стикеров', {
                        autoClose: 3000
                    });
                    if (!inEditor) return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                }
            }
        }
    } );
};


/** Удалить стикер */
export const deleteStickerAction = ({id, stickerSetId = '', inEditor = false}) => {
    return dispatch({
        type: inEditor ? ADMIN_THEME_STICKER_DELETE : ADMIN_STICKERS_STICKER_DELETE,
        payload: {
            // urlParams: [id],
            urlParams: inEditor ? [stickerSetId, 'unset_sticker', id] : [id],
            actions: {
                inSuccess: ({response}) => {
                    // @ts-ignore
                    toast.success('Стикер удалён', {
                        autoClose: 3000
                    });
                    return inEditor ? {
                            type: EDITOR_STICKERS_UPDATE_STICKER,
                            payload: { id: 'theme', data: { id, isDeleting: true } }
                        } : {
                            type: ADMIN_STICKERS_REMOVE_FROM_PACK,
                            payload: { id, packId: stickerSetId },
                        }
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при удалении стикера', {
                        autoClose: 3000
                    });
                    if (!inEditor) return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                }
            }
        }
    } );
};

/** Удалить несколько стикеров */
export const bulkDeleteStickerAction = (idList, packId = '') => {
    return dispatch({
        type: ADMIN_STICKERS_BULK_DELETE,
        payload: {
            id_list: idList,
            actions: {
                inSuccess: ({response}) => {
                    // @ts-ignore
                    toast.success('Стикеры удалены', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_STICKERS_REMOVE_FROM_PACK,
                        payload: {idList, packId},
                    }
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при удалении стикеров', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_STICKERS_CLEAR,
                    }
                }
            }
        }
    } );
};
