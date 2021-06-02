import { USER_ACCESS_PUT,
         USER_TOKEN_GET_REQUEST,
         USER_TOKEN_GET_INPROGRESS,
         USER_TOKEN_GET_SUCCESS,
         USER_TOKEN_GET_FAIL,
         USER_LOGIN,
         USER_LOGIN_FAIL,
         USER_LOGIN_SOCIAL,
         USER_FORM_INPROGRESS,
         SET_USER_FORM_LOGIN,
         USER_REGISTER,
         USER_REGISTER_FAIL,
         USER_RESTORE,
         USER_RESTORE_FAIL,
         USER_LOGOUT,
         USER_SET_CAPTCHA_TOKEN,
         SHOW_USER_LOGIN,
         SHOW_USER_REG,
         SHOW_USER_REG_RESTORE_SUCCESS,
         SHOW_USER_RESTORE,
         USER_GET_PERSONAL_INFO,
         USER_SET_PERSONAL_INFO,
         USER_CHANGE_PASSWORD,
         USER_SEND_PERSONAL_INFO,
         USER_SEND_AVATAR,
         USER_SEND_DELIVERY,
         USER_GET_DELIVERY,
         MY_PRODUCTS_SET_MY_DELIVERY,
         MODAL_AUTH } from 'const/actionTypes';


import { LOCAL_STORAGE_NAME } from 'config/main';
import TEXT_PROFILE from 'texts/profile';

import { accessList } from 'config/access';
import store from 'store'

import { logs } from 'libs/logs';

import { toast } from '__TS/libs/tools';

import { USER_LOGIN as LOGIN_METRIC, USER_SINGUP } from 'const/metrics'
import sendMetric from 'libs/metrics'

/**
 * получение данных пользователя из токена
 * @param token
 * @returns {*}
 */
const getDataByToken = ( token ) => {
    if (!token || !token.length) return;

    try {
      const authData = JSON.parse(window.atob(token.split('.')[1]));
      if (!authData.user || !authData.user.role) {
          logs.error('Session token not correct ', authData);
          return false;
      }
      return authData

    } catch (e) {
      //logs.error('Session token not correct', e);
      return false
    }
};

/**
 * Экшен на установку токена и роли в state
 * @param token
 * @param role
 * @returns {{type: const, payload: {token: string, role: string}}
 */
const actionPutTokenAndRole = ( token, role, fromLocalStorage = false, isNewUser = false, callback = null ) => ( dispatch ) => {
    //кладем в state token и role
    dispatch({
        type: USER_TOKEN_GET_SUCCESS,
        payload: {
            token: token,
            role: role
        }
    });

    //console.log('isNewUser', isNewUser);

    //если данные были не из localStorage, вызываем оповещение и закрываем окно авторизации
    if (!fromLocalStorage) {
        if (role === 'visitor') {
            if ( !isNewUser ) {
                toast.success('Вы успешно вышли', {
                    autoClose: 3000
                });
            }
        } else {
            toast.success('Вы успешно вошли в сервис', {
                autoClose: 3000
            });
            //закрываем модальное окно
            if ( typeof callback === 'function' ) callback();
            dispatch(modalUserAuthAction(false));
        }
    }

    //устанавливаем права доступа по роле пользователя
    dispatch({
        type: USER_ACCESS_PUT,
        payload: accessList( role )
    });
};


//action на запуск получения token
export const getUserTokenAction = () => {
    let user = null;

    //проверим есть ли token в LocalStorage
    const storageToken = store.get( LOCAL_STORAGE_NAME );

    //разбираем токен, получаем user. Если токен не валиде, user = false
    if (storageToken) user = getDataByToken( storageToken );

    //если token есть в LocalStorage и они корректны, кладем их в storage
    if (storageToken && user && user.user) return actionPutTokenAndRole( storageToken, user.user.role, true );

    //если token нет в LocalStorage, то вызываем запрос на получение
    return {
        type: USER_TOKEN_GET_REQUEST,
        payload: {
            actions: {
                inProgress: () => ({ type: USER_TOKEN_GET_INPROGRESS }),
                inSuccess: getUserTokenSuccessAction,
                inFail:    ()  => ({ type: USER_TOKEN_GET_FAIL })
            }
        }
    }
};

//========================= АВТОРИЗАЦИЯ ========================
//action на запрос установки token в state
export const getUserTokenSuccessAction = ( { response: { token }, callback = null } ) => {
    const user = getDataByToken( token );
    if ( !user ) return; //TODO: тут возвращать ошибку
    //добавляем токет в LocalStorage
    //store.set( LOCAL_STORAGE_NAME, token ); //пока закоменнтировали, так как ставит токен в кавычках "..."
    const storageToken = store.get( LOCAL_STORAGE_NAME );

    localStorage.setItem( LOCAL_STORAGE_NAME, token );

    //вызываем метод для сохранения записи и прав пользователя в storage
    return actionPutTokenAndRole( token, user.user.role, false, !storageToken, callback );
};


/**
 * Авторизация прользователя
 * @param phone
 * @param email
 * @param pwd
 * @param responseId
 */
export const userLoginAction = ( { phone = false, email = false, pwd, responseId, callback = null } ) => {
    const data = {
        responseId: responseId,
        pwd: pwd
    };

    if (phone) data.phone = phone;
    if (email) data.email = email;

    return {
        type: USER_LOGIN,
        payload: {
            actions: {
                inProgress: userFormInProgressAction,
                inSuccess: response => {
                    response.dispatch( getUserTokenSuccessAction( {
                                                                      response: response.response,
                                                                      callback: callback
                                                                  } ) );
                },
                inFail: userLoginFailAction
            },
            ...data
        }
    }
};

export const userLoginFailAction = ( show = true ) => ({ type: USER_LOGIN_FAIL, payload: show});

export const userLoginSocial = ( { type } ) => ({
    type: USER_LOGIN_SOCIAL,
    payload: type
});

//========================= РЕГИСТРАЦИЯ ========================
/**
 *
 * @param phone
 * @param email
 * @param responseId
 */
export const userRegisterAction = ( { phone = false, email = false, responseId } ) => {
    const data = { responseId: responseId };

    if (phone) data.phone = phone;
    if (email) data.email = email;

    return {
        type: USER_REGISTER,
        payload: {
            actions: {
                inProgress: userFormInProgressAction,
                inSuccess: userRegRestoreSuccessShowAction,
                inFail: ( { code } ) => ({ type: USER_REGISTER_FAIL, payload: { code: code } })
            },
            ...data
        }
    }
};



//========================= ВОСТАНОВЛЕНИЕ ПАРОЛЯ =================
/**
 *
 * @param phone
 * @param email
 * @param responseId
 */
export const userRestoreAction = ( { phone = false, email = false, responseId } ) => {
    const data = { responseId: responseId };
    if (phone) data.phone = phone;
    if (email) data.email = email;

    return {
        type: USER_RESTORE,
        payload: {
            actions: {
                inProgress: userFormInProgressAction,
                inSuccess: userRegRestoreSuccessShowAction,
                inFail: ( { code, response } ) => {
                    const err = response && response.data && response.data.err;

                    if ( err === 'Пароль уже отправлен.') {
                        toast.warn('Пароль уже отправлен', {
                            autoClose: 3000
                        });
                    }
                    return { type: USER_RESTORE_FAIL, payload: err };
                }
            },
            ...data
        }
    }
};


//action установку токена капчи
export const setCaptchaTokenAction = ( captchaToken ) => ({ type: USER_SET_CAPTCHA_TOKEN,  payload: captchaToken});

//action на окрытие модального окна Входа
export const userLoginShowAction = ( isModal = false, callback = null) => ( dispatch ) => {
    dispatch({ type: SHOW_USER_LOGIN });
    if (isModal) {
        sendMetric(LOGIN_METRIC);
        dispatch( modalUserAuthAction( true, callback ));
    }
};

//action на окрытие модального окна Регистрации
export const userRegShowAction = ( isModal = false ) => ( dispatch ) => {
    dispatch({ type: SHOW_USER_REG });
    if (isModal) {
        sendMetric(USER_SINGUP);
        dispatch( modalUserAuthAction( true ) );
    }
};

//action на закрытие модального окна Входа/Регистрации/Востановления пароля
export const modalUserAuthAction = ( show = true, callback = null ) => ( dispatch ) => {
    dispatch( { type: MODAL_AUTH, payload: show && (callback || true) || false } );
    if (!show) dispatch( userLoginShowAction( false ) ); //ставим по умолчанию авторизацию
};

//action на блок  Удачной регистрации/Востановления пароля
export const userRegRestoreSuccessShowAction = ( { request } ) => ({ type: SHOW_USER_REG_RESTORE_SUCCESS, payload: request });

//action на блок Востановления пароля
export const userRestorePwdShowAction = () => ({ type: SHOW_USER_RESTORE });

//форма пользователя в процессе ожидания
export const userFormInProgressAction = () => ({ type: USER_FORM_INPROGRESS });

//сохранение логина из поля ввода
export const setUserFormLoginAction = (login) => ({ type: SET_USER_FORM_LOGIN, payload: login });



//Получение информации о пользователе
export const userGetPersonalInfo = () => {
    return({
    type: USER_GET_PERSONAL_INFO,
    payload:{
        actions: {
            inProgress: () => ({ type: 0 }),
            inSuccess: (r) => _userSetDataToRedux(r.response),
            inFail:    ()  => ({ type: 0})
        }
    }
})};

//сохраняем данные профиля пользователя в redux
const _userSetDataToRedux = ( data ) => userSetPersonalInfo( {
                                                                 login: data.username || '',
                                                                 phone: data.phone || '',
                                                                 name: data.fullName || '',
                                                                 email: data.email || '',
                                                                 gender: data.gender || '',
                                                                 avatar: data.avatar || '',
                                                                 uid: data.uid || ''
                                                             });


//Обновление информации о пользователе
export const userSetPersonalInfo = (o) => ({ type: USER_SET_PERSONAL_INFO, payload: o });

// Выход из профиля
export const userLogout = () => ({
    type: USER_LOGOUT,
    payload:{
        actions: {
            inProgress: () => ({ type: 0 }),
            inSuccess: () => _userLogoutAction(),
            inFail:    ()  =>  _userLogoutAction()
        }
    }
});
const _userLogoutAction = () => {
    store.set( LOCAL_STORAGE_NAME, ' ' );
    window.location.assign('/');
};

// Смена пароля
export const changePasswordAction = ({errorCallback,successCallback,...o}) => ({
    type: USER_CHANGE_PASSWORD,
    payload: {
        actions: {
            inProgress: () => ({ type: 0 }),
            inSuccess: () => {successCallback(); return ({ type: 0 })},
            inFail:    (err)  =>  {errorCallback(err.response.data.err); return ({ type: 0 })}
        },
        ...o
    }
});

// Отправка информации о юзере на сервер
export const sendPersonalInfoAction = (o) => ({
    type: USER_SEND_PERSONAL_INFO,
    payload: {
        actions: {
            inProgress: () => ({ type: 0 }),
            inSuccess: (r) => {
                toast.success(TEXT_PROFILE.CHANGE_PROFILE_SUCCESS, {
                    autoClose: 3000
                });
                userSetPersonalInfo(r)
            },
            inFail:    (err)  =>  (()=>{
                console.log('Error ',err);
                toast.error(TEXT_PROFILE.CHANGE_PROFILE_ERROR, {
                    autoClose: 3000
                });
            })
        },
        ...o
    }
});

// Отправка аватара о юзере на сервер
export const sendAvatar = ( file ) => ({
    type: USER_SEND_AVATAR,
    payload: {
        files: [file],
        actions: {
            inProgress: () => ({ type: 0 }),
            inSuccess: ( r ) => {
                toast.success(TEXT_PROFILE.CHANGE_AVA_SUCCESS, {
                    autoClose: 3000
                });
                return _userSetDataToRedux( r.response );
            },
            inFail: ( err ) => (() => console.log( 'Error ', err ))
        }
    }
});

// Отправка данных доставки
// http://center.u4u.online:10080/projects/u4u/wiki/API_settings_from_frontend_save
export const userSendDeliveryAction = ( data ) => {
    return {
        type: USER_SEND_DELIVERY,
        payload: {
            data: data,
            actions: {
                inSuccess: ( r ) => {
                    console.log('sendUserDelivery response',r.response);
                },
                inFail: ( err ) => (() => console.log( 'Error ', err ))
            }
        }
    }
};

// Получение данных доставки
// http://center.u4u.online:10080/projects/u4u/wiki/API_settings_from_frontend_save
export const userGetDeliveryAction = (  ) => ({
    type: USER_GET_DELIVERY,
    payload: {
        actions: {
            inSuccess: ( r ) => {
                if (r.response && r.response.frontSettings && r.response.frontSettings.data){
                    const data = r.response.frontSettings.data;
                    return {
                        type: MY_PRODUCTS_SET_MY_DELIVERY,
                        payload: {
                            updated: r.response["datetime "] || true,
                            name: data.name,
                            surname: data.surname,
                            fathername: data.fathername,
                            phone:data.phone,
                            email: data.email,
                            comments: data.comments,
                        }
                    }
                }
            },
            inFail: ( err ) => (() => console.log( 'Error ', err ))
        }
    }
});