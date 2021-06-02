/** Import libs */
// @ts-ignore
import React, { useMemo, useState, useCallback } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import { FONTS } from "__TS/fonts/fontConfig";


/** Import components */
import {
    IconsArray, IconsArrayItem, SubBarSector, SubBarButton, SubBarDivider, SubBarSmallHeader,
    FontListItem, TextSVG
    // @ts-ignore
} from "__TS/styles/editor";

import { IconAddText, IconItalic, IconBold,
    IconTextPositionHorizontalLeft, IconTextPositionHorizontalRight, IconTextPositionHorizontalCenter,
    IconTextPositionVerticalTop, IconTextPositionVerticalMiddle, IconTextPositionVerticalBottom,
    IconBack,
// @ts-ignore
} from 'components/Icons';
// @ts-ignore
import { Tooltip, Select } from "components/_forms";
// @ts-ignore
import SelectSlider from '__TS/components/_misc/SelectSlider';
import SelectSliderDropDown, { SelectSlideDropDownAuto } from "./_SelectSlider"
import Color from "./_ColorPicker";
import MultilinePanel from "./_MultilinePanel";

/** Import selectors */
import {
    currentControlElementIdSelector,
    currentControlElementTypeSelector,
    selectedAreaSelector, windowIsMobileSelector
} from "../_selectors";
import {
    contentLayoutByBlockIdSelector,
    fontBgColorByContentIdSelector,
    fontBorderRadiusByContentIdSelector,
    fontColorByContentIdSelector,
    fontFamilyIdByContentIdSelector,
    fontFontByContentIdSelector,
    fontFontStrokeColorByContentIdSelector,
    fontFontStrokeSizeByContentIdSelector,
    fontHorizontalByContentIdSelector,
    fontItalicByContentIdSelector,
    fontLineHeightByContentIdSelector,
    fontSizeByContentIdSelector,
    fontVerticalByContentIdSelector
    // @ts-ignore
} from "__TS/selectors/layout";

/** Import actions */
// @ts-ignore
import { addTextToPageAction, updateTextContentAction } from "__TS/actions/layout";

/** Import interfaces */
// @ts-ignore
import { ILayoutColor, ILayoutContentText } from "__TS/interfaces/layout";
import { setControlElement } from "../_actions";

/**
 * Компонент выбора шрифта
 * @constructor
 */
const FontSelectList = ( { selectedId } ) => {
    //сохраням список построенный список шрифтов в переменной
    const fontsList = useMemo( () =>
        FONTS.map( fontItem => {
                return {
                    id: fontItem.id,
                    name: ( () =>
                            <FontListItem>
                                <svg width={ 140 } height={ 24 } viewBox="0 0 140 24" xmlns="http://www.w3.org/2000/svg">
                                    <TextSVG  fontSize={ 16 }
                                              fontFamily={ fontItem.name }
                                              fontUrl={ fontItem.types.regular.font}
                                              alignmentBaseline="middle"
                                              textAnchor="start"
                                              x={ 0 }
                                              y={ 14 }
                                    >{ fontItem.title }</TextSVG>
                                </svg>
                            </FontListItem>
                    )()
                }
            }
        ), [] );

    // @ts-ignore
    return useMemo( () => <Select list={ fontsList }
                                  selectedId={ selectedId }
                                  borderWidth={ 1 }
                                  onSelect={ id => updateTextContentAction( { fontId: id } ) } height={ 36 }
                                  paddingListItem={ 0 }/>, [ selectedId ] );
};

/**
 * Компонент выбора размера тени
 * @constructor
 */
const TextShadow = ( { selectedId } ) => {
    const shadowSizes = useMemo( () => {
            //генерим массив размеров
            // @ts-ignore
            const sizesArr = Array.from( Array( 55 ), ( _, i ) => i );

            return sizesArr.map( size => ( {
                id: size,
                name: <FontListItem>{ size }</FontListItem>
            } ) );
        },
        [] );

    // @ts-ignore
    return useMemo( () => <Select list={ shadowSizes }
                                  selectedId={ selectedId }
                                  borderWidth={ 1 }
                                  onSelect={ id => updateTextContentAction( { shadowSize: id } ) }
                                  height={ 36 }
                                  paddingListItem={ 0 }/>, [ selectedId ] );
}

/**
 * Компонент выбора размера отступа от текста
 * @constructor
 */
const TextPadding = ( { selectedId } ) => {
    const paddingSizes = useMemo( () => {
            //генерим массив размеров
            // @ts-ignore
            const sizesArr = Array.from( Array( 50 ), ( _, i ) => i );

            return sizesArr.map( size => ( {
                id: size,
                name: <FontListItem>{ size }</FontListItem>
            } ) );
        },
        [] );
    // @ts-ignore
    return useMemo( () => <Select list={ paddingSizes }
                                  selectedId={ selectedId }
                                  borderWidth={ 1 }
                                  onSelect={ id => updateTextContentAction( { padding: id } ) }
                                  height={ 36 }
                                  paddingListItem={ 0 }/>, [ selectedId ] );
}


/**
 * Компонент выбора начертания
 * @constructor
 */
const TextStyle = ( { isBold, isItalic } ) => {
    return useMemo( () =>
        <IconsArray>
            <Tooltip trigger={ 'hover' } tooltip={ 'Курсив' } placement="bottom" styleParent={ { display: 'flex' } }>
                <IconsArrayItem active={ isItalic }
                                onClick={ () => updateTextContentAction( { italic: !isItalic } ) }><IconItalic/></IconsArrayItem>
            </Tooltip>
            <Tooltip trigger={ 'hover' } tooltip={ 'Жирный' } placement="bottom" styleParent={ { display: 'flex' } }>
                <IconsArrayItem active={ isBold }
                                onClick={ () => updateTextContentAction( { bold: !isBold } ) }><IconBold/></IconsArrayItem>
            </Tooltip>
        </IconsArray>, [ isBold, isItalic ] );
}

/**
 * Компонент выбора положения текста по горизонтали
 * @constructor
 */
const TextHorizontalPosition = ( { position } ) => {
    return useMemo( () => <IconsArray>
        <Tooltip trigger={ 'hover' } tooltip={'Выравнивание по левому краю'} placement="bottom" styleParent={ { display: 'flex' } }>
            <IconsArrayItem active={ position === 'left' }
                            onClick={ () => updateTextContentAction( { horizontal: 'left' } ) }><IconTextPositionHorizontalLeft /></IconsArrayItem>
        </Tooltip>
        <Tooltip trigger={ 'hover' } tooltip={'Выравнивание по центру'} placement="bottom" styleParent={ { display: 'flex' } }>
            <IconsArrayItem active={ position === 'center' }
                            onClick={ () => updateTextContentAction( { horizontal: 'center' } ) }><IconTextPositionHorizontalCenter /></IconsArrayItem>
        </Tooltip>
        <Tooltip trigger={ 'hover' } tooltip={'Выравнивание по правому краю'} placement="bottom" styleParent={ { display: 'flex' } }>
            <IconsArrayItem active={ position === 'right' }
                            onClick={ () => updateTextContentAction( { horizontal: 'right' } ) }><IconTextPositionHorizontalRight /></IconsArrayItem>
        </Tooltip>
    </IconsArray>, [ position ] );
}

/**
 * Компонент выбора положения текста по вертикали
 * @constructor
 */
const TextVerticalPosition = ( { position } ) => {
    return useMemo( () => <IconsArray>
        <Tooltip trigger={ 'hover' } tooltip={'Выравнивание по верхней границе'} placement="bottom" styleParent={ { display: 'flex' } }>
            <IconsArrayItem active={ position === 'top' }
                            onClick={ () => updateTextContentAction( { vertical: 'top' } ) }><IconTextPositionVerticalTop /></IconsArrayItem>
        </Tooltip>
        <Tooltip trigger={ 'hover' } tooltip={'Выравнивание по центру'} placement="bottom" styleParent={ { display: 'flex' } }>
            <IconsArrayItem active={position === 'middle'}
                            onClick={ () => updateTextContentAction( { vertical: 'middle' } ) }><IconTextPositionVerticalMiddle /></IconsArrayItem>
        </Tooltip>
        <Tooltip trigger={ 'hover' } tooltip={'Выравнивание по нижней границе'} placement="bottom" styleParent={ { display: 'flex' } }>
            <IconsArrayItem active={position === 'bottom'}
                            onClick={ () => updateTextContentAction( { vertical: 'bottom' } ) }><IconTextPositionVerticalBottom /></IconsArrayItem>
        </Tooltip>
    </IconsArray>, [ position ] );
}


/**
 * Компонент суб-меню управления текстом
 */
const SubBarPanelText: React.FC = () => {
    const selectedArea: number = useSelector( selectedAreaSelector );
    const currentControlElementId: string | number = useSelector( currentControlElementIdSelector );
    const currentControlElementType: string = useSelector( currentControlElementTypeSelector );
    const contentLayout: ILayoutContentText = useSelector( state => contentLayoutByBlockIdSelector( state, currentControlElementId ) );
    const isMobile: boolean = useSelector( windowIsMobileSelector );

    const layoutId = contentLayout && contentLayout.id;

    const currentFontFamilyId: number = useSelector( state => fontFamilyIdByContentIdSelector( state, layoutId ) );
    const currentFontSize: number = useSelector( state => fontSizeByContentIdSelector( state, layoutId ) );
    const currentFontLineHeight: number = useSelector( state => fontLineHeightByContentIdSelector( state, layoutId ) );

    const currentFontBold: boolean = useSelector( state => fontFontByContentIdSelector( state, layoutId ) );
    const currentFontItalic: boolean = useSelector( state => fontItalicByContentIdSelector( state, layoutId ) );

    const currentFontHorizontal: string = useSelector( state => fontHorizontalByContentIdSelector( state, layoutId ) );
    const currentFontVertical: string = useSelector( state => fontVerticalByContentIdSelector( state, layoutId ) );

    const currentFontColor: ILayoutColor = useSelector( state => fontColorByContentIdSelector( state, layoutId ) );
    const currentFontBg: ILayoutColor = useSelector( state => fontBgColorByContentIdSelector( state, layoutId ) );
    const currentFontBorderRadius: number = useSelector( state => fontBorderRadiusByContentIdSelector( state, layoutId ) );

    // const currentFontPadding: number = useSelector( state => fontPaddingByContentIdSelector( state, layoutId ) );
    // const currentFontShadowSize: number = useSelector( state => fontFontShadowSizeByContentIdSelector( state, layoutId ) );
    // const currentFontShadowColor: ILayoutColor = useSelector( state => fontFontShadowColorByContentIdSelector( state, layoutId ) );

    const currentFontStrokeSize: number = useSelector( state => fontFontStrokeSizeByContentIdSelector( state, layoutId ) );
    const currentFontStrokeColor: ILayoutColor = useSelector( state => fontFontStrokeColorByContentIdSelector( state, layoutId ) );

    const isDisabled = currentControlElementType !== 'text';

    const addTextToPage = useCallback( () => {
        addTextToPageAction( { areaNumber: selectedArea } );
    }, [ selectedArea ] )

    const deselectElement = () => setControlElement( { blockId: 0, blockType: '' } );

    return <>
        { isMobile ?
            (isDisabled ?
                <SubBarButton onClick={ addTextToPage } grow>
                    <IconAddText/>
                    Добавить текст
                </SubBarButton>
                :
                <SubBarButton onClick={ deselectElement }>
                    <IconBack/>
                </SubBarButton>
            ) :
            <>
                <SubBarButton onClick={ addTextToPage } >
                    <IconAddText/>
                    Добавить текст
                </SubBarButton>
                <SubBarDivider/>
            </>
        }

        { (!isMobile || !isDisabled) && <MultilinePanel disabled={ isDisabled }>
            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Шрифт</SubBarSmallHeader>
                <FontSelectList selectedId={ currentFontFamilyId || 1 }/>
            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Размер</SubBarSmallHeader>
                <SelectSlider xParams={ { value: currentFontSize || 10, min: 5, max: 300 } }
                              debounce={ 0 }
                              width={ 65 }
                              InnerDrawComponent={ SelectSliderDropDown }
                              callBackFunction={ ( { x } ) => updateTextContentAction( { fontSize: x } ) }
                />


            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Высота строки</SubBarSmallHeader>
                <SelectSlider xParams={ { value: currentFontLineHeight || 1.14, min: 0, max: 3, step: 0.01 } }
                              debounce={ 0 }
                              width={ 65 }
                              InnerDrawComponent={ SelectSlideDropDownAuto }
                              callBackFunction={ ( { x } ) => updateTextContentAction( { lineHeight: x } ) }
                />

            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Начертание</SubBarSmallHeader>
                <TextStyle isBold={ currentFontBold } isItalic={ currentFontItalic }/>
            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Выравнивание</SubBarSmallHeader>
                <TextHorizontalPosition position={ currentFontHorizontal }/>
            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Позиция по-верт.</SubBarSmallHeader>
                <TextVerticalPosition position={ currentFontVertical }/>
            </SubBarSector>

            <SubBarDivider/>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Цвет</SubBarSmallHeader>
                <Color colorInvoice={ currentFontColor } type="text"/>
            </SubBarSector>

            <SubBarDivider/>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Обводка</SubBarSmallHeader>
                <SelectSlider xParams={ { value: currentFontStrokeSize || 0, min: 0, max: 300, } }
                              debounce={ 0 }
                              width={ 55 }
                              InnerDrawComponent={ SelectSliderDropDown }
                              callBackFunction={ ( { x } ) => updateTextContentAction( { strokeWidth: x } ) }
                />
            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled || !currentFontStrokeSize }>
                <SubBarSmallHeader>Цвет&nbsp;обводки</SubBarSmallHeader>
                <Color colorInvoice={ currentFontStrokeColor } type="strokeColor"/>
            </SubBarSector>
            {/*
                                <SubBarSector align={'start'} isDisabled={isDisabled}>
                                    <SubBarSmallHeader>Тень</SubBarSmallHeader>
                                    <TextShadow selectedId={ currentFontShadowSize || 0 }/>
                                </SubBarSector>

                                <SubBarSector align={ 'start' } isDisabled={ isDisabled || !currentFontShadowSize }>
                                    <SubBarSmallHeader>Цвет&nbsp;тени</SubBarSmallHeader>
                                    <Color colorInvoice={currentFontShadowColor} type="shadowColor" />
                                </SubBarSector>
                            */ }
            <SubBarDivider/>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled }>
                <SubBarSmallHeader>Фон</SubBarSmallHeader>
                <Color colorInvoice={ currentFontBg } type="bgColor"/>
            </SubBarSector>

            <SubBarSector align={ 'start' } isDisabled={ isDisabled || !currentFontBg || !currentFontBg.a }>
                <SubBarSmallHeader>Скругление</SubBarSmallHeader>
                <SelectSlider xParams={ { value: currentFontBorderRadius || 0, min: 0, max: 300, } }
                              debounce={ 0 }
                              width={ 55 }
                              InnerDrawComponent={ SelectSliderDropDown }
                              callBackFunction={ ( { x } ) => updateTextContentAction( { borderRadius: x } ) }
                />
            </SubBarSector>
        </MultilinePanel>
        }
    </>
};

export default SubBarPanelText;