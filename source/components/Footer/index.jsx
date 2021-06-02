//import s from './footer.scss';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import styled from 'styled-components';

import FooterMenu from './_FooterMenu';
// import SubscriptionForm from './_SubscriptionForm';
import SocialButtons from './_SocialButtons';
import Messengers from './_Messengers';

import Spinner from 'components/Spinner';

import TEXT from 'texts/main';
import { LINKS } from "config/routes";
import LINKS_MAIN from "config/links";

import AuthMenu from 'components/AuthMenu';
import SEOblock from 'components/SEO';
import SeoStatic from 'components/SEO/seoStatic';

import {productsSelector} from "components/_pages/ProductPage/selectors";
import { PRODUCT_TYPES } from 'const/productsTypes';

/** styles **/
const MainFooterDiv = styled('div')`
    padding: 20px 0; //$main-padding*2 0 (10*2 0);
    background: #3d4c62;
    color: #6e7a8e;
`
const MainFooterInnerDiv = styled('div')`
    position: relative;
    max-width: 1280px; //$media-lg + $main-grid-padding * 2  (1240+10*2*2);
    padding: 0 20px; //0 $main-grid-padding (10*2);
    height: auto;
    width: 100%;
    margin: 0 auto;
`

const MainFooterWrap = styled('div')`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin: 0 -20px; //0 $main-grid-padding*-1 (10*2*-1)
`;

const MainFooterColumn = styled('div')`
     width: 33.3%;
     padding: 0 20px; //$main-grid-padding (10*2)
`;

const MainFooterColumnLeft = styled( MainFooterColumn )`
     @media (max-width: 991px) { //@include media(md){width: 66.6%;}
        width: 66.6%;
     }     
     @media (max-width: 767px) { 
        width: 100%;
     }
`;

const MainFooterColumnCenter = styled( MainFooterColumn )`
      @media (max-width: 991px) { //@include media(md){width: 33.3%;}
        width: 33.3%;
     }     
     @media (max-width: 767px) { 
        width: 100%;
     } 
`;

const MainFooterColumnRight = styled( MainFooterColumn )`
      @media (max-width: 991px) { //@include media(md){width: 33.3%;}
        width: 100%;
     }     
`;

const FooterBottom = styled( 'div' )`
    margin-top: 10px; //$main-padding;
    padding: 10px 20px; //$main-padding $main-padding*2;
    border-top: 1px solid #6e7a8e; //$footerBaseColor;
    text-align: center;
`;


//console.log('LINKS', LINKS);
// Все элементы меню футера
const MENU_FOOTER_ITEMS = {
    photobooks:{
        name: TEXT.PHOTOBOOKS, sublinks: [
        {name: TEXT.PHOTOBOOK_HARD_GLUE,
            link: {
                path: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-glue')
            },
        },
        {name: TEXT.PHOTOBOOK_SOFT_GLUE,
            link: {
                path: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-glue')
            },
        },
        {name: TEXT.PHOTOBOOK_HARD_SPRING,
            link: {
                path: LINKS_MAIN.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
            }
        },
        {name: TEXT.PHOTOBOOK_SOFT_SPRING,
            link: {
                path: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-spring')
            }
        },
        {name: TEXT.PHOTOBOOK_SOFT_CLIP,
            link: {
                path: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-clip')
            }
        }
    ]
    },
    gallery: {name: TEXT.GALLERY, link: LINKS.GALLERY},
    auth: {
        name: TEXT.PROFILE,
        component: <AuthMenu isFooter={true}/>
    },
    info: {
        name: TEXT.INFO, sublinks: [
            {name: TEXT.ABOUT_COMPANY, link: LINKS.INFO_ABOUT_COMPANY},
            {name: TEXT.CONTACTS, link: LINKS.INFO_CONTACTS},
            {name: TEXT.DELIVERY, link: LINKS.INFO_DELIVERY},
            {name: TEXT.REQUISITES, link: LINKS.REQUISITES},
            {name: TEXT.PUBLIC_OFFER, link: LINKS.PUBLIC_OFFER},
            {name: TEXT.HELP, link: {
                    ...LINKS.HELP, path: LINKS.HELP.path.replace(':tab', 'start')
                }},
        ]
    },
    calc: {
        name: TEXT.PRICES, link: LINKS.PRICES,
    },
    contacts: {
        name: TEXT.CONTACTS, link: LINKS.CONTACTS, sublinks: [
            {name: TEXT.PHONE_NUMBER, href: LINKS.PHONE.path},
            {
                name: TEXT.PHONE_NUMBER2,
                href: LINKS.PHONE2.path
            },
            {
                name:  <Messengers />
            },
            {name: TEXT.ADDRESS_TEXT, link: LINKS.INFO_CONTACTS},
            {name: TEXT.EMAIL_TEXT, href: `mailto:${TEXT.EMAIL_TEXT}`}
        ]
    },
    blog: {
        name: TEXT.BLOG, link: LINKS.BLOG
    },
    sales: {
         name: TEXT.SALES, link: {path: LINKS.SALES.path.replace(':post','')}
    },
    giftCard: {
         name: TEXT.GIFT_CARD, link: LINKS.GIFT_CARD_MAIN
    },
    // subscription: {
    //     name: TEXT.SUBSCRIPTION,
    //     component: <SubscriptionForm />
    // },
    social: {
        name: TEXT.SOCIAL,
        component: <SocialButtons />
    },
};

/**
 * Компонент Футер
 */
const Footer = props => {
    const [postersArray, setPostersArray] = useState( null );
    const [photosArray, setPhotosArray] = useState( null );
    const [canvasesArray, setCanvasesArray] = useState( null );
    const [calendarsArray, setCalendarsArray] = useState(null);
    const [puzzlesArray, setPuzzlesArray] = useState(null);

    const posterSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.POSTER ) );
    const photosSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.PHOTO ) );
    const canvasSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.CANVAS ) );
    const calendarsSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.CALENDAR ) );
    const puzzleSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.PUZZLE ) );

    useEffect(() => {
        if ( posterSelector ) {
            setPostersArray( posterSelector.length && posterSelector.map( item => ({
                name: item.name,
                link: { path: LINKS_MAIN.PRODUCT.replace( ':productType', item.id ) }
            }) ) || [] );
        }
        if ( photosSelector ) {
            setPhotosArray( photosSelector.length && photosSelector.map( item => ({
                name: item.name,
                link: { path: LINKS_MAIN.PRODUCT.replace( ':productType', item.id ) }
            }) ) || [] );
        }
        if ( canvasSelector ) {
            setCanvasesArray( canvasSelector.length && canvasSelector.map( item => ({
                name: item.name,
                link: { path: LINKS_MAIN.PRODUCT.replace( ':productType', item.id ) }
            }) ) || [] );
        }
        if ( calendarsSelector ) {
            setCalendarsArray( calendarsSelector.length && calendarsSelector.map( ( item ) => ({
                name: item.name,
                link: { path: LINKS_MAIN.PRODUCT.replace( ':productType', item.id ) }
            }) ) || [] );
        }
        if ( puzzleSelector ) {
            setPuzzlesArray( puzzleSelector.length && puzzleSelector.map( ( item ) => ({
                name: item.name,
                link: { path: LINKS_MAIN.PRODUCT.replace( ':productType', item.id ) }
            }) ) || [] );
        }
    }, [posterSelector, photosSelector, canvasSelector, calendarsSelector, puzzleSelector]);

    const decorProducts = [].concat( postersArray || [], photosArray || [], canvasesArray || [] )

    //если не нужно рендерить, возвращаем null
    if ( !process.env.server_render && !props.renderHeaderAndFooter ) return null;

    return (<>
                <SeoStatic />
                <MainFooterDiv>
                    <MainFooterInnerDiv>
                        <MainFooterWrap>
                            <MainFooterColumnLeft>
                                <FooterMenu {...MENU_FOOTER_ITEMS.photobooks}/>
                                {decorProducts.length ? <FooterMenu name={TEXT.DECORS} sublinks={decorProducts}/> : <Spinner size={40} light={true} fill/>}
                            </MainFooterColumnLeft>

                            <MainFooterColumnCenter>
                                {calendarsArray && <FooterMenu name={TEXT.CALENDARS} sublinks={calendarsArray}/>}
                                {puzzlesArray && <FooterMenu name={TEXT.PUZZLES} sublinks={puzzlesArray}/>}
                                <FooterMenu {...MENU_FOOTER_ITEMS.auth}/>
                                <FooterMenu {...MENU_FOOTER_ITEMS.info}/>
                            </MainFooterColumnCenter>

                            <MainFooterColumnRight>
                                <FooterMenu {...MENU_FOOTER_ITEMS.calc}/>
                                <FooterMenu {...MENU_FOOTER_ITEMS.sales}/>
                                <FooterMenu {...MENU_FOOTER_ITEMS.blog}/>
                                <FooterMenu {...MENU_FOOTER_ITEMS.giftCard}/>
                                <FooterMenu {...MENU_FOOTER_ITEMS.contacts}/>
                                <FooterMenu {...MENU_FOOTER_ITEMS.social}/>
                            </MainFooterColumnRight>
                        </MainFooterWrap>

                        <FooterBottom>
                            {TEXT.COMPANY_NAME + ', ' + (new Date()).getFullYear()}
                            <SEOblock />
                        </FooterBottom>
                    </MainFooterInnerDiv>
                </MainFooterDiv>
            </>);
};
export default memo(Footer);
