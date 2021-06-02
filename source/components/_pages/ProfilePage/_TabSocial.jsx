import React, { Component } from 'react';
import { connect } from 'react-redux';

import { isEq } from 'libs/helpers';

import { Btn } from 'components/_forms';

import { userPersonalInfoSelector } from 'selectors/user';
import {
    userSetPersonalInfo,
    userGetPersonalInfo,
    userLogout,
    sendPersonalInfoAction
} from 'actions/user';

import { SOCIAL_VKONTAKTE, SOCIAL_INSTAGRAM, SOCIAL_GOOGLE } from "const/profile";

import s from "./ProfilePage.scss";
import TEXT_PROFILE from 'texts/profile';
import TEXT_MAIN from 'texts/main';
import { IconInstagram, IconGooglePlus, IconVk } from 'components/Icons';


const SocialItems = ( { items, actionBind, actionUnBind } ) => {
    return items.map( ( item, k ) => {
        if ( item.name ) {
            // Залогинен
            return (
                <div className={s.socialItem} key={k}>
                    <div className={s.socialItemImage} style={{ backgroundImage: `url(${item.imgUrl})` }}/>

                    <div className={s.socialItemText}>
                        <span className={s.socialItemTextLabel}>{TEXT_PROFILE.SOCIAL_LOGIN_LABEL}</span>
                        <a className={s.socialItemTextLink} href={'#'} target="_blank">{item.name}</a>
                    </div>

                    <Btn intent="danger" className={s.socialItemBtn} onClick={()=>actionUnBind(item.id)} >
                        {TEXT_PROFILE.SOCIAL_UNBIND}
                    </Btn>
                </div>
            );
        } else return (
            // Не залогинен
            <div className={s.socialItem} key={k}>
                <div className={s.socialItemIcon}> {item.icon} </div>

                <div className={s.socialItemText}>
                    {item.title}
                </div>

                <Btn intent="info" className={s.socialItemBtn} onClick={()=>actionBind(item.id)}>
                    {TEXT_PROFILE.SOCIAL_BIND}
                </Btn>
            </div>
        );

    } );
};

class TabSocial extends Component {
    constructor ( props ) {
        super( props );
        this.state = {
            [SOCIAL_VKONTAKTE]: {
                name: 'Коала Засыпала',
                imgUrl: 'http://itd1.mycdn.me/image?id=835659385670&t=20&plc=WEB&tkn=*X2AR6Gt4j5S7pnT03py9zA8tT0s',
            },
            [SOCIAL_INSTAGRAM]: null,
            [SOCIAL_GOOGLE]: null,
        };
    }

    //
    // setStateData ( data ) {
    //     if ( !data ) data = {};
    //     this.setState( {
    //         name: data.name || '',
    //         gender: data.gender || '',
    //         avatar: data.avatar || '',
    //         phone: data.phone || '',
    //         email: data.email || '',
    //     } )
    // }
    //
    // componentDidMount () {
    //     if ( !this.props.userInfoSelector.isRecived ) {         // Получены ли данные о пользователе
    //         this.props.userGetPersonalInfo();                   // Запросить данные
    //     } else {
    //         this.setStateData( this.props.userInfoSelector );   // Сохранить данные в state
    //     }
    // }
    //
    // shouldComponentUpdate ( nextProps ) {
    //     if ( !isEq( this.props.userInfoSelector, nextProps.userInfoSelector ) ) {
    //         this.setStateData( nextProps.userInfoSelector );
    //         return false;
    //     }
    //     return true;
    // }

    // Обработчик поля формы
    handleBindSocial = ( id ) => {
        console.log( 'handleBindSocial ', id );
    };

    // Обработчик поля формы
    handleUnBindSocial = ( id ) => {
        console.log( 'handleUnBindSocial ', id );
    };

    render () {

        const socialItems = [
            {
                id: SOCIAL_VKONTAKTE,
                title: TEXT_MAIN.VK,
                icon: <IconVk size={32}/>,
                name: this.state[SOCIAL_VKONTAKTE] && this.state[SOCIAL_VKONTAKTE].name || null,
                imgUrl: this.state[SOCIAL_VKONTAKTE] && this.state[SOCIAL_VKONTAKTE].imgUrl || null,
            },
            {
                id: SOCIAL_INSTAGRAM,
                title: TEXT_MAIN.INSTAGRAM,
                icon: <IconInstagram size={32}/>,
                name: this.state[SOCIAL_INSTAGRAM] && this.state[SOCIAL_INSTAGRAM].name || null,
                imgUrl: this.state[SOCIAL_INSTAGRAM] && this.state[SOCIAL_INSTAGRAM].imgUrl || null,
            },
            {
                id: SOCIAL_GOOGLE,
                title: TEXT_MAIN.GOOGLE,
                icon: <IconGooglePlus size={32}/>,
                name: this.state[SOCIAL_GOOGLE] && this.state[SOCIAL_GOOGLE].name || null,
                imgUrl: this.state[SOCIAL_GOOGLE] && this.state[SOCIAL_GOOGLE].imgUrl || null,
            }
        ];

        return (
            <div className={s.tabContent}>

            <h4>Показан в демонстрационных целях, раздел будет закрыт до готовности функционала.</h4>

                <div className={s.profileSocial}>
                    <p className={s.socialText}>{TEXT_PROFILE.SOCIAL_TEXT}</p>

                    <div className={s.socialWrap}>
                        <SocialItems items={socialItems}
                                     actionBind={this.handleBindSocial}
                                     actionUnBind={this.handleUnBindSocial}/>
                    </div>
                </div>


            </div>);
    }
}

export default connect(
    state => ({
        userInfoSelector: userPersonalInfoSelector( state )
    }),
    dispatch => ({
        userSetPersonalInfo: ( o ) => dispatch( userSetPersonalInfo( o ) ),
        userGetPersonalInfo: () => dispatch( userGetPersonalInfo() ),
        userLogout: () => dispatch( userLogout() ),
        sendPersonalInfoAction: ( o ) => dispatch( sendPersonalInfoAction( o ) ),
    })
)( TabSocial );