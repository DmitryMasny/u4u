// @ts-ignore
import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import styled, { css } from 'styled-components';
// @ts-ignore
import {hexToRgbA} from 'libs/helpers';
// @ts-ignore
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';

import { selectedAreaIdSelector } from './_selectors';
// @ts-ignore
import { productLayoutAreasListSelector, productLayoutFormatSizeSelector, productLayoutGroupSlugSelector, productLayoutSlug } from "__TS/selectors/layout";

import { saveAreasOrderAction, setAreaSelectedAction } from "./_actions";
// @ts-ignore
import { getPagesStructure, IPageStructurePage } from "__TS/products/pagesTypes";

// @ts-ignore
import { generatePagePreview } from 'components/LayoutConstructor/areaPreview';
// @ts-ignore
import { IconChevronLeft, IconChevronRight } from 'components/Icons';
// @ts-ignore
import { Btn } from 'components/_forms';

// @ts-ignore
import { COLORS, TextOverflow, StyledScrollbar } from 'const/styles';

// @ts-ignore
import { EDITOR_SIZES } from './_config'

/**
 * Interfaces
 */
interface IPagesTypes {
    name: string;
    disableMove: boolean;
}
interface Iscroll {
    current: number;
    total: number;
    showLeftArrow: boolean;
    showRightArrow: boolean;
}

/**
 * Styles
 */

const EditorPageSliderWrapper = styled( 'div' )`
    position: absolute;
    display: flex;
    width: 100%;
    bottom: 0;
    height: ${EDITOR_SIZES.PAGES_HEIGHT}px;
    ${({isMobile})=>isMobile && css`
        bottom: auto;
        top: 0;
        height: ${EDITOR_SIZES.PAGES_MOBILE_HEIGHT}px;
    `};
`;

const EditorPageSliderContainer = styled( 'div' )`
    position: relative;
    height: ${EDITOR_SIZES.PAGES_HEIGHT}px;
    width: 100%;
    // .arrow {
    //   position: absolute;
    //   display: flex;
    //   align-items: center;
    //   top: 0;
    //   bottom: 15px;
    //   fill: #fff;
    //   z-index: 25;
    //   pointer-events: none; // TODO
    //   overflow: hidden;
    //   cursor: pointer;
    //   transition: opacity .2s ease-out;
    //   &:before {
    //     content: '';
    //     display: block;
    //     position: absolute;
    //     width: 50px;
    //     height: 50px;
    //     border-radius: 50%;
    //     background-color: ${hexToRgbA(COLORS.TEXT, .2)};
    //     z-index: -1;
    //     transition: background-color .2s ease-out;
    //   }
    //   &:hover {
    //     &:before {
    //         background-color: ${hexToRgbA( COLORS.TEXT_INFO, .5)};
    //     }
    //   }
    //   &.left {
    //       left: 0;
    //       opacity: ${({scroll}: {scroll: Iscroll})=> scroll.showLeftArrow ? 1 : 0};
    //       padding-right: 10px;
    //       &:before {
    //         left: -25px;
    //       }
    //   }
    //   &.right {
    //       right: 0;
    //       opacity: ${({scroll}: {scroll: Iscroll})=> scroll.showRightArrow ? 1 : 0};
    //       padding-left: 10px;
    //       &:before {
    //         right: -25px;
    //       }
    //   }
    // }
    .smooth {
      position: absolute;
      display: flex;
      align-items: center;
      top: 1px;
      bottom: 16px;
      z-index: 25;
      pointer-events: none;
      transition: opacity .2s ease-out;
      width: 50px;
      &.left {
          left: 0;
          opacity: ${({scroll}: {scroll: Iscroll})=> scroll.showLeftArrow ? 1 : 0};
          background: linear-gradient(90deg, ${hexToRgbA(COLORS.SNOWWHITE, .9)} 1%, ${hexToRgbA(COLORS.SNOWWHITE, .01)} 100%);
      }
      &.right {
          right: 0;
          opacity: ${({scroll}: {scroll: Iscroll})=> scroll.showRightArrow ? 1 : 0};
          background: linear-gradient(90deg, ${hexToRgbA(COLORS.SNOWWHITE, .01)} 1%, ${hexToRgbA(COLORS.SNOWWHITE, .9)} 100%);
      }
    }
`;
const ScrollContainer = styled( StyledScrollbar )`
        display: flex;
        flex-grow: 1;
        height: ${EDITOR_SIZES.PAGES_HEIGHT}px;
        background-color: ${ COLORS.SNOWWHITE };
`;

const PageSliderBtn = styled( Btn )`
    height: 100%;
    border-radius: 0;
    &:hover{
        background-color: #fff;
    }
`;


const Page = styled( 'div' )`
        display: inline-block;
        height: ${ EDITOR_SIZES.PAGES_LAYOUT_HEIGHT }px;
        width: ${ ( { pageWidth } ) => pageWidth }px;
        box-shadow: 1px 2px 3px ${hexToRgbA(COLORS.TEXT, .22)};
`;

const EditorPageSliderItem = styled( 'div' )`
    padding: ${ EDITOR_SIZES.PAGES_PAGE_MARGIN }px;
    font-size: 0;
    z-index: 10;
`;
const SliderItemPageWrap = styled( 'div' )`
    height: ${ EDITOR_SIZES.PAGES_PAGE_HEIGHT }px;
    min-width: ${ Math.max(EDITOR_SIZES.PAGES_PAGE_HEIGHT / 2, 55) }px;
    text-align: center;
    border-radius: 2px;
    padding: ${ EDITOR_SIZES.PAGES_PAGE_PADDING - 2 }px;
    border: 2px solid transparent;
    background-color: transparent;
    transition: border-color .2s ease-out, background-color .2s ease-out;
    cursor: pointer;
    ${ ( { selected } ) => selected ? css`      
        border-color: ${COLORS.WARNING};
        background-color: ${COLORS.WHITE};
    ` : css`
        &:hover{
            border-color: ${COLORS.NEPAL};
            background-color: ${hexToRgbA(COLORS.WHITE,.3)};
        }
    ` };    
`;

const PageName = styled( 'div' )`
    display: flex;
    justify-content: center;
    align-items: center; 
    text-align: center;
    width: ${ ( { pageWidth } ) => pageWidth }px;
    min-width: 100%;
    margin-top: 1px;
    margin-bottom: -3px;
    height: ${ EDITOR_SIZES.PAGES_TITLE_HEIGHT + 2 }px;
    font-size: ${ EDITOR_SIZES.PAGES_TITLE_SIZE }px;
    color: ${COLORS.MUTE};
    z-index: 1;
    ${ ( { selected } ) => selected && css`
        color: ${COLORS.TEXT};
   `};
`;

/*
const PageDragHandle = styled( 'span' )`
    position: absolute;
    right: 3px;
    top: 3px;
    color:#fff;
    font-size: 20px;     
`;*/


const PageItem = ( { areaId, selected, pageWidth }: { areaId: string, selected: boolean, pageWidth: number } ) => {
    // @ts-ignore
    const areaPage = generatePagePreview( null, areaId );

    return <Page selected={ selected }
                 pageWidth={ pageWidth }
                 dangerouslySetInnerHTML={{ __html: areaPage }} />
};

//const DragHandle = sortableHandle( () => <PageDragHandle></PageDragHandle> );

const SortableItem = SortableElement( ( { areaId, selected, pageWidth, num, name }: { areaId: string, selected: boolean, pageWidth: number, num: number, name: string } ) => {

    const setAreaSelected = useCallback( () => {
        setAreaSelectedAction( num );
    }, [] );

    return (
        <EditorPageSliderItem>
            <SliderItemPageWrap onClick={ setAreaSelected } selected={selected}>
                {/*<DragHandle />*/ }
                <PageItem areaId={ areaId } selected={ selected } pageWidth={ pageWidth }/>
                <PageName pageWidth={ pageWidth } selected={ selected }>
                    <TextOverflow title={name}>{ name }</TextOverflow>
                </PageName>
            </SliderItemPageWrap>
        </EditorPageSliderItem>
    )
});

const SortableBlock = SortableContainer( ( { areas, selectedAreaId, pageWidth, areasTypes }: { areas: string[], selectedAreaId: string, pageWidth: number, areasTypes: IPagesTypes[] } ) => {
    const [scroll, setScroll] = useState<Iscroll>({
        current: 0, total: 0, showLeftArrow: false, showRightArrow: false
    })
    const containerRef = useRef(null)

    const updateScrollHandler = useCallback(()=>{
        if ( containerRef && containerRef.current ) {
            const current = containerRef.current.scrollLeft,
                total = containerRef.current.scrollWidth - containerRef.current.clientWidth
            setScroll( {
                current, total,
                showLeftArrow: current > 10,
                showRightArrow: (total - current) > 10,
            } )
        }
    }, [containerRef && containerRef.current])

    // const setContainerScroll = useCallback(( isRight: boolean = false ) => {
    //     let preventScroll = () => {};
    //     const
    //         scrollInitial = scroll.current,
    //         scrollSize = 100,
    //         scrollDuration = 300,
    //         scrollStep = Math.PI / (scrollDuration / 15),
    //         cosParameter = scrollSize / 2,
    //         sign = isRight ? 1 : -1;
    //     let
    //         scrollCount = 0,
    //         scrollTo = scroll.current + scrollSize * sign,
    //         scrollMargin;
    //
    //     if (scrollTo > scroll.total) scrollTo = scroll.total;
    //     if (scrollTo < 0) scrollTo = 0;
    //
    //     const scrollInterval = setInterval( function () {
    //
    //         if ( containerRef.current.scrollLeft !== scrollTo ) {
    //             scrollCount = scrollCount + 1;
    //             scrollMargin = (cosParameter - cosParameter * Math.round(Math.cos( scrollCount * scrollStep )*1000)/1000);
    //             if ( scrollMargin === 0 ) clearInterval( scrollInterval );
    //
    //             containerRef.current.scrollLeft = scrollInitial + scrollMargin * sign;
    //         }
    //         else {
    //             document.removeEventListener( 'wheel', preventScroll );
    //             document.removeEventListener( 'touchmove', preventScroll );
    //             clearInterval( scrollInterval );
    //             updateScrollHandler()
    //         }
    //     }, 15 );
    //
    //     preventScroll = () => {
    //         clearInterval( scrollInterval )
    //         updateScrollHandler()
    //     }
    //     document.addEventListener('wheel', preventScroll, {passive: false}); // Disable scrolling in Chrome
    //     document.addEventListener('touchmove', preventScroll, { passive: false }); // Disable scrolling on mobile
    //
    // }, [containerRef && containerRef.current, scroll])

    useEffect(()=>{
        if (containerRef && containerRef.current && !scroll.total) updateScrollHandler();
    }, [containerRef && containerRef.current])

    return (
        <EditorPageSliderContainer scroll={scroll}>
            <ScrollContainer ref={containerRef} onScroll={updateScrollHandler}>
            { areas.map( ( areaId, index ) =>
                <SortableItem key={ `area-${ index }` }
                              selected={ areaId === selectedAreaId }
                              index={ index }
                              num={index + 1}
                              name={ areasTypes[ index ].name }
                              pageWidth={ pageWidth }
                              areaId={ areaId }
                              disabled={areasTypes[ index ].disableMove}
                />
            )}
            </ScrollContainer>
            {scroll.total && <>
                <div className="smooth left"/>
                <div className="smooth right"/>
                {/*<div className="arrow left" ><IconChevronLeft/></div>*/}
                {/*<div className="arrow right" ><IconChevronRight/></div>*/}
            </>}
        </EditorPageSliderContainer>
    );
});

const EditorPageSlider = ( { isMobile }: { isMobile: boolean } ) => {
    const productLayoutAreasList = useSelector( productLayoutAreasListSelector );
    const productLayoutFormatSize = useSelector( productLayoutFormatSizeSelector );
    const selectedAreaId = useSelector( selectedAreaIdSelector );
    const productLayoutGroupSlug: string = useSelector( productLayoutGroupSlugSelector );
    const productLayout_Slug: string = useSelector( productLayoutSlug );

    //расчет размер одного блока страницы
    const pageWidth = useMemo( () => {
        const proportion = productLayoutFormatSize.width / productLayoutFormatSize.height;
        return EDITOR_SIZES.PAGES_LAYOUT_HEIGHT  * proportion
        // return (isMobile ? EDITOR_SIZES.PAGES_MOBILE_LAYOUT_HEIGHT : EDITOR_SIZES.PAGES_LAYOUT_HEIGHT ) * proportion
    }, [ productLayoutFormatSize.width, productLayoutFormatSize.height, isMobile ] );

    const areasTypes: IPagesTypes[] = useMemo( () => {
        const areasTypesList: IPageStructurePage = getPagesStructure( { productSlug: productLayoutGroupSlug || productLayout_Slug  } ),
              areasTypesAreas = areasTypesList && areasTypesList.areas;

        // @ts-ignore
        return productLayoutAreasList.map( ( item, index: number ): IPagesTypes => {
            let name: string | null = null,
                disableMove: boolean = false;

            const areaT: IPageStructurePage | null = areasTypesAreas && areasTypesAreas[ index.toString() ] || null;

            if ( areaT ) {
                if ( areaT.type !== 'empty') {
                    name = areaT.name;

                    if ( areaT.type === 'cover' ) {
                        disableMove = areaT.disableMove;
                    }
                }
            }

            return {
                name: name || index.toString(),
                disableMove: disableMove
            };
        });

    }, [ productLayoutGroupSlug, productLayoutAreasList.length ] )

    const onSortEnd = ( { oldIndex, newIndex } ) => {
        saveAreasOrderAction( arrayMove( productLayoutAreasList, oldIndex, newIndex ) );
    };

    return (<EditorPageSliderWrapper id={'editorPages'} isMobile={ isMobile }>
            {/*<PageSliderBtn>123</PageSliderBtn>*/}
                <SortableBlock areas={ productLayoutAreasList }
                               selectedAreaId={ selectedAreaId }
                               axis={'x'}
                               areasTypes={areasTypes}
                               pressDelay={ isMobile ? 200 : 0 }
                               distance={ isMobile ? 0 : 15 }
                               pageWidth={ pageWidth }
                               onSortEnd={ onSortEnd }/>
            {/*<PageSliderBtn>123</PageSliderBtn>*/}
        </EditorPageSliderWrapper>
    )
}

export default EditorPageSlider;