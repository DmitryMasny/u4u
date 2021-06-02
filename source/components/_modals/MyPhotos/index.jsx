import React, { memo, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import {useSelector, useDispatch} from "react-redux";
import styled from 'styled-components';

import {
    myPhotosAllSelector,
    myPhotosInProgressSelector,
    myPhotosCurrentFolderPhotosSelector,
    myPhotosCurrentFolderSelector,
    myPhotosFoldersSelector,
    myPhotosNextPageUrlSelector,
    myPhotosCurrentFolderNextPageSelector,
    myPhotosAllPhotosCountSelector
} from 'components/_pages/MyPhotosPage/selectors'

import {
    selectPhotoAction,
    previewPhotoAction,
    getPhotosFromServerAction,
    getFolderPhotosAction,
    getPhotosFoldersFromServerAction,
    selectAllPhotosAction
} from "components/_pages/MyPhotosPage/actions";
import {modalPhotosUploadAction} from "actions/modals";
import {modalMyPhotosSelector} from "selectors/modals";

import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import TEXT_MAIN from 'texts/main';


import {COLORS, Btn} from "const/styles";
import Library from "components/Library";
import {IconHelp, IconClose} from "components/Icons";

import TEXT_MY_PHOTOS from "texts/my_photos";
import FoldersList from "components/_pages/MyPhotosPage/_FoldersList";
import { hexToRgbA } from "libs/helpers";
import { windowIsMobileSelector } from "selectors/global";
import { Counter } from '../../_pages/MyPhotosPage/_Counter'


/** Styles */
const StyledLoadMore = styled.div`
    display: flex;
    justify-content: center;
    .text{
        margin-top: 10px;
        line-height: 40px;
        padding: 0 15px;
        color: ${COLORS.NEPAL};
    }
`;
const StyledNoPhoto = styled.div`
   text-align: center;
   padding: 30px 0;
   .text{
        margin-bottom: 20px;
        color: ${COLORS.NEPAL};
    }
`;
const HelpTextBlock = styled.div`
    position: absolute;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${hexToRgbA(COLORS.WHITE, .88)};
    color: ${COLORS.TEXT_INFO};
    padding: 2px 32px;
    border-radius: 10px;
    min-height: 40px;
    transition: opacity .3s ease-out;
    box-shadow: 1px 2px 12px 1px ${COLORS.TEXT_INFO};
    opacity: ${({show}) => show ? 1 : 0};
    pointer-events: none;
    z-index: 9;
    ${({theme}) => theme.media.sm`
        display: none;
    `};
    .iconHelp{
        position: absolute;
        fill: ${COLORS.TEXT_INFO};
        top: 0;
        bottom: 0;
        margin: auto;
        left: 5px;
    }
    .closeBtn{
        position: absolute;
        fill: ${COLORS.TEXT_INFO};
        top: 0;
        bottom: 0;
        margin: auto;
        right: 0;
        pointer-events: all;
        cursor: pointer;
        &:hover {
          fill: ${COLORS.TEXT_PRIMARY};
        }
    }
`;

const NAVBAR_TABS = [
    { id: 'photos',     title: TEXT_MY_PHOTOS.MY_PHOTOS_ALL},
    { id: 'folders',    title: TEXT_MY_PHOTOS.MY_PHOTOS_FOLDERS },
];


const scrollToBottom = () => {
    const loadMoreBtnRef = document.getElementById('loadMoreBlock'); // TODO: ref

    if (loadMoreBtnRef) loadMoreBtnRef.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
    })
};

/**
 * Добавление фотографий в альбом
 */
const MyPhotosModal = memo((props) => {
    const [currentTab, setCurrentTab] = useState('photos');
    const [loadNextPage, setLoadNextPage] = useState(null);
    const [addUploadedPhotos, setAddUploadedPhotos] = useState(false);
    const [shiftTipShow, setShiftTipShow] = useState(false); // показать подсказку, что можно выделять с шифтом

    const {setModal, closeModal} = useContext(ModalContext);
    const modalSelector = useSelector(state=>modalMyPhotosSelector(state));
    const myPhotos = useSelector(state=>myPhotosAllSelector(state));
    const myPhotosInProgress = useSelector(state=>myPhotosInProgressSelector(state));
    const myFolderPhotos = useSelector(state=>myPhotosCurrentFolderPhotosSelector(state));
    const currentFolderId = useSelector(state=>myPhotosCurrentFolderSelector(state));
    const myFolders = useSelector(state=>myPhotosFoldersSelector(state));
    const photosNext = useSelector(state=>myPhotosNextPageUrlSelector(state));
    const folderNext = useSelector(state=>myPhotosCurrentFolderNextPageSelector(state));
    const allPhotosCount = useSelector(myPhotosAllPhotosCountSelector);
    const isMobile = useSelector( windowIsMobileSelector );
    const dispatch = useDispatch();
    // const addLibraryPhotos = (list) => dispatch(addLibraryPhotosAction(list));

    const nextPage = currentFolderId ? folderNext : photosNext;

    const photosList = (currentTab === 'photos' ? myPhotos : myFolderPhotos);
    const mySelection = photosList && photosList.filter((item)=>item.selected);

    const readySelection = mySelection && mySelection.filter((item)=>!item.inProgress);

    const disableMainBtn = !mySelection || mySelection.length === 0 || addUploadedPhotos && readySelection && readySelection.length < mySelection.length

    const acceptAction = useCallback(() => {
        if (modalSelector.callback) {
            if (modalSelector.maxSelectCount > 1) {
                modalSelector.callback({photo: readySelection});
            } else {
                modalSelector.callback({photo: readySelection[0]});
            }
        }
        closeModal();
    }, [readySelection && readySelection.length]);
    
    const selectAllPhotos = (folderId, deselectAll) => dispatch(selectAllPhotosAction( folderId, deselectAll ));

    const chooseAllAction = useCallback(() => {
        if ( !currentFolderId ) {
            scrollToBottom()
        }

        selectAllPhotos( currentFolderId, false )
    }, [ currentFolderId ]);

    const deselectAllAction = useCallback(() => {
        selectAllPhotos( currentFolderId, true )
    }, [ currentFolderId ]);

    const getNextPageAction = useCallback(() => {
        setLoadNextPage( true );
        if (currentFolderId) {
            dispatch(getFolderPhotosAction({ id: currentFolderId, url: folderNext }))
        } else {
            dispatch(getPhotosFromServerAction({url: photosNext}))
        }
    }, [ currentFolderId, folderNext, photosNext ]);

    const showMoreAction = useCallback(() => {
        scrollToBottom();
        getNextPageAction()
    }, [ getNextPageAction ]);

    const closeShiftTip = () => {
        localStorage.setItem( 'hideTipSelectPhotosShift', JSON.stringify( {show: true} ) );
        setShiftTipShow(false)
    };

    const hideShiftTip = useMemo( () => JSON.parse(localStorage.getItem('hideTipSelectPhotosShift')), [shiftTipShow])

    const selectPhotoHandler = useCallback((o) => {
        if (!hideShiftTip) { // Если подсказку про выделение с шифтом еще не скрывали
            if (shiftTipShow) { // если подсказка показана
                if (o.shiftKey) closeShiftTip()
            } else { // если подсказка еще не показана
                if (!o.shiftKey) setShiftTipShow(true)
            }
        }

        dispatch(selectPhotoAction({
            ...o,
            ...modalSelector.maxSelectCount ? {
                max: modalSelector.maxSelectCount
            }: {}
        }))
    }, [ shiftTipShow, modalSelector && modalSelector.maxSelectCount ]);

    const uploadPhotosCallback = (x) => {
        setAddUploadedPhotos(true)
    };

    useEffect(() => {
        let timeout = null
        if (addUploadedPhotos) {
            timeout = () => setAddUploadedPhotos(false)
            setTimeout(timeout, 25000)
        } else {
            if (timeout) clearTimeout(timeout)
        }
        return () => timeout && clearTimeout(timeout)
    },[addUploadedPhotos])

    useEffect(() => {
        switch (currentTab) {
            case 'photos':  // если таб всех фотографий, а их нет, то запрашиваем
                if (myPhotos === null && !myPhotosInProgress) dispatch(getPhotosFromServerAction());
                break;
            case 'folders': // если таб папок, а их нет, то запрашиваем
                if (!myPhotosInProgress) {
                    if (myFolders === null ) {
                        dispatch(getPhotosFoldersFromServerAction());
                    } else {// если таб папок, и выбрана папка, то запрашиваем ее фотографии

                        if (currentFolderId && !myFolderPhotos ) {
                            dispatch(getFolderPhotosAction({id : currentFolderId}));
                        }
                    }
                }
        }

        setModal({
            ...modalSelector.modalTitle && {title: modalSelector.modalTitle} || {},
            navigation: {
                selectTabAction: (id)=>setCurrentTab(id),
                currentTab: currentTab,
                tabs: NAVBAR_TABS
            },
            footer: [
                {type: TYPES.BTN, text: TEXT_MAIN.UPLOAD, intent: 'warning', action: ()=>dispatch(modalPhotosUploadAction({show: true, callback: uploadPhotosCallback})) },
                {type: TYPES.COMPONENT, component: <Counter selected={mySelection && mySelection.length} showed={photosList && photosList.length} total={allPhotosCount}/> },
                ...isMobile ? [] : [{type: TYPES.BTN, text: TEXT_MY_PHOTOS.CHOOSE_ALL, action: chooseAllAction, disabled: myPhotosInProgress || photosList && mySelection && photosList.length === mySelection.length, intent: 'minimal' }],
                ...isMobile ? [] : [{type: TYPES.BTN, text: TEXT_MY_PHOTOS.DESELECT, action: deselectAllAction, disabled: myPhotosInProgress || !mySelection || !mySelection.length, intent: 'minimal' }],
                ...(currentFolderId || isMobile) ? [] : [{type: TYPES.BTN, text: TEXT_MY_PHOTOS.SHOW_MORE, action: showMoreAction, disabled: myPhotosInProgress || !photosNext, intent: 'minimal' }],
                {type: TYPES.DIVIDER},
                // {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeModal},
                {type: TYPES.BTN, text: TEXT_MAIN.READY, action: acceptAction, intent: 'primary', disabled: disableMainBtn },
            ],
        });
    },[currentTab, currentFolderId, myPhotosInProgress, myPhotos, myFolderPhotos, disableMainBtn, acceptAction, photosNext, photosList && photosList.length, mySelection && mySelection.length, isMobile]);

    useEffect(() => {
        setLoadNextPage( false );
    },[photosNext]);

    useEffect(() => {
        if (modalSelector.droppedFiles) dispatch(modalPhotosUploadAction({ droppedFiles: modalSelector.droppedFiles, callback: uploadPhotosCallback }))
    },[modalSelector.droppedFiles]);

    useEffect(() => {
        if (photosList && photosList.length === 0) dispatch( modalPhotosUploadAction({show: true, callback: uploadPhotosCallback}) )
    },[photosList]);


    return (
        <div>
            { currentTab === 'folders' &&
            <FoldersList list={myFolders}
                         selected={currentFolderId}
                         mobile={true}
            />
            }
            <HelpTextBlock show={shiftTipShow}>
                <IconHelp className="iconHelp"/> <span><b>Подсказка:</b> Клавиша "Shift" поможет быстро выделить много фотографий</span>
                <Btn intent="minimal" className="closeBtn" onClick={ closeShiftTip } iconed >
                    <IconClose/>
                </Btn>

            </HelpTextBlock>

            <Library
                items={photosList}
                folderId={currentFolderId}
                selectionActive={true}
                disabled={myPhotosInProgress}
                selectAction={selectPhotoHandler}
                previewAction={(o)=>dispatch(previewPhotoAction(o))}
            />

            { (currentTab === 'photos' || currentFolderId) && photosList && nextPage &&    // Подгрузить еще фотографии
            <StyledLoadMore id="loadMoreBlock">
                {loadNextPage ?
                    <span className='text'>{TEXT_MY_PHOTOS.LOADING_MORE_PHOTOS}</span>
                    :
                    <Btn onClick={getNextPageAction}>
                        {TEXT_MY_PHOTOS.SHOW_MORE}
                    </Btn>
                }
            </StyledLoadMore>}

            { (currentTab === 'photos' || currentFolderId) && photosList && photosList.length === 0 &&   // если нет фотографий
                <StyledNoPhoto>
                    <h3 className="text">{TEXT_MY_PHOTOS.NO_PHOTOS}</h3>
                    {!currentFolderId &&
                    <Btn intent="primary" onClick={() => dispatch( modalPhotosUploadAction({show: true, callback: uploadPhotosCallback}) )}>
                        {TEXT_MY_PHOTOS.UPLOAD_PHOTOS}
                    </Btn>
                    }
                </StyledNoPhoto>
            }

        </div>
    );
});

export default MyPhotosModal;