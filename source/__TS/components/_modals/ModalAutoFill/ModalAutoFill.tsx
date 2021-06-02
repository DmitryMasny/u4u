// @ts-ignore
import React, {useState, useEffect, useCallback, useContext, memo} from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';

// @ts-ignore
import { ModalContext} from 'components/Modal';
// @ts-ignore
import { IconMultiSelect } from 'components/Icons';

// @ts-ignore
import Library from "__TS/components/Library";

// @ts-ignore
import { modalAutoFillSelector } from "__TS/selectors/modals"
// @ts-ignore
import { windowIsMobileSelector } from "__TS/selectors/modals";

// @ts-ignore
import { arrayMove } from "libs/helpers";

// @ts-ignore
import {TYPES} from 'const/types';
import { windowIsXsSelector } from "../../Editor/_selectors";
import Spinner from "../../_misc/Spinner/Spinner";


/** Interfaces */
interface IModalUploadStickers {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
}
interface IModalAutoFillInfoText {
    blocksCount: number;
    selectedCount: number;
    compact?: boolean;
}
interface IModalAutoFillInfoTextStyled {
    overdraft?: boolean;
    notSelected?: boolean;
    success?: boolean;
}

/** Styles */
const UploadedStickersWrap = styled('div')`
    margin-bottom: 20px;
    min-height: 200px;
`;
const ModalAutoFillInfoTextStyled = styled('div')`
    display: flex;
    flex-direction: column;
    font-size: 13px;
    text-align: right;
    padding-top: 1px;
    .line {
      padding: 2px 0;
    }
    .row {
      padding: 12px 0;
      display: flex;
    }
    .selected {
      color: ${({notSelected, success}: IModalAutoFillInfoTextStyled) => notSelected ? COLORS.MUTE : success ? COLORS.TEXT_SUCCESS : COLORS.TEXT_INFO};
    }
    .blocks {
      color: ${({overdraft, success}: IModalAutoFillInfoTextStyled) => overdraft ? COLORS.TEXT_DANGER : success ? COLORS.TEXT_SUCCESS : COLORS.TEXT_MUTE};
    }
`;


/**
 * Модалка загрузки стикеров
 */
const ModalAutoFillInfoText: React.FC<IModalAutoFillInfoText> = ( { blocksCount, selectedCount, compact } ) => (
    <ModalAutoFillInfoTextStyled overdraft={selectedCount > blocksCount} notSelected={!selectedCount} success={selectedCount === blocksCount}>
        {compact ?
            <div className="row">
                <span className="selected">{selectedCount}</span> / <span className="blocks">{blocksCount}</span>
            </div>
        :
            <>
                <div className="line selected">
                    Выбрано фотографий: {selectedCount}
                </div>
                <div className="line blocks">
                    Свободно блоков: {blocksCount}
                </div>
            </>
        }
    </ModalAutoFillInfoTextStyled>
)

/**
 * Модалка загрузки стикеров
 */
const ModalAutoFill: React.FC<IModalUploadStickers> = () => {
    const modalData = useSelector( modalAutoFillSelector );
    const {setModal, closeModal} = useContext(ModalContext);
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const isXs: boolean = useSelector( windowIsXsSelector );
    const [photosList, setPhotosList] = useState([])
    const [loading, setLoading] = useState(true)

    const selectedPhotosList = photosList.filter( (p) => p.selected )
    const disabled = !selectedPhotosList.length
    const isAllSelected = selectedPhotosList.length === photosList.length || selectedPhotosList.length === modalData.emptyBlocksCount

    /** Разместить выбранные */
    const completeAction = useCallback(() => {
        modalData.callback && !disabled && modalData.callback( selectedPhotosList )
        closeModal();
    }, [photosList])

    /** Обновление футера модалки */
    useEffect(()=>{
        setModal({
            footer: [
                {type: TYPES.BTN, text: isXs ? <IconMultiSelect/> : isAllSelected ? 'Отменить выбор' : 'Выбрать все', action: () => multiSelectAction(isAllSelected) },
                { type: TYPES.DIVIDER },
                {type: TYPES.COMPONENT, component: <ModalAutoFillInfoText blocksCount={modalData.emptyBlocksCount} selectedCount={selectedPhotosList.length} compact={isXs}/> },
                {type: TYPES.BTN, text: isMobile ? 'Разместить' : 'Разместить выбранные фотографии в этом порядке', action: completeAction, primary: true, disabled: disabled },
            ]
        });
    }, [ completeAction, photosList, isMobile, isXs ]);

    /** Создание локального списка фотографий */
    useEffect(()=>{
        if (modalData && modalData.photosList) setPhotosList( modalData.photosList )
    }, [modalData && modalData.photosList]);

    /** При загрузке выделяем максимально допустимое кол-во фотографий */
    useEffect(()=>{
        if ( photosList.length && loading ) {
            console.log('photosList!!!!', photosList)
            multiSelectAction()
            setLoading( false )
        }
    }, [photosList, loading]);

    /** Выбрать фото */
    const selectActionHandler = useCallback(({data}) =>{
        if ( !data || !data.id ) return null

        const updatedPhotosList = photosList.map( (p) => p.id === data.id ? {...p, selected: !p.selected} : p )
        if (updatedPhotosList.filter( x => x.selected ).length <= modalData.emptyBlocksCount) setPhotosList( updatedPhotosList )
    }, [photosList])

    /** Выбрать всё / Снять выбор */
    const multiSelectAction = useCallback(( isDeselect: boolean = false ) => {
        let selectedCount = 0
        setPhotosList( photosList.map( (p) => {
            if (!isDeselect) selectedCount++
            return {...p, selected: isDeselect ? false : selectedCount <= modalData.emptyBlocksCount }
        } ))
    }, [photosList])

    /** Сортировать фото */
    const onSortEndHandler = useCallback(({oldIndex, newIndex}) =>{
        if (oldIndex === newIndex) return null;
        const sortedList = arrayMove(photosList, oldIndex, newIndex);
        setPhotosList(sortedList);
    }, [photosList])

    if (loading) return <Spinner delay={0}/>

    return <UploadedStickersWrap>
        { photosList.length ? <Library
            items={photosList}
            thumbSize={isMobile ? 50 : 100}
            sortable={true}
            selectionActive={true}
            selectAction={selectActionHandler}
            onSortEnd={onSortEndHandler}
            axis={'xy'}
        /> : null}
    </UploadedStickersWrap>;

};

export default memo(ModalAutoFill);



