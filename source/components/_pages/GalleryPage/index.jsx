import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//import s from './GalleryPage.scss';
import styled from 'styled-components';

import {
    GallerySideMenuDiv,
    GalleryFullDiv,
    GalleryWrapDiv,
    GalleryLeftDiv,
    GalleryRightDiv
} from './styles';

import { Page, PageInner } from 'components/Page';
import Categories from './_Categories';
import Filters from './_Filters';
import Themes from './_Themes';
import Paginator from 'components/Paginator';

import ProductAlbum from 'hoc/ProductAlbum';

import { galleryPageSelector, galleryThemesTotalElementsSelector } from "./selectors";
import { modalGalleryThemeInfoAction, setThemePage } from "./actions/themes";

import TEXT_GALLERY from 'texts/gallery';

import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'

import { productSaveDataAction } from 'components/_pages/ProductPage/actions';

import SideMenu from 'components/SideMenu';
import BorderBtn from 'components/BorderBtn';

import {IconTune} from 'components/Icons';

import { ResizeContext } from 'contexts/resizeContext';

import { base64ToObject } from 'libs/converters';

const LocalStyledBorderBtn = styled ( BorderBtn )`
    margin-bottom: 15px;//$main-margin-bottom;
`;


const GalleryPage = props => {
    if ( props.match && props.match.params.b64 ) {
        setTimeout(()=> {
            const hash = props.match.params.b64.replace('/sozdat-fotoknigu/', '');

            const objectByUrl = base64ToObject( hash );

            if ( objectByUrl && typeof objectByUrl === 'object') {

                let url = props.match.path.replace(':b64+', '');
                if (props.match.params.categoryId && parseInt(props.match.params.categoryId) > 0) {
                    url = url.replace(':categoryId?', props.match.params.categoryId || '');
                } else {
                    url = url.replace(':categoryId?', '');
                }
                url = url.replace( /\/+/g, '/' );

                props.history.push( url );

                switch ( objectByUrl.type ) {
                    case 'setAlbumFormatAndBinding':
                        delete (objectByUrl.type);
                        if ( objectByUrl.product ) {
                            props.productSaveDataAction( 'photoBook', objectByUrl );
                        }
                        break;
                    case 'showPreviewAlbum':
                        delete (objectByUrl.type);
                        if ( objectByUrl.product && objectByUrl.modal ) {
                            props.productSaveDataAction( 'photoBook', objectByUrl.product );
                            props.modalGalleryThemeInfoAction( objectByUrl.modal );
                        }
                        break;
                    default:
                        break;
                }
            }
        }, 500 );
    }

    const ITEMS_BY_PAGE = 20,
          totalPages = (props.themesTotalElementsSelector ? Math.ceil( props.themesTotalElementsSelector / ITEMS_BY_PAGE ) : 0);

    const pageId = 'gallery';

    const gallerySideMenuBtn = (
        <LocalStyledBorderBtn>
            <IconTune/> {TEXT_GALLERY.FILTERS}
        </LocalStyledBorderBtn>
    );

    const setThemePage = ( page ) => {
        //console.log('УСТАНОВКА СТРАНИЦЫ');
        props.setThemePage( page )
    };

    const paginator = (
                <Paginator //className={s.paginator}
                           currentPage={props.pageSelector}
                           totalPages={totalPages}
                           onSelectPage={( page ) => setThemePage( page )}
                           portal
                />);

    return (
        <Page id={pageId}>
            <PageInner> {/*className={s.gallery}>*/}
                <ResizeContext.Consumer>
                    {( { media } ) => {
                        return (media === 'xs' || media === 'sm') ?
                            (
                                <Fragment>

                                    <SideMenu button={gallerySideMenuBtn} title={TEXT_GALLERY.FILTERS}>
                                        <GallerySideMenuDiv>
                                            <ProductAlbum>
                                                <Filters/>
                                                <Categories/>
                                            </ProductAlbum>
                                        </GallerySideMenuDiv>
                                    </SideMenu>

                                    <GalleryFullDiv>
                                        <ProductAlbum>
                                            <Themes itemsByPage={ITEMS_BY_PAGE} />
                                        </ProductAlbum>
                                        {paginator}
                                    </GalleryFullDiv>

                                </Fragment>
                            ) : (
                                <GalleryWrapDiv>
                                    <GalleryLeftDiv>
                                        <Categories/>
                                    </GalleryLeftDiv>
                                    <GalleryRightDiv>
                                        <ProductAlbum>
                                            <Filters />
                                            <Themes itemsByPage={ITEMS_BY_PAGE} />
                                        </ProductAlbum>
                                        {paginator}
                                    </GalleryRightDiv>
                                </GalleryWrapDiv>
                            );
                    }}

                </ResizeContext.Consumer>
            </PageInner>
        </Page>);
};

export default withRouter(connect(
    (state, ownProps)  => {
        const categoryId = ownProps.match.params.categoryId || 0;
        return {
            pageSelector: galleryPageSelector( state ),
            themesTotalElementsSelector: galleryThemesTotalElementsSelector( state, PRODUCT_TYPE_PHOTOBOOK, categoryId ),
        }
    },
    dispatch => ({
        setThemePage: ( page ) => {dispatch( setThemePage( page ) )},
        modalGalleryThemeInfoAction: ( themeId ) => {dispatch( modalGalleryThemeInfoAction( themeId ) )},
        productSaveDataAction: ( theme, data ) => {dispatch( productSaveDataAction( theme, data ) )},
        //getThemesFromServerAction: ( page ) => {dispatch( getThemesFromServerAction( page ) )}
    })
)( GalleryPage ) );