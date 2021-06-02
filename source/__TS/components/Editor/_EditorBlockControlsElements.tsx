// @ts-ignore
import React, { memo, MouseEvent, useCallback, useEffect, useState } from 'react';
// @ts-ignore
import styled, { css } from 'styled-components';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {
    IconFlipToBack,
    IconFlipToFront,
    IconMagnetic,
    IconDelete2,
    IconClean,
    IconCopy,
    IconMirror2,
    IconClose
// @ts-ignore
} from 'components/Icons';
// @ts-ignore
import Tooltip from 'components/_forms/Tooltip';
// @ts-ignore
import Select from 'components/_forms/Select';


// @ts-ignore
import { IBlockOrderType } from '__TS/interfaces/layout';
// @ts-ignore
import { blockSortOrderAction, deleteBlockAction, removePhotoFromBlockAction, copyBlockAction, mirroringBlockAction } from '__TS/actions/layout';
import { setControlElement } from './_actions';
// @ts-ignore
import { removeBackgroundAction } from '__TS/actions/backgrounds';

import { toggleMagneticAction } from './_actions';
import {
    currentControlElementIdSelector,
    currentControlElementTypeSelector,
    isMagneticSelector,
    windowIsMobileSelector
} from './_selectors';
import { userRoleIsAdmin } from "../../selectors/user";
import { numsOfAreasSelector } from "../../selectors/layout";



/** Interfaces */
interface IProps {
    //currentControlElementId: string | number;
}

/** Styles */
const ControlBlock = styled('div')`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  ${ ({ isMobile }: {isMobile: boolean}) => isMobile ? 'bottom: 5px' : 'top: 5px' };
  left: 5px;
  right: 5px;
  margin: auto;
  z-index: 250;
  user-select: none;
  .ControlBlockInner {
    display: flex;
    align-items: center;
    border-radius: 10px;  
    padding: 5px 10px;
    background-color: rgb(240 245 248 / .9);
    box-shadow: 1px 2px 7px rgba(0,0,0,.1);
  }
`;
const ControlBlockName = styled('div')`
    color: #3d4c62;
    padding-right: 5px;
`;
const ControlBlockButtons = styled('div')`
    display: flex;
    align-items: stretch;   
    & > div {
      display: flex;
    }
`
const ControlButton = styled('span')`
    cursor: pointer;
    display: flex;
    border-radius: 5px;
    align-self: center;
    white-space: nowrap;
    height: 32px;
    ${ ( { infinity }: { infinity: boolean } ) => !infinity && css`
        width: 32px;
   ` };
    
    justify-content: center;
    align-items: center;
  & > svg {
      //font-size: 32px;
      ${ ( { isActive }: { isActive: boolean } ) => isActive && css`
          fill: #1278ca;
      `};
  } 
  &:hover {
      background: rgba(255,255,255, .3);
  }
  &:active {
      background: rgba(255,255,255, .55);
  }
`
const ControlButtonSeparator = styled('div')`
    display: flex;
    border-left: 1px solid #3d4c62;
    margin: 5px 10px; 
`;

/**
 * Блок управления фотографией
 */
const EditorBlockControlsElements: React.FC<IProps> = (): any => {
    const currentControlElementId: string  = useSelector( currentControlElementIdSelector );
    const currentControlElementType: string  = useSelector( currentControlElementTypeSelector );
    const isMagnetic: boolean = useSelector( isMagneticSelector );
    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const isMobile: boolean = useSelector( windowIsMobileSelector );

    const numsOfAreas: number = useSelector( numsOfAreasSelector );

    const isContentSelected: boolean = currentControlElementId && typeof currentControlElementId === 'string';

    const [copyPageSubMenu, setCopyPageSubMenu] = useState( false );

    useEffect( () => {
        if ( copyPageSubMenu ) setCopyPageSubMenu( false )
    }, [ currentControlElementType ] );

    const clickOrderAction = useCallback( ( event: MouseEvent, direction: IBlockOrderType ) => {
        event.stopPropagation();
        event.preventDefault();
        blockSortOrderAction( { blockId: currentControlElementId, direction: direction } );
    }, [ currentControlElementId ] );

    const deleteAction = useCallback( () => {
        //console.log( 'currentControlElementId', currentControlElementId );
        deleteBlockAction( { blockId: currentControlElementId } );
    }, [ currentControlElementId ] );

    const removePhotoFromBlock = useCallback( () => {
        //console.log( 'currentControlElementId', currentControlElementId );
        removePhotoFromBlockAction( { blockId: currentControlElementId } );
    }, [ currentControlElementId ] );

    const removeBackground = useCallback( () => {
        //console.log( 'currentControlElementId', currentControlElementId );
        removeBackgroundAction( { contentId: currentControlElementId } );
    }, [ currentControlElementId ] );

    const removeBlockSelection = useCallback( () => {
        //console.log( 'currentControlElementId', currentControlElementId );
        setControlElement( { blockId: '', blockType: '' } );
    }, [ currentControlElementId ] );

    /*
    const RULES = {
        'photo': [
            {type: 'text', description: 'Порядок'},
            {type: 'separator'},
            {type: 'button', description: 'Ниже', icon: <IconChevronDown size={32} />, click: },

        ],
        'contentPhoto': [
            {type: 'text', description: 'Фотография'}
        ]


    }*/

    /*
    const deleteActionKey = useCallback(( event ) => {
        const key = event.which || event.keyCode || event.charCode;
        console.log( 'KEY 1',  key );
        console.log( 'KEY 2',  key == 27 );
        console.log( 'KEY 3',  key === 27 );
        if ( key === 27 || key === 8 || key === 46 ) {
            console.log( 'DELETE' );
            deleteAction();
        }
    },[currentControlElementId]);

    useEffect( () => {
        document.addEventListener('keydown', deleteActionKey)
        return () => {
            document.removeEventListener("keydown", deleteActionKey);
        };
    }, [currentControlElementId]);
    */

    const isPhotoContent = currentControlElementType === 'contentPhoto';
    const isBackgroundContent = currentControlElementType === 'background';
    const isStickerContent = currentControlElementType === 'sticker';
    const isTextContent = currentControlElementType === 'text';

    //ДЛЯ ФОНОВ
    if ( isBackgroundContent ) {
        return <ControlBlock isMobile={isMobile}>
                   <div className="ControlBlockInner">
                       <ControlBlockName>Фон:</ControlBlockName>
                       <ControlBlockButtons>
{/*
 // @ts-ignore */}
                           <Tooltip trigger="hover" tooltip={'Убрать фоновое изображение'} intent="minimal" placement="bottom" >
                               <ControlButton onClick={ removeBackground }>
                                   <IconClean />
                               </ControlButton>
                           </Tooltip>

                           <ControlButtonSeparator />
{/*
 // @ts-ignore */}
                           <Tooltip trigger="hover" tooltip={'Снимает выделение с фона'} intent="minimal" placement="bottom" >
                               <ControlButton infinity={true} onClick={ () => removeBlockSelection() }>
                                   Убрать выделение с фона
                               </ControlButton>
                           </Tooltip>
                       </ControlBlockButtons>
                   </div>
               </ControlBlock>
    }


    //ДЛЯ СТРАНИЦЫ У АДМИНА
    if ( !isContentSelected && isAdmin && numsOfAreas > 1 ) {
        return <ControlBlock isMobile={isMobile}>
                    <div className="ControlBlockInner">
                        { !copyPageSubMenu ? <>
                                                <ControlBlockName>Страница:</ControlBlockName>
                                                <ControlBlockButtons>
{/*
 // @ts-ignore */}
                                                    <Tooltip trigger="hover" tooltip={ 'Скопировать страницу' } intent="minimal" placement="bottom" >
                                                    <ControlButton onClick={ () => setCopyPageSubMenu( true ) }>
                                                        <IconCopy size={ 24 } />
                                                    </ControlButton>
                                                    </Tooltip>
                                                </ControlBlockButtons>
                                            </>
                        :
                                            <>
                                                <ControlBlockName>Скопировать:</ControlBlockName>
                                                <ControlBlockButtons>
{/*
 // @ts-ignore */}

                                                    <Tooltip trigger="hover" tooltip={ 'Скопировать на все страницы' } intent="minimal" placement="bottom" >
                                                        <ControlButton infinity={ true } onClick={ () => setCopyPageSubMenu( true ) }>
                                                            На все страницы
                                                        </ControlButton>
                                                    </Tooltip>
                                                    <ControlButtonSeparator />
{/*
 // @ts-ignore */}

                                                    <Tooltip trigger="hover" tooltip={ 'Не хочу' } intent="minimal" placement="bottom" >
                                                        <ControlButton onClick={ () => setCopyPageSubMenu( false )  }>
                                                            <IconClose size={ 24 } />
                                                        </ControlButton>
                                                    </Tooltip>
                                                </ControlBlockButtons>
                                            </>
                        }
                    </div>
                </ControlBlock>
    }



    //ДЛЯ СТИКЕРОВ И ФОТО
// @ts-ignore
    return  isContentSelected ? <ControlBlock isMobile={isMobile}>
        <div className="ControlBlockInner">
                        <ControlBlockName>{ isPhotoContent && 'Фотография' }</ControlBlockName>
                        <ControlBlockButtons>
{/*
 // @ts-ignore */}
                            { !isPhotoContent && <Tooltip trigger="hover" tooltip={'На задний план'} intent="minimal" placement="bottom" >
                                                    <ControlButton onClick={ ( event ) => clickOrderAction( event, 'down' ) }>
                                                        <IconFlipToBack />
                                                    </ControlButton>
                                                </Tooltip>}
{/*
 // @ts-ignore */}
                            { !isPhotoContent && <Tooltip trigger="hover" tooltip={'На передний план'} intent="minimal" placement="bottom" >
                                                    <ControlButton onClick={ ( event ) => clickOrderAction( event, 'up' ) }>
                                                        <IconFlipToFront />
                                                    </ControlButton>
                                                </Tooltip>}

                            { !isPhotoContent && <ControlButtonSeparator />}
{/*
// @ts-ignore */}
                            { !isPhotoContent && <Tooltip trigger="hover" tooltip={'Отразить по вертикали'} intent="minimal" placement="bottom" >
                                                    <ControlButton onClick={ mirroringBlockAction }>
                                                        <IconMirror2/>
                                                    </ControlButton>
                                                </Tooltip>}

                            { !isPhotoContent && <ControlButtonSeparator />}
{/*
// @ts-ignore */}
                            { !isPhotoContent && <Tooltip trigger="hover" tooltip={'Создать копию'} intent="minimal" placement="bottom" >
                                                    <ControlButton onClick={ copyBlockAction }>
                                                        <IconCopy/>
                                                    </ControlButton>
                                                </Tooltip>}

                            { !isPhotoContent && <ControlButtonSeparator />}
{/*
// @ts-ignore */}
                            { !isPhotoContent && <Tooltip trigger="hover" tooltip={'Включить/выключить примагничивание'} intent="minimal" placement="bottom" >
                                                    <ControlButton isActive={ isMagnetic } onClick={ toggleMagneticAction }>
                                                        <IconMagnetic />
                                                    </ControlButton>
                                                </Tooltip>}

                            { !isStickerContent && !isTextContent && <ControlButtonSeparator />}
{/*
// @ts-ignore */}
                            { !isStickerContent && !isTextContent && <Tooltip trigger="hover" tooltip={'Убрать фотографию из блока'} intent="minimal" placement="bottom" >
                                                                        <ControlButton onClick={ removePhotoFromBlock }>
                                                                            <IconClean />
                                                                        </ControlButton>
                                                                    </Tooltip>}

                            { !isPhotoContent && <ControlButtonSeparator />}
{/*
// @ts-ignore */}
                            { !isPhotoContent && <Tooltip trigger="hover" tooltip={'Удалить с листа'} intent="minimal" placement="bottom" >
                                                    <ControlButton onClick={ deleteAction }>
                                                        <IconDelete2 />
                                                    </ControlButton>
                                                </Tooltip>}

                        </ControlBlockButtons>
                </div>
                     </ControlBlock>
            : null;
};

export default memo( EditorBlockControlsElements );