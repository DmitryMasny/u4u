import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';

import { modalCreatePhotoFolderAction, modalPhotosFoldersAction } from 'actions/modals';
import { modalShowPhotosFoldersSelector } from 'selectors/modals';

import {hexToRgbA} from 'libs/helpers';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import {COLORS} from "const/styles";
import TEXT_MAIN from 'texts/main';
import TEXT_PHOTOS from 'texts/my_photos';

import { myPhotosFoldersSelector } from "components/_pages/MyPhotosPage/selectors";
import { getPhotosFoldersFromServerAction } from "components/_pages/MyPhotosPage/actions";
import { IconFolder, IconFolderCreate } from 'components/Icons';


const FoldersList = styled.div`
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 300px);
    overflow: hidden;
    overflow-y: auto;
    border-bottom: 1px solid ${COLORS.LINE};
    .icon{
        margin-right: 5px;
    }
`;
const FoldersListItem = styled.div`
    display: flex;
    height: 50px;
    padding: 0 20px;
    align-items: center;
    border: 1px solid ${hexToRgbA(COLORS.LINE, .5)};
    border-top-color: transparent;
    line-height: 1.2em;
    cursor: pointer;
    flex-shrink: 0;
    &:not(.selected):first-child {
        border-top-color: ${hexToRgbA(COLORS.LINE, .5)};
    }
    &:hover {
        color: ${COLORS.MUTE};
        fill: ${COLORS.MUTE};
    }
    &.selected {
        color: ${COLORS.TEXT_PRIMARY};
        border-color: ${COLORS.PRIMARY};
        fill: ${COLORS.PRIMARY};
        cursor: default;
    }
`;
const NewFolderBtn = styled.div`
    display: flex;
    height: 50px;
    padding: 0 20px;
    align-items: center;
    border: 1px solid ${COLORS.LINE};
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 1.2em;
    &:hover {
        color: ${COLORS.TEXT_PRIMARY};
        fill: ${COLORS.PRIMARY};
        border-color: ${COLORS.PRIMARY};
    }
`;

/**
 * PhotosFolders
 */
const PhotosFolders = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const dispatch = useDispatch();

    const modalSelector = useSelector(modalShowPhotosFoldersSelector);
    const myFoldersSelector = useSelector(myPhotosFoldersSelector);
    const getFoldersFromServerAction = ( ) => dispatch( getPhotosFoldersFromServerAction() );
    const createPhotoFolderAction = ( o ) => dispatch( modalCreatePhotoFolderAction( o ) );
    const [selected, setSelected] = useState(null);

    // Обработчик поля формы
    const selectItem = ( id ) => {
        setSelected(id);
    };
    // Выбрать папку
    const OkAction = () => {
        modalSelector.callback(selected);
        closeModal();
    };
    // Создать папку
    const newFolderAction = () => {
        createPhotoFolderAction({show:true, callback: (id)=> {
            modalSelector.callback(id);
            closeModal();
        }});
    };

    useEffect(() => {
        if ( !myFoldersSelector ) getFoldersFromServerAction();

        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, action: closeModal},
                {type: TYPES.BTN, text: TEXT_MAIN.SELECT, action: OkAction, disabled: !selected, primary: true},
            ],
            zIndex: 7
        });
    },[selected]);

    return <div>
        <NewFolderBtn onClick={newFolderAction}>
            <IconFolderCreate className="icon"/>
            {TEXT_PHOTOS.NEW_FOLDER}
        </NewFolderBtn>

        <FoldersList>
            {myFoldersSelector && myFoldersSelector.map((item)=>{
                if (modalSelector.exclude !== item.id) return (
                    <FoldersListItem className={selected === item.id ? 'selected' : ''}
                         onClick={()=>selectItem(item.id)}
                         key={item.id}
                    >
                        <IconFolder className="icon"/>
                        {item.name}
                    </FoldersListItem>);
            })
            }
        </FoldersList>
    </div>;
};

export default PhotosFolders;