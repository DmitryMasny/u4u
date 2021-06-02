import React, {useState, useEffect, useRef, memo} from 'react';
import {useSelector, useDispatch} from "react-redux";

import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components'
import { useDrag } from 'react-use-gesture'
import { Btn } from 'components/_forms';

import { COLORS} from 'const/styles'
import {EDITOR_SIZES} from './_config'
import {EDITOR_TABS} from './_config'
import TEXT_EDITOR from 'texts/editor'
import {IMAGE_TYPES} from "const/imageTypes";
import {PHOTO_THUMB_SIZE} from "config/main";


import {currentTabSelector, windowIsMobileSelector, getLibrarySelector, getLibrarySelectionSelector} from "./_selectors";
import {getLibraryAction, previewPhotoAction, selectLibraryItemAction} from "./_actions";
import Library from "../Library";
import Spinner from "../Spinner";
import {modalMyPhotosAction} from "actions/modals";


/** Styles */
const EditorLibraryWrap = styled.div`
        position: relative;
        display: flex;
        align-items: flex-start;
        //padding: 0 10px;
        ${({isMobile}) => isMobile ? 'padding-top: 10px;' : 'padding-right: 10px;'};
        width: ${({isMobile}) => isMobile ? '100%' : 'auto'};
        height: ${({isMobile}) => isMobile ? 'auto' : `calc(100% - ${EDITOR_SIZES.HEADER}px - ${EDITOR_SIZES.ACTION_PANEL}px )`};
        background-color: ${COLORS.WHITE};
`,
    EditorLibraryShift = styled.div`
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        top: 0;
        background-color: ${({active}) => active ? COLORS.LINE : COLORS.WHITE};
        transition: background-color 0.1s linear;
        &:hover {
           background-color: ${({active}) => active ? COLORS.LINE : COLORS.ATHENSGRAY}
        }
`,
    EditorLibraryShiftHor = styled(EditorLibraryShift)`
        height: ${EDITOR_SIZES.LIBRARY_SHIFT_SIZE_XS}px;
        width: 100%;
        border-top: 1px solid ${COLORS.LINE};
        border-bottom: 1px solid ${COLORS.LINE};
        cursor: ns-resize;
`,
    EditorLibraryShiftVert = styled(EditorLibraryShift)`
        height: 100%;
        width: ${EDITOR_SIZES.LIBRARY_SHIFT_SIZE}px;
        border-right: 1px solid ${COLORS.LINE};
        border-left: 1px solid ${COLORS.LINE};
        cursor: ew-resize;
`,
    ShiftDots = styled.svg`
        pointer-events: none;
        transition: fill 0.25s;
        fill: ${({active}) => active ? COLORS.NEPAL : COLORS.LINE};
        ${EditorLibraryShift}:hover & {
            fill: ${COLORS.NEPAL};
        }
`;
const EmptyLibrary = styled.div`
    width: 100%;
    color: ${COLORS.TEXT_MUTE};
    text-align: center;
    .text{
      margin: 15px;
    }
`;

const getTypebyTab = (tab) => {
    switch (tab) {
        case EDITOR_TABS.PHOTOS: return IMAGE_TYPES.GPHOTO;
        case EDITOR_TABS.THEMES: return IMAGE_TYPES.THEME_BG;
        default: return null;
    }
};

const EditorLibraryContent = memo(({tab}) => {
    const projectId = 'abrakadabra';
    const content = useSelector(getLibrarySelector(tab));
    const selection = useSelector(getLibrarySelectionSelector(tab)) || false;
    const dispatch = useDispatch();
    const getContent = () => dispatch(getLibraryAction(tab, projectId));


    if (content) {
        if (!content.length){
            if (tab === EDITOR_TABS.PHOTOS) {
                return  <EmptyLibrary>
                    <div className="text">В этот альбом не добавлено ни одной фотографии</div>
                    <Btn intent="primary" onClick={() => dispatch(modalMyPhotosAction({show: true}))}>Добавить фотографии</Btn>
                </EmptyLibrary>;
            } else {
                return  <EmptyLibrary>
                    <div className="text">В этой теме отсутствуют {TEXT_EDITOR[tab.toUpperCase()] || 'элементы'}</div>
                </EmptyLibrary>
            }

        }
        return <Scrollbars >
            <Library
                items={content}
                disabled={false}
                type={getTypebyTab(tab)}
                thumbSize={PHOTO_THUMB_SIZE[0]}
                selectionActive={selection}
                hideSelectBtn={true}
                selectAction={(data) => dispatch(selectLibraryItemAction(tab, data))}
                previewAction={(o) => dispatch(previewPhotoAction(o))}
            />
        </Scrollbars>;
    } else  if (content === null){
        getContent();
        return  <Spinner/>
    }


});

/**
 * Библиотека редактора
 */
const EditorLibraryShifter = memo(({ isMobile, resizeControll, isShifted }) => {
    const bind = useDrag((o) => {
        resizeControll(o);
    });

    return isMobile ?
            <EditorLibraryShiftHor {...bind()}
                active={isShifted}
            >
                <ShiftDots active={isShifted} width="30" height="6" viewBox="0 0 30 6">
                    <path d="M0 0H2V2H0V0Z"/>
                    <path d="M4 0H6V2H4V0Z"/>
                    <path d="M8 0H10V2H8V0Z"/>
                    <path d="M12 0H14V2H12V0Z"/>
                    <path d="M0 4H2V6H0V4Z"/>
                    <path d="M4 4H6V6H4V4Z"/>
                    <path d="M8 4H10V6H8V4Z"/>
                    <path d="M12 4H14V6H12V4Z"/>
                    <path d="M16 0H18V2H16V0Z"/>
                    <path d="M20 0H22V2H20V0Z"/>
                    <path d="M24 0H26V2H24V0Z"/>
                    <path d="M28 0H30V2H28V0Z"/>
                    <path d="M16 4H18V6H16V4Z"/>
                    <path d="M20 4H22V6H20V4Z"/>
                    <path d="M24 4H26V6H24V4Z"/>
                    <path d="M28 4H30V6H28V4Z"/>
                </ShiftDots>
            </EditorLibraryShiftHor>
            :

            <EditorLibraryShiftVert  {...bind()}
                active={isShifted}
            >
                <ShiftDots active={isShifted} width="6" height="30" viewBox="0 0 6 30">
                    <path d="M6 2.62268e-07V2H4V1.74846e-07L6 2.62268e-07Z"/>
                    <path d="M6 4V6L4 6V4L6 4Z"/>
                    <path d="M6 8V10H4V8H6Z"/>
                    <path d="M6 12L6 14H4L4 12H6Z"/>
                    <path d="M2 8.74227e-08L2 2H1.22392e-06L1.31134e-06 0L2 8.74227e-08Z"/>
                    <path d="M2 4L2 6H1.04907e-06L1.1365e-06 4H2Z"/>
                    <path d="M2 8V10H8.74228e-07L9.61651e-07 8H2Z"/>
                    <path d="M2 12V14H6.99382e-07L7.86805e-07 12H2Z"/>
                    <path d="M6 16V18H4V16H6Z"/>
                    <path d="M6 20V22H4V20H6Z"/>
                    <path d="M6 24L6 26H4L4 24H6Z"/>
                    <path d="M6 28V30H4V28H6Z"/>
                    <path d="M2 16L2 18H5.24537e-07L6.11959e-07 16H2Z"/>
                    <path d="M2 20L2 22H3.49691e-07L4.37114e-07 20H2Z"/>
                    <path d="M2 24V26H1.74845e-07L2.62268e-07 24H2Z"/>
                    <path d="M2 28V30H0L8.74229e-08 28H2Z"/>
                </ShiftDots>
            </EditorLibraryShiftVert>
});

/**
 * Библиотека редактора
 */
const EditorLibrary = (props) => {

    // Инициалиализация размеров библтотеки, получение данных из LS
    const lsSizes = useRef( JSON.parse(localStorage.getItem('editor_library')) || null );
    const lsSizesCurrent = lsSizes.current;

    const initW = lsSizesCurrent && lsSizesCurrent.w || EDITOR_SIZES.LIBRARY_WIDTH;
    const initH = lsSizesCurrent && lsSizesCurrent.h || EDITOR_SIZES.LIBRARY_HEIGHT;

    // Ширина библиотеки
    const [libraryWidth, setLibraryWidth] = useState( initW );
    // Высота библиотеки (моб. версия)
    const [libraryHeight, setLibraryHeight] = useState( initH );
    // Изменение размеров библиотеки
    const [isShifted, setIsShifted] = useState(false);
    // Текущий раздел в редакторе
    const tab = useSelector( state => currentTabSelector( state ) );

    // Размеры окна
    const isMobile = useSelector( state => windowIsMobileSelector( state ) );

    // Проверка и поправка размеров библиотеки в допустимых рамках
    const libSizeCheck = ( size ) => {
        const min = isMobile ? EDITOR_SIZES.LIBRARY_MIN_HEIGHT : EDITOR_SIZES.LIBRARY_MIN_WIDTH;
        const max = isMobile ? EDITOR_SIZES.LIBRARY_MAX_HEIGHT : EDITOR_SIZES.LIBRARY_MAX_WIDTH;

        if ( size > min ) {
            if ( size > max ) size = max;

            const maxOfWindowSize = Math.round( window.innerHeight * 0.8 - (isMobile ? 100 : 0)  );
            if ( size > maxOfWindowSize ) size = maxOfWindowSize;

        } else size = min;

        return size;
    };

    // Ресайз библиотеки
    const libraryResizeControll = ( {delta, first, last, down} ) => {
        // delta = down ? delta : [0, 0]; - пример, когда надо вернуть в начальную позицию onDragEnd
        if (first) setIsShifted(true );

        if (isMobile) {
            setLibraryHeight(libSizeCheck( initH - delta[1] ));
        } else {
            setLibraryWidth(libSizeCheck( initW + delta[0] ));}

        if (last) {
            localStorage.setItem('editor_library', JSON.stringify({ w:libraryWidth, h: libraryHeight }));
            lsSizes.current = { w: libraryWidth, h: libraryHeight };
            setIsShifted(false );
        }
    };

    // style для inline-размера
    const libraryStyle = isMobile ? {height: libraryHeight + 'px'} : {width: libraryWidth + 'px'};

    return <EditorLibraryWrap style={libraryStyle} isMobile={isMobile}>
                <EditorLibraryContent tab={tab}/>

                <EditorLibraryShifter
                     isMobile={isMobile}
                     resizeControll={libraryResizeControll}
                     isShifted={isShifted}
                />

            </EditorLibraryWrap>
};

export default EditorLibrary;