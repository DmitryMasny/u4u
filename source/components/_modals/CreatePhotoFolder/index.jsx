import React, { useEffect, useState, useRef, useContext, Fragment } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';

import { modalCreatePhotoFolderSelector } from 'selectors/modals';
import { myPhotosFoldersSelector } from 'components/_pages/MyPhotosPage/selectors';
import { createPhotoFolderAction, renameFolderAction } from 'components/_pages/MyPhotosPage/actions';

import TEXT_MAIN from 'texts/main';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import {PHOTO_FOLDER_NAME_MAX} from 'config/main';
import {COLORS, Btn} from "const/styles";
import {Input} from "components/_forms";

const InputLength = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    height: 40px;
    color: ${COLORS.MUTE};
    &.full{
         color: ${COLORS.TEXT}
    }
`;

/**
 * Создание и переименование папки
 */
const CreatePhotoFolder = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const dispatch = useDispatch();
    const modalSelector = useSelector(modalCreatePhotoFolderSelector);
    const foldersSelector = useSelector(myPhotosFoldersSelector);
    const createFolderAction = ( name, callback, redirect ) => dispatch( createPhotoFolderAction( name, callback, redirect ) );
    const renameAction = ( o ) => dispatch( renameFolderAction( o ) );
    const [newFolderName, setNewFolderName] = useState('');

    // Обработчик поля формы
    const handleInputChange = ( event ) => {
        if ( !event || !event.target ) return null;
        setNewFolderName(event.target.value.slice(0, PHOTO_FOLDER_NAME_MAX));
    };
    // Создать папку
    const createFolder = () => {
        if ( !newFolderName ) return null;
        console.log('modalSelector',modalSelector);
        if (modalSelector.folderId) {
            renameAction({name: newFolderName, folderId: modalSelector.folderId});
        } else createFolderAction(newFolderName, modalSelector.callback, modalSelector.redirect);
        closeModal();
    };

    useEffect(() => {
        const folderId = modalSelector && modalSelector.folderId || null;

        if (folderId) {
            for (let i=0; i < foldersSelector.length ; i++) {
                if (foldersSelector[i].id === folderId) {
                    setNewFolderName(foldersSelector[i].name);
                    break;
                }
            }
        }
    },[]);

    useEffect(() => {
        setModal({
            footer: [
                {type: TYPES.COMPONENT, component:  <InputLength className={nameLength === PHOTO_FOLDER_NAME_MAX ? 'full' : ''}>
                                                        {nameLength} /{PHOTO_FOLDER_NAME_MAX}
                                                    </InputLength>},
                {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, action: closeModal},
                {type: TYPES.BTN, text: modalSelector.folderId ? TEXT_MAIN.SAVE : TEXT_MAIN.CREATE, action: createFolder,
                    disabled: !newFolderName || !newFolderName.length, primary: true},
            ]
        });
    },[newFolderName]);

    const nameLength = newFolderName.length;

    return <Input name="newFolderName"
                  value={newFolderName || ''}
                  onChange={handleInputChange}
                  placeholder={'Новая папка'}
                  autoFocus={true}
    />;
};

export default CreatePhotoFolder;