//редюсер для установки прав доступа пользователя
import {
    USER_ACCESS_PUT,
    USER_TOKEN_GET_SUCCESS,
    USER_LOGIN_FAIL,
    USER_FORM_INPROGRESS,
    USER_REGISTER,
    USER_REGISTER_FAIL,
    USER_REGISTER_INPROGRESS,
    USER_RESTORE_FAIL,
    USER_SET_CAPTCHA_TOKEN,
    USER_LOGOUT,
    SET_USER_FORM_LOGIN,
    SHOW_USER_LOGIN,
    SHOW_USER_REG,
    SHOW_USER_RESTORE,
    SHOW_USER_REG_RESTORE_SUCCESS,
    MODAL_CLOSE_USER,
    USER_SEND_AVATAR,
    USER_SET_PERSONAL_INFO
} from 'const/actionTypes';

import { ACCESSES } from 'config/access';

//редьюсер обновление прав доступа
export function access ( state = ACCESSES, { type, payload } ) {
    switch ( type ) {
        case USER_ACCESS_PUT:
            return {
                ...state, ...payload
            };
        default:
            return state;
    }
}


//редьюсер установки токена и роли пользователя, авторизации и регистрации, востановления пароля
let defaultState = {
    token: null,
    role: null,
    formInProgress: false,
    loginFail: false,
    registerFail: false,
    restoreFail: false,
    login: '',
    captcha: null,
    uid: null,
    type: SHOW_USER_LOGIN
};

if ( process.env.server_render ) {
    defaultState = {
        auth: {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvNlVpbmUxSWxFYzFvMTE2VzJZeFJTRTNuUWlpamQ4ViIsImRldiI6ImI1ZTY1ZmQyLWRiZDEtNGM2OS1iYzgxLTEzZjRhYTJkN2Q5YSIsInVzZXIiOnsicm9sZSI6InZpc2l0b3IiLCJ1aWQiOiI1ZjNiZTdkNzliM2JlNDQwNjZjZjNlMDkifX0.PpezCOaUKrEJ_rKcCb98ROagr9zGcaOzkWTcx4AEdeA',
            role: 'visitor',
            formInProgress: false,
            loginFail: false,
            registerFail: false,
            restoreFail: false,
            login: '',
            captcha: null,
            uid: '5f3be7d79b3be44066cf3e09',
            type: 'Блок авторизации пользователя'
        },
        info: {
            name: '',
            gender: '',
            avatar: '',
            phone: '',
            email: '',
            isRecived: true,
            inProgress: false
        },
        access: {
            hasProfile: false,
            hasMyProducts: false
        }
    }
}

export function auth ( state = defaultState, { type, payload } ) {
    switch ( type ) {
        case SHOW_USER_LOGIN:
        case SHOW_USER_REG:
        case SHOW_USER_RESTORE:
        case SHOW_USER_REG_RESTORE_SUCCESS:
            return {
                ...state,
                formInProgress: type !== SHOW_USER_REG_RESTORE_SUCCESS && state.formInProgress || false,
                type: type,
                loginFail: false,
                registerFail: false,
                restoreFail: false,
                login: payload && (payload.email || payload.phone) || state.login || (state.popup && state.popup.login) || ''
            };
        case USER_SET_PERSONAL_INFO:
            return payload.uid ?
                {
                    ...state,
                    uid: payload.uid,
                } : state;

        case USER_SET_CAPTCHA_TOKEN:
            return {
                ...state,
                captcha: payload,
            };
        case USER_TOKEN_GET_SUCCESS:
            return {
                ...state,
                token: payload.token,
                role: payload.role,
                formInProgress: false,
                loginFail: false,
            };
        case USER_FORM_INPROGRESS:
            return {
                ...state,
                formInProgress: true,
                loginFail: false,
                restoreFail: false,
                registerFail: false
            };
        case SET_USER_FORM_LOGIN:
            return {
                ...state,
                login: payload,
            };
        case USER_LOGIN_FAIL:
            return {
                ...state,
                formInProgress: false,
                loginFail: payload
            };
        case USER_REGISTER_FAIL:
            return {
                ...state,
                formInProgress: false,
                registerFail: (payload.code === 401)
            };
        case USER_RESTORE_FAIL:
            return {
                ...state,
                formInProgress: false,
                restoreFail: payload
            };
        case USER_LOGOUT:
            return {
                ...state,
                login: null
            };

        default:
            return state;
    }
}


//редьюсер информации о пользователе
const defaultStateInfo = {
    name: '',
    gender: '',
    avatar: '',
    phone: '',
    email: '',
    isRecived: false,
    inProgress: false
};

export function info ( state = defaultStateInfo, { type, payload } ) {

    switch ( type ) {
        case USER_SEND_AVATAR:
            return {
                ...state,
                inProgress: true
            };
        case USER_SET_PERSONAL_INFO:
            return {
                ...state,
                name: payload.name,
                gender: payload.gender,
                avatar: payload.avatar,
                phone: payload.phone,
                email: payload.email,
                inProgress: false,
                isRecived: true
            };
        // case USER_SET_AVATAR:
        //     return {
        //         ...state,
        //         avatar: payload,
        //     };
        default:
            return state;
    }
}