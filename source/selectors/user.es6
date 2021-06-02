//получение идентификатора роли пользователя
export const userRoleSelector  = state => state.user.auth.role;

export const userRoleIsAdmin   = state => userRoleSelector( state ) ==='admin';
export const userRoleIsUser    = state => userRoleSelector( state ) ==='user';
export const userRoleIsVisitor = state => userRoleSelector( state ) ==='visitor';

//получение токена пользователя
export const userTokenSelector = state => state.user.auth.token;
//получение id пользоватля
export const userIdSelector = state => state.user.auth.uid;
//получение идентификатора роли пользоватля
export const userHasProfileSelector         = state => state.user.access.hasProfile;
//получение статуса процесса авторизации
export const userFormInProgressSelector     = state => state.user.auth.formInProgress;
//получение статуса ошибки авторизации
export const userLoginFailSelector          = state => state.user.auth.loginFail;
//получение статуса ошибки регистрации
export const userRegisterFailSelector       = state => state.user.auth.registerFail;
//получение статуса ошибки востановления
export const userRestoreFailSelector        = state => state.user.auth.restoreFail;
//получение капчи
export const userGetCaptchaToken            = state => state.user.auth.captcha;


//получение типа рабочего окна
export const userAuthTypeSelector          = state => state.user.auth && state.user.auth.type;

export const userAuthLoginSelector     = state => state.user.auth.login;

//получение информации о пользователе
export const userPersonalInfoSelector     = state => state.user.info;
export const userPersonalInfoInProgressSelector   = state => state.user.info.inProgress;
