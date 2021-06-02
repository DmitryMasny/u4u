// @ts-ignore
import React, {memo, useEffect, useState, useCallback} from 'react';

// @ts-ignore
import FilterBtnProductIcon from 'components/FilterBtnProductIcon';
// @ts-ignore
import {Select, Btn} from 'components/_forms';
import ThemesCategories from './_ThemesCategories';
import ThemesProductTypes from './_ThemesProductTypes';


// @ts-ignore
import { IThemesFilters, IFormatTitle, IFormat } from "__TS/interfaces/themes";


// @ts-ignore
import {useSelector} from "react-redux";
import {
    themesFormatsSelector,
} from "./_selectors";
import { showCreateThemeModalAction} from "./_actions";
import {FiltersStyled, FormatTitleStyled} from "./_styles";


const FORMAT_ICON_SIZE = 30;

/**
 * Название формата
 */
const FormatTitle: React.FC<IFormatTitle> = ({ format }) => (
    <FormatTitleStyled>
        {format.name}
        {/*<div className="size"> ({format.width} x {format.height})</div>*/}
    </FormatTitleStyled>);

/**
 * Адаптер форматов
 */
const formatsAdapter = (formats:  IFormat[]) => {
    let formatsList = [];

    formats.map((f)=>{
        const formatSizesArrayFromName = !f.height && f.name && f.name.split(' x ');
        const formatSizes = formatSizesArrayFromName && {
            w: parseInt(formatSizesArrayFromName[0]),
            h: parseInt(formatSizesArrayFromName[1])
        };

        const iconSizes = {
            aspect: f.height ? f.width/f.height : (formatSizes ? formatSizes.w/formatSizes.h : 0),
            w: 0,  h:0
        };
        if (iconSizes.aspect > 1) {
            iconSizes.w = FORMAT_ICON_SIZE;
            iconSizes.h = Math.round(FORMAT_ICON_SIZE/iconSizes.aspect);
        } else {
            iconSizes.h = FORMAT_ICON_SIZE;
            iconSizes.w = Math.round(FORMAT_ICON_SIZE*iconSizes.aspect);
        }
        const formatItemData = {
            id: f.id,
            name: <FormatTitle format={f}/>,
            icon: iconSizes.aspect && <FilterBtnProductIcon width={iconSizes.w} height={iconSizes.h} type={'poster'}/>,
            width: formatSizes && formatSizes.w || f.width,
            height: formatSizes && formatSizes.h || f.height,
        }
        //TODO: type={'poster'}
        formatsList.push(formatItemData);
        // if ( f.width ===  f.height ) formatsList.push( {...formatItemData, id: f.id + 'r'}); // добавляем  повернутый вариант
    });
    return formatsList.sort((a,b)=> a.height === b.height ? a.width - b.width : a.height - b.height );
}

/**
 * Фильтры галереи тем
 */
const ThemesFilters: React.FC<IThemesFilters> = ({setThemeFilter, themesSelected, isAdmin}) => {

    const formats = useSelector((s)=>themesFormatsSelector(s, themesSelected && themesSelected.productType));     // Форматы из redux state
    const [formatsList, setFormatsList] = useState(null);   // Форматы для выпадающего списка

    // Адаптируем форматы для выпадающего списка
    useEffect(()=>{
        if (formats) setFormatsList(formatsAdapter(formats));
    }, [formats]);

    // Выбираем формат по умолчанию
    useEffect(()=>{
        if (isAdmin){
            if (themesSelected.format) setThemeFilter({format:'0'});
        } else if ( !themesSelected.format && formatsList  && formatsList.length ) setThemeFilter({format: formatsList[0].id});
    }, [formatsList, isAdmin]);

    return (
        <FiltersStyled>
            {isAdmin && <div className="filterGroup">
                <Btn intent={'info'} fill onClick={() => showCreateThemeModalAction(themesSelected && themesSelected.productType)}>Создать тему</Btn>
            </div>}
            <ThemesProductTypes compact setProductTypeAction={(id)=>setThemeFilter({productType: id, format: '0'})} selectedProductType={themesSelected.productType} isAdmin={isAdmin}/>

            {!isAdmin && <div className="filterGroup">
                <div className="filterTitle">Формат:</div>
                <Select list={formatsList}
                        onSelect={id=>setThemeFilter({format: ''+ id})}
                        selectedId={themesSelected.format}
                        calculateListHeight
                />
            </div>}
            <div className="filterGroup">
                <div className="filterTitle">Категории:</div>
                <ThemesCategories setCategoryAction={(id)=>setThemeFilter({category: ''+ id})}
                                  selectedCategory={themesSelected.category}
                                  productType={themesSelected && themesSelected.productType}
                                  isAdmin={isAdmin}/>
            </div>
        </FiltersStyled>
    );

};

export default memo(ThemesFilters);
