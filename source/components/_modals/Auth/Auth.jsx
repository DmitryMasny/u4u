import React, { useEffect, useState, memo, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import s from './Auth.scss';

import {useKeyPress} from "libs/hooks";
import { Btn } from "components/_forms";
import BorderBtn from "components/BorderBtn";
import Socials from "./Socials";

import { modalAuthSelector } from 'selectors/modals';

import TEXT from "texts/main";

import { userLoginFailSelector, userAuthLoginSelector, userFormInProgressSelector, userGetCaptchaToken } from "selectors/user";
import { userRestorePwdShowAction, userRegShowAction, userLoginAction, userLoginFailAction, userFormInProgressAction } from "actions/user";
import Spinner from "components/Spinner";

import { loginNormalize, typeOfEmail, typeOfPhone } from './libs';

import LoginInput from "./LoginInput";
import PasswordInput from "./PasswordInput";

const Auth = ( { startCaptcha } ) => {
    const dispatch = useDispatch();
    //селекторы
    const $userLoginFailSelector = useSelector( userLoginFailSelector );
    const $userAuthLoginSelector = useSelector( userAuthLoginSelector );
    const $userFormInProgressSelector = useSelector( userFormInProgressSelector );
    const $captchaToken = useSelector( userGetCaptchaToken );
    const $modalAuthSelector = useSelector( modalAuthSelector );

    //состояния ошибок
    const [loginError, setLoginError] = useState( false );
    const [pwdError, setPwdError] = useState( false );
    const [authError, setAuthError] = useState( false );

    //состояния общие
    const [loginType, setLoginType] = useState( null );
    const [pwd, setPwd] = useState( false );
    const [waitCaptcha, setWaitCaptcha] = useState( false );

    const timeOut = useRef( null );

    // Отслеживание нажатия enter
    const enterPress = useKeyPress(13);


    useEffect(()=> {
        handlerClearErrors();
        return () => {
            if ( timeOut.current ) clearTimeout( timeOut.current );
        }
    },[]);

    useEffect(()=> {
        if (enterPress && !$userFormInProgressSelector) handlerSubmitForm()
    },[enterPress]);

    //ручка очищаем ошибки
    const handlerClearErrors = () => {
        if ( $userLoginFailSelector ) dispatch( userLoginFailAction( false ) );
        if ( $userFormInProgressSelector ) dispatch( userFormInProgressAction( false ) );
        setPwdError( false );
        setAuthError( false );
        setLoginError( false );
    };

    //ручка submit формы
    const handlerSubmitForm = e => {
        if (e) e.preventDefault();

        //проверяем на ошибки
        if ( !loginType ) { setLoginError(true); return null; }
        if ( !pwd )       { setPwdError(true); return null; }

        //запускаем авторизацию через капчу
        userLogin();
    };

    //запуск авторизации пользователя
    const userLogin = () => {
        //если капчи еще нет, ожидаем ее
        if ( !$captchaToken ) {
            if ( !waitCaptcha ) {
                startCaptcha();
                setWaitCaptcha( true );
            }
            return;
        }
        setWaitCaptcha( false );
        dispatch( userLoginAction( {
                                       [ loginType ]: loginNormalize( $userAuthLoginSelector, loginType ),
                                       pwd: pwd,
                                       responseId: $captchaToken,
                                       callback: typeof $modalAuthSelector === 'function' ? $modalAuthSelector : null
                                   } ) );
    };

    //если капча обновилась, смотрим, ждем ли мы ее для запуска авторизации
    useEffect( () => {
        if ( waitCaptcha && $captchaToken ) userLogin();
    }, [$captchaToken]);


    return (
            <div className={s.authForm}>
                <LoginInput onFocus={handlerClearErrors}
                            waitCaptcha={waitCaptcha}
                            loginError={loginError}
                            loginType={loginType}
                            setLoginType={setLoginType} />
                <PasswordInput onFocus={handlerClearErrors}
                               waitCaptcha={waitCaptcha}
                               setPwd={setPwd}
                               pwd={pwd}
                               pwdError={pwdError}
                />

                <Btn className={s.authFormBtnMain} intent="primary" fill disabled={$userFormInProgressSelector} onClick={e => handlerSubmitForm( e )}>
                    {($userFormInProgressSelector || waitCaptcha) ? <Spinner size={25} light={true}/> : TEXT.TO_LOGIN}
                </Btn>

                <div className={s.pwdHelp}>
                    <span className={s.authFormText}>
                        {TEXT.FORGET_PASSWORD}
                    </span>
                    <span className={s.authFormLink} onClick={() => !$userFormInProgressSelector && !waitCaptcha && dispatch( userRestorePwdShowAction() )}>
                        {TEXT.RESTORE_PASSWORD}
                    </span>
                </div>

                <BorderBtn fill
                           intent="info"
                           className={s.authFormBtn}
                           disabled={$userFormInProgressSelector || waitCaptcha}
                           onClick={() => dispatch(userRegShowAction())}>
                    {TEXT.TO_REGISTER}
                </BorderBtn>
                <Socials disabled={$userFormInProgressSelector || waitCaptcha}/>
            </div>
    )
};
export default memo( Auth );