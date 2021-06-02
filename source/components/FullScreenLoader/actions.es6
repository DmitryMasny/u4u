import { FULL_SCREEN_LOADER } from 'const/actionTypes';

export const FullScreenLoaderAction = ( show = true ) => ({
    type: FULL_SCREEN_LOADER,
    payload: show
});