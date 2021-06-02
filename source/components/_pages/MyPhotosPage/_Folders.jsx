import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showServerError } from 'libs/errors';
import ResizeObserver from 'resize-observer-polyfill';
import MEDIA from "config/media";

import TEXT_MY_PHOTOS from 'texts/my_photos';
import s from './MyPhotosPage.scss';

import {
    myPhotosCurrentFolderPhotosSelector,
    myPhotosCurrentFolderSelector,
    myPhotosFoldersSelector,
    myPhotosInProgressSelector,
    myPhotosAddFolderSelector
} from "./selectors";

import {
    getPhotosFoldersFromServerAction,
    getFolderPhotosAction,
    selectFolderAction
} from "./actions";
import {modalPhotosUploadAction} from 'actions/modals';

import PhotoGallery from "./_PhotoGallery";
import FoldersList from "./_FoldersList";


/**
 * Страница "Мои Фотографии" - Все папки
 */
class Folders extends Component {
    state = {
        width: 0,       // ширина главного контейнера (this.container)
        small: false,   // если true то уменьшаем пагинатор (для маленьких экранов)
    };
    resizeObject = null;

    componentDidMount () {
        // Если нет данных содержимого вкладки, запрашиваем
        if ( !this.props.myPhotosFolders && !this.props.myPhotosInProgress ) {
            this.props.getPhotosFoldersFromServerAction();
        } else if (this.props.myPhotosFolders && this.props.myPhotosFolders.error) showServerError(); //если ошибка сервера

        // Вешаем триггер на ресайз главного блока
        this.resizeObject = new ResizeObserver( entries => {
            for ( let entry of entries ) {
                this.setState( {
                                   width: entry.contentRect.width,
                                   small: entry.contentRect.width < MEDIA.sm ? (entry.contentRect.width < MEDIA.xs ? 'xs' : 'sm') : false
                               } );
            }
        } );
        this.resizeObject.observe( document.body );
    };

    // Удаляем триггер на ресайз главного блока
    componentWillUnmount () {
        if ( this.resizeObject ) this.resizeObject.unobserve( document.body );
        this.props.selectFolderAction();
    }

    shouldComponentUpdate( nextProps, nextState ) {
        // console.log('this.props',this.props);
        // console.log('nextProps',nextProps);
        // console.log('this.state',this.state);
        // console.log('nextState',nextState);
        const { myPhotosFolders, myPhotosInProgress, currentFolderSelector, getFolderPhotosAction, selectFolderAction, addFolderSelector } = nextProps;

        if (!this.props.addFolderSelector && addFolderSelector) return false;

        if ( currentFolderSelector && currentFolderSelector !== this.props.currentFolderSelector ) {
            // if (currentFolderSelector === null && !addFolderSelector) return true;
            getFolderPhotosAction(currentFolderSelector);
            return false;
        }
        if ( !currentFolderSelector && nextState.width && !nextState.small && myPhotosFolders && myPhotosFolders.length ) {
            // автовыбор папки в полноэкранной версии, если не выбрана ни одна
            // если включено добавление в папку, то не выбираем папку для добавления
            const selectFolder = addFolderSelector ? myPhotosFolders.find( ( item ) => item.id !== addFolderSelector.id ) : myPhotosFolders[0];
            selectFolderAction( selectFolder ? selectFolder.id : false );
            return !selectFolder;
        }


        //если ошибка сервера
        if (myPhotosFolders && myPhotosFolders.error){
            showServerError();
        }
        // return (this.state.small !== nextState.small ||
        //     (myPhotosInProgress !== this.props.myPhotosInProgress) );
        return true;
    };

    render () {
        const {
            myPhotosFolders,
            myPhotosInProgress,
            currentFolderPhotosSelector,
            currentFolderSelector,
        } = this.props;

        return <div className={s.myPhotosFolders + ` ${this.state.small ? s.sm : ''}`}>
            <div className={s.myPhotosFoldersWrap}>
                <FoldersList list={myPhotosFolders}
                             selected={currentFolderSelector}
                             mobile={this.state.small}
                />

                {currentFolderSelector &&
                <PhotoGallery photos={currentFolderPhotosSelector} loading={myPhotosInProgress} folderId={currentFolderSelector}/>
                }
            </div>
        </div>;
    }
}

export default connect(
    state => ({
        myPhotosFolders: myPhotosFoldersSelector( state ),
        myPhotosInProgress: myPhotosInProgressSelector( state ),
        currentFolderSelector: myPhotosCurrentFolderSelector( state ),
        currentFolderPhotosSelector: myPhotosCurrentFolderPhotosSelector( state ),
        addFolderSelector: myPhotosAddFolderSelector( state ),
    }),
    dispatch => ({
        getPhotosFoldersFromServerAction: ( ) => dispatch( getPhotosFoldersFromServerAction( ) ),
        getFolderPhotosAction: ( id ) => dispatch( getFolderPhotosAction( {id : id} ) ),
        selectFolderAction: ( id ) => dispatch( selectFolderAction( id) ),
        showModalPhotosUploadAction: (o) => dispatch( modalPhotosUploadAction( o ) ),
    })
)( Folders );