import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Input, Radio, Btn } from 'components/_forms';

import Tooltip from 'components/_forms/Tooltip';

import Spinner from 'components/Spinner';

import { changePasswordAction } from 'actions/user';

import s from "./ProfilePage.scss";
import TEXT_PROFILE from 'texts/profile';

import { toast } from '__TS/libs/tools';

import { IconCheck } from 'components/Icons';


class TabChangePwd extends Component {
    constructor ( props ) {
        super( props );
        this.defaultState = {
            pwdOld: '',
            pwdOldGood: null,
            pwdOldError: null,

            pwdNew: '',
            pwdNewGood: null,
            pwdNewError: null,

            pwdNewRe: '',
            pwdNewReGood: null,
            pwdNewReError: null,

            pwdChangeLoading: false
        };
        this.state = this.defaultState;
    }

    // Обработчик поля формы
    handleInputChange = ( event ) => {
        console.log('event',event);
        console.log('handleInputChange',{
            name: event.target.name,
            value: event.target.value
        });
        if ( !event || !event.target || !event.target.name ) return null;
        this.setState( { [event.target.name]: event.target.value, [event.target.name + 'Good']: null } );
    };

    // Сброс ошибок
    handlerClearErrors = () => {
        this.setState( {
                           pwdOldGood: this.checkPwd('old'),
                           pwdNewGood: this.checkPwd('new'),
                           pwdNewReGood: this.checkPwd('re'),

                           pwdOldError: null,
                           pwdNewError: null,
                           pwdNewReError: null
                       });
    };

    // Обработка ошибок от сервера
    errorCallback = ( err ) => {
        if (!err) this.setState( { pwdOldError: TEXT_PROFILE.ERROR_PWD_OLD_WRONG, pwdOldGood: null, pwdChangeLoading: false } );
        if (err.hasOwnProperty('old')){
            this.setState( { pwdOldError: TEXT_PROFILE.ERROR_PWD_OLD_WRONG, pwdOldGood: null, pwdChangeLoading: false } );
        } else if (err.hasOwnProperty('new')){
            this.setState( { pwdNewError: TEXT_PROFILE.ERROR_PWD_NEW_WRONG_S, pwdNewGood: null, pwdChangeLoading: false } );
        } else {
            console.log('Ошибка обработчика ошибок! Непредусмотренные данные ',err);
            toast.error(TEXT_PROFILE.CHANGE_PWD_UNKNOWN_ERR, {
                autoClose: 3000
            });
        }
    };

    // Callback в случае успеха
    successCallback = (  ) => {
        this.setState({...this.defaultState}) ;
        toast.success(TEXT_PROFILE.CHANGE_PWD_SUCCESS, {
            autoClose: 3000
        });
    };

    // Проверка поля на наличие ошибок
    checkPwd = (type) => {
        switch (type) {
            case 'old':
                if (!this.state.pwdOld.length){
                    this.setState( { pwdOldError: TEXT_PROFILE.ERROR_PWD_OLD_EMPTY } );
                    return false;
                }
                return true;

            case 'new':
                if (!this.state.pwdNew.length){
                    this.setState( { pwdNewError: TEXT_PROFILE.ERROR_PWD_NEW_EMPTY } );
                    return false;
                }
                if (!(this.state.pwdNew.length > 5)){
                    this.setState( { pwdNewError: TEXT_PROFILE.ERROR_PWD_NEW_WRONG } );
                    return false;
                }
                return true;

            case 're':
                if (!this.state.pwdNewRe.length){
                    this.setState( { pwdNewReError: TEXT_PROFILE.PWD_NEW_RE } );
                    return false;
                }
                if (this.state.pwdNew !== this.state.pwdNewRe){
                    this.setState( { pwdNewReError: TEXT_PROFILE.ERROR_PWD_RE_WRONG } );
                    return false;
                }
                return true;
        }


    };
    // Сменить пароль - отправка данных на сервер
    handlerSavePwdChanges = () => {
        this.handlerClearErrors();

        if( this.checkPwd('old') && this.checkPwd('new') && this.checkPwd('re')) {
            this.setState({pwdChangeLoading: true});
            this.props.changePasswordAction( {
                                                 old: this.state.pwdOld,
                                                 new: this.state.pwdNew,
                                                 confirm: this.state.pwdNewRe,
                                                 errorCallback: this.errorCallback,
                                                 successCallback: this.successCallback
                                             } );
        }
    };

    // Условие, когда можно нажать на кнопку Сменить пароль
    saveBtnDisabled = () => {
        return !(this.state.pwdOld && this.state.pwdNew && this.state.pwdNewRe && (this.state.pwdNewRe === this.state.pwdNew));
    };


    render () {
        const { pwdOld, pwdNew, pwdNewRe,pwdOldError,pwdNewError,pwdNewReError, pwdOldGood,pwdNewGood,pwdNewReGood } = this.state;

        return (
            <div className={s.tabContent}>
                <div className={s.profilePwd}>

                    <Input name="pwdOld"
                           type="password"
                           value={pwdOld}
                           onChange={this.handleInputChange}
                           onFocus={this.handlerClearErrors}
                           label={TEXT_PROFILE.PWD_OLD}
                           className={s.pwdOld}
                           disabled={this.state.pwdChangeLoading}
                           intent={pwdOldGood ? 'success':null}
                           rightEl={pwdOldGood && <IconCheck className={s.iconGood}/>}
                           error={pwdOldError}
                           autoComplete="off"
                    />

                    <Input name="pwdNew"
                           type="password"
                           value={pwdNew}
                           onChange={this.handleInputChange}
                           onFocus={this.handlerClearErrors}
                           label={TEXT_PROFILE.PWD_NEW}
                           className={s.pwdNew}
                           disabled={this.state.pwdChangeLoading}
                           intent={pwdNewGood ? 'success':null}
                           rightEl={pwdNewGood && <IconCheck className={s.iconGood}/>}
                           error={pwdNewError}
                           autoComplete="new-password"
                    />

                    <Input name="pwdNewRe"
                           type="password"
                           value={pwdNewRe}
                           onChange={this.handleInputChange}
                           onFocus={this.handlerClearErrors}
                           label={TEXT_PROFILE.PWD_NEW_RE}
                           className={s.pwdNewRe}
                           disabled={this.state.pwdChangeLoading}
                           intent={pwdNewReGood ? 'success':null}
                           rightEl={pwdNewReGood && <IconCheck className={s.iconGood}/>}
                           error={pwdNewReError}
                           autoComplete="new-password"
                    />

                    <Btn intent="primary" className={s.pwdBtn} onClick={this.handlerSavePwdChanges} disabled={!pwdOld || this.state.pwdChangeLoading}>
                        {this.state.pwdChangeLoading ? <Spinner className={s.spinner} size={24}/> : TEXT_PROFILE.CHANGE_PWD}
                    </Btn>

                </div>
            </div>);
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        changePasswordAction: ( o ) => dispatch( changePasswordAction( o ) )
    })
)( TabChangePwd );