import React, { Component } from 'react';
import { connect } from 'react-redux';

import { isEq } from 'libs/helpers';

import { Input, Radio, Btn } from 'components/_forms';

import { userPersonalInfoSelector, userPersonalInfoInProgressSelector } from 'selectors/user';
import {
    userSetPersonalInfo,
    userGetPersonalInfo,
    userLogout,
    sendPersonalInfoAction,
    sendAvatar
} from 'actions/user';

import s from "./ProfilePage.scss";
import TEXT_PROFILE from 'texts/profile';
import TEXT from 'texts/main';
import { IconUpload, IconClose } from 'components/Icons';

import Avatar from 'components/Avatar'

class TabPersonal extends Component {
    constructor ( props ) {
        super( props );
        this.state = {
            name: '',
            gender: '',
            avatar: '',
            phone: '',
            email: '',
        };
    }

    setStateData ( data ) {
        if ( !data ) data = {};
        this.setState( {
            name: data.name || '',
            gender: data.gender || '',
            avatar: data.avatar || '',
            phone: data.phone || '',
            email: data.email || '',
        } )
    }

    componentDidMount () {
        if ( !this.props.userInfoSelector.isRecived ) {         // Получены ли данные о пользователе
            this.props.userGetPersonalInfo();                   // Запросить данные
        } else {
            this.setStateData( this.props.userInfoSelector );   // Сохранить данные в state
        }
    }

    shouldComponentUpdate ( nextProps ) {
        if ( !isEq( this.props.userInfoSelector, nextProps.userInfoSelector ) ) {
            this.setStateData( nextProps.userInfoSelector );
            return false;
        }
        return true;
    }

    // Есть ли изменения в полях перс. инф., чтобы показать кнопки сохранения/отмены
    checkFormChanges () {
        return (this.state.name === this.props.userInfoSelector.name) && (this.state.gender === this.props.userInfoSelector.gender);
    }

    // Обработчик поля формы
    handleInputChange = ( event ) => {
        if ( !event || !event.target || !event.target.name ) return null;
        this.setState( { [event.target.name]: event.target.value } );
    };

    // Сохранить
    handlerSaveChanges = () => {
        const o={
            gender: this.state.gender,
            email:  this.state.email,
            phone:  this.state.phone,
        };
        this.props.userSetPersonalInfo( { ...o, name: this.state.name } );
        this.props.sendPersonalInfoAction( { ...o, fullName: this.state.name } );
    };

    // // Отменить
    // handlerCancelChanges = () => {
    //     this.setState( {
    //         name: this.props.userInfoSelector.name,
    //         gender: this.props.userInfoSelector.gender
    //     } );
    // };

    // Загрузить аватар
    changeAvatar = ( ava ) => {
        if (!ava){
            //Удалить аватар
            this.props.sendAvatar( false ); // TODO
            return null;
        }
        this.props.sendAvatar( ava.target.files[0] ); // TODO
    };

    render () {
        const { name, gender, avatar, phone, email } = this.state;
        const { userPersonalInfoInProgressSelector } = this.props;

        return (
            <div className={s.tabContent}>
                <div className={s.profileAvatar}>
                    <Avatar className={s.avatar} avatar={avatar}  gender={gender} inProgress={userPersonalInfoInProgressSelector}/>
                    <div className={s.profileAvatarBtnWrap}>
                        {!userPersonalInfoInProgressSelector ?  // Кнопка загрузки аватара
                            <label className={s.avatarLabel} htmlFor={'avatar'}>
                                <input id={'avatar'} onChange={this.changeAvatar} type="file" accept=".jpg, .jpeg, .png"
                                       name="avatar"/>
                                <Btn className={s.avatarBtn} large > <IconUpload/> {TEXT_PROFILE.LOAD_AVA}</Btn>
                            </label>
                            :
                            <div className={s.avatarLabel}>Загрузка...</div>
                        }
                    </div>
                </div>

                <div className={s.profilePersonal}>
                    <div className={s.personal}>
                        <Input name="name"
                               value={name}
                               onChange={this.handleInputChange}
                               label={TEXT_PROFILE.FIO}
                               placeholder={TEXT_PROFILE.FIO}
                               className={s.personalName}
                        />

                        <Radio
                            className={s.personalGender}
                            inline={true}
                            name="gender"
                            onChange={this.handleInputChange}
                            selectedValue={gender}
                            options={[{label: TEXT_PROFILE.MALE ,value: 'male'},{label: TEXT_PROFILE.FEMALE ,value: 'female'},]}
                        />

                        <Input name="email"
                               value={email}
                               onChange={this.handleInputChange}
                               label={TEXT_PROFILE.EMAIL}
                               placeholder={TEXT_PROFILE.EMAIL}
                               className={s.personalEmail}
                               disabled
                        />
                        <Input name="phone"
                               value={phone}
                               label={TEXT_PROFILE.PHONE}
                               placeholder={TEXT_PROFILE.PHONE}
                               className={s.personalPhone}
                               disabled
                               onChange={this.handleInputChange}
                        />

                        <div className={s.personalActions}>

                            <Btn intent="danger"
                                 className={s.personalBtnLogout}
                                 onClick={() => this.props.userLogout()}
                            >
                                {TEXT_PROFILE.LOGOUT}
                            </Btn>

                            <Btn intent="primary"
                                 className={s.personalBtnSave}
                                 onClick={this.handlerSaveChanges}
                                 disabled={this.checkFormChanges()}
                            >
                                {TEXT.SAVE}
                            </Btn>
                        </div>
                    </div>
                </div>

            </div>);
    }
}

export default connect(
    state => ({
        userInfoSelector: userPersonalInfoSelector( state ),
        userPersonalInfoInProgressSelector: userPersonalInfoInProgressSelector( state )
    }),
    dispatch => ({
        userSetPersonalInfo: ( o ) => dispatch( userSetPersonalInfo( o ) ),
        userGetPersonalInfo: () => dispatch( userGetPersonalInfo() ),
        userLogout: () => dispatch( userLogout() ),
        sendPersonalInfoAction: ( o ) => dispatch( sendPersonalInfoAction( o ) ),
        sendAvatar: ( avatarFile ) => dispatch( sendAvatar( avatarFile ) ),
    })
)( TabPersonal );