import React  from 'react';
import { connect } from 'react-redux';
import Auth from './_Auth';
//import Captcha from 'components/Captcha';

import { Input, Btn } from 'components/_forms';

import Tooltip from 'components/_forms/Tooltip';

import BorderBtn from "components/BorderBtn";
import {
    IconVk,
    IconFacebook,
    IconInstagram,
    IconGooglePlus,
    IconEyeOn,
    IconEyeOff,
    IconLockOpen,
    IconEye,
    IconCheck
} from 'components/Icons';

import TEXT from 'texts/main';
import s from './Auth.scss';

import { loadReCaptcha } from 'react-recaptcha-google'

import {
    userRegShowAction,
    userRestorePwdShowAction,
    setUserFormLoginAction,
    userLoginFailAction,
    userLoginAction,
    userLoginSocial
} from 'actions/user';

import {
    userAuthLoginSelector,
    userFormInProgressSelector,
    userLoginFailSelector,
    userGetCaptchaToken
} from 'selectors/user';

import {
    loginInputFormProps,
    pwdInputFormProps,
    loginInputProps,
    pwdInputProps,
    tooltipProps,
    tooltipPropsPwdShow
} from './props';


//иконка для поля пароля
const PwdIcon = ({isOn, onClick, className}) => (
    <Tooltip {...tooltipPropsPwdShow} className={className} tooltip={isOn ? TEXT.HIDE_PWD : TEXT.SHOW_PWD}>
        <Btn intent="minimal" className={s.showPwdIcon} onClick={onClick}>
            <IconEye intent={isOn ? 'danger' : 'mute'} onClick={onClick}/>
        </Btn>
    </Tooltip>);


class AuthLogin extends Auth {
    componentDidMount() {
        // if (this.context.setModal) this.context.setModal({  title: TEXT.LOGIN });

        this.loginValidator(this.props.userAuthLoginSelector);
    };
    userLogin() {
        const { userCaptchaToken } = this.props;

        //если капчи еще нет, ожидаем ее
        if (!userCaptchaToken) {
            this.props.startCaptcha();
            this.waitCaptcha(true);
            return;
        }

        const { loginType, pwd } = this.state;
        this.props.userLoginAction( {[loginType]: this.loginNormalize(this.props.userAuthLoginSelector), pwd: pwd, responseId: userCaptchaToken } );
    };
    handlerSubmitForm = (e) => {
        e.preventDefault();

        //проверяем на ошибки
        let err = null,
            { loginType, pwd } = this.state;

        if      ( !loginType ) { err = { loginError: true } }
        else if ( !pwd )       { err = { pwdError: true} }

        if (err) {
            this.setState({...this.errorState, ...err});
            return;
        }

        //запускаем авторизацию через капчу
        this.userLogin();
    };
    componentDidUpdate( prevProps ) {
        //если ждем капчу и токен уже есть
        if (this.state.waitCaptcha && (this.props.userCaptchaToken !== prevProps.userCaptchaToken)) {
            this.waitCaptcha(false);
            this.userLogin();
        }
    };
    handlerSwitchSavePwd = () => this.setState({rememberPwd: !this.state.rememberPwd});
    handlerSwitchShowPwd = () => this.setState({showPassword: !this.state.showPassword});

    render() {
        let  { userFormInProgressSelector, userLoginFailSelector, userAuthLoginSelector, setUserFormLoginAction } = this.props;

        //если ожидание капчи, ставим форму в режим ожидания
        if (this.state.waitCaptcha) userFormInProgressSelector = true;

        const {
                loginError,
                pwdError,
                loginType,
                pwd
              } = this.state,
                // loginClass = (loginError || userLoginFailSelector && this.warningClass) || (loginType ? this.successClass : ''),
                // pwdClass   = (pwdError   || userLoginFailSelector && this.warningClass) || (pwd.length >= 6 ? this.successClass : ''),
                loginIntent = (loginError && 'danger') || (userLoginFailSelector && 'danger') || (loginType ? 'success' : ''),
                pwdIntent   = (pwdError && 'danger') || (userLoginFailSelector && 'danger') || (pwd.length >= 6 ? 'success' : ''),
                authFormLinkClass = !userFormInProgressSelector ? s.authFormLink : '';

        return (
            <Tooltip {...tooltipProps} tooltip={TEXT.ERROR_AUTH} tooltipShown={userLoginFailSelector}>


                    <div className={s.authForm}>
                        <Input name="login"
                               type="email"
                               value={userAuthLoginSelector}
                               onChange={setUserFormLoginAction}
                               onFocus={this.handlerClearErrors}
                               placeholder={TEXT.PHONE_OR_EMAIL_LABEL}
                               disabled={this.state.pwdChangeLoading}
                               intent={loginIntent}
                               error={loginError && TEXT.ERROR_LOGIN}
                               autoComplete="current-login"
                               autoFocus={true}
                               leftEl={this.iconLogin(loginIntent)}
                        />

                        <Input name="password"
                               type={this.state.showPassword ? 'text' : 'password'}
                               onChange={this.handlerChange('pwd')}
                               onFocus={this.handlerClearErrors}
                               placeholder={TEXT.PASSWORD_LABEL}
                               disabled={userFormInProgressSelector}
                               intent={pwdIntent}
                               error={pwdError && TEXT.ERROR_PWD}
                               autoComplete="current-password"
                               leftEl={<IconLockOpen intent={pwdIntent}/>}
                               rightEl={<PwdIcon isOn={this.state.showPassword} onClick={this.handlerSwitchShowPwd} />}
                        />

                        <Btn intent="primary" fill
                            disabled={userFormInProgressSelector}
                            className={s.authFormBtnMain}
                            onClick={(e)=>this.handlerSubmitForm(e)}>
                            {TEXT.TO_LOGIN}
                        </Btn>

                        <div className={s.pwdHelp}>
                                <span className={s.authFormText}>
                                    {TEXT.FORGET_PASSWORD}
                                </span>
                            <span className={s.authFormLink}
                                  onClick={() => !userFormInProgressSelector && this.props.userRestorePwdShowAction()}>
                                    {TEXT.RESTORE_PASSWORD}
                                </span>
                        </div>

                        <BorderBtn fill
                                   intent="info"
                                   className={s.authFormBtn}
                                   disabled={userFormInProgressSelector}
                                   onClick={() => this.props.userRegShowAction()}
                                >
                            {TEXT.TO_REGISTER}
                        </BorderBtn>


                        <div className={s.authFormBottomText}>

                            <div className={s.socialHeader}>{TEXT.OR_LOGIN_SOCIAL}</div>
                            <div className={s.socialWrap}>
                                <div className={`${s.socialBtn} ${s.socialBtnVk}`} onClick={()=>this.socialAuth(this.socials['vk'].id)}><IconVk size={24}/></div>
                                <div className={`${s.socialBtn} ${s.socialBtnFb}`} onClick={()=>this.socialAuth(this.socials['fb'].id)}><IconFacebook size={24}/></div>
                                {this.showInstagramButton && <div className={`${s.socialBtn} ${s.socialBtnInst}`} onClick={()=>this.socialAuth(this.socials['instagram'].id)}><IconInstagram size={24}/></div>}
                                <div className={`${s.socialBtn} ${s.socialBtnGoogle}`} onClick={()=>this.socialAuth(this.socials['google'].id)}><IconGooglePlus size={24}/></div>
                            </div>

                        </div>
                    </div>

            </Tooltip>
        )
    }
}

export default connect(
    state => ({
        userCaptchaToken: userGetCaptchaToken( state ),
        userFormInProgressSelector: userFormInProgressSelector( state ),
        userLoginFailSelector: userLoginFailSelector( state ),
        userAuthLoginSelector: userAuthLoginSelector( state )
    }),
    dispatch => ({
        userLoginAction: ( login, pwd )   => dispatch( userLoginAction( login, pwd ) ),
        userLoginFailAction: ( show )     => dispatch( userLoginFailAction( show ) ),
        userRegShowAction:        () => dispatch( userRegShowAction() ),
        userRestorePwdShowAction: () => dispatch( userRestorePwdShowAction() ),
        setUserFormLoginAction:   (e) => dispatch( setUserFormLoginAction(e.target.value) ),
        userLoginSocial:      ( type )    => dispatch( userLoginSocial( type ) ),
    })
)( AuthLogin );
