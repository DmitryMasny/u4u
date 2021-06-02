// @ts-ignore
import React, {memo, useCallback, useMemo, useState, useEffect} from 'react';

import {StyledThemesGallery, StyledTheme, StyledTags, StyledThemesEmptyGallery} from "./_styles";

// @ts-ignore
import { IThemes, IThemeEl, IThemeTags } from "__TS/interfaces/themes";

// import ImageLoader from "./ImageLoader";
// @ts-ignore
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';


// @ts-ignore
import {IconCheck, IconSelect, IconMove} from "components/Icons";
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';
// @ts-ignore
import ProductPreview from '__TS/components/_misc/ProductPreview';
import { PRODUCT_TYPES_MAP } from "./_config";



// const SvgPublished: React.FC = () =>
//     <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M4.61261 16.4435C4.22661 16.6415 3.78861 16.2945 3.86661 15.8515L4.69661 11.1215L1.17361 7.7655C0.844607 7.4515 1.01561 6.8775 1.45661 6.8155L6.35461 6.1195L8.53861 1.7925C8.73561 1.4025 9.26861 1.4025 9.46561 1.7925L11.6496 6.1195L16.5476 6.8155C16.9886 6.8775 17.1596 7.4515 16.8306 7.7655L13.3076 11.1215L14.1376 15.8515C14.2156 16.2945 13.7776 16.6415 13.3916 16.4435L9.00061 14.1875L4.61161 16.4435H4.61261Z" fill="#2B7ED5"/>
//     </svg>;


// Ярлыки темы
const ThemeTags: React.FC<IThemeTags> = ({published, isAdminPage}) => {
    return(
        <StyledTags>
            {published && isAdminPage && <div className="tag published"><IconSelect/></div>}
        </StyledTags>);
};

// Ручка для сортировки
const SortHandle = SortableHandle(() => {
    return <div className="SortHandle"><IconMove className="icon"/></div>;
});

const getPreviewSizesFromFormatSlug = ( formatSlug ) => {
    const defaultSizes = [{ w: 100, h: 100, x: 0, y: 0 }, { w: 300, h: 300 }];
    if (!formatSlug) return defaultSizes;
    const formatArray = formatSlug.split('_');
    if (!formatArray[1]) return defaultSizes;
    const fWidth = parseInt(formatArray[0] || 0);
    const fHeight = parseInt(formatArray[1] || 0);
    const k = fWidth / fHeight;
    if (!k) return defaultSizes;
    let w=0, h=0, x=0, y=0;
    if ( k > 1) {   //горизонтальные пропорции
        w = 100;
        h = Math.round( fHeight / fWidth * 1000 ) / 10;
        y = Math.round( (100 - h) / .2 ) / 10;
    } else {   //вертикальные пропорции или квадрат
        h = 100;
        w = Math.round( k * 1000 ) / 10;
        x = Math.round( (100 - w) / .2 ) / 10;
    }
    return [{ w: w, h: h, x: x, y: y }, { w: fWidth, h: fHeight }]
};

/**
 * Тема
 */
    // @ts-ignore
const Theme: React.FC<IThemeEl> = SortableElement( ( { data, thumbSize = 200, onClick, disableSort, isAdminPage, formatSlug } ) => {
    const [size, setSize] = useState(getPreviewSizesFromFormatSlug( formatSlug )[0]);
    const [format, setFormat] = useState(getPreviewSizesFromFormatSlug( formatSlug )[1]);

    useEffect(()=>{
        const [size1, format1] =  getPreviewSizesFromFormatSlug( formatSlug );
        setSize(size1);
        setFormat(format1);
    }, [formatSlug]);

    if (!data) return null;
    // console.log('data',data);
    const { preview, selected, disabled, tags, error, name, id, productGroup } = data;

    const onClickItemHandler = ( e ) => {
        // if (disabled) return null;
        onClick({
            data,
            shiftKey: e.shiftKey
        });
    };

    const thumb = useMemo( () => {
        if ( preview ) return <div className="svgWrap">
            <ProductPreview size={ size }
                            svg={ preview }
                            format={ format }
                            svgImageQuality={ thumbSize * 2 }
                            productSlug={ PRODUCT_TYPES_MAP[productGroup || 'decor'] }
            />
        </div>;
        return <div className="noPreview"/>;
    }, [ id, preview, format ] );


    return <StyledTheme
                onClick={onClickItemHandler}
                selected={selected}
                disabled={disabled}
                error={error}
                thumbSize={thumbSize}
                isNamed={!!name}
            >

            {thumb}

            <div className="name" title={name}>{name}</div>

            {/* Чекбокс выделения */ !disabled &&
            <div className="selectionBox">
                {selected ? <IconCheck/> : null}
            </div>}

            {/* Ярлыки */ tags &&
            <ThemeTags {...tags} isAdminPage={isAdminPage}/>
            }
            {/* Якорь для сортировки */ !disableSort &&
            <SortHandle/>
            }
        </StyledTheme>
});

/**
 * Сортируемая обёртка
 */
    // @ts-ignore
const ThemesGallerySortable: React.FC<IThemes> = SortableContainer(({ isAdminPage, disabled, themes, selectionActive, sortable, selectAction, thumbSize, formatSlug } ) => {

    const onClickItemHandler = useCallback(({data, shiftKey}) => {
        selectAction && selectAction({data, shiftKey});
    }, [selectAction]);

    return (
        <StyledThemesGallery disabled={disabled} disableEvents={!selectAction} className={selectionActive ? 'selectionActive' : ''}>
            { (themes && themes.length || false) && themes.map(
                ( item, i ) => {

                    return <Theme
                        data={item}
                        thumbSize={thumbSize}
                        onClick={onClickItemHandler}
                        key={item.id || `index_${i}`}
                        index={i}
                        disableSort={!sortable}
                        isAdminPage={isAdminPage}
                        formatSlug={formatSlug}
                    />
                }
            )}

            {disabled && <Spinner className="spinner" size={50}/>}
        </StyledThemesGallery>
    );
});

/**
 * Библиотека тем
 */
const ThemesGallery: React.FC<IThemes> = ( props ) => {
    if (!props) return null;

    if (!props.themes) return <Spinner size={50} fill/>;
    if (!props.themes.length) return <StyledThemesEmptyGallery>Не найдено тем по заданным параметрам</StyledThemesEmptyGallery>;
    // @ts-ignore
    return <ThemesGallerySortable {...props} useDragHandle={true}/>;
};

export default memo( ThemesGallery );