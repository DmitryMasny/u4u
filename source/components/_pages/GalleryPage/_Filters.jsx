import React, { Component, memo } from 'react';

//import s from './GalleryPage.scss';
import styled, { css } from 'styled-components';

import {hexToRgbA} from "libs/helpers";

import {COLORS} from 'const/styles'
import FilterBtnProductIcon from 'components/FilterBtnProductIcon';
import Tooltip from 'components/_forms/Tooltip';

import Select from 'components/_forms/Select';

import TEXT from 'texts/main';
import TEXT_GALLERY from 'texts/gallery';


const FilterBtnDiv = styled('div')`
    margin: 0 5px 0 0;
    padding: 1px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
        background-color: ${hexToRgbA(COLORS.PRIMARY, .1)};
    }
    ${({active})=>active && css`
        background-color: transparent;
        cursor: default;
    `};        
`;

const FilterBlockDiv = styled('div')`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 50px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;//$main-margin-bottom;
        &.compact {
            .filter {
                &-group {
                    flex-wrap: wrap;
                }
                &-title {
                    width: 100%;
                }
            }
        }    
`;
const FiltersDiv = styled('div')`
        display: flex;
        width: 100%;
`;
const FiltersGroupDiv = styled('div')`
        display: flex;
        align-items: center;
        height: 50px;//$gallery-filters-height;
        margin-right: 20px;//$gallery-filters-group-margin;
`;
const FiltersTitleSpan = styled('span')`
        display: flex;
        align-items: center;
        font-size: 18px;
        text-transform: uppercase;
        height: 50px;//$gallery-filters-height;
        margin-right: 10px; //$gallery-filters-btn-margin*2;
`;
/**
 * Кнопка фильтра
 */
class FilterBtn extends Component {

    handlerSelectFormat = ( format, isDisabled ) => {
        if (isDisabled) return;

        const { formatId } = this.props.productsSelected;
        if (format !== formatId ) {
            this.props.setFormatSelected( format );
        }
    };

    render() {
        const {tooltip, active, disabled, id, width, height } = this.props;
        return <Tooltip tooltip={tooltip} placement="top">
                    <FilterBtnDiv active={active} onClick={()=>this.handlerSelectFormat( id, disabled )}>
                        <FilterBtnProductIcon width={width}
                                height={height}
                                filled={false}
                                isDisabled={disabled}
                                active={active}/>
                    </FilterBtnDiv>
               </Tooltip>;


    }
}

const filtersDataFormat = {
    title: TEXT.FORMAT,
    options: [
        { id: 2, w: 20, h: 20, tooltip: '20x20', name: 'SQUARE' },     //20x20 fmt 2
        { id: 4, w: 20, h: 30, tooltip: '20x30', name: 'VERTICAL' },   //20x30 fmt 4
        { id: 3, w: 30, h: 20, tooltip: '30x20', name: 'HORIZONTAL' }, //30x20 fmt 3
        { id: 5, w: 30, h: 30, tooltip: '30x30', name: 'SQUARE' },     //30x30 fmt 5
    ]
};

/**
 * Фильтры галереи тем
 */
const Filters = memo(props => {
    const {
        productsSelected: { formatId, id },
        setFormatSelected,
        productsList,
        getAvailableFormatsBySelectedProductOnlyIdsArray: availableFormats,
        setProductTypeSelected,
        productsSelected
    } = props;

    return (
        <FilterBlockDiv>
            <FiltersDiv>
                <FiltersGroupDiv>
                    <FiltersTitleSpan>{filtersDataFormat.title}:</FiltersTitleSpan>

                    {filtersDataFormat.options.map( ( item, key ) => {
                        return <FilterBtn key={key}
                                          tooltip={`${TEXT_GALLERY[item.name]} ${item.tooltip} см.`}
                                          active={item.id === formatId}
                                          disabled={!~availableFormats().indexOf( item.id )}
                                          setFormatSelected={setFormatSelected}
                                          id={item.id}
                                          width={item.w}
                                          height={item.h}
                                          productsSelected={productsSelected}
                        />;
                    } )}

                </FiltersGroupDiv>
            </FiltersDiv>
            <Select
                list={productsList}
                selectedId={id}
                onSelect={setProductTypeSelected}
            />
        </FilterBlockDiv>
    );

});

export default Filters;
