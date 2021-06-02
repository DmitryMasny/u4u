import { SET_SPEC_PROJECT } from 'const/actionTypes';

//получение тем с сервера
export const setSpecProjectAction = ( value = null) => ({
    type: SET_SPEC_PROJECT,
    payload: value
});