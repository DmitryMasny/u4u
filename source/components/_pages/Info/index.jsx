import React from 'react';

import { Page, PageInner, PageTitle } from "components/Page";
import { NavLink } from 'react-router-dom'
import TEXT from 'texts/main';
import LINKS from "config/links";

import s from './Info.scss';

const INFO_ITEMS = [
    {name: TEXT.ABOUT_COMPANY,  link: LINKS.INFO_ABOUT_COMPANY},
    {name: TEXT.CONTACTS,       link: LINKS.INFO_CONTACTS},
    {name: TEXT.DELIVERY,       link: LINKS.INFO_DELIVERY},
    {name: TEXT.REQUISITES,     link: LINKS.REQUISITES},
    {name: TEXT.PUBLIC_OFFER,   link: LINKS.PUBLIC_OFFER},
    {name: TEXT.HELP,           link: LINKS.HELP}
];

// Компонент пункта меню
const items = INFO_ITEMS.map(( item, key ) => {
    return (
        <NavLink className={s.infoPageItem}
                 activeClassName={s.active}
                 to={item.link}
                 key={key}>
            {item.name}
        </NavLink>);
});

const InfoPage = props => {
    return (
        <Page>
            <PageInner>
                    <PageTitle>{TEXT.INFO}</PageTitle>

                    <div className={s.infoPage}>{items}</div>
            </PageInner>
        </Page>);
};

export default InfoPage;