import React, { useEffect, useState, memo, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import s from "./Auth.scss";
import { SHOW_USER_REG_RESTORE_SUCCESS, SHOW_USER_RESTORE } from "const/actionTypes";

import { Btn, Input } from "components/_forms";
import TEXT from "texts/main";
import BorderBtn from "components/BorderBtn";
import { IconFacebook, IconGooglePlus, IconInstagram, IconVk } from "components/Icons";
import { MailIcon, SmartphoneIcon } from "components/Icons/LineIcon";

import {
    userAuthTypeSelector,
    userAuthLoginSelector,
    userFormInProgressSelector,
    userLoginFailSelector,
    userGetCaptchaToken
} from "selectors/user";
import {
    userFormInProgressAction,
    userLoginAction,
    userLoginFailAction,
    userLoginShowAction,
    userRestoreAction,
    userRegisterAction
} from "actions/user";
import { modalConditionAction } from "actions/modals";

import LoginInput from "./LoginInput";
import Socials from "./Socials";
import { loginNormalize, typeOfEmail, typeOfPhone } from './libs';
import Spinner from "components/Spinner";

import { formatPhone } from "libs/converters";

const RegRestore = ( { startCaptcha } ) => {

    const dispatch = useDispatch();

    //селекторы
    const $userLoginFailSelector = useSelector( userLoginFailSelector );
    const $userAuthTypeSelector = useSelector( userAuthTypeSelector );
    const $userAuthLoginSelector = useSelector( userAuthLoginSelector );
    const $userFormInProgressSelector = useSelector( userFormInProgressSelector );
    const $captchaToken = useSelector( userGetCaptchaToken );

    //состояния ошибок
    const [loginError, setLoginError] = useState( false );
    const [waitCaptcha, setWaitCaptcha] = useState( false );
    const [loginType, setLoginType] = useState( null );

    //ручка очищаем ошибки
    const handlerClearErrors = () => {
        if ( $userLoginFailSelector ) dispatch( userLoginFailAction( false ) );
        if ( $userFormInProgressSelector ) dispatch( userFormInProgressAction( false ) );

        setLoginError( false );
    };

    const handlerSubmitForm = e => {
        e.preventDefault();

        //проверяем на ошибки
        if ( !loginType ) { setLoginError(true); return null; }

        //запускаем авторизацию через капчу
        userRegisterOrRestore();
    }

    //запуск авторизации пользователя
    const userRegisterOrRestore = () => {
        //если капчи еще нет, ожидаем ее
        if ( !$captchaToken ) {
            if ( !waitCaptcha ) {
                startCaptcha();
                setWaitCaptcha( true );
            }
            return;
        }

        setWaitCaptcha( false );
        const queryObject = { [ loginType ]: loginNormalize( $userAuthLoginSelector, loginType ), userCaptchaToken: $captchaToken };

        if ( $userAuthTypeSelector === SHOW_USER_RESTORE ) {
            dispatch( userRestoreAction( queryObject ) );
        } else {
            dispatch( userRegisterAction( queryObject ) );
        }
    };

    //если капча обновилась, смотрим, ждем ли мы ее для запуска авторизации
    useEffect( () => {
        if ( waitCaptcha && $captchaToken ) userRegisterOrRestore();
    }, [$captchaToken]);


    const registerRestoreButtonText = ($userAuthTypeSelector === SHOW_USER_RESTORE ? TEXT.TO_RESTORE : TEXT.TO_REGISTER);

    //======= УСПЕШНАЯ РЕГИСТРАЦИЯ / ВОСТАНОВЛЕНИЕ ПАРОЛЯ ========
    if ( $userAuthTypeSelector === SHOW_USER_REG_RESTORE_SUCCESS ) {
        const textToSended = (loginType === typeOfEmail ? TEXT.SEND_PWD_EMAIL : TEXT.SEND_PWD_PHONE),
            iconProps = { intent: "primary", size: 120, stroke: 2, type: 'round' },
            showedIcon = (loginType === typeOfEmail ?
                <MailIcon {...iconProps} /> :
                <SmartphoneIcon {...iconProps} />);

        const loginToShow  = (loginType === typeOfEmail ? $userAuthLoginSelector : formatPhone( loginNormalize( $userAuthLoginSelector ) ));
        return (
            <div className='bp3-dialog-body'>
                <div className={s.authForm}>
                    <div className={s.authFormIcon}>
                        {showedIcon}
                    </div>
                    <p>
                        {textToSended}<br/>
                        {loginToShow}
                    </p>
                    <Btn intent="primary"
                         fill
                         className={`${s.authFormBtnMain}`}
                         onClick={() => dispatch( userLoginShowAction() )}>
                        {TEXT.TO_LOGIN}
                    </Btn>
                </div>
            </div>
        );
    }

    const authFormLinkClass = !$userFormInProgressSelector ? s.authFormLink : '';

    return <div className={s.authForm}>

                <LoginInput onFocus={handlerClearErrors}
                            waitCaptcha={waitCaptcha}
                            loginError={loginError}
                            loginType={loginType}
                            setLoginType={setLoginType} />

                <Btn intent="primary" fill
                     disabled={$userFormInProgressSelector || waitCaptcha}
                     className={s.authFormBtnMain}
                     onClick={e => handlerSubmitForm( e )}>
                        {($userFormInProgressSelector || waitCaptcha) ? <Spinner size={25} light={true}/> : registerRestoreButtonText}
                </Btn>

                <div className={s.spaceBetweenWrap}>
                    <span>{$userAuthTypeSelector === SHOW_USER_RESTORE  ? TEXT.ALLREADY_REMEMBER: TEXT.ALLREADY_REGISTERED}</span>
                    <BorderBtn
                        intent="info"
                        className={s.authFormBtn}
                        disabled={$userFormInProgressSelector || waitCaptcha}
                        onClick={() => dispatch( userLoginShowAction() )}
                    >
                        {TEXT.TO_LOGIN}
                    </BorderBtn>
                </div>

                <Socials disabled={$userFormInProgressSelector || waitCaptcha} />

                {$userAuthTypeSelector !== SHOW_USER_RESTORE &&
                <div className={s.authFormBottomTextBottom}>
                    <div className={s.authFormInfo}>
                        <span>{TEXT.AUTH_AGREE_1}<br /></span>
                        <span className={authFormLinkClass} onClick={() => dispatch(modalConditionAction( true ))}>
                                                    {TEXT.AUTH_AGREE_2}
                                                </span>.
                    </div>
                </div>}
                {/*
                <div className={s.authFormBottomText}>

                    <div className={s.socialHeader}>{TEXT.OR_LOGIN_SOCIAL}</div>
                    <div className={s.socialWrap}>
                        <div className={`${s.socialBtn} ${s.socialBtnVk}`} onClick={()=>this.socialAuth(this.socials['vk'].id)}><IconVk size={24}/></div>
                        <div className={`${s.socialBtn} ${s.socialBtnFb}`} onClick={()=>this.socialAuth(this.socials['fb'].id)}><IconFacebook size={24}/></div>
                        {this.showInstagramButton && <div className={`${s.socialBtn} ${s.socialBtnInst}`} onClick={()=>this.socialAuth(this.socials['instagram'].id)}><IconInstagram size={24}/></div>}
                        <div className={`${s.socialBtn} ${s.socialBtnGoogle}`} onClick={()=>this.socialAuth(this.socials['google'].id)}><IconGooglePlus size={24}/></div>
                    </div>

                    {userAuthTypeSelector !== SHOW_USER_RESTORE &&
                    <div className={s.authFormBottomTextBottom}>
                        <div className={s.authFormInfo}>
                            <span>{TEXT.AUTH_AGREE_1}<br /></span>
                            <span className={authFormLinkClass} onClick={() => this.props.modalConditionAction( true )}>
                                            {TEXT.AUTH_AGREE_2}
                                        </span>.
                        </div>
                    </div> }
                </div>*/}

            </div>
};
export default memo( RegRestore );