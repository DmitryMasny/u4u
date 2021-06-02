import { MY_PHOTOS_PREVIEW_PHOTO, MY_PHOTOS_PREVIEW_PHOTO_SLIDE } from 'const/actionTypes';

// actions

export const previewPhotoCloseAction = () => ({
    type: MY_PHOTOS_PREVIEW_PHOTO,
    payload: null
});

export const previewPhotoNextAction = () => ({
    type: MY_PHOTOS_PREVIEW_PHOTO_SLIDE,
    payload: 'next'
});

export const previewPhotoPrevAction = () => ({
    type: MY_PHOTOS_PREVIEW_PHOTO_SLIDE,
    payload: 'prev'
});