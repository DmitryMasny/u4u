import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Gesture from 'rc-gesture';

import ImageLoader from 'components/ImageLoader';
import Spinner from 'components/Spinner';


import {IconClose, IconChevronRight, IconChevronLeft, } from "components/Icons";
import { ShareIcon, CopyIcon, TrashIcon, RotateL, RotateR, SaveIcon } from "components/Icons/LineIcon";
import {modalPhotosFoldersAction} from "actions/modals";

import { previewPhotoInProgressSelector, previewPhotoSelector, previewPhotoIdSelector } from "./selectors";
import { windowWidthSelector, windowHeightSelector, windowIsMobileSelector } from "selectors/global";
import { previewPhotoCloseAction, previewPhotoNextAction, previewPhotoPrevAction } from "./actions";
import {
    removeFromFolderAction,
    movePhotosAction,
    duplicatePhotosAction,
    deletePhotosAction,
    rotatePhotosAction,
} from "components/_pages/MyPhotosPage/actions";
import { modalDeleteConfirmAction } from "actions/modals";

import TEXT_MY_PHOTOS from 'texts/my_photos';
import s from './previewPhoto.scss';


/**
 * PreviewBlock - блок фотографии, отвечает за поворот
 */
const PreviewBlock = ( { disabled, url, rotate, photoSize, blockSize, thumbSize, move, disableTransition } ) => {
    // photoSize && console.log('photoSize',photoSize);
    // blockSize && console.log('blockSize',blockSize);
    let scale = 1;
/*
    const blockW = blockSize.width - 40;
    const blockH = blockSize.height - 80;

    if (photoSize && blockSize && (rotate % 180)) {
        console.log('rotate % 180');
        const photoRatio = photoSize.h / photoSize.w;
        const blockRatio = blockW / blockH;
        const ratio = photoRatio / blockRatio;
        if (ratio < 1) {
            // фотография возможно будет упираться сверху-снизу
            if (photoSize.w > blockH) {
                // фотография достает до краев
                console.log('=======>',{
                    photoWidth: photoSize.w,
                    photoHeight: photoSize.h,
                    blockWidth: blockW,
                    blockHeight: blockH,
                    photoRealWidth: blockW,
                    photoRealHeight: blockW * photoRatio,
                });
            }
        } else {
            // фотография возможно будет упираться по бокам
            if (photoSize.h > blockW) {
                console.log('ratio >= 1');
                // фотография достает до краев
                console.log('photoSize.w',photoSize.w);
                console.log('blockW',blockW);
            }

        }
    }*/

    const imageStyle = {transform:`rotate(${rotate || 0}deg) scale(${scale}) translateX(${move}px)`};

    return (
        <div className={s.previewPhotoBlock + ` ${disabled ? s.disabled : ''}`} >
            {/*<div className={s.previewPhotoZone}/>*/}
            <div className={s.previewPhotoImageWrap + ` ${(move || disableTransition)  ? s.disableTransition : ''}`} style={imageStyle} >
                <ImageLoader light className={s.previewPhotoImage} preload={url} preloadSize={thumbSize}/>
            </div>
            { disabled && <Spinner className={s.spinner} light size={50} />}
        </div>);
};

/**
 * Кнопка действий с фото
 */
const PreviewPhotoAction = ( { action, intent, title, isMobile, showTitleOnMobile, data } ) => {
    return (
        <div className={`${s.previewPhotoControlBtn} ${intent ? s[intent] : ''} ${(isMobile && !showTitleOnMobile) ? s.round : ''}`}
             onClick={()=>action(data)}>
            <TrashIcon className={s.previewPhotoControlIcon}/>
            {(isMobile && !showTitleOnMobile) ? null : title}
        </div>
    );
};

/**
 * Preview Photo
 */
const PreviewPhoto = ( props ) => {
    const dispatch = useDispatch();

    const modalSelector = useSelector(previewPhotoSelector);
    const modalPhotoIdSelector = useSelector(previewPhotoIdSelector);
    const modalInProgressSelector = useSelector(previewPhotoInProgressSelector);
    const windowWidth = useSelector(windowWidthSelector);
    const windowHeight = useSelector(windowHeightSelector);
    const windowIsMobile = useSelector(windowIsMobileSelector);

    const [rotate, setRotate] = useState(0);
    const [movePhoto, setMovePhoto] = useState(0);

    const previewContainer = useRef(null);

    // слушатели - назначаем при инициализации, удаляем при удалении компонента
    useEffect(() => {
        // Слушатель клавиш
        document.addEventListener( 'keydown', keyControll );
        // Запрет скролла страницы
        document.addEventListener('wheel', keyControll, {passive: false});         // Disable scrolling in Chrome
        document.addEventListener('touchmove', keyControll, { passive: false });   // Disable scrolling on mobile
        return ()=>{
            document.removeEventListener( 'keydown', keyControll );
            document.removeEventListener( 'wheel', keyControll );
            document.removeEventListener( 'touchmove', keyControll );
        }
    }, [modalSelector.prev, modalSelector.next]);

    useEffect(() => {
        setRotate(0)
    }, [modalSelector]);

    const keyControll = ( event ) => {
        // запрет скролла
        if ( event.type === 'wheel' ||  event.type === 'touchmove' ) {
            event.preventDefault && event.preventDefault();
            event.returnValue = false;
        }
        switch ( event.keyCode ) {
            case 27:   //ESC
                closeModal();
                break;
            case 37:
                prevPhoto();
                break;
            case 39:
                nextPhoto();
                break;
            case 13:
                saveRotateAction();
                break;
            case 46:
            case 8:
                deletePhotoAction(modalSelector.photoId, modalSelector.folderId);
                break;
        }
    };

    const gestureControll = ( status, type ) => {
        switch ( type ) {
            case 'swipe':
                switch ( status ) {
                    case 4:
                        prevPhoto();
                        break;
                    case 2:
                        nextPhoto();
                        break;
                }
                break;

            case 'pan':
                setMovePhoto(status.x);
                break;

            case 'panEnd':
                setMovePhoto(0);
                break;
        }
    };

    const closeModal = (e) => {
        if (!e || !previewContainer || e.target === previewContainer.current) dispatch(previewPhotoCloseAction());
    };

    const prevPhoto = () => {
        if (modalSelector.prev) dispatch(previewPhotoPrevAction());
    };
    const nextPhoto = () => {
        modalSelector.next && dispatch(previewPhotoNextAction());
    };

    const duplicatePhotoAction = ( photoId) => {
        dispatch(modalPhotosFoldersAction({
            exclude: modalSelector.folderId,
            callback: (folderId) => {
                dispatch(duplicatePhotosAction({list:[photoId],folderId: folderId }))
            }
        }));
    };
    const movePhotoAction = (photoId, sourceFolderId) => {
        dispatch(modalPhotosFoldersAction({
            exclude: modalSelector.folderId,
            callback: (folderId) => {
                dispatch(movePhotosAction({ list: [photoId], folderId: folderId, sourceFolderId: sourceFolderId }))
            }
        }));
    };
    const deletePhotoAction = (photoId, folderId) => {
        dispatch(modalDeleteConfirmAction({
            text: folderId ? TEXT_MY_PHOTOS.DELETE_CONFIRM_QUESTION_F_1 : TEXT_MY_PHOTOS.DELETE_CONFIRM_QUESTION_1,
            callback: (folderId) => {
                if (folderId) {
                    dispatch(removeFromFolderAction({ list:[photoId], folderId: folderId }))
                } else {
                    dispatch(deletePhotosAction([photoId]))
                }
            }
        }));
    };
    const rotatePhotoAction = (direction) => {
        let angle = rotate + (direction === 'left' ?  -90 : 90 );
        setRotate(angle);
    };
    const saveRotateAction = () => {
        if ( rotate ) {
            const angle = rotate % 360;
            dispatch(rotatePhotosAction({
                photoId: modalSelector.photoId,
                folderId: modalSelector.folderId,
                angle: angle
            }));
        }
    };

    return <Gesture onSwipe={( status ) => gestureControll(status.direction, 'swipe')}
                    onPan={ (status) => { gestureControll(status.moveStatus, 'pan') } }
                    onPanEnd={ (status) => { gestureControll(status, 'panEnd') } }
                    direction="horizontal" >
        <div className={s.previewPhoto} onClick={closeModal} ref={previewContainer}>
            <PreviewBlock
                disabled={modalInProgressSelector}
                key={modalSelector.photoId}
                url={modalSelector.photoUrl}
                rotate={modalSelector.angle || rotate}
                move={movePhoto}
                photoSize={modalSelector.size}
                thumbSize={modalSelector.thumbSize}
                blockSize={{width: windowWidth, height: windowHeight}}
            />
            {/*Старые экшены - для превью в Мои фото*/}
            {modalSelector && !modalSelector.noActions &&
            <div className={s.previewPhotoControl + (modalInProgressSelector ? ` ${s.disabled}` : '')}>

                <div className={`${s.previewPhotoControlBtn} ${windowIsMobile ? s.round : ''}`}
                     onClick={()=>duplicatePhotoAction(modalSelector.photoId)}>
                    <CopyIcon className={s.previewPhotoControlIcon}/>
                    {windowIsMobile ? null : TEXT_MY_PHOTOS.DUPLICATE}
                </div>
                {modalSelector.folderId && <div className={`${s.previewPhotoControlBtn} ${windowIsMobile ? s.round : ''}`}
                                  onClick={()=>movePhotoAction(modalSelector.photoId, modalSelector.folderId) }>
                    <ShareIcon className={s.previewPhotoControlIcon}/>
                    {windowIsMobile ? null : TEXT_MY_PHOTOS.MOVE_TO}
                </div>}

                <div className={s.previewPhotoControlBtn +' '+ s.round} onClick={()=>rotatePhotoAction('left')}>
                    <RotateL className={s.previewPhotoControlIcon} />
                </div>
                <div className={s.previewPhotoControlBtn +' '+ s.round +' '+ s.rotateRight} onClick={()=>rotatePhotoAction('right')}>
                    <RotateR className={s.previewPhotoControlIcon} />
                </div>
                <div className={`${s.previewPhotoControlBtn} ${windowIsMobile ? s.round : ''} ${!(rotate % 360) ? s.hide : ''}`}
                     onClick={()=>saveRotateAction()}>
                    <SaveIcon className={s.previewPhotoControlIcon}/>
                    {windowIsMobile ? null : TEXT_MY_PHOTOS.SAVE}
                </div>

                <div className={`${s.previewPhotoControlBtn} ${s.danger} ${windowIsMobile ? s.round : ''}`}
                     onClick={()=>deletePhotoAction(modalSelector.photoId, modalSelector.folderId)}>
                    <TrashIcon className={s.previewPhotoControlIcon}/>
                    {windowIsMobile ? null : TEXT_MY_PHOTOS.DELETE}
                </div>

            </div>}
            {/*Новые экшены - строятся из props */}
            { modalSelector && modalSelector.actions &&
            <div className={s.previewPhotoControl + (modalInProgressSelector ? ` ${s.disabled}` : '')}>
                {modalSelector.actions.map((item, i)=> <PreviewPhotoAction {...item} data={{photoId: modalSelector.photoId, folderId: modalSelector.folderId}} key={i} isMobile={windowIsMobile}/>)}
            </div>
            }

            <div className={s.previewPhotoArrows}>
                <div className={s.previewPhotoArrow + ` ${modalSelector.prev ? '' : s.disabled}`} onClick={prevPhoto}>
                    <IconChevronLeft size={48}/>
                </div>
                <div className={s.previewPhotoArrow + ` ${modalSelector.next ? '' : s.disabled}`} onClick={nextPhoto}>
                    <IconChevronRight size={48}/>
                </div>
            </div>
            <div className={s.previewPhotoClose} onClick={()=>closeModal()}><IconClose size={36}/></div>
        </div>
    </Gesture>;
};

export default PreviewPhoto;