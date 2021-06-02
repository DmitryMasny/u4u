export const typeOfEmail = 'email';
export const typeOfPhone = 'phone';

//нормализация логина
export const loginNormalize = ( login, loginType ) => {
    let loginTxt = login.toString();

    if ( loginType === typeOfEmail ) {
        //если email то переводим в нижний регистр
        return loginTxt.toLowerCase();
    } else {
        //если телефон, убираем лишние символы и оставляем последние 10 символов (мобильный телефон)
        loginTxt = loginTxt.replace( /\D+/g, "" );
        return loginTxt.substring( loginTxt.length - 10 );
    }
};