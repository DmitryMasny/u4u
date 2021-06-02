import React, { useEffect, useContext, Fragment } from 'react';

import { useSelector, useDispatch } from "react-redux";
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-google'
import { userAuthTypeSelector } from 'selectors/user';
import { SHOW_USER_LOGIN,
    SHOW_USER_REG,
    SHOW_USER_REG_RESTORE_SUCCESS,
    SHOW_USER_RESTORE } from 'const/actionTypes';
import { setCaptchaTokenAction } from 'actions/user';

import TEXT_MAIN from 'texts/main';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import AuthLogin from './_AuthLogin';
import AuthRegAndRestore from './_AuthRegAndRestore';

/**
 * Компонент авторизации
 */
const DeleteConfirm = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const authTypeSelector = useSelector(userAuthTypeSelector);
    const dispatch = useDispatch();
    const captcha = React.createRef();


    const keyCaptcha = "6LevvyMUAAAAAAGhAGs-aiq1_51S6uG9NsmJQm1W";  //key v2

    /* Фикс при закрытии капчи */
    let captchaTimer = null;
    const onLoadRecaptcha = () => {
        if ( captcha ) {
            dispatch(setCaptchaTokenAction(null));
            captcha.current.reset();
            captcha.current.execute();
        }

        const captchaCheck = () => {
            const recaptcha = document.querySelector('iframe[title*="recaptcha"]');
            if (recaptcha && recaptcha.parentElement.previousSibling ) {
                //recaptcha.parentElement.previousSibling.style.pointerEvents = 'none';
                recaptcha.parentElement.previousSibling.addEventListener('click', ()=>onLoadRecaptcha());
                clearInterval(captchaTimer);
            }
        };

        captchaTimer = setInterval( captchaCheck, 333 )
    };

    const verifyCallback = ( recaptchaToken ) => {
        dispatch(setCaptchaTokenAction( recaptchaToken ));
        captchaTimer && clearInterval(captchaTimer);
    };

    const startCaptcha = () => {
        loadReCaptcha();
    };


    return <Fragment>
        <ReCaptcha
            ref={captcha}
            size="invisible"
            data-theme="dark"
            render="explicit"
            sitekey={keyCaptcha}
            onloadCallback={onLoadRecaptcha}
            verifyCallback={verifyCallback}
        />
        { authTypeSelector === SHOW_USER_LOGIN && <AuthLogin startCaptcha={startCaptcha}/>}
        { (authTypeSelector === SHOW_USER_REG ||
            authTypeSelector === SHOW_USER_REG_RESTORE_SUCCESS ||
            authTypeSelector === SHOW_USER_RESTORE
        ) && <AuthRegAndRestore startCaptcha={startCaptcha}/>}
    </Fragment>;
};

export default DeleteConfirm;