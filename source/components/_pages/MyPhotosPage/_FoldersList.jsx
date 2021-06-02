import React, {memo, Fragment, useEffect} from 'react';
import styled, {css} from 'styled-components';
import {useSelector, useDispatch} from "react-redux";

import {hexToRgbA} from 'libs/helpers';
import Select from 'components/_forms/Select';

import {IconFolder, IconFolderCreate, IconArrowBack} from 'components/Icons';
import {FolderIcon, FolderPlusIcon} from 'components/Icons/LineIcon';
import TEXT_MY_PHOTOS from 'texts/my_photos';
import {COLORS} from "const/styles";
import { Btn } from 'components/_forms';

import {
    myPhotosInProgressSelector,
    myPhotosCurrentFolderSelector,
    myPhotosAddFolderSelector,
} from "./selectors";
import {selectFolderAction} from "./actions";
import {modalCreatePhotoFolderAction} from "actions/modals";

/** Styles */

const StyledFoldersList = styled.div`
    display: flex;
    flex-direction: column;
    width: 220px;
    padding: 20px;
    fill: ${COLORS.TEXT};
    flex-shrink: 0;
    z-index: 3;
    ${({isMobile}) => isMobile && css`
        flex-direction: row;
        flex-wrap: wrap;
        width: auto;
        min-width: 100%;
        padding: 20px 0;
        margin: 0 -5px;
    `}
    ${({disabled}) => disabled && css`
        pointer-events: none;
        opacity: .5;
    `}
`;
const StyledFoldersListItem = styled.div`
    display: flex;
    align-items: center;
    min-height: 40px;
    line-height: 1em;
    padding: ${({isMobile}) => isMobile ? '10px 20px' : '5px 0'};
    cursor: pointer;
    ${({isMobile}) => isMobile && css`
        width: calc(33.33% - 10px);
        max-width: 180px;
        margin: 0 5px 20px;
        border-radius: 2px;
        justify-content: flex-start;
        flex-direction: column;
        text-align: center;
    `}
    ${({theme}) => theme.media.xs`
        width: calc(50% - 10px);
    `}
    
    &.newFolder {
        border-bottom: 1px solid ${COLORS.LINE};
        margin-bottom: 15px;
        ${({isMobile}) => isMobile && css`
            border: none;
            margin: 0 5px 10px;
            flex-direction: column;
            stroke: ${COLORS.INFO};
            color: ${COLORS.TEXT_INFO};
            .icon {
                stroke: ${COLORS.INFO};
            }
            &:hover {
                .folders-list-icon {
                    stroke: ${COLORS.INFO};
                    fill: ${hexToRgbA(COLORS.INFO, .2)};
                }
            }
        `}
    }
    &:hover {
        color: ${COLORS.PRIMARY};
        .icon {
            fill: ${COLORS.PRIMARY};
            ${({isMobile}) => isMobile && css`
            stroke: ${COLORS.PRIMARY};
            fill: ${hexToRgbA(COLORS.PRIMARY, .12)}
            `}
        }
    }
    &:active {
        color: ${COLORS.TEXT_PRIMARY};
        border-color: ${COLORS.PRIMARY};
        .icon {
            fill: ${COLORS.TEXT_PRIMARY};
            ${({isMobile}) => isMobile && css`
                stroke: ${COLORS.PRIMARY};
                fill: ${hexToRgbA(COLORS.PRIMARY, .25)}
            `}
        }
    }
    &.active {
        cursor: default;
        color: ${COLORS.TEXT_WARNING};
        border-color: ${COLORS.WARNING};
        .icon {
            fill: ${COLORS.TEXT_WARNING};
        }
    }
    .name {
        text-overflow: ellipsis;
        max-width: 220px;
        overflow: hidden;
        background-color: rgba(255, 255, 255, .7);
        ${({theme}) => theme.media.sm`
            max-width: 180px;
        `}
        ${({theme}) => theme.media.xs`
            max-width: 140px;
        `}
        &:hover{
            overflow: visible;
            max-width: none;
        }
    }
    .icon {
    margin-right: 5px;
    flex-shrink: 0;
    margin-top: -.2em;
    ${({isMobile}) => isMobile && css`
        stroke: ${COLORS.TEXT};
        margin-right: 0;
        margin-bottom: 5px;
        transition: fill .2s ease-out;
        fill: ${hexToRgbA(COLORS.INFO, 0.01)};
    `}
    }
`;

const StyledFoldersBack = styled.div`
    display: flex;
    .name {
        height: 40px;
        line-height: 40px;
        flex-grow: 1;
        font-size: 18px;
    }
`;

/**
 * Кнопка назад ко всем папкам
 */
const FolderBack = ({list, selectFolderAction, selected}) => {
    return <StyledFoldersBack>
        <Btn intent="minimal" onClick={()=>selectFolderAction()}><IconArrowBack/></Btn>
        <Select className='name' selectedId={selected} list={list} onSelect={selectFolderAction}/>
    </StyledFoldersBack>;
};
/**
 * Кнопка "Создать новую папку"
 */
const NewFolder = ({action, isMobile}) => <StyledFoldersListItem className="newFolder"
                                                       onClick={action}
                                                       isMobile={isMobile}
                                                       key={1}>
    {isMobile ? <FolderPlusIcon className="icon" size={48}/> : <IconFolderCreate className="icon"/>}
    {TEXT_MY_PHOTOS.NEW_FOLDER}
</StyledFoldersListItem>;

/**
 * Список всех папок
 */
const AllFoldersList = ({list, addFolderId, isMobile, selected, selectFolderAction})=>{
    return list && list.map((folder) => {
        if (addFolderId && addFolderId === folder.id) return false;  // не показывать папку, в которую добавляем фотки
        const active = selected === folder.id;              // выделяем если выбрана
        return <StyledFoldersListItem className={active && 'active'}
                                      onClick={active ? null : () => selectFolderAction(folder.id)}
                                      key={folder.id + Math.floor(Math.random() * 1000)}
                                      isMobile={isMobile}
        >
            {isMobile ? <FolderIcon className="icon" size={48}/> : <IconFolder className="icon"/>}
            <span className="name">{folder.name}</span>
        </StyledFoldersListItem>
    });
};

/**
 * Список папок
 * @param list
 * @param mobile
 */
const FoldersList = memo(({list, mobile}) => {
    if (!list) return null;

    const disabled = useSelector(myPhotosInProgressSelector);
    const selected = useSelector(myPhotosCurrentFolderSelector);
    const addFolderSelector = useSelector(myPhotosAddFolderSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        return ()=>{
            dispatch(selectFolderAction());
        }
    },[]);

    const createNewFolderAction = () => {
        dispatch(modalCreatePhotoFolderAction({show: true, redirect: true}));
    };
    const selectAction = (id) => {
        dispatch(selectFolderAction(id));
    };

    let selectedName = addFolderSelector && addFolderSelector.name || '';
    if (!selectedName && list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === selected) {
                selectedName = list[i].name;
                break;
            }
        }
    }

    return <StyledFoldersList disabled={disabled} isMobile={mobile}>
        {mobile && selected ?
            <FolderBack list={list}
                        selectFolderAction={selectAction}
                        selected={selected}
                        selectedName={selectedName}
            />
            :
            <Fragment>
                <NewFolder action={createNewFolderAction} isMobile={mobile}/>
                <AllFoldersList list={list}
                                selected={selected}
                                selectFolderAction={selectAction}
                                addFolderId={addFolderSelector && addFolderSelector.id}
                                isMobile={mobile}/>
            </Fragment>}
    </StyledFoldersList>;
});

export default FoldersList;
