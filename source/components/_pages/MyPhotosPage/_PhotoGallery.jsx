import React, { Component } from 'react';
import { connect } from 'react-redux';

import Library from "components/Library";

import TEXT_MY_PHOTOS from 'texts/my_photos';
import s from "./MyPhotosPage.scss";
import ActionsPanel from "./_ActionsPanel";

import {
    myPhotosSelectionSelector,
    myPhotosAddFolderSelector,
    myPhotosNextPageUrlSelector,
    myPhotosSelectionActiveSelector,
} from "./selectors";
import {
    selectPhotoAction,
    previewPhotoAction,
    selectPhotosToggleAction,
    deletePhotosAction,
    selectAllPhotosAction,
    getPhotosFromServerAction,
    getFolderPhotosAction,
    removeFromFolderAction,
} from "./actions";
import { modalDeleteConfirmAction, modalPhotosUploadAction } from "actions/modals";
import { previewPhotoIdSelector } from "components/_modals/PreviewPhoto/selectors";
import {IMAGE_TYPES} from "const/imageTypes";




class PhotoGallery extends Component {

    state = {
        loadNextPage: null, // идет загрузка следующей страницы
        nextPage: null,     // url следующей страницы
        initLoad: true,     // загрузка при инициализации
        // srolledToEnd: false  // достигнуто дно фотографий
    };

    componentDidMount () {
        document.addEventListener( 'keydown', this.keyControll );
        // Если есть следующая страница, сразу кладем ее url в state
        const nextPage = this.props.folderId ? this.props.currentFolderNextPageSelector : this.props.nextPageUrlSelector;
        if (nextPage)  this.setState({ nextPage: nextPage });
    }

    componentWillUnmount () {
        document.removeEventListener( 'keydown', this.keyControll );
    }

    shouldComponentUpdate ( nextProps, nextState ) {
        // console.log('nextState',nextState);
        // console.log('nextProps',nextProps);

        // if ( nextState.nextPage && !nextState.loadNextPage  ) {
        //     // если есть url следующей страницы и её загрузка не началась
        //     if (
        //         nextState.initLoad ||       // если это первичная подгрузка (до тех пор пока фотографии не достигнут дна)
        //         nextState.srolledToEnd      // или если липкая панель нам сообщила, что дно достигнуто
        //     ){
        //         this.getNextPageAction(nextState.nextPage);   // подгружаем следующую страницу
        //     }
        //     return true;
        // }
        if ((nextProps.currentFolderNextPageSelector !== this.props.currentFolderNextPageSelector) ||   // поменялся nextpage url в папке
            (nextProps.nextPageUrlSelector !== this.props.nextPageUrlSelector) ) {                      // или поменялся nextpage url во всех фото
                this.setState( {
                   nextPage: nextProps.folderId ? nextProps.currentFolderNextPageSelector : nextProps.nextPageUrlSelector,
                   loadNextPage: false
                } );
        }

        return true;
    }

    getNextPageAction = (url = '') => {
        //передавали url из shouldComponentUpdate чтобы сразу подгрузить
        // if (!url || typeof url !== 'string') url = this.state.nextPage;
        url = this.state.nextPage;
        if (!url) return;
        this.setState( { loadNextPage: true} );
        this.props.folderId ?
            this.props.getFolderNextPageAction( { id: this.props.folderId, url: url } )
            :
            this.props.getPhotosNextPageAction( url );
    };

    // loadMore = ( {fixed} ) => {
    //     this.setState( { srolledToEnd: !fixed, ... fixed && { initLoad: false } } ); // Когда прокрутили до конца
    // };

    keyControll = ( event ) => {
        // if (this.props.previewPhotoSelector) return null;
        // console.log('event.keyCode',event);
        switch ( event.keyCode ) {
            case 46:    // Del
                const selection = this.props.selectionSelector;
                selection && this.props.deleteConfirmAction(
                    {
                        text: this.props.folderId ?
                            ( selection.length > 1 ? TEXT_MY_PHOTOS.DELETE_CONFIRM_QUESTION_F : TEXT_MY_PHOTOS.DELETE_CONFIRM_QUESTION_F_1) :
                            ( selection.length > 1 ? TEXT_MY_PHOTOS.DELETE_CONFIRM_QUESTION : TEXT_MY_PHOTOS.DELETE_CONFIRM_QUESTION_1),
                        callback: () => this.props.folderId ?
                            this.props.removeFromFolderAction(
                                {
                                    list: selection,
                                    folderId: this.props.folderId
                                } )
                            :
                            this.props.deletePhotosAction( selection )
                    } );
                break;
            case 27:    // Esc
                this.props.selectPhotosToggleAction( false );
                break;
            case 65:    // Ctrl + A
                if ( event.ctrlKey ) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.selectPhotosToggleAction( true );
                    this.props.selectAllPhotosAction( this.props.folderId );
                }
                break;

        }
    };


    render () {
        const {
            photos, loading, count, selectionActiveSelector, addFolderSelector, folderId, showModalPhotosUploadAction
        } = this.props;
        // const photosLength = 0;
        const photosLength = (count === undefined) ? (photos && photos.length) : count;
        const noPhotos = !photosLength && photosLength !== null;

        return (
            <div className={s.gallery} id='gallery-wrap'>

                <ActionsPanel photosLength={photosLength} folderId={folderId} getNextPageAction={this.getNextPageAction}/>

                <Library
                    items={photos}
                    disabled={loading || !photos}
                    folderId={folderId}
                    selectionActive={selectionActiveSelector || addFolderSelector}
                    selectAction={this.props.selectPhotoAction}
                    previewAction={ this.props.previewPhotoAction }
                    type={IMAGE_TYPES.GPHOTO}
                    showResolution
                />

                {noPhotos && <div className={s.uploadBtnWrap}>
                    <h3 className={s.uploadBtnText}>{TEXT_MY_PHOTOS.NO_PHOTOS}</h3>
                    {!folderId &&
                    <div className={s.uploadBtn + ' ' + s.uploadBtnNoPhoto}
                         onClick={() => showModalPhotosUploadAction( { show: true } )}>
                        {TEXT_MY_PHOTOS.UPLOAD_PHOTOS}
                    </div>
                    }
                </div>}

                {/*{!noPhotos && <StickyPanel onChange={this.loadMore} observe={'gallery-wrap'}>
                    {this.state.loadNextPage && this.state.srolledToEnd && <span className={s.loadMoreText}>Загружаю еще фотографии...</span>}
                </StickyPanel>}*/}

                {!noPhotos && this.state.nextPage &&
                <div className={s.loadMore} id="loadMoreBlock">
                    {this.state.loadNextPage &&
                    <span className={s.loadMoreText}>Загружаю еще фотографии...</span>}

                    {!this.state.loadNextPage &&
                    <div className={s.loadMoreBtn} onClick={this.getNextPageAction}>
                        {TEXT_MY_PHOTOS.SHOW_MORE}
                    </div>}
                </div>}



            </div>);
    }
}


export default connect(
    state => ({
        selectionSelector: myPhotosSelectionSelector( state ),
        selectionActiveSelector: myPhotosSelectionActiveSelector( state ),
        addFolderSelector: myPhotosAddFolderSelector( state ),
        nextPageUrlSelector: myPhotosNextPageUrlSelector( state ),
        previewPhotoSelector: previewPhotoIdSelector( state ),
    }),
    dispatch => ({
        selectPhotoAction: ( o ) => dispatch( selectPhotoAction( o ) ),
        previewPhotoAction: ( o ) => dispatch( previewPhotoAction( o ) ),
        showModalPhotosUploadAction: ( o ) => dispatch( modalPhotosUploadAction( o ) ),
        selectPhotosToggleAction: ( show ) => dispatch( selectPhotosToggleAction( show ) ),
        deletePhotosAction: ( list ) => dispatch( deletePhotosAction( list ) ),
        removeFromFolderAction: ( o ) => dispatch( removeFromFolderAction( o ) ),
        selectAllPhotosAction: ( folderId ) => dispatch( selectAllPhotosAction( folderId ) ),
        getPhotosNextPageAction: ( nextUrl ) => dispatch( getPhotosFromServerAction( { url: nextUrl } ) ),
        getFolderNextPageAction: ( o ) => dispatch( getFolderPhotosAction( o ) ),
        deleteConfirmAction: ( obj ) => dispatch( modalDeleteConfirmAction( obj ) ),

    })
)( PhotoGallery );