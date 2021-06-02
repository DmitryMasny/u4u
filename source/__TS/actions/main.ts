import { store } from "components/App";
import { FULL_SCREEN_LOADER } from 'const/actionTypes';

//получаем диспетчер Redux
const dispatch = store.dispatch;

export const setFullScreenLoaderAction = ( show: boolean = true ) => dispatch({
    type: FULL_SCREEN_LOADER,
    payload: show
});