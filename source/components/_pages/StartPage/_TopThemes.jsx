import React, { useCallback, memo } from "react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import CoverPreview from 'components/CoverPreview';
import { Btn } from 'components/_forms';
// @ts-ignore
import ProductPreview from "__TS/components/_misc/ProductPreview";
import { SLUGS } from "const/productsTypes";

const StyledTopThemes = styled.div`
    display: flex;
    margin: 0 -20px;
    padding-top: 20px;
    justify-content: center;
    ${({theme}) => theme.media && theme.media.sm`
        margin: 0 -10px;
    `}
    ${({theme}) => theme.media && theme.media.xs`
        flex-direction: column;
        align-items: center;
    `}
`;

const StyledTopThemeLink = styled(Link)`
    display: block;
    width: 25%;
    max-width: 300px;
    padding: 0 20px;
    ${({theme}) => theme.media && theme.media.sm`
        padding: 10px;
    `}
    ${({theme}) => theme.media && theme.media.xs`
        width: 100%;
        padding-bottom: 20px;
    `}
    .themeName {
      text-align: center;
      margin-top: 10px;
    }
`;


const StyledGalleryBtn = styled.div`
    display: flex;
    justify-content: center;
    padding: 30px 0;
`;


const TopThemes = memo(({title, link, themesList, productSlug}) => {

    return <>
            <StyledTopThemes>
                <ThemesElements themes={themesList}
                                productSlug={productSlug}
                />
            </StyledTopThemes>
            <GalleryBtn title={title} link={link}/>
         </>;
});

const ThemesElements = ( { themes, productSlug } ) => themes && themes.map( (theme, i) => {
    const getFormatBySlug = useCallback((productSlug) => {
        switch (productSlug) {
            case SLUGS.CALENDAR_WALL_FLIP: return { w: 212, h: 318 }
            default: return { w: 212, h: 318 }
        }
    }, [ productSlug ])
    return (
        <StyledTopThemeLink to={theme.url} key={i} >
            {productSlug === 'photobook' ?
                <CoverPreview src={theme.previewCover}
                              formatId={2}
                              coverType={'hard'}
                              bindingType={'glue'}
                />
            :
                <div> <ProductPreview svg={ theme.preview } productSlug={ productSlug } format={getFormatBySlug()} svgImageQuality={500}/></div>
            }
            <div className="themeName">
                {theme.name}
            </div>
        </StyledTopThemeLink>
    ) || null
});

const GalleryBtn = ({title, link}) => <StyledGalleryBtn><Link to={link}><Btn large intent={"primary"}>{title}</Btn></Link></StyledGalleryBtn>

export default TopThemes;