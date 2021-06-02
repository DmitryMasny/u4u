import React, { useEffect, useContext, useState, useRef, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";


import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import { SOCIAL_GOOGLE, SOCIAL_INSTAGRAM, SOCIAL_VK, SOCIAL_YA } from 'const/myPhotos';
import TEXT_MAIN from 'texts/main';
import TEXT_MY_PHOTOS from "texts/my_photos";
import s from "./index.scss";

import {
    getGooglePhotosAction, addPhotosFromGoogleAction,
    getInstagramPhotosAction, addPhotosFromInstagramAction,
    getVkPhotosAction, addPhotosFromVkAction,
    getYandexPhotosAction, addPhotosFromYandexAction,
} from 'components/_pages/MyPhotosPage/actions';

import { toast } from '__TS/libs/tools';

import Library from "components/Library";

import { modalUploadSocialPhotosAction } from 'actions/modals';
import { modalUploadSocialPhotosSelector } from 'selectors/modals';
import {selectLibraryItem, arrayBufferToBase64} from "libs/helpers";
import {windowHeightSelector, windowWidthSelector} from "selectors/global";

/**
 *  Модалка загруки фотографий из соцсетей
 */
const SocialPhotosModal = memo((props) => {

    const interval = useRef({});
    const w = useRef({});

    const {setModal, closeModal} = useContext(ModalContext);
    const dispatch = useDispatch();
    const uploadSocialPhotosSelector = useSelector(modalUploadSocialPhotosSelector);
    const windowWidth = useSelector( state => windowWidthSelector( state ) );
    const windowHeight = useSelector( state => windowHeightSelector( state ) );

    const [socialSuccess, setSocialSuccess] = useState(null);   // true после удачного редиректа при авторизации в Social Photos (чтобы исключить возможность вхождения в цикл)
    const [socialPhotos, setSocialPhotos] = useState(null);     // массив фотографий
    const [lastSelected, setLastSelected] = useState(null);     // последняя выделенная (для выделения с shift)
    const [next, setNext] = useState(null);                     // url следующей страницы Social Photos
    const [loadNextPage, setLoadNextPage] = useState(null);     // состояние: подгрузка следующей страницы (boolean)
    const [noSocialPhotos, setNoSocialPhotos] = useState(null); // true если в соцсети нет фотографий
    // const [waitingForClose, setWaitingForClose] = useState(null); // состояние: подгрузка следующей страницы (boolean)
    // const [selectedCount, setSelectedCount] = useState(null); // состояние: подгрузка следующей страницы (boolean)

    const getSocialPhotos = ( callback, next ) => {
        if (!uploadSocialPhotosSelector) return null;
        switch (uploadSocialPhotosSelector.target) {
            case SOCIAL_GOOGLE:     return dispatch(getGooglePhotosAction( callback, next ));
            case SOCIAL_INSTAGRAM:  return dispatch(getInstagramPhotosAction( callback, next ));
            case SOCIAL_VK:         return dispatch(getVkPhotosAction( callback, next ));
            case SOCIAL_YA:         return dispatch(getYandexPhotosAction( callback, next ));
        }
    };
    const addPhotosFromSocial = ( list ) => {
        if (!uploadSocialPhotosSelector) return null;
        switch (uploadSocialPhotosSelector.target) {
            case SOCIAL_GOOGLE:     return dispatch(addPhotosFromGoogleAction( list ));
            case SOCIAL_INSTAGRAM:  return dispatch(addPhotosFromInstagramAction( list ));
            case SOCIAL_VK:         return dispatch(addPhotosFromVkAction( list ));
            case SOCIAL_YA:         return dispatch(addPhotosFromYandexAction( list ));
        }
    };


    // Ответ на авторизацию в соц-сетях
    const socialCallback = (data) => {
        if (data.results) {
            // Пользователь авторизован, пришел ответ с гугл фотками
            if (!data.results.length) {
                // может прийти пустой массив после фильтрации не jpeg на сервере. Запрашиваем сл. страницу, пока есть
                if (data.next) {
                    setLoadNextPage(true);
                    getSocialPhotos(socialCallback, data.next); //Запрашиваем снова по новому урлу (след. страница)
                } else  setNoSocialPhotos(true);        // Запись, что нет фоток в соцсети
            } else {
                // Все хорошо, фотки пришли
                setLoadNextPage(false);         //Убираем статус загрузки
                setNext(data.next || false);    //Запись next url

                // Для превьюшек яндекс фоток надо строить запрос
                if (uploadSocialPhotosSelector.target === SOCIAL_YA) {

                    const yaPhotosArray = [];

                    for (let i=0; i < data.results.length; i++) {
                        const thumb = data.results[i];
                        const authId = thumb.requestUuid;
                        if (authId){
                            const headers = new Headers();
                            headers.append('Content-Type', 'text/plain; charset=UTF-8');
                            headers.append('access-control-allow-origin', '*');
                            headers.append('Authorization', 'OAuth ' + authId);

                            const options = {
                                method: 'GET',
                                headers: headers,
                                mode: 'cors',
                                cache: 'default',
                            };
                            const request = new Request(thumb.url);

                            fetch(request, options).then((response) => {
                                if (response.status === 200 || response.ok){
                                    response.arrayBuffer().then((buffer) => {
                                        const base64Flag = 'data:image/jpeg;base64,';
                                        const imageStr = arrayBufferToBase64(buffer);
                                        thumb.url = base64Flag + imageStr;
                                        if (!thumb.id ) thumb.id = thumb.photoId;
                                        yaPhotosArray.push(thumb);
                                        if (yaPhotosArray.length === data.results.length) {
                                            setSocialPhotos( [...(socialPhotos || []), ...yaPhotosArray] );
                                        }
                                    });
                                }
                            });

                        }
                    }

                } else {
                    const newPhotos = data.results && data.results.map((item)=>({...item, id: item.id || item.photoId})) || [];
                    setSocialPhotos(socialPhotos ? [...socialPhotos, ...newPhotos] : newPhotos);
                }

            }

        } else if (data.redirectUrl) {
            // Пользователю необходимо авторизоваться в social photos
            const socialWindowSize = {
                w: 380,
                h: 420
            };
            socialWindowSize.x = windowWidth ? (windowWidth - socialWindowSize.w) /2 : 50;
            socialWindowSize.y = windowHeight ? (windowHeight - socialWindowSize.h) /2  : 50;


            w.current = {window: window.open('', '_blank', `width=${socialWindowSize.w},height=${socialWindowSize.h},left=${socialWindowSize.x},top=${socialWindowSize.y}`)};
            w.current.window.location.href = data.redirectUrl;

            localStorage.removeItem( 'social_auth' );
            if ( interval.current.interval ) clearInterval( interval.current.interval );

            // Действие после ответа с вкладки авторизации
            const closeAction = (answer) => {
                if (interval.current.interval) clearInterval( interval.current.interval );
                if (interval.current.timer) clearTimeout( interval.current.timer );
                w.current && w.current.window.close && w.current.window.close();
                if (answer) {
                    if (answer.success){
                        setSocialSuccess(true);
                        setSocialPhotos(null);
                        setLastSelected(null);
                        getSocialPhotos(socialCallback);    // Снова запрашиваем фотки из соцсети у сервера
                    }
                    if (answer.error) {
                        console.error('error', answer.error);

                        //window.sendErrorLog('Ошибка авторизации в social photo:', answer);
                        toast.error('Авторизация не удалась', {
                            autoClose: 3000
                        });
                        dispatch(modalUploadSocialPhotosAction());
                    }
                } else {
                    dispatch(modalUploadSocialPhotosAction());
                }
            };

            interval.current = {
                // Интервал проверки localStorage > social_auth
                interval: setInterval(() => {
                    const socialAuthAnswer = JSON.parse(localStorage.getItem( 'social_auth' ) || false);

                    if (w.current.window.closed) closeAction();
                    if (!socialAuthAnswer) return;

                    if ( socialAuthAnswer.success && !socialSuccess ) {
                        closeAction({success:true});
                    } else if ( socialAuthAnswer.error ) closeAction({error: socialAuthAnswer.error || true});

                }, 350 ),
                timer: setTimeout( () => {
                    clearInterval( interval.current.interval );
                }, 300000 )
            };

        } else {
            if (data.error) {
                setLoadNextPage(false);
                setNext( false);
                console.log('socialCallback data.error',data.error);
            }
            toast.error('Авторизация не удалась. Попробуйте позже или обратитесь в поддержку', {
                autoClose: 3000
            });
            clearIntervalAction();
            closeModal();
        }
    };


    const getNextPageAction = () => {
        setLoadNextPage(true);
        getSocialPhotos(socialCallback, next );
    };
    const confirmAction = () => {
        addPhotosFromSocial(socialPhotos.filter((item) => item.selected));
        // clearIntervalAction();
        closeModal();
        uploadSocialPhotosSelector && uploadSocialPhotosSelector.closeCallback();
    };
    // Выбрать фотографию
    const selectPhotoAction = ({id, shiftKey}) => {
        const { list, lastSelected:ls } = selectLibraryItem({
            itemId: id,
            shiftKey: shiftKey,
            sourceList: socialPhotos,
            lastSelected: lastSelected,
            maxSelectCount: 200,
        });
        setSocialPhotos(list);
        setLastSelected(ls);
    };
    const clearIntervalAction = () => {
        if (interval.current) {
            if ( interval.current.interval ) clearInterval( interval.current.interval );
            if ( interval.current.timer ) clearTimeout( interval.current.timer );
        }
    };

    useEffect(() => {
        setSocialPhotos(false);
        getSocialPhotos(socialCallback);
        return ()=> {
            clearIntervalAction()
        };
    },[]);
    useEffect(() => {
        const socialPhotosSelectCount = socialPhotos && socialPhotos.filter((item)=>item.selected).length;
        setModal({
            footer: [
                {
                    type: TYPES.COMPONENT,
                    component: <div className={s.counter}>
                        <span>Выбрано:&nbsp;</span>
                        <span>{socialPhotosSelectCount || 0}</span>
                    </div>
                },
                {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, action: closeModal},
                {type: TYPES.BTN, text: TEXT_MAIN.UPLOAD, action: confirmAction, primary: true,  disabled: !socialPhotosSelectCount},
            ]
        });
    },[socialPhotos]);


    return (noSocialPhotos ?
        <div className={s.noPhotos}>
            В вашем Social-аккаунте не обнаружено фотографий. <br/>
            Убедитесь, что вы авторизовались в нужном аккаунте, и что у вас есть изображения в формате ".jpeg"
        </div>
        :
        <div className={s.gallery}>
            <Library
                items={socialPhotos}
                disabled={socialPhotos === false}
                selectionActive={true}
                selectAction={selectPhotoAction}
            />
            { socialPhotos && next &&
            <div className={s.loadMore}>
                {loadNextPage &&
                <span className={s.loadMoreText}>Загружаю еще фотографии...</span>}

                {!loadNextPage &&
                <div className={s.loadMoreBtn} onClick={getNextPageAction}>
                    {TEXT_MY_PHOTOS.SHOW_MORE}
                </div>}
            </div>}
        </div>);
});

export default SocialPhotosModal;