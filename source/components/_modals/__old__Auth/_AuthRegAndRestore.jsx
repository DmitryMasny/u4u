import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auth from './_Auth';

import { Input, Btn } from 'components/_forms';

//import Tooltip from 'components/_forms/Tooltip';

import {IconVk, IconFacebook, IconInstagram, IconGooglePlus, IconCheck} from 'components/Icons';
import BorderBtn from "components/BorderBtn";

import { SmartphoneIcon, MailIcon } from 'components/Icons/LineIcon';

import TEXT from 'texts/main';
import s from "./Auth.scss";

import {
    SHOW_USER_REG_RESTORE_SUCCESS,
    SHOW_USER_RESTORE
} from 'const/actionTypes';

import {
    userFormInProgressSelector,
    userRegisterFailSelector,
    userAuthTypeSelector,
    userRestoreFailSelector,
    userAuthLoginSelector,
    userGetCaptchaToken
} from 'selectors/user';

import {
    userLoginShowAction,
    userRegisterAction,
    setUserFormLoginAction,
    userRestoreAction
} from 'actions/user';

import { modalConditionAction } from 'actions/modals';

import { formatPhone } from 'libs/converters';

import { loginInputFormProps, loginInputProps, tooltipProps } from "./props";
import TEXT_PROFILE from "../../../texts/profile";

class AuthReg extends Auth {
    componentDidMount() {
        // if ( this.context.setModalTitle ) {
        //     const titleText = (this.props.userAuthTypeSelector === SHOW_USER_RESTORE ? TEXT.RESTORE_PASSWORD : TEXT.REGISTER);
        //     this.context.setModalTitle( titleText );
        // }
        const titleText = (this.props.userAuthTypeSelector === SHOW_USER_RESTORE ? TEXT.RESTORE_PASSWORD : TEXT.REGISTER);

        console.log('this.context', this.context);
        this.context.setModal({
                                title: titleText
                              });
        if ( this.context.setModalBlocked ) this.context.setModalBlocked( false );
        if ( !this.state.loginType && this.props.userAuthLoginSelector ) this.loginValidator( this.props.userAuthLoginSelector );
        this.loginInput && this.loginInput.focus();
    }

    regOrRestoreUser() {
        const { userCaptchaToken } = this.props;

        //если капчи еще нет, ожидаем ее
        if (!userCaptchaToken) {
            this.props.startCaptcha();
            this.waitCaptcha(true);
            return;
        }

        const queryObject = { [  this.state.loginType ]: this.loginNormalize( this.props.userAuthLoginSelector ), userCaptchaToken: userCaptchaToken };

        if ( this.props.userAuthTypeSelector === SHOW_USER_RESTORE ) {
            //восстановление пароля
            this.props.userRestoreAction( queryObject );
        } else {
            //регистрация
            this.props.userRegisterAction( queryObject );
        }
    }
    handlerSubmitForm = () => {
        //проверяем на ошибки
        if ( !this.state.loginType ) {
            this.setState( { ...this.errorState, ...{ registerError: true } } );
            return;
        }

        //востановлание пароля или регистрация
        this.regOrRestoreUser();
    };
    componentDidUpdate( prevProps ) {
        //если ждем капчу и токен уже есть
        if (this.state.waitCaptcha && (this.props.userCaptchaToken !== prevProps.userCaptchaToken)) {
            this.waitCaptcha(false);
            this.regOrRestoreUser();
        }
    };
    render() {
        const { userAuthTypeSelector, setUserFormLoginAction, userAuthLoginSelector } = this.props;
        const { loginType} = this.state;

        //======= УСПЕШНАЯ РЕГИСТРАЦИЯ / ВОСТАНОВЛЕНИЕ ПАРОЛЯ ========
        if ( userAuthTypeSelector === SHOW_USER_REG_RESTORE_SUCCESS ) {
            const textToSended = (loginType === this.typeOfEmail ? TEXT.SEND_PWD_EMAIL : TEXT.SEND_PWD_PHONE),
                iconProps = { intent: "primary", size: 120, stroke: 2, type: 'round' },
                showedIcon = (loginType === this.typeOfEmail ?
                    <MailIcon {...iconProps} /> :
                    <SmartphoneIcon {...iconProps} />);

            const loginToShow  =
                (this.state.loginType === this.typeOfEmail
                    ?
                this.props.userAuthLoginSelector
                    :
                formatPhone( this.loginNormalize( this.props.userAuthLoginSelector ) ));

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
                             onClick={() => this.props.userLoginShowAction()}>
                            {TEXT.TO_LOGIN}
                        </Btn>
                    </div>
                </div>
            );
        }

        //======= РЕГИСТРАЦИЯ / ВОСТАНОВЛЕНИЕ ПАРОЛЯ ========
        let { userFormInProgressSelector } = this.props;

        //если ожидание капчи, ставим форму в режим ожидания
        if (this.state.waitCaptcha) userFormInProgressSelector = true;

        const {
                registerError,
                registerErrorNotCorrectEmail,
                registerErrorNotCorrectPhone,
                restoreFailNoUser
            } = this.state,

            isError = (registerError || registerErrorNotCorrectEmail || registerErrorNotCorrectPhone || restoreFailNoUser),
            loginClass = ( isError && this.warningClass) || (loginType ? this.successClass : ''),
            loginIntent = ( isError && 'danger') || (loginType ? 'success' : ''),
            registerRestoreButtonText = (userAuthTypeSelector === SHOW_USER_RESTORE ? TEXT.TO_RESTORE : TEXT.TO_REGISTER),
            authFormLinkClass = !userFormInProgressSelector ? s.authFormLink : '';

        //назначаем текст ошибки
        let errorText = TEXT.ERROR_LOGIN;
        if (restoreFailNoUser) errorText = TEXT.ERROR_NO_USER_FOUND;
        if (registerErrorNotCorrectEmail) errorText = TEXT.ERROR_EMAIL_NOT_EXIST;
        if (registerErrorNotCorrectPhone) errorText = TEXT.ERROR_PHONE_NOT_EXIST;

        return (
                <div className={s.authForm}>
                    <Input name="login"
                           value={userAuthLoginSelector}
                           onChange={setUserFormLoginAction}
                           onFocus={this.handlerClearErrors}
                           disabled={this.state.pwdChangeLoading}
                           intent={loginIntent}
                           leftEl={this.iconLogin(loginIntent)}
                           error={isError && errorText}
                           autoComplete="new-password"
                           ref={( r ) => {
                               this.loginInput = r
                           }}
                    />

                    <Btn intent="primary" fill
                         disabled={userFormInProgressSelector}
                         className={s.authFormBtnMain}
                         onClick={this.handlerSubmitForm}>{registerRestoreButtonText}</Btn>

                    <div className={s.spaceBetweenWrap}>
                        <span>{TEXT.ALLREADY_REGISTERED}</span>
                        <BorderBtn
                                   intent="info"
                                   className={s.authFormBtn}
                                   disabled={userFormInProgressSelector}
                                   onClick={() => this.props.userLoginShowAction()}
                        >
                            {TEXT.TO_LOGIN}
                        </BorderBtn>
                    </div>

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
                        </div>}
                    </div>

                </div>
        )
    }
}

export default connect(
    state => ({
        userCaptchaToken: userGetCaptchaToken( state ),
        userFormInProgressSelector: userFormInProgressSelector( state ),
        userRegisterFailSelector: userRegisterFailSelector( state ),
        userRestoreFailSelector: userRestoreFailSelector( state ),
        userAuthLoginSelector: userAuthLoginSelector( state ),
        userAuthTypeSelector: userAuthTypeSelector( state )
    }),
    dispatch => ({
        modalConditionAction: ( show ) =>  dispatch(modalConditionAction( show ) ),
        userRestoreAction: ( login )  => dispatch( userRestoreAction( login ) ),
        userRegisterAction: ( login ) => dispatch( userRegisterAction( login ) ),
        setUserFormLoginAction:   (e) => dispatch( setUserFormLoginAction(e.target.value) ),
        userLoginShowAction: ()  => dispatch( userLoginShowAction() )
    })
)( AuthReg );
