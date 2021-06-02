import styled from 'styled-components';

export const GallerySideMenuDiv = styled( 'div' )`
    padding: 0 10px;//$main-padding*2;  
`;

export const GalleryFullDiv = styled( 'div' )`
    width: 100%;
`;

export const GalleryWrapDiv = styled( 'div' )`
    display: flex;
`;

export const GalleryLeftDiv = styled( 'div' )`
    width: 200px;// $gallery-categories-width;    
    @media only screen and (max-width: 1239px) { //$media-lg - 1
        width: 160px;// gallery-categories-width-sm;
    }    
`;

export const GalleryRightDiv = styled( 'div' )`
    width: calc(100% - 200px);//#{$gallery-categories-width});
    display: flex;
    flex-wrap: wrap;
    @media only screen and (max-width: 1239px) {//media(lg){
        width: calc(100% - 160px);//#{$gallery-categories-width-sm});
    }
`;