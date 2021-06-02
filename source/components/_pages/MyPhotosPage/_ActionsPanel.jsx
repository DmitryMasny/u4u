import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { SelectIcon, TrashIcon, ShareIcon, CopyIcon, RenameIcon, UploadCloudIcon, AddPhotoIcon } from 'components/Icons/LineIcon';
import ActionsPanel from 'components/ActionsPanel';
import StickyPanel from "components/StickyPanel";

import TEXT_MY_PHOTOS from 'texts/my_photos';
import TEXT_MAIN from 'texts/main';


import {
    myPhotosSelectionActiveSelector,
    myPhotosSelectionSelector,
    myPhotosSortSelector,
    myPhotosInProgressSelector,
    myPhotosNextPageUrlSelector,
    myPhotosCurrentFolderNextPageSelector,
    myPhotosAddFolderSelector,
    myPhotosAllPhotosCountSelector
} from './selectors'

import {
    selectPhotosToggleAction,
    deleteFolderAction,
    deletePhotosAction,
    duplicatePhotosAction,
    movePhotosAction,
    selectAllPhotosAction,
    removeFromFolderAction,
    addToFolderToggleAction,
} from "./actions";

import {
    modalCreatePhotoFolderAction,
    modalPhotosUploadAction,
    modalPhotosFoldersAction,
    modalDeleteConfirmAction
} from "actions/modals";

import { Counter } from './_Counter'

/**
 * Страница "Мои Фотографии" - Панель действий
 */
class MyPhotosActionsPanel extends PureComponent {

    state = {
        fixed: null,
        mobile: null
    };

    updatePanel = ( props ) => {
        this.setState( { ...props } );
    };

    renameFolder = ( folderId ) => {
        this.props.modalCreatePhotoFolderAction( { folderId: folderId } );
    };
    duplicatePhotos = ( selection ) => {
        this.props.modalPhotosFoldersAction(
            {
                exclude: this.props.folderId,
                callback: ( folderId ) => {
                    this.props.duplicatePhotosAction( { list: selection, folderId: folderId } )
                }
            } );
    };
    movePhotos = ( selection ) => {
        this.props.modalPhotosFoldersAction(
            {
                exclude: this.props.folderId,
                callback: ( folderId ) => {
                    this.props.movePhotosAction(
                        {
                            list: selection,
                            folderId: folderId,
                            sourceFolderId: this.props.folderId
                        } )
                }
            } );
    };
    removePhotos = ( selection, folderId ) => {
        selection && this.props.deleteConfirmAction(
            {
                text: folderId ?
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
    };
    removeFolder = ( folderId ) => {
        folderId && this.props.deleteConfirmAction(
            {
                text: TEXT_MY_PHOTOS.DELETE_F_CONFIRM_QUESTION,
                callback: () => this.props.deleteFolderAction( folderId )
            } );
    };
    scrollToBottom = () => {
        const loadMoreBtnRef = document.getElementById('loadMoreBlock'); // TODO: ref

        if (loadMoreBtnRef) loadMoreBtnRef.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    };
    selectAllHandler = () => {
        if (!this.props.folderId) {
            this.scrollToBottom()
        }
        this.props.selectAllPhotosAction( this.props.folderId, false )
    };
    deselectAllHandler = () => {
        this.props.selectAllPhotosAction( this.props.folderId, true )
    };
    showMoreHandler = () => {
        this.scrollToBottom();
        this.props.getNextPageAction && this.props.getNextPageAction()
    };

    render () {
        const {
            selectionSelector,
            selectionActive,
            inProgressSelector,
            addFolderSelector,
            allPhotosCountSelector,
            folderId,
            photosLength
        } = this.props;

        const selectionCount = selectionSelector && selectionSelector.length;

        const BTNS = {
            BTN_CHOOSE: {
                text: TEXT_MAIN.CHOOSE,
                icon: <SelectIcon/>,
                action: () => this.props.selectPhotosToggleAction( true ),
                className: 'choose',
            },
            BTN_RENAME_FOLDER: {
                text: TEXT_MY_PHOTOS.RENAME_FOLDER,
                icon: <RenameIcon/>,
                action: () => this.renameFolder( folderId ),
                className: 'renameFolder',
                intent: 'primary'
            },
            BTN_DELETE_FOLDER: {
                text: TEXT_MY_PHOTOS.DELETE_FOLDER,
                icon: <TrashIcon/>,
                action: () => this.removeFolder(folderId),
                className: 'deleteFolder',
                intent: 'danger'
            },
            BTN_UPLOAD_PHOTOS: {
                text: TEXT_MY_PHOTOS.UPLOAD_PHOTOS,
                icon: <UploadCloudIcon/>,
                action: () => this.props.showModalPhotosUploadAction( { show: true } ),
                className: 'uploadPhotos',
                intent: 'main'
            },
            BTN_ADD_PHOTOS: {
                text: TEXT_MY_PHOTOS.ADD_PHOTOS,
                icon: <AddPhotoIcon/>,
                action: () => this.props.addToFolderToggleAction( folderId ),
                className: 'addPhotos',
                intent: 'main'
            },
            BTN_CANCEL: {
                text: TEXT_MAIN.CANCEL,
                action: () => this.props.selectPhotosToggleAction(),
                className: 'cancel',
            },
            BTN_ADD: {
                text: TEXT_MY_PHOTOS.DUPLICATE_TO_FOLDER,
                action: () => this.props.duplicatePhotosAction( { list: selectionSelector, folderId: addFolderSelector.id, instantRedirect: true } ),
                disabled: !selectionCount,
                className: 'addToFolder',
                intent: 'main'
            },
            BTN_CANCEL_ADD: {
                text: TEXT_MAIN.CANCEL,
                action: () => this.props.addToFolderToggleAction(),
                className: 'cancel',
            },
            BTN_CHOOSE_ALL: {
                text: TEXT_MY_PHOTOS.CHOOSE_ALL,
                action:  this.selectAllHandler,
                disabled: photosLength && photosLength === selectionCount,
                name: 'chooseAll',
            },
            BTN_DESELECT: {
                text: TEXT_MY_PHOTOS.DESELECT,
                action:  this.deselectAllHandler,
                disabled: !selectionCount
            },
            BTN_SHOW_MORE: {
                text: TEXT_MY_PHOTOS.SHOW_MORE,
                action:  this.showMoreHandler,
                disabled: photosLength && photosLength === allPhotosCountSelector
            },
            BTN_DELETE: {
                text: TEXT_MY_PHOTOS.DELETE,
                icon: <TrashIcon/>,
                intent: 'danger',
                action: () => this.removePhotos( selectionSelector, folderId ),
                disabled: !selectionCount,
                className: 'delete',
            },
            BTN_DUPLICATE: {
                text: TEXT_MY_PHOTOS.DUPLICATE_TO_FOLDER,
                icon: <CopyIcon/>,
                intent: 'primary',
                action: () => this.duplicatePhotos( selectionSelector ),
                disabled: !selectionCount,
                className: 'duplicate',
            },
            BTN_MOVE_TO: {
                text: TEXT_MY_PHOTOS.MOVE_TO,
                icon: <ShareIcon/>,
                intent: 'primary',
                action: () => this.movePhotos( selectionSelector ),
                disabled: !selectionCount,
                className: 'moveTo',
            }
        };
        const DIVIDER = { type: 'divider' };

        const COUNTER = { type: 'component', component: <Counter selected={selectionCount} showed={photosLength} total={allPhotosCountSelector}/>  };

        const MOB = {
            FOLDER_MENU: {
                type: 'menu',
                text: TEXT_MY_PHOTOS.CHOOSE_ALL,
                content: [BTNS.BTN_RENAME_FOLDER, BTNS.BTN_DELETE_FOLDER]
            },
            SELECT_MENU: {
                type: 'menu',
                content: [BTNS.BTN_CHOOSE_ALL, BTNS.BTN_DESELECT, BTNS.BTN_SHOW_MORE, DIVIDER, BTNS.BTN_DUPLICATE, ...(!!folderId && [BTNS.BTN_MOVE_TO] || []), BTNS.BTN_DELETE]
            },
            BTN_ADD_PHOTOS: {
                text: TEXT_MY_PHOTOS.ADD_PHOTOS_MOB,
                icon: <AddPhotoIcon/>,
                action: () => this.props.addToFolderToggleAction( folderId ),
                className: 'addPhotos',
                intent: 'main'
            },
            BTN_UPLOAD_PHOTOS: {
                text: TEXT_MY_PHOTOS.UPLOAD_PHOTOS_MOB,
                icon: <UploadCloudIcon/>,
                action: () => this.props.showModalPhotosUploadAction( { show: true } ),
                className: 'uploadPhotos',
                intent: 'main'
            },
        };

        const usedBtns = ( mobile ) => {
            const iframe = window.self !== window.top;

            /** Если iFrame **/
            if (iframe) return [
                BTNS.BTN_CHOOSE_ALL,
                COUNTER,
                DIVIDER,
                BTNS.BTN_DELETE,
            ];

            /** Если страница "Мои фотографии" **/
            return addFolderSelector ?
                // выбор фото для добавления в папку
                [
                    BTNS.BTN_CANCEL_ADD,
                    ...((!!folderId || mobile) ? [DIVIDER] : [COUNTER]),
                    ...(!folderId && mobile !== 'xs' && [(BTNS.BTN_UPLOAD_PHOTOS['intent'] = 'primary') && BTNS.BTN_UPLOAD_PHOTOS] || []),
                    BTNS.BTN_ADD,
                ]
                :
                !selectionActive ?
                    // DEFAULT - выбор фото неактивен
                    (mobile === 'xs' ?
                        // мобильная версия
                        [
                            ...(!!photosLength && [BTNS.BTN_CHOOSE] || []),
                            ...(!!folderId && [MOB.FOLDER_MENU] || []),
                            DIVIDER,
                            (folderId ? MOB.BTN_ADD_PHOTOS : (!!photosLength && MOB.BTN_UPLOAD_PHOTOS)),
                        ] :
                        // десктопная версия
                        [
                            ...(!!photosLength && [BTNS.BTN_CHOOSE] || []),
                            BTNS.BTN_SHOW_MORE,
                            DIVIDER,
                            ...(!!folderId && [BTNS.BTN_RENAME_FOLDER, BTNS.BTN_DELETE_FOLDER] || []),
                            (folderId ? BTNS.BTN_ADD_PHOTOS : (!!photosLength && BTNS.BTN_UPLOAD_PHOTOS)),
                        ])
                    :
                    // SELECTION - выбор фото активен
                    (mobile === 'xs' || mobile === 'sm'  ?
                            // мобильная версия
                            [
                                BTNS.BTN_CANCEL,
                                ...(!!folderId  ? [DIVIDER] : [COUNTER, DIVIDER]),
                                MOB.SELECT_MENU,
                            ] :
                            // десктопная версия
                            [
                                BTNS.BTN_CANCEL,
                                ...(!folderId && [COUNTER] || []),
                                BTNS.BTN_DESELECT,
                                BTNS.BTN_CHOOSE_ALL,
                                BTNS.BTN_SHOW_MORE,
                                DIVIDER,
                                BTNS.BTN_DUPLICATE,
                                ...(!!folderId && [BTNS.BTN_MOVE_TO] || []),
                                BTNS.BTN_DELETE,
                            ]
                    );
        };

        return (
            <StickyPanel position="top" onChange={this.updatePanel} padding={(folderId && this.state.fixed && !this.state.mobile) && 230}>
                <ActionsPanel
                    content={usedBtns( this.state.mobile )}
                    disabled={inProgressSelector}
                    fixed={this.state.fixed}
                    mobile={this.state.mobile}/>
            </StickyPanel>);
    }
}

export default connect(
    state => ({
        selectionSelector: myPhotosSelectionSelector( state ),
        selectionActive: myPhotosSelectionActiveSelector( state ),
        inProgressSelector: myPhotosInProgressSelector( state ),
        nextPageUrlSelector: myPhotosNextPageUrlSelector( state ),
        currentFolderNextPageSelector: myPhotosCurrentFolderNextPageSelector( state ),
        addFolderSelector: myPhotosAddFolderSelector( state ),
        allPhotosCountSelector: myPhotosAllPhotosCountSelector( state ),
        // sortSelector: myPhotosSortSelector( state ),
    }),
    dispatch => ({
        selectPhotosToggleAction: ( show ) => dispatch( selectPhotosToggleAction( show ) ),
        deletePhotosAction: ( list ) => dispatch( deletePhotosAction( list ) ),
        duplicatePhotosAction: ( o ) => dispatch( duplicatePhotosAction( o ) ),
        movePhotosAction: ( o ) => dispatch( movePhotosAction( o ) ),
        deleteFolderAction: ( id ) => dispatch( deleteFolderAction( id ) ),
        selectAllPhotosAction: ( folderId, deselectAll = false ) => dispatch( selectAllPhotosAction( folderId, deselectAll ) ),
        modalPhotosFoldersAction: ( o ) => dispatch( modalPhotosFoldersAction( o ) ),
        modalCreatePhotoFolderAction: ( o ) => dispatch( modalCreatePhotoFolderAction( o ) ),
        removeFromFolderAction: ( o ) => dispatch( removeFromFolderAction( o ) ),
        showModalPhotosUploadAction: ( o ) => dispatch( modalPhotosUploadAction( o ) ),
        deleteConfirmAction: ( obj ) => dispatch( modalDeleteConfirmAction( obj ) ),

        addToFolderToggleAction: ( id ) => dispatch( addToFolderToggleAction( id ) ),

    })
)( MyPhotosActionsPanel );