import {
    MY_PHOTOS_GET_PHOTOS,
    MY_PHOTOS_SET_ALL_PHOTOS,
    MY_PHOTOS_GET_FOLDERS,
    MY_PHOTOS_GET_FOLDER_PHOTOS,
    MY_PHOTOS_SET_FOLDERS,
    MY_PHOTOS_SELECT_TOGGLE,
    MY_PHOTOS_SET_NEW_FOLDER,
    MY_PHOTOS_CREATE_FOLDER,
    MY_PHOTOS_DELETE_PHOTOS,
    MY_PHOTOS_MOVE_PHOTOS,
    MY_PHOTOS_RENAME_FOLDER,
    MY_PHOTOS_DELETE_FOLDER,
    MY_PHOTOS_REMOVE_FROM_FOLDER,
    MY_PHOTOS_SELECT_FOLDER,
    MY_PHOTOS_SET_CURRENT_FOLDER,
    MY_PHOTOS_SELECT_PHOTO,
    MY_PHOTOS_DUPLICATE_PHOTOS,
    MY_PHOTOS_REMOVE_PHOTOS,
    MY_PHOTOS_PREVIEW_PHOTO,
    MY_PHOTOS_ADD_TO_FOLDER,
    MY_PHOTOS_ADD_TO_FOLDER_TOGGLE,
    MY_PHOTOS_SET_PHOTO,
    MY_PHOTOS_ROTATE_PHOTO,
    MY_PHOTOS_ADD_NEW_PHOTO,
    MY_PHOTOS_RESET_DEFAULT
} from 'const/actionTypes';

import { MY_PHOTOS_ALL, MY_PHOTOS_FOLDERS } from 'const/myPhotos';
import {selectLibraryItem} from "../libs/helpers";

/**
 * MyPhotos
 */
const defaultState = {
    inProgress: false,
    allPhotos: null,        // Все фотографии
    photosCount: null,      // Кол-во фотографий загружено
    allCount: 0,            // Кол-во фотографий всего
    folders: null,          // все папки
    currentFolderId: null,  // Открытая папка
    currentFolderPhotos: null,  // Фотографии в открытой папке
    currentFolderNext: null,    // Следущая страница папки
    selectionActive: false,  // режим выбора фотографий
    lastSelected: null,     // последняя выбранная (для выделения с shift)
    nextPhotoPage: null,    // следущая страница фотографий (url запроса)
    sorting: 'name',        // сортировка фотографий
    previewPhoto: null  ,   // превью фотографии
    addToFolder: null,      // id папки куда добавить фотографии из всех
  };

export function myPhotos ( state = defaultState, { type, payload } ) {
    switch ( type ) {

        case MY_PHOTOS_GET_PHOTOS:
        case MY_PHOTOS_GET_FOLDERS:
        case MY_PHOTOS_DELETE_PHOTOS:
        case MY_PHOTOS_GET_FOLDER_PHOTOS:
        case MY_PHOTOS_REMOVE_FROM_FOLDER:
            return { ...state, inProgress: true };

        case MY_PHOTOS_RESET_DEFAULT:
            return {
                ...state,
                ...defaultState
            };

        case MY_PHOTOS_SET_ALL_PHOTOS:

            if (!payload.results) return {
                ...state,
                inProgress: false
            };
            const toAllPhotos = payload.results.filter((photo)=>(photo.url && photo.id)) || [];
            return {
                ...state,
                inProgress: false,
                allPhotos: payload.add ?    // Подгрузка следующей сраницы или загрузка с нуля / очистка
                    // ( payload.addToTop ? [...toAllPhotos.map((p)=>({...p, selected: true})), ...(state.allPhotos || [])] : [...(state.allPhotos || []), ...toAllPhotos] )
                    ( payload.addToTop ? [...toAllPhotos, ...(state.allPhotos || [])] : [...(state.allPhotos || []), ...toAllPhotos] )
                    :
                    (toAllPhotos || []),
                photosCount: (payload.add && toAllPhotos.length) ? state.photosCount + toAllPhotos.length : (toAllPhotos.length || false),
                ... !payload.addToTop && {
                    nextPhotoPage: payload.next || null,
                    // selectionActive: true
                } || {},
                allCount: payload.allCount, // сколько всего фотографий
            };

        case MY_PHOTOS_ADD_NEW_PHOTO:
            // console.log('payload',payload);
            // console.log('state.allPhotos',state.allPhotos);
            // const newPhoto = payload && {
            //     ...payload,
            //     selected: true
            // };
            return {
                ...state,
                allPhotos: state.allPhotos ? [{...payload || {}}, ...(state.allPhotos || [])] : [payload],
                // allPhotos: state.allPhotos ? [{...newPhoto || {}}, ...(state.allPhotos || [])] : [newPhoto],
                photosCount: state.photosCount ? state.photosCount +1 : 1,
                allCount: state.allCount ? state.allCount +1 : 1,
                // selectionActive: true
            };

        case MY_PHOTOS_ROTATE_PHOTO:
            return {
                ...state,
                ... !payload.folderId && {allPhotos: state.allPhotos.map((photo)=>(photo.photoId === payload.photo_id ? {...photo, inProgress: true } : photo ))} || {},
                ... payload.folderId && {currentFolderPhotos: state.currentFolderPhotos.map((photo)=>(photo.photoId === payload.photo_id ? {...photo, inProgress: true} : photo ))} || {},
            };

        case MY_PHOTOS_SET_PHOTO:
            const errorFilter = (photos) => {
                let payloadPhotoIsFound = false;
                const filteredPhotosList = photos.map((photo) => {
                      if( (photo.photoId || photo.id) === payload.photoId ) {
                          payloadPhotoIsFound = true
                          return payload.data.clear ? null :
                              {
                                  ...photo,
                                  photoId: payload.photoId,
                                  ...(payload.data.error ? { inProgress: false } : { ...payload.data }),
                                  ...(state.addToFolder && { selected: true } || {}), // Если загрузили для добавления в папку, надо выделить
                              }
                      } else return photo

                  }).filter((photo) => photo)

                if (!payloadPhotoIsFound && !payload.data.clear && !payload.data.error) {
                    return [ {...payload.data, photoId: payload.photoId }, ...filteredPhotosList ]
                } else return filteredPhotosList
            };

            return {
                ...state,
                ...(state.allPhotos && {allPhotos: errorFilter(state.allPhotos)} || {}),
                ...(state.currentFolderPhotos && { currentFolderPhotos: errorFilter(state.currentFolderPhotos) } || {})
            };

        case MY_PHOTOS_SET_FOLDERS:
            // console.log('payload',payload);
            return {
                ...state,
                inProgress: false,
                ... !payload.name && {
                    currentFolderId: null,
                    currentFolderPhotos: null,
                    currentFolderNext: null
                } || {},
                folders: !payload.error && payload.data  && payload.data.length ?
                    // Назначение папок
                    payload.data.map( ( item ) => ({
                            id: item.id,
                            name: item.name
                        }
                    ) )
                    :
                    (
                        // Удаление папки
                        payload.deleting ?
                            state.folders.filter((item)=>item.id !== payload.deleting)
                            :
                            (
                                // Переименование папки
                                payload.name && payload.id ?
                                    state.folders.map((item)=>{
                                        return item.id === payload.id ? {name: payload.name, id: payload.id} : item
                                    })
                                    :
                                    state.folders || []
                            )
                    )
            };

        case MY_PHOTOS_SELECT_TOGGLE:
            const isActive = (payload === undefined ? !state.selectionActive : payload);
            const source = state.currentFolderId ? 'currentFolderPhotos' : 'allPhotos';
            const sourceHaveContent = state[source] && state[source].length;
            return {
                ...state,
                ...( !isActive && sourceHaveContent && { [source]: state[source].map((item)=>item.selected ? {...item, selected: false} : item) } || {} ),
                selectionActive: isActive
            };

        case MY_PHOTOS_CREATE_FOLDER:
            return {
                ...state,
                inProgress: true
            };

        case MY_PHOTOS_SET_NEW_FOLDER:
            return {
                ...state,
                inProgress: false,
                ... payload.redirect && {
                    currentFolderId: payload.id,
                    currentFolderPhotos: null,
                    currentFolderNext: null
                } || {},
                ... !payload.error && {
                    folders: [
                    { id: payload.id, name: payload.name },
                        ... state.folders || []
                    ]
                } || {}
            };

        case MY_PHOTOS_SELECT_FOLDER:
            return {
                ...state,
                currentFolderId: payload || null,
                currentFolderPhotos: null,
                currentFolderNext: null,
                selectionActive: state.addToFolder
            };

        case MY_PHOTOS_SET_CURRENT_FOLDER:
            if (!payload.photos) return {
                ...state,
                inProgress: false
            };
            const toFolderPhotos = payload.photos.filter((photo)=>(photo.url && photo.id));

            return {
                ...state,
                inProgress: false,
                currentFolderPhotos: payload.add ? [...state.currentFolderPhotos, ...toFolderPhotos] : (toFolderPhotos || []),
                currentFolderNext: payload.next || null
            };

        case MY_PHOTOS_ADD_TO_FOLDER_TOGGLE:
            return {
                ...state,
                addToFolder: payload ? state.folders.find((folder)=>folder.id === payload) : null,
                ... !payload && {
                    currentFolderId: state.addToFolder.id || null,
                    currentFolderPhotos: null,
                    currentFolderNext: null,
                } || {},
                selectionActive: !!payload
            };

        case MY_PHOTOS_DUPLICATE_PHOTOS:
            return {
                ...state,
                addToFolder: null,
            };

        case MY_PHOTOS_SELECT_PHOTO:
            const { list, lastSelected, selectedCount } = selectLibraryItem({
                itemId: payload.id,
                shiftKey: payload.shiftKey,
                selectAll: payload.alls,
                deselectAll: payload.deselectAll,
                sourceList: payload.folderId ? state.currentFolderPhotos : state.allPhotos,
                lastSelected: state.lastSelectedPhoto,
                maxSelectCount: payload.max,
            });
            return ({
                ...state,
                ...(payload.folderId ? {currentFolderPhotos: list} : {allPhotos: list}),
                lastSelectedPhoto:lastSelected,
                selectionActive: !!selectedCount
            });



        case MY_PHOTOS_REMOVE_PHOTOS:
            const targetArray = payload.folderId ? state.currentFolderPhotos : state.allPhotos;
            if (!targetArray || !targetArray.length) return state;
            return {
                ...state,
                inProgress: false,
                selectionActive: false,
                [payload.folderId ? 'currentFolderPhotos' : 'allPhotos']: targetArray.filter((item)=>{
                    return item.photoId && !~payload.list.indexOf(item.photoId)
                })
            };

        default:
            return state;
    }
}