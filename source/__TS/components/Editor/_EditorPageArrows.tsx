// @ts-ignore
import React, { memo, useCallback, useEffect, useState } from 'react';
// @ts-ignore
import styled, {css} from 'styled-components';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {
    IconChevronLeft, IconChevronRight
// @ts-ignore
} from 'components/Icons';
import { productLayoutAreasListSelector } from "../../selectors/layout";
import { selectedAreaIdSelector } from "./_selectors";

// @ts-ignore
import { COLORS } from "const/styles";
// @ts-ignore
import { hexToRgbA } from "libs/helpers";
import { setAreaSelectedAction } from "./_actions";



/** Interfaces */
interface IProps {
    isMobile?: boolean;
}

/** Styles */
const ArrowStyled = styled('div')`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: ${ ({ isMobile }) => isMobile ? '90px' : 0 };
    bottom: ${ ({ isMobile }) => isMobile ? 0 : '90px' };
    width: ${ ({ isMobile }) => isMobile ? 30 : 50 }px;
    height: ${ ({ isMobile }) => isMobile ? 60 : 100 }px;
    margin: auto;
    max-height: 60%;
    fill: ${COLORS.WHITE};
    background-color: ${hexToRgbA(COLORS.TEXT, .3)};
    opacity: .5;
    transition: opacity .2s ease-out;
    cursor: pointer;
    ${ ({ isNext }) => isNext ? css`
        right: 0;
        border-radius: 50px 0 0 50px;
        .icon {
          margin-right: -8px;
        }
    ` : `
        left: 0;
        border-radius: 0 50px 50px 0;
        .icon {
          margin-left: -8px;
        }
    `}
    &:hover{
      opacity: .7;
    }
    &:active{
      opacity: 1;
    }
`;


/**
 * Стрелочки для переключения страниц
 */
const EditorPageArrows: React.FC<IProps> = ({ isMobile }): any => {

    const productLayoutAreasList = useSelector( productLayoutAreasListSelector );
    const selectedAreaId = useSelector( selectedAreaIdSelector );

    const [areaIndex, setAreaIndex] = useState(0)

    useEffect( () => {
        if (productLayoutAreasList.length && selectedAreaId) {
            const currentIndex = productLayoutAreasList.findIndex( x => x === selectedAreaId )
            setAreaIndex(currentIndex + 1)
        }
    }, [ productLayoutAreasList, selectedAreaId ] );

    const goTo = useCallback( (index) => {
        if ( productLayoutAreasList.length > 1 ) {
            if (index > (productLayoutAreasList.length - 1)) index = productLayoutAreasList.length - 1;
            if (index < 0) index = 0;
            setAreaSelectedAction(index)
        }
    }, [ productLayoutAreasList ] );

    return <>
        <ArrowStyled onClick={ () => goTo(areaIndex - 1) } show={ areaIndex > 0 } isMobile={isMobile}>
            <IconChevronLeft size={ 48 }/>
        </ArrowStyled>
        <ArrowStyled onClick={ () => goTo(areaIndex + 1) } show={ areaIndex < (productLayoutAreasList.length - 1) } isNext isMobile={isMobile}>
            <IconChevronRight size={ 48 }/>
        </ArrowStyled>
    </>

};

export default memo( EditorPageArrows );