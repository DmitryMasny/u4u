import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toast } from '__TS/libs/tools';

import styled from 'styled-components'
import {COLORS} from 'const/styles'
import {EDITOR_SIZES, EDITOR_TABS} from './_config'
import {currentTabSelector, windowIsMobileSelector} from "./_selectors";
import { BtnEditor, SelectEditor, ToggleEditor, BtnEditorText, TextEditor, Divider} from 'const/styles'
import { Btn } from 'components/_forms';

import ColorSwatch from 'components/ColorSwatch'
// import {TYPES} from 'const/types';

import {
    IconSelect, IconSave, IconAddPhoto, IconDelete2, IconEye2, IconRandom,
    IconSave2, IconEffects, IconCpu, IconNavFrames, IconBlockScheme, IconImageCover,
    IconGroup, IconImageFilters,
} from 'components/Icons'
import {modalMyPhotosAction} from 'actions/modals';
import {toggleLibrarySelectionAction} from "./_actions";

/** Styles */
const EditorActionsWrap = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: ${EDITOR_SIZES.ACTION_PANEL}px;
    background-color: ${COLORS.WHITE};
    border-${({isMobile})=>isMobile ? 'top' : 'bottom'}: 1px solid ${COLORS.LINE};
`;
const PackStyled = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    flex-grow: 1;
    padding: 0 5px;
    border-right: 1px solid ${COLORS.LINE};
    &>*{
        margin: 0 5px;
    }
`;

const Toggle = (props) => {
    if (!props.children || !props.children.length) return null;
    return <ToggleEditor>
        <div className="toggleInner">{props.children[0]}</div>
        <div className="toggleInner">{props.children[1]}</div>
    </ToggleEditor>
};

const Stickers = (props) => {
    return <PackStyled>
        <span>7</span>
        <span>8</span>
        <span>9</span>
    </PackStyled>
};
const Frames = (props) => {
    return <PackStyled>
        <span>1</span>
        <span>2</span>
        <span>3</span>
    </PackStyled>
};

const EditorActions = (props) => {
    // const [isLoaded, setIsLoaded] = useState(null);
    const tab = useSelector( state => currentTabSelector( state ) );
    const isMobile = useSelector( state => windowIsMobileSelector( state ) );
    // const selection = useSelector( state => ЧтоВыбраноЮзером( блокФоткаИлиГруппа ) );
    const dispatch = useDispatch();

    const toastExample = () => {
        toast.success("Wow so easy 2 !", {
            onClose: () => toast("Wow so easy !")
        });
    };
    const selection = '';

    let actions = null;
if (selection) {
    switch (selection){
        case 'group':
            actions = <Fragment>
                <TextEditor>
                    Группа
                </TextEditor>

                <BtnEditor onClick={toastExample}>
                    <IconGroup/> <BtnEditorText>Разгруппировать</BtnEditorText>
                </BtnEditor>

                <BtnEditor onClick={toastExample}>
                    <IconDelete2/> <BtnEditorText>Удалить</BtnEditorText>
                </BtnEditor>

                <Divider/>

                <SelectEditor onClick={toastExample} >
                    <IconNavFrames/> <BtnEditorText>Рамка/Маска</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <IconEffects/> <BtnEditorText>Эффекты</BtnEditorText>
                </SelectEditor>
            </Fragment>;
            break;
        case 'block':
            actions = <Fragment>
                <TextEditor>
                    Блок
                </TextEditor>

                <SelectEditor onClick={toastExample}>
                    <IconBlockScheme/> <BtnEditorText>Деление блока</BtnEditorText>
                </SelectEditor>

                <BtnEditor onClick={toastExample}>
                    <IconDelete2/> <BtnEditorText>Удалить блок</BtnEditorText>
                </BtnEditor>

                <Divider/>

                <SelectEditor onClick={toastExample} >
                    <IconNavFrames/> <BtnEditorText>Рамка/Маска</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <IconEffects/> <BtnEditorText>Эффекты</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <ColorSwatch color={'#1278ca'}/> <BtnEditorText>Фон</BtnEditorText>
                </SelectEditor>
            </Fragment>;
            break;
        case 'photo':
            actions = <Fragment>
                <TextEditor>
                    Фотография
                </TextEditor>

                <BtnEditor onClick={toastExample}>
                    <IconEye2/> <BtnEditorText>Просмотр</BtnEditorText>
                </BtnEditor>

                {/*<BtnEditor onClick={toastExample}>
                    <IconImageContent/> <BtnEditorText>Вписать в блок</BtnEditorText>
                </BtnEditor>*/}

                <BtnEditor onClick={toastExample}>
                    <IconImageCover/> <BtnEditorText>Заполнить блок</BtnEditorText>
                </BtnEditor>

                <BtnEditor onClick={toastExample}>
                    <IconDelete2/> <BtnEditorText>Удалить из блока</BtnEditorText>
                </BtnEditor>

                <Divider/>

                <SelectEditor onClick={toastExample} >
                    <IconImageFilters/> <BtnEditorText>Цветокоррекция</BtnEditorText>
                </SelectEditor>
            </Fragment>;
            break;
        case 'text':
            actions = <Fragment>
                <TextEditor>
                    Текст
                </TextEditor>

                <TextEditor>
                    Шрифт
                </TextEditor>
                <TextEditor>
                    Размер
                </TextEditor>
                <TextEditor>
                    Высота строки
                </TextEditor>
                <TextEditor>
                    Позиция по-гор.
                </TextEditor>
                <TextEditor>
                    Позиция по-верт.
                </TextEditor>

                <Divider/>

                <SelectEditor onClick={toastExample} >
                    <IconEffects/> <BtnEditorText>Эффекты</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <ColorSwatch color={'#1278ca'}/> <BtnEditorText>Цвет текста</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <ColorSwatch color={'#1278ca'} disabled/> <BtnEditorText>Цвет фона</BtnEditorText>
                </SelectEditor>

                <BtnEditor onClick={toastExample} >
                    <IconSave2/> <BtnEditorText>Сохранить стиль</BtnEditorText>
                </BtnEditor>
            </Fragment>;
            break;
        case 'bg':
            actions = <Fragment>
                <TextEditor>
                    Фон страницы
                </TextEditor>

                <Divider/>

                <SelectEditor onClick={toastExample} >
                    <IconSave/> <BtnEditorText>Изображение</BtnEditorText>
                </SelectEditor>
                <SelectEditor onClick={toastExample} >
                    <ColorSwatch color={'#1278ca'}/> <BtnEditorText>Цвет</BtnEditorText>
                </SelectEditor>
            </Fragment>;
            break;
        case 'test':
            actions = <Fragment>
                {/*<BtnEditor>
                    <IconBack/> <IconBack2/>
                </BtnEditor>
                <BtnEditor >
                    <IconDelete/> <IconDelete2/>
                </BtnEditor>
                <BtnEditor >
                    <IconEye/> <IconEye2/>
                </BtnEditor>
                <BtnEditor >
                    <IconSave/> <IconSave2/>
                </BtnEditor>*/}
            </Fragment>;
            break;
    }
} else switch (tab){
        case EDITOR_TABS.PHOTOS:
            actions = <Fragment>
                <BtnEditor onClick={() => dispatch(modalMyPhotosAction({show: true}))}>
                    <IconAddPhoto/> <BtnEditorText>Добавить фото</BtnEditorText>
                </BtnEditor>

                <BtnEditor onClick={() => dispatch(toggleLibrarySelectionAction(tab))}>
                    <IconSelect/> <BtnEditorText>Выбрать</BtnEditorText>
                </BtnEditor>

                <BtnEditor onClick={() => toast("Wow so easy !")}>
                    <IconEye2/> <BtnEditorText>Показать неразмещенные</BtnEditorText>
                </BtnEditor>

                <Divider/>

                <BtnEditor onClick={toastExample} >
                    <IconCpu/> <BtnEditorText>Авторазмещение</BtnEditorText>
                </BtnEditor>
            </Fragment>;
            break;

        case EDITOR_TABS.THEMES:
            actions = <Fragment>
                <BtnEditor onClick={(e)=>e.preventDefault()}>
                    <IconAddPhoto/> <BtnEditorText>Добавить фон</BtnEditorText>
                </BtnEditor>

                <BtnEditor onClick={(e)=>e.preventDefault()}>
                    <IconSelect/> <BtnEditorText>Выбрать</BtnEditorText>
                </BtnEditor>

                <Divider/>

                <BtnEditor onClick={(e)=>e.preventDefault()}>
                    <IconRandom/> <BtnEditorText>Случайный фон</BtnEditorText>
                </BtnEditor>
            </Fragment>;
            break;

        case EDITOR_TABS.TEXT:
            actions = <Fragment>
                <TextEditor>
                    Шрифт
                </TextEditor>
                <TextEditor>
                    Размер
                </TextEditor>
                <TextEditor>
                    Высота строки
                </TextEditor>
                <TextEditor>
                    Позиция по-гор.
                </TextEditor>
                <TextEditor>
                    Позиция по-верт.
                </TextEditor>

                <Divider/>

                <SelectEditor onClick={toastExample} >
                    <IconEffects/> <BtnEditorText>Эффекты</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <ColorSwatch color={'#123456'} /> <BtnEditorText>Цвет текста</BtnEditorText>
                </SelectEditor>

                <SelectEditor onClick={toastExample} >
                    <ColorSwatch color={'#123456'} opacity={.5} disabled/> <BtnEditorText>Цвет фона</BtnEditorText>
                </SelectEditor>

                <BtnEditor onClick={toastExample} >
                    <IconSave2/> <BtnEditorText>Сохранить стиль</BtnEditorText>
                </BtnEditor>
            </Fragment>; break;

        case EDITOR_TABS.FRAMES:
            actions = <Fragment>
                <Toggle>
                    <span>Рамки</span>
                    <span>Маски</span>
                </Toggle>

                <Frames/>
            </Fragment>; break;

        case EDITOR_TABS.STICKERS:
            actions = <Stickers/>; break;

        case EDITOR_TABS.TEMPLATES:
            actions = <Fragment>
                <BtnEditor onClick={toastExample} >
                    <IconRandom/> <BtnEditorText>Случайный шаблон</BtnEditorText>
                </BtnEditor>
                <Divider/>

                <BtnEditor onClick={toastExample} >
                    <IconSave2/> <BtnEditorText>Сохранить текущий</BtnEditorText>
                </BtnEditor>
            </Fragment>; break;
        default:
            actions = null; break;
    }

    return <EditorActionsWrap isMobile={isMobile}>
           { actions }
        </EditorActionsWrap>
};

export default EditorActions;