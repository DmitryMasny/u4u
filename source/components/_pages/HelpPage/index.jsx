import React, {useEffect, useState} from 'react';
import { NavLink, withRouter } from 'react-router-dom'
import styled from 'styled-components';

import { Page, PageInner, Wrapper } from 'components/Page';
import {helpMenuData} from 'config/help';
import { NAV } from 'const/help';
import TEXT_HELP from 'texts/help';

import HelpStart from './_HelpStart';
import HelpEditor from './_HelpEditor';
import HelpPosterEditor from './_HelpPosterEditor';
import HelpMyPhotos from './_HelpMyPhotos';
import HelpPhotoEdit from './_HelpPhotoEdit';
import HelpTextEdit from './_HelpTextEdit';
import HelpPagesEdit from './_HelpPagesEdit';
import HelpBinding from './_HelpBinding';
import HelpOrder from './_HelpOrder';
import HelpNotifications from './_HelpNotifications';
import HelpPromo from './_HelpPromo';
import { COLORS } from "../../../const/styles";



/**
 * Styles
 */
const HelpPageWrap = styled( 'div' )`
    display: flex;
    position: relative;
    ${({theme}) => theme.media.sm`
        flex-direction: column;
    `};
`;
const HelpContentWrap = styled( 'div' )`
    flex-grow: 1;
    flex-basis: auto;
    padding-left: 30px;
    border-left: 1px solid ${COLORS.LINE};
    ${({theme}) => theme.media.sm`
        border-left: none;
        border-bottom: 1px solid ${COLORS.LINE};
        padding-left: 0;
        padding-bottom: 15px;
    `};
`;
const HelpNavWrap = styled( 'div' )`
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 250px;
    min-height: calc(100vh - 500px);
    padding-right: 20px;
    z-index: 1;
    ${({theme}) => theme.media.md`
        flex-basis: 200px;
        font-size: 15px;
    `};
    ${({theme}) => theme.media.sm`
        padding-right: 0;
        padding-top: 30px;
        min-height: inherit;
        flex-basis: initial;
        order: 2;
    `};
    .helpNavItem {
        padding: 5px 0;
        color: ${COLORS.TEXT};
        &:hover {
            color: ${COLORS.TEXT_PRIMARY};
            background-color: rgba(255, 255, 255, .33);
        }
        &.active {
            color: ${COLORS.TEXT_WARNING};
            background-color: transparent;
            cursor: default;
        }
    }
`;

// import TEXT_PROFILE from 'texts/profile';

// Ссылка раздела
const NavItem = ( {title, link, active} ) => {
    const className = 'helpNavItem' + (active ? ` active` : '');
    const onClick = (e)=>{
        if (active) {
            e.preventDefault();
            return null;
        }
    };
    return (
        <NavLink className={className} to={link} onClick={onClick} >
            {title}
        </NavLink>
    )
};


const helpContentData = {
    [NAV.START]:            <HelpStart title={TEXT_HELP.START}/>,
    [NAV.EDITOR]:           <HelpEditor title={TEXT_HELP.EDITOR}/>,
    [NAV.POSTER_EDITOR]:    <HelpPosterEditor title={TEXT_HELP.POSTER_EDITOR}/>,
    [NAV.MY_PHOTOS]:        <HelpMyPhotos title={TEXT_HELP.MY_PHOTOS}/>,
    [NAV.PHOTO_EDIT]:       <HelpPhotoEdit title={TEXT_HELP.PHOTO_EDIT}/>,
    [NAV.TEXT_EDIT]:        <HelpTextEdit title={TEXT_HELP.TEXT_EDIT}/>,
    [NAV.PAGES_EDIT]:       <HelpPagesEdit title={TEXT_HELP.PAGES_EDIT}/>,
    [NAV.BINDING]:          <HelpBinding title={TEXT_HELP.BINDING}/>,
    [NAV.ORDER]:            <HelpOrder title={TEXT_HELP.ORDER}/>,
    [NAV.NOTIFICATIONS]:    <HelpNotifications title={TEXT_HELP.NOTIFICATIONS}/>,
    [NAV.PROMO]:            <HelpPromo title={TEXT_HELP.PROMO}/>,
};


const HelpPage = props => {
    const [section, setSection ] = useState(props.match.params.tab || NAV.START)

    useEffect(()=>{
        setSection(props.match.params.tab || NAV.START);
    }, [props.match.params && props.match.params.tab]);

    const navItems = <HelpNavWrap>
                        {/*<span className={s.helpNav}>Навигация</span>*/}
                        {helpMenuData.map( ( { id, ...other }, k ) => {
                            return <NavItem {...other} active={id === section} key={k}/>;
                        } )}
                     </HelpNavWrap>;

    return (
        <Page>
            <PageInner>
                <HelpPageWrap>
                    {navItems}

                    <HelpContentWrap>
                        {helpContentData[section]}
                    </HelpContentWrap>
                </HelpPageWrap>
            </PageInner>
        </Page>);
};


export default withRouter(HelpPage);

