import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useSelector } from "react-redux";
// import styled from 'styled-components';
import AddPhotos from "components/_pages/MyPhotosPage/_AddPhotos";

import Modal, { ModalContext} from 'components/Modal';
import TEXT_MAIN from 'texts/main';
import s from "./index.scss";
import {TYPES} from 'const/types';

import {myPhotosAllSelector} from "components/_pages/MyPhotosPage/selectors";
import { modalPhotosUploadSelector } from 'selectors/modals';
import {IMAGE_TYPES} from "const/imageTypes";

const LoadingStatus = ({disabled, totalCount, successfulCount, visitorLoading}) => (
    disabled ?
    <div className={s.count + ` ${ s.animated}`}>
        <span>Идёт загрузка...</span>
    </div>
    :
    ( visitorLoading ?
        <div className={s.count}>
            <span>Подождите завершения загрузки</span>
        </div>
        :
        <div className={s.count + (totalCount !== successfulCount ? ` ${ s.error}` : '')}>
            <span>Загружено: </span>
            {successfulCount ? successfulCount : 0}
            <span> из {totalCount}</span>
        </div>
    ));
/**
 * Панель страниц
 */
const PhotosUpload = (props) => {
    const modalData = useSelector( state => modalPhotosUploadSelector( state ));
    const allPhotosSelector = useSelector( state => myPhotosAllSelector( state ));
    const {setModal, closeModal} = useContext(ModalContext);

    const ReadyOkAction = () => {
        // if ( modalData.visitor && modalData.photosAddAction ) {
        //     modalData.photosAddAction(
        //         modalData.photoUploadList
        //             .filter((item)=>!item.error)
        //             .map( ( item ) => item.id )
        //     );
        // } else

        closeAction();
    };

    const closeAction = () => {
        if ( modalData.callback ) {
            modalData.callback(modalData.photoUploadList
                .filter((item)=>!item.error)
                .map( ( item ) => item.id ))
        }

        closeModal();

        // if ( modalData.visitor && modalData.closeIframeAction ) {
        //     modalData.closeIframeAction();
        // } else closeModal();
    };

    // кол-во файлов с ошибками
    let errorCount = 0;
    // Количество загруженных в модалку загрузки
    const uploadCount = modalData.photoUploadList && modalData.photoUploadList.filter(
        ( p ) => {
            if (p.error) {
                errorCount++;
                return false;
            } else return true;
        }
    ).length || 0;
    // Количество финально загруженных (получен ответ по ws)
    const fullLoadedCount = modalData.visitor && allPhotosSelector &&
        allPhotosSelector.filter(
            ( p ) => p.type === IMAGE_TYPES.GPHOTO,
        ).length || 0;
    // Общий процент для незарегеного юзера (для полосы загрузки)
    const fullLoadedPercent = fullLoadedCount && uploadCount && Math.round(fullLoadedCount/uploadCount * 100) || 0;
    // Завершена загрузка фоток Незарегенного юзера
    const visitorEnd = uploadCount === fullLoadedCount || (modalData.visitor && fullLoadedPercent >= 100);
    // Завершена загрузка фоток
    const uploadEnd = modalData.success && ( !modalData.visitor || visitorEnd  );

    useEffect(() => {

        const modalFooter = [
            ...(modalData.success && [{type: TYPES.COMPONENT, component: <LoadingStatus
                    disabled={modalData.disabled}
                    successfulCount={modalData.successfulCount}
                    totalCount={modalData.successfulCount}
                    visitorLoading={modalData.visitor && !visitorEnd}
                />}] || []),

            {type: TYPES.DIVIDER},

            ...(!!uploadEnd &&
                [{type: TYPES.BTN, text: TEXT_MAIN.READY, action: ReadyOkAction, disabled: modalData.disabled, intent: 'primary' }]
                || []),

            ...(!uploadEnd &&
                [{type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeAction, disabled: modalData.disabled}]
                || []),
        ];

        setModal({
            footer: modalFooter
        });

    },[uploadEnd, modalData.success , modalData.disabled ]);


    return (
        <Fragment>

            <AddPhotos droppedFiles={modalData && modalData.droppedFiles}/>
            { modalData.visitor && modalData.success && !!uploadCount && <div className={s.visitorProgress +  (!visitorEnd ? ` ${s.show}` : '')} >
                <div className={s.visitorProgressInner} style={fullLoadedPercent? {width: fullLoadedPercent + '%'}: null}/>
            </div> }

        </Fragment>
    )
};

export default PhotosUpload;