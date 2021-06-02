import React, { Component } from 'react';
import { dispatch } from 'redux';
import { validateEmail, validateForPhone } from 'libs/validators';
import PropTypes from "prop-types";

import { IconPhoneApple, IconMailOutline, IconAccount } from 'components/Icons';

import { toast } from '__TS/libs/tools';

import { getUserTokenSuccessAction } from 'actions/user';

import store from 'libs/reduxStore';
import { ModalContext } from 'components/Modal';


class _Auth extends Component {
    static contextTypes = ModalContext;
    //static contextTypes = { //прокидываем контекст для окна, заголовок и блокировку окна
    //    setModalTitle: PropTypes.func,
    //    setModalBlocked: PropTypes.func
    //};
    errorState = { //ошибки авторизации
        loginError: false,
        pwdError: false,
        authError: false,
        registerError: false,
        registerErrorNotCorrectEmail: false,
        registerErrorNotCorrectPhone: false,
        restoreFailNoUser: false
    };
    state = { //начальное состояние авторизации
        loginType: null,
        pwd: '',
        rememberPwd: true,
        showPassword: false,
        waitCaptcha:  false,
        ...this.errorState
    };

    successClass = 'bp3-intent-success';
    warningClass = 'bp3-intent-warning';
    typeOfEmail = 'email';
    typeOfPhone = 'phone';

    socials = {
        'fb': {
            id: 'fb',
            name: 'Facebook'
        },
        'vk': {
            id: 'vk',
            name: 'Вконтакте'
        },
        'instagram': {
            id: 'instagram',
            name: 'Instagram'
        },
        'google': {
            id: 'google',
            name: 'Google Plus'
        }
    };

    interval = null;
    timerOut = null;
    w = null;

    showInstagramButton = (() => {
        const today = new Date(),
              dedline =  new Date('04/01/2020'); //1 апреля 2020 года
        return today.getTime() < dedline.getTime();
    })();
    /**
     * авторизация/регистрация чкерез соцсети
     * @param social
     */
    socialAuth = ( social ) => {

        const self = this;

        //создаем новое окно
        self.w = window.open('', '_blank');

        const status = ( response ) => {
            if ( response && response.status >= 200 && response.status < 300 ) {
                return Promise.resolve( response )
            } else {
                return Promise.reject( new Error( response.statusText ) )
            }
        };

        const json = (response) => response.json();

        const token = localStorage.getItem('auth_token');
        const myHeaders = new Headers({
                                    'authorization': 'Bearer ' + token
                                });

        //получаем ссылку на ресурсы
        fetch('/auth/' + social + '/', {
            method: 'GET',
            headers: myHeaders
        })
            .then(status)
            .then(json)
            .then( ( response ) => {
                //окно авторизации соц сети
                // self.w.onload = () => {

                    // console.log('onload');

                    self.w.location.href = response.url;

                    const authCurrent = localStorage.getItem( 'auth_token' );
                    if ( this.interval ) clearInterval( self.interval );

                    this.interval = setInterval(() => {
                        const newToken = localStorage.getItem( 'auth_token' ),
                              err = localStorage.getItem( 'auth_token_err' );

                        if ( err ) {
                            localStorage.removeItem( 'auth_token_err' );
                            errAuthSocial( err );
                        } else if ( newToken && authCurrent !== newToken ) {
                            setNewToken( newToken );
                        }
                    }, 350 );

                    //timeout на отбой ожидания ответа
                    this.timerOut = setTimeout( () => {
                        clearInterval( self.interval );
                    }, 300000 );

                    function errAuthSocial( err ) {
                        clearInterval( self.interval );
                        clearTimeout( self.timerOut );
                        toast.error('Авторизация не удалась', {
                            autoClose: 3000
                        });

                        self.w.close();
                    }

                    function setNewToken( token ) {
                        clearInterval( self.interval );
                        clearTimeout( self.timerOut );

                        store.dispatch( getUserTokenSuccessAction( { response: { token: token } } ) );

                        self.w.close();
                    }
                // }
            } )
            .catch( ( error ) => {
                if (self.w) self.w.close();
                toast.error('Проблема с соединением', {
                    autoClose: 3000
                });

        });
    };

    /**
     * Метод переключения состояния ожидания капчи
     * @param isOn
     */
    waitCaptcha( isOn = false ) {
        this.setState({waitCaptcha: isOn});
    }

    /**
     * Иконка поля Логин в зависимости от типа логина
     * @returns {string}
     */
    iconLogin = ( intent ) => {
        if (this.state.loginType === this.typeOfEmail) {
            return <IconMailOutline intent={intent}/>;
        } else if (this.state.loginType === this.typeOfPhone) {
            return <IconPhoneApple intent={intent}/>;
        }
        return <IconAccount intent={intent}/>;
    };

    /**
     * Нормализация логина
     * @param login
     * @returns {string}
     */
    loginNormalize = ( login ) => {
        let loginTxt = login.toString();

        if (this.state.loginType === this.typeOfEmail) {
            //если email то переводим в нижний регистр
            return loginTxt.toLowerCase();
        } else {
            //если телефон, убираем лишние символы и оставляем последние 10 символов (мобильный телефон)
            loginTxt = loginTxt.replace(/\D+/g, "");
            return loginTxt.substring(loginTxt.length - 10);
        }
    };

    /**
     * проверям логин на валидацию почты или телефона
     * @param login
     */
    loginValidator = ( login ) => this.setState( {loginType: validateEmail( login ) ? this.typeOfEmail : validateForPhone( login ) ? this.typeOfPhone : null} );

    shouldComponentUpdate(nextProps, nextState) {
        //блокируем окно, если статус в "в процессе" или ожидание капчи
        if (this.context.setModalBlocked) this.context.setModalBlocked( nextProps.userFormInProgressSelector || nextState.waitCaptcha );

        if ((nextProps.userAuthLoginSelector !== this.props.userAuthLoginSelector) || (nextProps.userAuthTypeSelector !== this.props.userAuthTypeSelector)) {
            this.loginValidator(nextProps.userAuthLoginSelector);
            return false;
        }

        if (this.props.userRegisterFailSelector !== nextProps.userRegisterFailSelector && nextProps.userRegisterFailSelector) {
            if (this.state.loginType === this.typeOfEmail) {
                this.setState( { registerErrorNotCorrectEmail: true } );
            } else {
                this.setState( { registerErrorNotCorrectPhone: true } );
            }
            return false;
        }

        if (this.props.userRestoreFailSelector !== nextProps.userRestoreFailSelector && nextProps.userRestoreFailSelector && (nextProps.userRestoreFailSelector !== 'Пароль уже отправлен.')) {
            this.setState({restoreFailNoUser: true});
            return false;
        }


        return true;
    };
    handlerClearErrors = () => {
        this.setState(this.errorState);
        if (this.props.userLoginFailSelector && this.props.userLoginFailAction) this.props.userLoginFailAction( false );
    };
    handlerChange = name => event => this.setState({ [name]: event.target.value});
    // handlerLoginChange = x => console.log('xxxx',x);

}

export default _Auth