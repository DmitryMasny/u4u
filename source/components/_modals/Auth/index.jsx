import React, { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-google'
import { ModalContext } from 'components/Modal';

import {
    userAuthTypeSelector,
    userFormInProgressSelector,
    userGetCaptchaToken,
    userLoginFailSelector
} from "selectors/user";

import { setCaptchaTokenAction } from 'actions/user';

import TEXT from 'texts/main';

import {
    SHOW_USER_LOGIN,
    SHOW_USER_REG,
    SHOW_USER_REG_RESTORE_SUCCESS,
    SHOW_USER_RESTORE
} from "const/actionTypes";

import Auth from "./Auth";
import RegRestore from "./RegRestore";

//Ключь для капчи
const keyCaptcha = "6LevvyMUAAAAAAGhAGs-aiq1_51S6uG9NsmJQm1W";  //key v2

const AuthWindow = () => {
    //диспетчер
    const dispatch = useDispatch();

    //селекторы
    const $userLoginFailSelector = useSelector( userLoginFailSelector );
    const $authTypeSelector = useSelector( userAuthTypeSelector );
    const $captchaToken = useSelector( userGetCaptchaToken );
    const $userFormInProgressSelector = useSelector( userFormInProgressSelector );

    //контекст окна
    const { setModal, closeModal } = useContext( ModalContext );

    //состояние
    const [currentType, setCurrentType] = useState( false );

    const captcha = React.createRef();

    /* Фикс при закрытии капчи */
    let captchaTimer = null;
    const onLoadRecaptcha = () => {
        if ( captcha.current ) {
            dispatch( setCaptchaTokenAction( null ) );
            captcha.current.reset();
            captcha.current.execute();
        }

        const captchaCheck = () => {
            const recaptcha = document.querySelector( 'iframe[title*="recaptcha"]' );
            if ( recaptcha && recaptcha.parentElement.previousSibling ) {
                //recaptcha.parentElement.previousSibling.style.pointerEvents = 'none';
                recaptcha.parentElement.previousSibling.addEventListener( 'click', () => onLoadRecaptcha() );
                clearInterval( captchaTimer );
            }
        };

        captchaTimer = setInterval( captchaCheck, 333 );
    };

    const verifyCallback = recaptchaToken => {
        dispatch( setCaptchaTokenAction( recaptchaToken ) );
        captchaTimer && clearInterval( captchaTimer );
    };

    const startCaptcha = () => {
        if ( captcha.current ) {
            onLoadRecaptcha();
        }
        loadReCaptcha();
    };

    //устанавливаем заголовок модального окна
    useEffect( () => {
        if ( $authTypeSelector !== SHOW_USER_REG_RESTORE_SUCCESS ) {
            setCurrentType($authTypeSelector);
        }

        let titleText = '';
        switch ( $authTypeSelector ) {
            case SHOW_USER_LOGIN:   titleText = TEXT.LOGIN; break;
            case SHOW_USER_REG_RESTORE_SUCCESS:
                if (currentType === SHOW_USER_REG) titleText = TEXT.REGISTER
                if (currentType === SHOW_USER_RESTORE) titleText = TEXT.RESTORE_PASSWORD
                break;
            case SHOW_USER_RESTORE: titleText = TEXT.RESTORE_PASSWORD; break;
            case SHOW_USER_REG:     titleText = TEXT.REGISTER; break;
        }
        setModal && setModal( { title: titleText } );
    }, [ $authTypeSelector ] );

    //устанавливаем блокировку окна, при селекторе прогресса
    useEffect( () => {
        setModal && setModal( { blocked: $userFormInProgressSelector } );
    }, [ $userFormInProgressSelector ] );

    //если нет токена, запускаем капчу
    useEffect( () => {
        //if ( $captchaToken ) setWaitCaptcha( false );
    }, [ $captchaToken ] );

    return <>
                <ReCaptcha
                    ref={captcha}
                    size="invisible"
                    data-theme="dark"
                    render="explicit"
                    hl={"ru"}
                    sitekey={keyCaptcha}
                    onloadCallback={onLoadRecaptcha}
                    verifyCallback={verifyCallback}
                />
                {$authTypeSelector === SHOW_USER_LOGIN && <Auth startCaptcha={startCaptcha} />}
                {($authTypeSelector === SHOW_USER_REG ||
                    $authTypeSelector === SHOW_USER_REG_RESTORE_SUCCESS ||
                    $authTypeSelector === SHOW_USER_RESTORE
                ) && <RegRestore startCaptcha={startCaptcha}/>}
          </>;
};
export default AuthWindow;