// selectors

export const previewPhotoSelector           = (state) => state.previewPhoto;
export const previewPhotoIdSelector         = (state) => state.previewPhoto && state.previewPhoto.photoId;
export const previewPhotoInProgressSelector = (state) => state.previewPhoto.inProgress;
