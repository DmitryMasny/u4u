import React, { memo, useState } from 'react';

import styled, {css} from 'styled-components'
import {COLORS, TextOverflow, getInputIntentColor} from 'const/styles'
import {hexToRgbA} from 'libs/helpers'
import { IconArrowDropDown, IconArrowDropUp } from "components/Icons";
import Tooltip from "components/_forms/Tooltip";
import FilterBtn from 'components/FilterBtn';

/** Styles */
const StyledSelect = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    //max-width: 320px;
    height: ${( { height } ) => height || 40}px;
    padding: 0 10px;
    line-height: 1em;
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    border: ${( { borderWidth } ) => borderWidth || 2}px solid ${( { intent } ) => getInputIntentColor( intent )};
    border-radius: 2px;
    color: ${COLORS.TEXT};
    background: ${COLORS.WHITE};
    appearance: none;
    box-shadow: none;
    cursor: pointer;
    user-select: none;
    transition: box-shadow 100ms cubic-bezier(0.4, 1, 0.75, 0.9);
    max-width: ${({maxWidth})=> maxWidth ? maxWidth : 'inherit'};
    
    &:hover {
        //background: initial;
        box-shadow: 0 0 4px 1px ${({intent})=>getInputIntentColor(intent,  true, .2)};
    }
    &:focus {
        box-shadow: 0 0 0 1px ${({intent})=>getInputIntentColor(intent,  true)}, 0 0 0 3px ${({intent})=>getInputIntentColor(intent,  true, .3)}, inset 0 1px 2px ${hexToRgbA(COLORS.BLACK, .1)}
    }
    &::placeholder {
        opacity: 1;
        color: ${COLORS.MUTE};
    }
    &:not(:first-child) {
        padding-left: 40px;
    }
    &:not(:last-child) {
        padding-right: 40px;
    }
   
    ${({disabled})=> disabled && css`
        box-shadow: none;
        background: ${COLORS.ATHENSGRAY};
        cursor: not-allowed;
        color: ${COLORS.TEXT_MUTE};
        resize: none;
        &:hover{
          box-shadow: none;
        }
    `};
    
    ${({large, small}) => large ? css`
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        &:not(:first-child) {
            padding-left: 50px;
        }
        &:not(:last-child) {
            padding-right: 50px;
        }
        ` : small ? css`
            height: 30px;
            line-height: 30px;
            &:not(:first-child) {
                padding-left: 30px;
            }
            &:not(:last-child) {
                padding-right: 30px;
            }
        ` : ``
    };
    
    .icon {
        margin-right: -10px;
        flex-shrink: 0;
    }
    .iconWrap {
        margin-right: 10px;
    }
`;

const StyledSelectList = styled.div`
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 2px;
    max-width: 450px;
    
    
    ${( { borders, fullHeight } ) => borders && css`
        max-width: initial;
        max-height: ${fullHeight ? 'inherit' : '350px'};
        border-bottom: 2px solid ${COLORS.ATHENSGRAY};
        border-top: 2px solid ${COLORS.ATHENSGRAY};
        padding: 10px 0 5px 10px; 
        ${( { theme } ) => theme.media.md`
            max-height: ${fullHeight ? 'inherit' : '260px'};
        `}
    `}
`;

const StyledTitle = styled( TextOverflow )`
    flex-grow: 1;
`;

const StyledSelectListItem = styled.div`
    display: flex;
    align-items: center;
    padding: ${( { paddingListItem } ) => (paddingListItem || paddingListItem === 0) ? paddingListItem : 10}px;
    color: ${COLORS.TEXT};
    cursor: pointer;
    &:hover {
         color: ${COLORS.TEXT_PRIMARY};
    }
    ${( { active } ) => active && css`color: ${COLORS.TEXT_WARNING}`};
    .iconWrap {
        margin-right: 10px;
    }
`;

// Выпадающий компонент списка
const SelectList = ( { selected, selectedId, list, onSelectItem, grid, borders, large, fullHeight, paddingListItem, calculateListHeight } ) => {

    return <StyledSelectList grid={grid} borders={borders} fullHeight={fullHeight}>
        {list.map((item, i) => grid ?
            <FilterBtn onClick={() => onSelectItem(i)}
                       active={selectedId ? (selectedId == item.id) : (selected === i)}
                       icon={item.icon}
                       title={item.name}
                       rotate={item.isRotated}
                       key={item.id || (item.id === 0 ? 0 : i)}
                       large={large}
            />
            :
            <StyledSelectListItem key={item.id || (item.id === 0 ? 0 : i)}
                                  active={selectedId ? (selectedId === item.id) : (selected === i)}
                                  paddingListItem={paddingListItem}
                                  onClick={() => onSelectItem(i)}>
                {item.icon && <span className="iconWrap">{item.icon}</span>}{item.name}
            </StyledSelectListItem>)}
    </StyledSelectList>;
};

/**
 * Выпадающий список
 * @prop selected             - выбранный по индексу
 * @prop selectedId           - выбранный по id
 * @prop list                 - сам список
 * @prop onSelect             - выбор элемента списка
 * @prop intent               - цвет
 * @prop grid                 - отображение сеткой кнопок
 * @prop showAllGridItems     - отображать сразу весь список
 * @prop fullHeight           - не ограничивать по высоте (при showAllGridItems)
 * @prop maxWidth             - макс ширина select
 * @prop large                - увеличенный размер элементов grid (FilterBtn)
 * @prop calculateListHeight  - высчитывать ли высоту выпадашки, чтобы обрезать последний выдимый элемент для понимая возможности скролла
 */
const Select = memo(props => {
    if ( !props || !props.list ) return null;
    const { selected, selectedId, list, onSelect, intent, grid, showAllGridItems, maxWidth, large, fullHeight, width, disabled, calculateListHeight } = props;
    const [open, setOpen] = useState( false );
    const onSelectItem = key => {
        onSelect( selectedId || selected === undefined ? list[ key ].id : key );
        setOpen(false);
    };

    const selectedItem = (selectedId || selectedId === 0 || selectedId === '') ?
        list.find( ( item ) => item.id === selectedId )
        :
        list[selected];

    if ( disabled ) return <StyledSelect disabled>{selectedItem && selectedItem.name}</StyledSelect>

    const selectList = <SelectList list={list}
                                   selected={selected}
                                   selectedId={selectedId}
                                   paddingListItem={props.paddingListItem}
                                   onSelectItem={onSelectItem}
                                   large={large}
                                   borders={showAllGridItems}
                                   fullHeight={fullHeight}
                                   calculateListHeight={calculateListHeight}
                                   grid={showAllGridItems || grid}/>;

    return showAllGridItems ?
        selectList
        :
        <Tooltip
            placement="bottom"
            trigger="click"
            intent="minimal"
            hideArrow
            tooltip={selectList}
            onVisibilityChange={( isOpen ) => setOpen( isOpen )}
            tooltipShown={open}
        >
            <StyledSelect intent={intent || 'default'} maxWidth={maxWidth} borderWidth={props.borderWidth} height={props.height}>
                {selectedItem && selectedItem.icon && <span className="iconWrap">{selectedItem.icon}</span>}
                <StyledTitle className="selectedTitle">{selectedItem && selectedItem.name}</StyledTitle>
                {open ? <IconArrowDropUp className="icon"/> : <IconArrowDropDown className="icon"/>}
            </StyledSelect>
        </Tooltip>;
});

export default Select;


