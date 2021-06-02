// @ts-ignore
import React, { useState, memo } from 'react';
// @ts-ignore
import styled from 'styled-components';

import EditorLibraryContent from './library/_EditorLibraryContent';
import EditorLibraryShifter from './library/_EditorLibraryShifter';

import { EDITOR_SIZES } from './_config';

// @ts-ignore
import { COLORS } from 'const/styles';

import { setLibraryResizingAction } from './_actions';

//Имя поля в localStore
const LOCAL_STORAGE_NAME = 'editor_library';

/** Interfaces */
interface IProps {
    isMobile: boolean; //мобильный режим или нет
}

interface ILsSize {
    w: number;
    h: number;
}

interface IResizeControl {
    delta: any;
    first: any;
    last: any;
    down: any;
}

/** Styles */
const EditorLibraryWrap = styled( 'div' )`
     position: relative;
     display: flex;
     align-items: flex-start;
     //padding: 0 10px;
     ${ ( { isMobile } ) => isMobile ? 'padding-top: 10px;' : 'padding-right: 10px;' };
     width: ${ ( { isMobile }: IProps ) => isMobile ? '100%' : 'auto' };
     height: ${ ( { isMobile }: IProps ) => isMobile ? 'auto' : '100%' };
     background-color: ${COLORS.SNOWWHITE};
     .editorLibraryContent {
         width: 100%;
         height: 100%;
         z-index: 150;
     }
 `;

// - ${ EDITOR_SIZES.HEADER }px - ${ EDITOR_SIZES.ACTION_PANEL }px )`

/**
 * Функция проверки и поправка размеров библиотеки в допустимых рамках
 * @param size
 * @param isMobile
 */
const libSizeCheck = ( size: number, isMobile: boolean ): number => {
    const min: number = isMobile ? EDITOR_SIZES.LIBRARY_MIN_HEIGHT : EDITOR_SIZES.LIBRARY_MIN_WIDTH;
    const max: number = isMobile ? EDITOR_SIZES.LIBRARY_MAX_HEIGHT : EDITOR_SIZES.LIBRARY_MAX_WIDTH;

    if ( size > min ) {
        if ( size > max ) size = max;

        const maxOfWindowSize: number = Math.round( window.innerHeight * 0.8 - ( isMobile ? 100 : 0 ) );
        if ( size > maxOfWindowSize ) size = maxOfWindowSize;

    } else {
        size = min;
    }

    return size;
};

/**
 * Получение данных о размере библиотеки из LocalStorage
 */
const getLocalStorageData = (): ILsSize => {
    let data: ILsSize = { w: 0, h: 0 };
    try {
        const storeData: ILsSize = JSON.parse( localStorage.getItem( LOCAL_STORAGE_NAME ) );
        if ( storeData ) {
            if ( storeData.w ) data.w = storeData.w;
            if ( storeData.h ) data.h = storeData.h;
        }
    } catch ( err ) {
        console.error( 'Ошибка парсинга localstore editor_library', err );
    }
    return data;
}

/**
 * Компонент библиотеки редактора
 * @param isMobile
 * @private
 */
const _EditorLibrary: React.FC<IProps> = ( { isMobile } ) => {

    // Стартовые размеры (Инициалиализация размеров библиотеки, получение данных из LocalStore)
    const [ initW, setInitW ] = useState<number>( getLocalStorageData().w || EDITOR_SIZES.LIBRARY_WIDTH );
    const [ initH, setInitH ] = useState<number>( getLocalStorageData().h || EDITOR_SIZES.LIBRARY_HEIGHT );

    // Ширина библиотеки
    const [ libraryWidth, setLibraryWidth ] = useState<number>( initW );
    // Высота библиотеки (моб. версия)
    const [ libraryHeight, setLibraryHeight ] = useState<number>( initH );
    // Изменение размеров библиотеки
    const [ isShifted, setIsShifted ] = useState<boolean>( false );

    /**
     * Функция управления ресайзом библиотеки
     * @param delta
     * @param first
     * @param last
     * @param down
     */
    const libraryResizeControl = ( { delta, first, last, down }: IResizeControl ) => {

        // delta = down ? delta : [0, 0]; - пример, когда надо вернуть в начальную позицию onDragEnd
        if ( first ) {
            setIsShifted( true );
            setLibraryResizingAction( true );
        }

        if ( isMobile ) {
            setLibraryHeight( libSizeCheck( libraryHeight - delta[ 1 ], isMobile ) );
        } else {
            setLibraryWidth( libSizeCheck( libraryWidth + delta[ 0 ], isMobile ) );
        }

        if ( last ) {
            localStorage.setItem( LOCAL_STORAGE_NAME, JSON.stringify( { w: libraryWidth, h: libraryHeight } ) );
            setInitW( libraryWidth );
            setInitH( libraryHeight );
            setIsShifted( false );
            setLibraryResizingAction( false );
        }
        return null;
    };

    // style для inline-размера
    const libraryStyle: object = isMobile ? { height: libraryHeight + 'px' } : { width: libraryWidth + 'px' };

    return (<EditorLibraryWrap style={ libraryStyle } isMobile={ isMobile } id={'libraryBlock'}>
                <div className="editorLibraryContent">
                    <EditorLibraryContent />
                </div>

                <EditorLibraryShifter
                    isMobile={ isMobile }
                    resizeControl={ libraryResizeControl }
                    isShifted={ isShifted }
                />

            </EditorLibraryWrap>);
}

export default memo( _EditorLibrary );