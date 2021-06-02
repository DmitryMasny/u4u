import React, { Component } from 'react';
import {createPortal} from "react-dom";
import { connect } from 'react-redux';

// import { Button } from 'bp';

// import { modalPhotosUploadAction } from 'actions/modals';
import { showServerError } from 'libs/errors';
// import ResizeObserver from 'resize-observer-polyfill';
// import MEDIA from "config/media";
import PhotoGallery from './_PhotoGallery';

import TEXT_MY_PHOTOS from 'texts/my_photos';
import s from './MyPhotosPage.scss';

import {
    myPhotosAllSelector,
    myPhotosCountSelector,
    myPhotosInProgressSelector
} from "./selectors";

import {
    getPhotosFromServerAction,
} from "./actions";


/**
 * Страница "Мои Фотографии" - Все фотографии
 */
class AllPhotos extends Component {

    state = {
        loadingCount: -1,
        percent: 0
    };

    componentDidMount () {
        const { myPhotosAll, getPhotosFromServerAction, myPhotosInProgress } = this.props;
        // Если нет данных содержимого вкладки, запрашиваем
        if ( !myPhotosAll && !myPhotosInProgress ) {
            getPhotosFromServerAction();
        } else if ( myPhotosAll && myPhotosAll.error ) showServerError(); //если ошибка сервера

    };

    shouldComponentUpdate ( nextProps, nextState ) {
        const { myPhotosAll } = nextProps;
        //Если не осуществляется запрос к серверу и нет данных таба, запрашиваем с сервера
        if ( !nextProps.myPhotosInProgress && !myPhotosAll ) {
            this.props.getPhotosFromServerAction();
            return false;
        }

        //если ошибка сервера
        if ( myPhotosAll && myPhotosAll.error ) {
            showServerError();
        }

        if (this.state.loadingCount !== nextState.loadingCount) {
            this.setState({percent: 0});
            return true;
        }

        if (this.props.myPhotosAll !== myPhotosAll) {
            // Подсчет загружаемых фоток для линии общей загрузке в spa-top
            let loadingPhotos = 0;
            let percent = 0;
            if (myPhotosAll && myPhotosAll.length) {
                for (let i=0; i < myPhotosAll.length; i++) {
                    if (myPhotosAll[i].isBlob) {
                        loadingPhotos++;
                    }
                }
            }
            if (loadingPhotos || nextState.loadingCount > -1) {
                // console.log('==>',{
                //     loadingPhotos:loadingPhotos,
                //     thisloadingCount: this.state.loadingCount,
                //     nextloadingCount:nextState.loadingCount,
                // });
                percent = (nextState.loadingCount - loadingPhotos)/nextState.loadingCount * 100;
                if (loadingPhotos > nextState.loadingCount) {
                    // обновление счетчика незагруженных
                    this.setState({loadingCount: loadingPhotos});
                    return false;
                } else if (percent === 100) {
                    this.setState({loadingCount: -1});
                }
                this.setState({percent: percent});
            }

            return true;
        }

        return this.state.percent !== nextState.percent;
    };

    render () {
        const {
            myPhotosAll,
            myPhotosCount,
            myPhotosInProgress,
        } = this.props;
        const {percent} = this.state;
        return <div className={s.myPhotosAll}>
            <PhotoGallery photos={myPhotosAll}
                          count={myPhotosCount}
                          loading={myPhotosInProgress}
            />

            { percent && createPortal(
                <div className={s.globalPercent} title={'Загрузка завершена. Идет обработка фотографий. Вы пока не можете использовать некоторые фотографии, но уже можете закрыть браузер.'}>
                    <div className={s.globalPercentInner} style={{width: percent ? `${percent}%` : 0}}/>
                </div>,
                document.getElementById( 'spa-top' )
            ) || null}
        </div>;
    }
}

export default connect(
    state => ({
        myPhotosAll: myPhotosAllSelector( state ),
        myPhotosCount: myPhotosCountSelector( state ),
        myPhotosInProgress: myPhotosInProgressSelector( state ),
    }),
    dispatch => ({
        getPhotosFromServerAction: () => dispatch( getPhotosFromServerAction() ),

    })
)( AllPhotos );