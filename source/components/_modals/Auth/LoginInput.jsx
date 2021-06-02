import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Input } from "components/_forms";
import { setUserFormLoginAction } from "actions/user";
import TEXT from "texts/main";

import { userAuthLoginSelector, userFormInProgressSelector, userLoginFailSelector } from "selectors/user";
import { validateEmail, validateForPhone } from "libs/validators";
import { typeOfEmail, typeOfPhone } from "./libs";
import { IconAccount, IconMailOutline, IconPhoneApple } from "components/Icons";

const LoginInput = ( {onFocus, loginError, loginType, setLoginType, waitCaptcha } ) => {
    const dispatch = useDispatch();
    const $userAuthLoginSelector = useSelector( userAuthLoginSelector );
    const $userFormInProgressSelector = useSelector( userFormInProgressSelector );
    const $userLoginFailSelector = useSelector( userLoginFailSelector );

    //определяем тип логина
    useEffect(() => {
        setLoginType( validateEmail( $userAuthLoginSelector ) ? typeOfEmail : validateForPhone( $userAuthLoginSelector ) ? typeOfPhone : null );
    }, [$userAuthLoginSelector] );

    //получаем иконку по типу
    const iconLogin = intent => {
        switch ( loginType ) {
            case typeOfEmail: return <IconMailOutline intent={intent} />;
            case typeOfPhone: return <IconPhoneApple intent={intent} />;
            default: return <IconAccount intent={intent} />;
        }
    };

    const loginIntent = loginError && 'danger' ||
                        $userLoginFailSelector && 'danger' ||
                        loginType ? 'success' : '';

    return <Input name="login"
                  type="email"
                  value={$userAuthLoginSelector}
                  onChange={e => dispatch( setUserFormLoginAction( e.target.value ) )}
                  onFocus={onFocus}
                  placeholder={TEXT.PHONE_OR_EMAIL_LABEL}
                  disabled={waitCaptcha || $userFormInProgressSelector}
                  intent={loginIntent}
                  error={loginError && TEXT.ERROR_LOGIN || $userLoginFailSelector && TEXT.ERROR_AUTH || false }
                  autoComplete="current-login"
                  autoFocus={true}
                  leftEl={iconLogin(loginIntent)}
            />
};

export default memo( LoginInput );