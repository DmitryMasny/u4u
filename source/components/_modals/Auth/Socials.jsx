import React, { memo } from "react";
import { useSelector } from "react-redux";
import s from "./Auth.scss";
import TEXT from "texts/main";
import { IconFacebook, IconGooglePlus, IconVk } from "../../Icons";
import store from 'libs/reduxStore';
import { getUserTokenSuccessAction } from "../../../actions/user";
import { toast } from '__TS/libs/tools';
import { modalAuthSelector } from 'selectors/modals';



const socials = {
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


const Socials = ( { disabled = false } ) => {
    let timerOut = null,
        interval = null,
        windowObj =null;

    const $modalAuthSelector = useSelector( modalAuthSelector );

    const handlerSocialAuth = social => {
        const self = this;

        //создаем новое окно
        windowObj = window.open('', '_blank');

        const status = response => {
            if ( response && response.status >= 200 && response.status < 300 ) {
                return Promise.resolve( response )
            } else {
                return Promise.reject( new Error( response.statusText ) )
            }
        };

        const json = response => response.json();

        const token = localStorage.getItem('auth_token');
        const myHeaders = new Headers({
                                          'authorization': 'Bearer ' + token
                                      });

        //получаем ссылку на ресурсы
        fetch('/auth/' + social + '/', {
            method: 'GET',
            headers: myHeaders
        })
            .then( status )
            .then( json )
            .then( response  => {
                //окно авторизации соц сети
                // self.w.onload = () => {

                // console.log('onload');

                windowObj.location.href = response.url;

                const authCurrent = localStorage.getItem( 'auth_token' );
                if ( interval ) clearInterval( interval );

                interval = setInterval(() => {
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
                timerOut = setTimeout( () => {
                    clearInterval( interval );
                }, 300000 );

                function errAuthSocial( err ) {
                    clearInterval( interval );
                    clearTimeout( timerOut );
                    toast.error( 'Авторизация не удалась', {
                        autoClose: 3000
                    });

                    windowObj.close();
                }

                function setNewToken( token ) {
                    clearInterval( interval );
                    clearTimeout( timerOut );

                    store.dispatch( getUserTokenSuccessAction( {
                                                                   response: { token: token },
                                                                   callback: typeof $modalAuthSelector === 'function' ? $modalAuthSelector : null
                                                               } ) );

                    windowObj.close();
                }
                // }
            } )
            .catch( ( error ) => {
                if ( windowObj ) windowObj.close();
                toast.error('Проблема с соединением', {
                    autoClose: 3000
                });
            });
    };

    const socialClassArray = [s.socialWrap];
    if ( disabled ) socialClassArray.push( s.socialBlocked );

    return <div className={s.authFormBottomText}>
                <div className={s.socialHeader}>{TEXT.OR_LOGIN_SOCIAL}</div>
                <div className={socialClassArray.join(' ')}>
                    <div className={`${s.socialBtn} ${s.socialBtnVk}`} onClick={()=>handlerSocialAuth(socials['vk'].id)}><IconVk size={24}/></div>
                    <div className={`${s.socialBtn} ${s.socialBtnFb}`} onClick={()=>handlerSocialAuth(socials['fb'].id)}><IconFacebook size={24}/></div>
                    <div className={`${s.socialBtn} ${s.socialBtnGoogle}`} onClick={()=>handlerSocialAuth(socials['google'].id)}><IconGooglePlus size={24}/></div>
                </div>
            </div>;
};

export default memo( Socials );