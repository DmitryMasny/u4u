// @ts-ignore
import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {Tooltip, Checkbox} from 'components/_forms';

// @ts-ignore
import { IPhoto } from "__TS/interfaces/photo";
// @ts-ignore
import { ILayoutBlock } from "__TS/interfaces/layout";

import { photoLibraryShowOnlyNotUsedSelector, windowIsXsSelector } from "../_selectors";
// @ts-ignore
import { userRoleIsAdmin } from "__TS/selectors/user";
// @ts-ignore
import { productPhotosSelector } from "__TS/selectors/photo";
// @ts-ignore
import { layoutBlocksListSelector } from "__TS/selectors/layout";

import {
    photoLibraryShowOnlyNotUsedToggleAction,
    showSelectPhotoModalAction,
    showAutoFillModalAction
} from "../_actions";

// @ts-ignore
import { IconAddPhoto, IconAutoplace } from "components/Icons";
import {
     SubBarButton, SubBarDivider, SubBarSpace
    // @ts-ignore
} from "__TS/styles/editor";



interface ISubBarPanelPhoto {
    isThemeLayout?: boolean;
}

/**
 * Компонент суб-меню управления фотографиями
 */
const SubBarPanelPhoto: React.FC<ISubBarPanelPhoto> = ({isThemeLayout}) => {
    const photoLibraryShowOnlyNotUsed = useSelector( photoLibraryShowOnlyNotUsedSelector );
    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const isXs: boolean = useSelector( windowIsXsSelector );
    const photosList: Array<IPhoto> = useSelector( productPhotosSelector );
    const emptyBlocksList: Array<ILayoutBlock> = useSelector( (s) => layoutBlocksListSelector(s, true) );
    const [usedPhotosCount, usedPhotosCountSet] = useState(0);

    const allPhotosIsPlaced = photosList && photosList.length === usedPhotosCount
    const hasNoEmptyBlocks = !emptyBlocksList.length

    // Подсчёт использованных фото
    useEffect(()=>{
        if (photosList && photosList.length) {
            const used = photosList.filter((p)=> p.usedCount) || [];
            usedPhotosCountSet(used.length);
        }
    }, [photosList]);

    // Показать модалку автозаполнения
    const showAutoFillModalHandler = useCallback(() => {
        const unUsed = photosList.filter((p)=> !p.usedCount) || [];
        if (unUsed.length) {
            showAutoFillModalAction({
                photosList: unUsed.map((p) => ({
                    id: p.photoId,
                    src: `${p.url}=h200`
                })),
                emptyBlocksCount: emptyBlocksList.length
            })
        } else console.log('Нет неразмещенных фотографий!')
    }, [photosList])

    // Текст подсказки Автозаполнения
    const  tooltipText = <>
            <p>Заполните автоматически пустые блоки фотографиями из библиотеки</p>
            { (hasNoEmptyBlocks || allPhotosIsPlaced) && <p>
                { hasNoEmptyBlocks ? '(Сейчас пустые блоки отсутствуют)' : allPhotosIsPlaced ? '(Сейчас все фотографии размещены. Удалите пустые блоки или добавьте фотографии)' : '' }
            </p> }
        </>

    return <>
        <SubBarButton onClick={ ()=>showSelectPhotoModalAction(isAdmin && isThemeLayout) }>
            <IconAddPhoto />
            {isXs ? 'Добавить' : 'Добавить фотографии'}
        </SubBarButton>

        <SubBarDivider />

        <SubBarButton isDisabled={!usedPhotosCount} active={ photoLibraryShowOnlyNotUsed } onClick={ photoLibraryShowOnlyNotUsedToggleAction }>
            {/* @ts-ignore */}
            <Checkbox checked={ photoLibraryShowOnlyNotUsed } className={'SubBarButtonCheckbox'}/>
            Скрывать размещённые {usedPhotosCount ? `(${usedPhotosCount})` : null}
        </SubBarButton>

        <SubBarSpace />
        <Tooltip tooltip={tooltipText}
                 styleParent={ { display: 'flex' } }
                 intent="info"
                 placement="bottom">
            <SubBarButton isDisabled={hasNoEmptyBlocks || allPhotosIsPlaced} onClick={ showAutoFillModalHandler }>
                <IconAutoplace/>
                Заполнить
            </SubBarButton>
        </Tooltip>

    </>
};

export default SubBarPanelPhoto;