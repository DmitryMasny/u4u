//редюсер октрытия и закрытия полноэкранного лоадера
import { FULL_SCREEN_LOADER } from 'const/actionTypes';

const defaultState = false;

export function fullScreenLoader(state = defaultState, {type, payload}) {
    switch ( type ) {
        case FULL_SCREEN_LOADER: return payload;
        default:
            return state;
    }
}
