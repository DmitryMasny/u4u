// Редюсер открытия и закрытия бокового меню
import { SIDE_MENU_SHOW_TOGGLE } from 'const/actionTypes';

export function sideMenuShow(state = false, {type}) {
    switch ( type ) {
        case SIDE_MENU_SHOW_TOGGLE: return !state;
        default:
            return state;
    }
}
