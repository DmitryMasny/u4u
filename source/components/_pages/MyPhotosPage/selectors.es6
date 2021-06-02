import { createSelector } from 'reselect'

// Получение всех фотографий
export const myPhotosAllSelector =  createSelector(
    state => state.myPhotos.allPhotos,
    ( myPhotosAll ) => myPhotosAll
);

// Получение количества загруженных фотографий
export const myPhotosCountSelector = createSelector(
    state => state.myPhotos.photosCount,
    ( myPhotosCount ) => myPhotosCount
);
// Получение количества фотографий всего
export const myPhotosAllPhotosCountSelector = createSelector(
    state => state.myPhotos.allCount,
    ( allCount ) => allCount
);

// Получение папок фотографий
export const myPhotosFoldersSelector = createSelector(
    state => state.myPhotos.folders,
    ( myPhotosFolders ) => myPhotosFolders
);

// Получение id текущей папки
export const myPhotosCurrentFolderSelector = createSelector(
    state => state.myPhotos.currentFolderId,
    ( myPhotosCurrentFolder ) => myPhotosCurrentFolder
);

// Получение фотографий текущей папки
export const myPhotosCurrentFolderPhotosSelector = createSelector(
    state => state.myPhotos.currentFolderPhotos,
    ( myPhotosCurrentFolderPhotos ) => myPhotosCurrentFolderPhotos
);

// Получение статуса inProgress
export const myPhotosInProgressSelector = createSelector(
    state => state.myPhotos.inProgress,
    ( myPhotosInProgress ) => myPhotosInProgress
);

// Получение типа сортировки фотографий
export const myPhotosSortSelector = createSelector(
    state => state.myPhotos.sorting,
    ( myPhotosSort ) => myPhotosSort
);

// Получение статуса мульти-выбора фотографий
export const myPhotosSelectionActiveSelector = createSelector(
    state => state.myPhotos.selectionActive,
    ( myPhotosSelectionActive ) => myPhotosSelectionActive
);

// Получение выделенных фотографий
export const myPhotosSelectionSelector = createSelector(
    myPhotosSelectionActiveSelector, myPhotosCurrentFolderPhotosSelector, myPhotosAllSelector, myPhotosCurrentFolderSelector,
    ( selectionActive, folderPhotos, allPhotos, currentFolder ) => (
        selectionActive ?
        ((currentFolder ? folderPhotos : allPhotos) || []).filter((item)=>item.selected).map((item)=>item.photoId || item.id)
        : []
    )
);

// Получение следующей страницы фотографий
export const myPhotosNextPageUrlSelector = createSelector(
    state => state.myPhotos.nextPhotoPage,
    ( myPhotosNextPageUrl ) => myPhotosNextPageUrl
);

// Получение следующей страницы текущей папки
export const myPhotosCurrentFolderNextPageSelector = createSelector(
    state => state.myPhotos.currentFolderNext,
    ( myPhotosCurrentFolderNextPage ) => myPhotosCurrentFolderNextPage
);

// Получение id папки выбранной для добавления фотографий из ленты
export const myPhotosAddFolderSelector = createSelector(
    state => state.myPhotos.addToFolder,
    ( myPhotosAddFolder ) => myPhotosAddFolder
);

