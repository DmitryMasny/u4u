import React from "react";
import { Btn } from 'components/_forms';

import {
    MY_PHOTOS_GET_PHOTOS,
    MY_PHOTOS_SET_ALL_PHOTOS,
    MY_PHOTOS_GET_FOLDERS,
    MY_PHOTOS_GET_FOLDER_PHOTOS,
    MY_PHOTOS_SET_FOLDERS,
    MY_PHOTOS_SELECT_TOGGLE,
    MY_PHOTOS_SELECT_PHOTO,
    MY_PHOTOS_CREATE_FOLDER,
    MY_PHOTOS_DELETE_PHOTOS,
    MY_PHOTOS_MOVE_PHOTOS,
    MY_PHOTOS_RENAME_FOLDER,
    MY_PHOTOS_DELETE_FOLDER,
    MY_PHOTOS_REMOVE_FROM_FOLDER,
    MY_PHOTOS_SELECT_FOLDER,
    MY_PHOTOS_SET_CURRENT_FOLDER,
    MY_PHOTOS_DUPLICATE_PHOTOS,
    MY_PHOTOS_REMOVE_PHOTOS,
    MY_PHOTOS_PREVIEW_PHOTO,
    MY_PHOTOS_UPLOAD_PHOTO,
    MY_PHOTOS_SET_NEW_FOLDER,
    MY_PHOTOS_ADD_TO_FOLDER_TOGGLE,
    MY_PHOTOS_ROTATE_PHOTO,
    MY_PHOTOS_SET_PHOTO,
    MY_PHOTOS_ADD_NEW_PHOTO,
    MY_PHOTOS_GET_GOOGLE_PHOTOS,
    MY_PHOTOS_SET_GOOGLE_PHOTOS,
    MY_PHOTOS_GET_INSTAGRAM_PHOTOS,
    MY_PHOTOS_SET_INSTAGRAM_PHOTOS,
    MY_PHOTOS_GET_VK_PHOTOS,
    MY_PHOTOS_SET_VK_PHOTOS,
    MY_PHOTOS_GET_YANDEX_PHOTOS,
    MY_PHOTOS_SET_YANDEX_PHOTOS,
    MY_PHOTOS_RESET_DEFAULT
} from 'const/actionTypes';

import { toast } from '__TS/libs/tools';

import TEXT_MY_PHOTOS from 'texts/my_photos';
import store from 'libs/reduxStore';
import {IMAGE_TYPES} from "const/imageTypes";

import decamelizeKeysDeep from 'decamelize-keys-deep';

/******************************
 * ФОТОГРАФИИ
 ******************************/

/**
 * Сброс раздела фото в начальное состояние
 * @returns {{type: *}}
 */
export const resetDefaultPhotos = () => {
    return {
        type: MY_PHOTOS_RESET_DEFAULT
    }
};

/**
 * Получение всех фотографий с сервера
 * url {string} - запрос следующей страницы по сгенерированному урлу
 * id {string} - запрос конкретной фото по id
 *
 * Если ничего не передано, то запрашиваем все фотографии
 */
export const getPhotosFromServerAction = ({url, id} = {}) => {
    const  urlParams = url ?
                        null : (id ?
                                [id] : ['?page_size=50<']   // "<" означает удалить "/" в конце urla запроса
                        );

    return {
        type: MY_PHOTOS_GET_PHOTOS,
        payload: {
            urlParams: urlParams,
            ... url && { url: url },
            actions: {
                inSuccess: ( data ) => {
                    return ({ type: MY_PHOTOS_SET_ALL_PHOTOS, payload: {
                        ...data.response,
                        ... url && { add: true },
                    } })},
                inFail: (err)  => {
                    window.sendErrorLog( 'Ошибка получения фотографий:', {error: err} );
                    return { type: MY_PHOTOS_SET_ALL_PHOTOS, payload: {error: err.error.message} };
                }
            }
        }
    }
};

/**
 * Удалить фотографии
 */
export const deletePhotosAction = (list) => {
    if (!list || !list.length) return {type: 0};
    return {
        type: MY_PHOTOS_DELETE_PHOTOS,
        payload: {
            photo_id_list: list,
            actions: {
                inSuccess: (r) => {
                    if (r.response.updateCount) {
                        toast.success(r.response.updateCount === 1 ? TEXT_MY_PHOTOS.DELETE_SUCCESS_1 : TEXT_MY_PHOTOS.DELETE_SUCCESS, {
                            autoClose: 3000
                        });
                    } else {
                        toast.error(TEXT_MY_PHOTOS.DELETE_ERROR, {
                            autoClose: 3000
                        });
                    }

                    return { type: MY_PHOTOS_REMOVE_PHOTOS, payload: { list: list } }
                },
                inFail: (err)  => {
                    toast.error(TEXT_MY_PHOTOS.DELETE_ERROR, {
                        autoClose: 3000
                    });
                    window.sendErrorLog( 'Ошибка удаления фотографии:', {error: err} );
                    return {type: 0}
                }
            }
        }
    }
};
/**
 * Скопировать фотографии
 */
export const duplicatePhotosAction = ({ list, folderId, instantRedirect }) => {
    if (!folderId || !list || !list.length) return {type: 0};
    return {
        type: MY_PHOTOS_DUPLICATE_PHOTOS,
        payload: {
            photo_id_list: list,
            folder_id: folderId,
            actions: {
                // inSuccess: () => ({ type: MY_PHOTOS_SET_ALL_PHOTOS, payload: data.response }),
                inSuccess: (r) => {
                    if (!r.response ) return { type: MY_PHOTOS_SELECT_TOGGLE, payload: false };

                    const redirectToFolderAction = () => store.dispatch(selectFolderAction(folderId));
                    const ToastMessage = () => <div>
                        <div style={{marginBottom: '5px'}}>{r.response.moveCount === 1 ? TEXT_MY_PHOTOS.DUPLICATE_SUCCESS_1 : TEXT_MY_PHOTOS.DUPLICATE_SUCCESS}</div>
                        {!instantRedirect && <Btn small intent={"success"} onClick={redirectToFolderAction}>{TEXT_MY_PHOTOS.MOVE_IN}</Btn>}
                    </div>;

                    toast.success(<ToastMessage/>, {
                        autoClose: instantRedirect ? 3000 : 7000
                    });

                    if (instantRedirect) redirectToFolderAction();

                    return { type: MY_PHOTOS_SELECT_TOGGLE, payload: false }

                },
                inFail: (err)  => {
                    toast.error(TEXT_MY_PHOTOS.DUPLICATE_ERROR, {
                        autoClose: instantRedirect ? 3000 : 7000
                    });
                    window.sendErrorLog( 'Ошибка копирования фотографии:', {error: err} );
                    return { type: MY_PHOTOS_SELECT_TOGGLE, payload: false }
                }
            }
        }
    }
};
/**
 * Переместить фотографии
 */
export const movePhotosAction = ({ list, folderId, sourceFolderId }) => {
    if (!folderId || !list || !list.length || !sourceFolderId ) return {type: 0};
    return {
        type: MY_PHOTOS_MOVE_PHOTOS,
        payload: {
            photo_id_list: list,
            new_folder_id: folderId,
            urlParams: [sourceFolderId, 'move_many'],
            actions: {
                // inSuccess: () => ({ type: MY_PHOTOS_SET_ALL_PHOTOS, payload: data.response }),
                inSuccess: (r) => {
                    toast.success(r.response.toCount === 1 ? TEXT_MY_PHOTOS.MOVE_TO_SUCCESS_1 : TEXT_MY_PHOTOS.MOVE_TO_SUCCESS, {
                        autoClose: 3000
                    });

                    return { type: MY_PHOTOS_REMOVE_PHOTOS, payload: { list: list, folderId: folderId } }
                },
                inFail: (err)  => {
                    toast.error(TEXT_MY_PHOTOS.MOVE_TO_ERROR, {
                        autoClose: 3000
                    });

                    window.sendErrorLog( 'Ошибка перемещения фотографии:', {error: err} );
                    return {type: 0}
                }
            }
        }
    }
};
/**
 * Загрузить фотографию
 */
export const uploadPhotosAction = ( { photo, folderId, callback, updateProgress } ) => {
    if ( !photo || !photo.file ) {
        window.sendErrorLog( 'ошибка в uploadPhotosAction. Не переданы необходимые данные: ', {photo: photo} );
        return { type: 0 };
    }
    photo.file.id = photo.id;
    return {
        type: MY_PHOTOS_UPLOAD_PHOTO,
        payload: {
            files: [photo.file],
            onUploadProgress: (percent)=>percent && updateProgress(photo.id,percent),
            actions: {
                // inSuccess: () => ({ type: MY_PHOTOS_SET_ALL_PHOTOS, payload: data.response }),
                inSuccess: (r) => {
                    // Помечаем в модалке, что фотография загружена
                    callback && callback({photoId: r.response.photoId});

                    // Добавляем заглушку фотки во все фотографии
                    return {
                        type: MY_PHOTOS_ADD_NEW_PHOTO,
                        payload: {
                            id: r.response.photoId,
                            url: photo.thumb,
                            orig: photo.orig,
                            type: IMAGE_TYPES.BLOB,
                            inProgress: true,
                            selected: true
                        }
                    }
                },
                inFail: (err)  => {
                    if ( err && err.response && err.response.status === 429 ) {
                        callback && callback({error: 'превышен лимит'});
                        return null;
                    }
                    const message = err.response && err.response.data && err.response.data.error && err.response.data.error.messages[0];

                    toast.error(message ? (err.response.data.error.name + ' - ' + message) : 'Не удалось загрузить фотографию', {
                        autoClose: 3000
                    });

                    callback && callback({error:message || 'ошибка'});
                    window.sendErrorLog( 'Ошибка загрузки фотографии (POST):', {photo: photo, error: err, message: message} );
                }
            }
        }
    }
};

/******************************
 * ПАПКИ
 ******************************/

/**
 * Получение папок с сервера
 */
export const getPhotosFoldersFromServerAction = ()  => {
    return {
        type: MY_PHOTOS_GET_FOLDERS,
        payload: {
            // urlParams: [id, 'generate-layout'],
            actions: {
                inSuccess: ( data ) => ({ type: MY_PHOTOS_SET_FOLDERS, payload: {data: data.response.reverse()} }),
                inFail: (err)  => {
                    window.sendErrorLog( 'Ошибка получения папок:', {error: err} );
                    return { type: MY_PHOTOS_SET_FOLDERS, payload: {error: err.error.message} }
                }
            }
        }
    }
};


/**
 * Cоздать новую папку
 */
export const createPhotoFolderAction  = ( name, callback, redirect ) => ({
    type: MY_PHOTOS_CREATE_FOLDER,
    payload: {
        name: name,
        // urlParams: [id, 'generate-layout'],
        actions: {
            inSuccess: ( data ) => {
                callback && callback (data.response.id);
                return { type: MY_PHOTOS_SET_NEW_FOLDER, payload: redirect ? ((data.response.redirect=redirect) && data.response) : data.response }
                },
            inFail: ( err ) => {
                window.sendErrorLog( 'Ошибка создания папки:', {error: err} );
                return { type: MY_PHOTOS_SET_NEW_FOLDER, payload: {error: err && err.error} }
            }
        }
    }
});

/**
 * Переименовать папку
 */
export const renameFolderAction = ({folderId, name})  => {
    if (!folderId) return {type: 0};
    return {
        type: MY_PHOTOS_RENAME_FOLDER,
        payload: {
            urlParams: [folderId],
            name: name,
            actions: {
                inSuccess: ( data ) => ({ type: MY_PHOTOS_SET_FOLDERS, payload: data.response }),
                inFail: (err)  => {
                    window.sendErrorLog( 'Ошибка переименования папки:', {error: err} );
                    return { type: MY_PHOTOS_SET_FOLDERS, payload: {error: err.error.message} }
                }
            }
        }
    }
};

/**
 * Получение фотографий из папки
 */
export const getFolderPhotosAction = ({url, id} = {})  => {
    if (!id) return {type: 0};
    const  urlParams = url ? null : [id];
    return {
        type: MY_PHOTOS_GET_FOLDER_PHOTOS,
        payload: {
            urlParams: urlParams,
            ... url && { url: url },
            actions: {
                inSuccess: ( data ) => ({ type: MY_PHOTOS_SET_CURRENT_FOLDER, payload: {
                        photos: data.response.results,
                        next: data.response.next,
                        ... url && { add: true }
                    }
                }),
                inFail: (err)  => {
                    window.sendErrorLog( 'Ошибка получения фотографий папки:', {error: err} );
                    return{ type: MY_PHOTOS_SET_CURRENT_FOLDER, payload: {error: err.error.message} }
                }
            }
        }
    }
};


/**
 * Удаление папки
 */
export const deleteFolderAction = (id)  => {
    if (!id) return {type: 0};
    return {
        type: MY_PHOTOS_DELETE_FOLDER,
        payload: {
            urlParams: [id],
            actions: {
                inSuccess: () => {
                    toast.success(TEXT_MY_PHOTOS.DELETE_FOLDER_SUCCESS, {
                        autoClose: 3000
                    });
                    return({ type: MY_PHOTOS_SET_FOLDERS, payload: {deleting: id} })
                },
                inFail: ( err )  => {
                    toast.error(TEXT_MY_PHOTOS.DELETE_FOLDER_ERROR, {
                        autoClose: 3000
                    });
                    window.sendErrorLog( 'Ошибка удаления папки:', {error: err} );
                    return { type: MY_PHOTOS_SET_FOLDERS, payload: { error: err.error.message } };
                }
            }
        }
    }
};

/**
 * Удаление фотографий из папки
 */
export const removeFromFolderAction = ({ list, folderId })  => {
    if (!folderId || !list || !list.length) return {type: 0};
    return {
        type: MY_PHOTOS_REMOVE_FROM_FOLDER,
        payload: {
            urlParams: [folderId, 'remove_photo'],
            photo_id_list: list,
            actions: {
                inSuccess: ( r ) => {
                    toast.success(r.response.removeCount === 1 ? TEXT_MY_PHOTOS.DELETE_SUCCESS_F_1 : TEXT_MY_PHOTOS.DELETE_SUCCESS_F, {
                        autoClose: 3000
                    });

                    return { type: MY_PHOTOS_REMOVE_PHOTOS, payload: {list: list, folderId: folderId} }
                },
                inFail: (err)  => {
                    toast.success(TEXT_MY_PHOTOS.DELETE_ERROR, {
                        autoClose: 3000
                    });
                    window.sendErrorLog( 'Ошибка удаления фотографий из папки:', {error: err} );
                    return { type: MY_PHOTOS_SET_FOLDERS, payload: {error: err.error.message} }
                }
            }
        }
    }
};

/**
 * Добавление в папку
 */
export const  addToFolderToggleAction = ( folderId )  => {
    return {
        type: MY_PHOTOS_ADD_TO_FOLDER_TOGGLE,
        payload: folderId
    }
};

/******************************
 * БИБЛИОТЕКА
 ******************************/

/**
 * Групповой выбор фотографий
 */
export const selectPhotosToggleAction = ( show )  => {
    return {
        type: MY_PHOTOS_SELECT_TOGGLE,
        payload: show
    }
};

/**
 * Выбор фотографии
 */
export const selectPhotoAction = ( o )  => {
    return {
        type: MY_PHOTOS_SELECT_PHOTO,
        payload: o
    }
};

/**
 * Выбор списка фотографии (когда загрузили фото)
 */
export const selectPhotoArrayAction = ( photoArray )  => {
    return {
        type: MY_PHOTOS_SELECT_PHOTO,
        payload: {
            photoArray
        }
    }
};

/**
 * Выбор всех фотографий
 */
export const selectAllPhotosAction = (folderId, deselectAll = false)  => {
    return {
        type: MY_PHOTOS_SELECT_PHOTO,
        payload: { alls: true, folderId: folderId, deselectAll: deselectAll }
    }
};

/**
 * Выбор папки
 */
export const selectFolderAction = (id)  => {
    return {
        type: MY_PHOTOS_SELECT_FOLDER,
        payload: id
    }
};


/**
 * Просмотр фотографии
 */
export const previewPhotoAction = ( o ) => {
    return {
        type: MY_PHOTOS_PREVIEW_PHOTO,
        payload: o
    }
};


/**
 * Поворот фотографии
 */
export const rotatePhotosAction = ({ photoId, folderId, angle })  => {
    if (!photoId || !angle) return {type: 0};

    return {
        type: MY_PHOTOS_ROTATE_PHOTO,
        payload: {
            photo_id: photoId,
            folderId: folderId,
            angle: angle,
            actions: {
                // inSuccess: ( r ) => {
                //
                // },
                inFail: (err)  => {
                    window.sendErrorLog( 'Ошибка поворота фотографии:', { error: err } );
                    updatePhotoAction( photoId, { error: TEXT_MY_PHOTOS.WS_ROTATE_ERROR } );
                }
            }
        }
    }
};
/**
 * Обновление фотографии после ответа по websocket
 */
export const updatePhotoAction = ( photoId, data )  => {
    if (!photoId || !data) return {type: 0};

    data.error && toast.error(data.error, {
        autoClose: 3000
    });
    return {
        type: MY_PHOTOS_SET_PHOTO,
        payload: {
            photoId: photoId,
            data: data
        }
    }
};

/**
 * Запрос Google фоток
 */
export const getGooglePhotosAction = (callback, nextUrl) => {
    return {
        type: MY_PHOTOS_GET_GOOGLE_PHOTOS,
        payload: {
            ... nextUrl && { url: nextUrl },
            actions: {
                inSuccess: ( data ) => {
                    callback && callback(data.response);
                },
                inFail: (err)  => {
                    const d =  err.response &&  err.response.data;
                    const redirectUrl = d && d.redirect_url;
                    if (redirectUrl){
                        callback && callback({redirectUrl: d.redirect_url});
                    } else {
                        callback && callback({error: d})
                    }
                }
            }
        }
    }
};
/**
 * Запрос на добавление выбранных фоток из гугла в Мои фотографии
 */
export const addPhotosFromGoogleAction = (list, callback) => {
    return {
        type: MY_PHOTOS_SET_GOOGLE_PHOTOS,
        payload: {
            // urlParams: ['?page_size=50'],
            photo_list: decamelizeKeysDeep( list ),
            actions: {
                inSuccess: (data) => {
                    callback && callback();
                    return({
                        type: MY_PHOTOS_SET_ALL_PHOTOS,
                        payload: {
                            results: list.map((item) => ({
                                ...item,
                                isBlob: true,
                                selected: false,
                                inProgress: true
                            })),
                            add: true,
                            addToTop: true,
                        }
                    })
                },
                inFail: (err)  => {
                    callback && callback();
                    window.sendErrorLog( 'Ошибка получения фотографий из google:', {error: err} );
                    return { type: MY_PHOTOS_SET_ALL_PHOTOS, payload: {error: err.error.message} };
                }
            }
        }
    }
};
/**
 * Запрос Instagram фоток
 */
export const getInstagramPhotosAction = (callback, nextUrl) => {
    return {
        type: MY_PHOTOS_GET_INSTAGRAM_PHOTOS,
        payload: {
            ... nextUrl && { url: nextUrl },
            actions: {
                inSuccess: ( data ) => {
                    callback && callback(data.response);
                },
                inFail: (err)  => {
                    const d =  err.response &&  err.response.data;
                    const redirectUrl = d && d.redirect_url;
                    if (redirectUrl){
                        callback && callback({redirectUrl: d.redirect_url});
                    } else {
                        callback && callback({error: d})
                    }
                }
            }
        }
    }
};
/**
 * Запрос на добавление выбранных фоток из Instagram в Мои фотографии
 */
export const addPhotosFromInstagramAction = (list, callback) => {
    return {
        type: MY_PHOTOS_SET_INSTAGRAM_PHOTOS,
        payload: {
            // urlParams: ['?page_size=50'],
            photo_list: decamelizeKeysDeep( list ),
            actions: {
                inSuccess: (data) => {
                    callback && callback();
                    return ({
                        type: MY_PHOTOS_SET_ALL_PHOTOS,
                        // payload: data.response && data.response.downloading_list ? {
                        // payload: data.response && data.response.downloading_list ? {
                        //     results: data.response.downloading_list.map((item) => ({
                        //         photo_id: item.photo_id,
                        //         size: item.size,
                        //         url: item.url,
                        //         isBlob: true,
                        //         inProgress: true
                        //     })) || list,
                        //     add: true,
                        //     addToTop: true,
                        // } : {
                        //     error: data
                        // }
                        payload: {
                            results: list.map((item) => ({
                                        ...item,
                                        isBlob: true,
                                        selected: false,
                                        inProgress: true
                                    })),
                            add: true,
                            addToTop: true,
                        }
                    })
                },
                inFail: (err)  => {
                    callback && callback();
                    window.sendErrorLog( 'Ошибка получения фотографий из Instagram:', {error: err} );
                    return { type: MY_PHOTOS_SET_ALL_PHOTOS, payload: {error: err.error.message} };
                }
            }
        }
    }
};

/**
 * Запрос Vkontakte фоток
 */
export const getVkPhotosAction = (callback, nextUrl) => {
    return {
        type: MY_PHOTOS_GET_VK_PHOTOS,
        payload: {
            ... nextUrl && { url: nextUrl },
            actions: {
                inSuccess: ( data ) => {
                    callback && callback(data.response);
                },
                inFail: (err)  => {
                    const d =  err.response &&  err.response.data;
                    const redirectUrl = d && d.redirect_url;
                    if (redirectUrl){
                        callback && callback({redirectUrl: d.redirect_url});
                    } else {
                        callback && callback({error: d})
                    }
                }
            }
        }
    }
};
/**
 * Запрос на добавление выбранных фоток из Vkontakte в Мои фотографии
 */
export const addPhotosFromVkAction = (list, callback) => {
    return {
        type: MY_PHOTOS_SET_VK_PHOTOS,
        payload: {
            photo_list: decamelizeKeysDeep( list ),
            actions: {
                inSuccess: () => {
                    callback && callback();
                    return ({
                        type: MY_PHOTOS_SET_ALL_PHOTOS,
                        payload: {
                            results: list.map((item) => ({
                                        ...item,
                                        isBlob: true,
                                        selected: false,
                                        inProgress: true
                                    })),
                            add: true,
                            addToTop: true,
                        }
                    })
                },
                inFail: (err)  => {
                    callback && callback();
                    window.sendErrorLog( 'Ошибка получения фотографий из Vkontakte:', {error: err} );
                    return { type: MY_PHOTOS_SET_ALL_PHOTOS, payload: {error: err.error.message} };
                }
            }
        }
    }
};
/**
 * Запрос Yandex фото
 */
export const getYandexPhotosAction = (callback, nextUrl) => {
    return {
        type: MY_PHOTOS_GET_YANDEX_PHOTOS,
        payload: {
            ... nextUrl ? { url: nextUrl } : {urlParams:['?page_size=50<']},
            actions: {
                inSuccess: ( data ) => {
                    callback && callback(data.response);
                },
                inFail: (err)  => {
                    const d =  err.response &&  err.response.data;
                    const redirectUrl = d && d.redirect_url;
                    if (redirectUrl){
                        callback && callback({redirectUrl: d.redirect_url});
                    } else {
                        callback && callback({error: d})
                    }
                }
            }
        }
    }
};
/**
 * Запрос на добавление выбранных фоток из Yandex фото в Мои фотографии
 */
export const addPhotosFromYandexAction = (list, callback) => {
    return {
        type: MY_PHOTOS_SET_YANDEX_PHOTOS,
        payload: {
            photo_list: decamelizeKeysDeep( list ),
            actions: {
                inSuccess: () => {
                    callback && callback();
                    return ({
                        type: MY_PHOTOS_SET_ALL_PHOTOS,
                        payload: {
                            results: list.map((item) => ({
                                        ...item,
                                        type: null,
                                        isBlob: true,
                                        selected: false,
                                        inProgress: true
                                    })),
                            add: true,
                            addToTop: true,
                        }
                    })
                },
                inFail: (err)  => {
                    callback && callback();
                    window.sendErrorLog( 'Ошибка получения фотографий из Yandex фото:', {error: err} );
                    return { type: MY_PHOTOS_SET_ALL_PHOTOS, payload: {error: err.error.message} };
                }
            }
        }
    }
};