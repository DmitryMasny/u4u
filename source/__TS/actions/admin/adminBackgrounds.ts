// @ts-ignore
import { store } from "components/App";
import {
    ADMIN_BACKGROUNDS_GET_BACKGROUNDS,
    ADMIN_BACKGROUNDS_SET_BACKGROUNDS,
    ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK,
    ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_CREATE,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_UPDATE,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_DELETE,
    ADMIN_BACKGROUNDS_SET_BACKGROUND,
    ADMIN_BACKGROUNDS_SELECT_BACKGROUNDS,
    ADMIN_BACKGROUNDS_MOVE_BACKGROUNDS,
    ADMIN_BACKGROUNDS_CLEAR,
    ADMIN_BACKGROUNDS_SELECT_BACKGROUND_PACK,
    ADMIN_BACKGROUNDS_BACKGROUND_UPLOAD,
    ADMIN_BACKGROUNDS_ADD_UPLOADED,
    ADMIN_BACKGROUNDS_BACKGROUND_UPDATE,
    ADMIN_BACKGROUNDS_BACKGROUND_DELETE,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_SORT,
    ADMIN_BACKGROUNDS_BACKGROUND_SORT,
    ADMIN_BACKGROUNDS_BULK_DELETE,
    ADMIN_BACKGROUNDS_REMOVE_FROM_PACK,
// @ts-ignore
} from "const/actionTypes";

import {IadminBackgroundsList, Ibackground, IcurrentBackgroundPack,
    //IlibraryItemTags
} from "__TS/interfaces/admin/adminBackgrounds";


// @ts-ignore
import { toast } from '__TS/libs/tools';

// @ts-ignore
import { arrayMove, declOfNum } from "libs/helpers";

import {createStickerLink} from "__TS/libs/sticker";

//получаем диспетчер Redux
const dispatch = store.dispatch;


const backgroundPackAdapter = (response):IcurrentBackgroundPack => ({
    id: response.id,
    name: response.name,
    status: response.status,
    config: response.config && response.config.background,
    sortIndex: response.sortIndex,
    backgroundsList: response.backgroundList && response.backgroundList
        .map((item)=>backgroundsListItemAdapter(item, response.config && response.config.background))
        .sort((a, b) => b.sortIndex - a.sortIndex)
});

const backgroundPacksListAdapter = (response): IadminBackgroundsList[] => response &&
response.length ?
    response
        .map((item) => backgroundPacksListItemAdapter(item))
        .sort((a, b) => b.sortIndex - a.sortIndex)
    : [];

const backgroundPacksListItemAdapter = (item):IadminBackgroundsList => ({
    id: item.id,
    name: item.name,
    sortIndex: item.sortIndex,
    published: item.status === 'enabled',
    // config: item.config
        // && item.config.background
    // backgroundsCount: item.backgrounds && item.backgrounds.length || 0,
});
// @ts-ignore
const backgroundsListItemAdapter = (item, config):Ibackground => ({
    id: item.id,
    svg: item.svg,
    src: createStickerLink({ stickerConfig: config, id: item.id , size: 'sm', ext: item.ext }) ,
    srcMedium: createStickerLink({ stickerConfig: config, id: item.id , size: 'md', ext: item.ext }) ,
    repeatBackground: item.isPattern || item.is_pattern,
    size: {
        height: item.h || item.height,
        width: item.w || item.width,
    },
    sortIndex: item.sortIndex,
    backgroundSet: item.backgroundSet,
    tags: {
        constrainProportions: item.constrainProportions,
//         fileType: item.svg ? 'svg' : item.urls && item.urls.sm ? 'png' : '',
    }
});


/**
 * Экшены для админки фонов
 */

/** Получить все пак фонови */
export const getAdminBackgroundsAction = () => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_GET_BACKGROUNDS,
        payload: {
            actions: {
                inProgress: () => {
                    return { type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS, payload: 'progress' }
                },
                inSuccess: ({response}) => {
                    return { type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS, payload: backgroundPacksListAdapter(response)};
                },
                inFail: (err)  => {
                    toast.error('Ошибка получение коллекций фонов');
                    // return { type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS, payload: [] }
                    return {
                        type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS,
                        payload: [{
                            id: '1',
                            name: 'test',
                            sortIndex: 1,
                            published: false,
                        }]
                    };
                }
            }
        }
    } );
};

/** Запись списка пак фоновов*/
const writeAdminBackgroundsAction = (data) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS,
        payload: data
    } );
};

/** Получить конкретный пак фонов */
export const getCurrentBackgroundPackAction = (id) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK,
        payload: {
            urlParams: [id],
            actions: {
                inProgress: () => {
                    return { type: ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK, payload: {
                            id: id,
                            data: {
                                id: id,
                                isLoading: true
                            }
                        }
                    }
                },
                inSuccess: ({response}) => {
                    return {
                        type: ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK,
                        payload: {
                            id: id,
                            data: backgroundPackAdapter(response)
                        }
                    }
                },
                inFail: (err) => {
                    return {
                        type: ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK,
                        payload: {
                            id: id,
                            data: {error: err}
                        }
                    }
                }
            }
        }
    } );
};

/** Создать новый пак фонов */
export const createBackgroundPackAction = (name) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_PACK_CREATE,
        payload: {
            name: name,
            status: 'disable',
            actions: {
                inSuccess: ({response}) => {
                    // callback && callback({success: response.id});
                    toast.success(`Коллекция фонов "${name}" успешно создана`);
                    return [{
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }, {
                        type: ADMIN_BACKGROUNDS_SELECT_BACKGROUND_PACK,
                        payload: response.id
                    }]
                },
                inFail: (err) => {
                    toast.error('Ошибка создания коллекции фонов');
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                }
            }
        }
    } );
};

/** Удалить пак фонов */
export const deleteBackgroundPackAction = (id, callback) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_PACK_DELETE,
        payload: {
            urlParams: [id],
            actions: {
                inSuccess: ({response}) => {
                    callback && callback();
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                },
                inFail: (err) => {
                    callback && callback();
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                }
            }
        }
    } );
};

/** Обновить пак фонов */
export const updateBackgroundPackAction = (packId, data) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_PACK_UPDATE,
        payload: {
            urlParams: [packId],
            ...data,
            actions: {
                inSuccess: ({response}) => {
                    toast.success(data.status ?
                        (data.status === 'enable' ? 'Коллекция фонов опубликована' : 'Коллекция фонов снята с публикации')
                        : `Коллекция фонов обновлена`);

                    return {
                        type: ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK,
                        payload: {
                            id: packId,
                            data: backgroundPackAdapter(response),
                            iconFrom: data.icon_from,
                            name: data.name,
                        }
                    }
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при изменении коллекции фонов');
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                }
            }
        }
    } );
};



/** Выбрать пак фонов */
export const selectBackgroundPackAction = (id = '') => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_SELECT_BACKGROUND_PACK,
        payload: id
    } );
};



/** Сортировать пак фонов */
export const sortBackgroundPackAction = ({adminBackgrounds, oldIndex, newIndex}) => {
    if (!adminBackgrounds || !adminBackgrounds.length) return null;
    const sortedList = arrayMove( adminBackgrounds, oldIndex, newIndex);
    writeAdminBackgroundsAction(sortedList);
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_PACK_SORT,
        payload: {
            id_list: sortedList.map((item)=>item.id),
            actions: {
                // inSuccess: ({response}) => {
                //     return {
                //         type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS,
                //         payload: sortedList
                //     };
                // },
                inFail: (err) => {
                    return {
                        type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS,
                        payload: backgroundPacksListAdapter(adminBackgrounds)
                    };
                }
            }
        }
    });
};


/** Загрузить фон на сервер */
export const addUploadedBackgroundsAction = (packId, data, config) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_ADD_UPLOADED,
        payload: {
            packId: packId,
            data: data && data.length && data.map((item)=>backgroundsListItemAdapter(item, config)) || []
        }
    } );
};
//
//
// /** Загрузить фон на сервер */
// export const uploadBackgroundAction = ({packId, file, uploadCallback}) => {
//     return dispatch({
//         type: ADMIN_BACKGROUNDS_BACKGROUND_UPLOAD,
//         payload: {
//             packId: packId,
//             file: file,
//             actions: {
//                 inSuccess: ({response}) => {
//                     uploadCallback({data: response});
//                     return {
//                         type: ADMIN_BACKGROUNDS_ADD_UPLOADED,
//                         payload: {
//                             packId: packId,
//                             data: backgroundsListItemAdapter(response)
//                         }
//                     }
//                 },
//                 inFail: (err) => {
//                     uploadCallback({error: err});
//                     // return {
//                     //     type: ADMIN_BACKGROUNDS_CLEAR,
//                     // }
//                 }
//             }
//         }
//     } );
// };


/** Выбрать фон в списке */
export const selectBackgroundAction = ({packId = '', id, selected}) => {
    // console.log('setBackgroundAction',{packId, id, o});
    return dispatch({
        type: ADMIN_BACKGROUNDS_SET_BACKGROUND,
        payload: {packId, id, data:{selected: selected}}
    } );
};


/** Выбрать все фоны пак фонова */
export const selectAllBackgroundsAction = (packId) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_SELECT_BACKGROUNDS,
        payload: {packId, deselect: false}
    } );
};

/** Снять выбор */
export const deselectBackgroundsAction = (packId) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_SELECT_BACKGROUNDS,
        payload: {packId, deselect: true}
    } );
};

/** Сортировать фоны набора */
export const sortBackgroundsAction = (sortedList, packId, callback) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_SORT,
        payload: {
            id_list: sortedList.map((item)=>item.id),
            actions: {
                inSuccess: () => {
                    // TODO
                    return {
                        type: ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK, payload: {
                            packId: packId,
                            backgroundsList: sortedList
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
/** Переместить фон в другой набор */
export const moveBackgroundsAction = ({idList, packId}) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_MOVE_BACKGROUNDS,
        payload: {
            background_set_id: packId,
            id_list: idList,
            actions: {
                inSuccess: () => {
                    // @ts-ignore
                    toast.success(declOfNum(idList.length, ['фон перемещён', 'фоны перемещены', 'фоны перемещены']));
                    return {
                        type: ADMIN_BACKGROUNDS_REMOVE_FROM_PACK,
                        payload: {idList, clearPack: packId},
                    }
                },
                inFail: (err)  => {
                    // @ts-ignore
                    toast.error('Ошибка при перемещении фона');
                    return { type: ADMIN_BACKGROUNDS_CLEAR }
                    // return { type: ADMIN_BACKGROUNDS_SET_BACKGROUNDS, payload: {error: err} }
                }
            }
        }
    } );
};

/** Обновить фон */
// export const updateBackgroundsAction = ({id, data, config}) => {
export const updateBackgroundsAction = ({id, data, config}) => {
    // const upBackgroundTags:IlibraryItemTags = {};  // Для обновления меток фона в галерее
    // if (data.constrain_proportions) upBackgroundTags.constrainProportions = data.constrain_proportions;
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_UPDATE,
        payload: {
            urlParams: [id],
            ...data,
            actions: {
                inSuccess: ({response}) => {
                    //console.log('ADMIN_BACKGROUNDS_BACKGROUND_UPDATE response',response);

                    toast.success('фон обновлен');

                    return dispatch(
                        response.id ? {
                            type: ADMIN_BACKGROUNDS_SET_BACKGROUND,
                            payload: {
                                id, data: backgroundsListItemAdapter(response, config)
                            }
                        } : {
                            type: ADMIN_BACKGROUNDS_CLEAR
                        })
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при изменении коллекции фонов', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                }
            }
        }
    } );
};


/** Удалить фон */
export const deleteBackgroundAction = (id, packId = '') => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_BACKGROUND_DELETE,
        payload: {
            urlParams: [id],
            actions: {
                inSuccess: ({response}) => {
                    // @ts-ignore
                    toast.success('фон удалён', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_BACKGROUNDS_REMOVE_FROM_PACK,
                        payload: {id, packId},
                    }
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при удалении фона', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                }
            }
        }
    } );
};

/** Удалить несколько фонов */
export const bulkDeleteBackgroundAction = (idList, packId = '') => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_BULK_DELETE,
        payload: {
            id_list: idList,
            actions: {
                inSuccess: ({response}) => {
                    // @ts-ignore
                    toast.success('фоны удалены', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_BACKGROUNDS_REMOVE_FROM_PACK,
                        payload: {idList, packId},
                    }
                },
                inFail: (err) => {
                    // @ts-ignore
                    toast.error('Ошибка при удалении фонов', {
                        autoClose: 3000
                    });
                    return {
                        type: ADMIN_BACKGROUNDS_CLEAR,
                    }
                }
            }
        }
    } );
};
