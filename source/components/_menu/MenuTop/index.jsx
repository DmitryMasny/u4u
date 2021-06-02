import React, {memo} from 'react';

import {NavLink} from 'react-router-dom';

import sendMetric from 'libs/metrics';
import {
    LINK_DELIVERY, LINK_HELP
} from 'const/metrics'
import LINKS_MAIN from "config/links";
import TEXT from 'texts/main';

import s from 'components/_menu/MenuProfile/menuProfile.scss';


/**
 * Styles
 */

const MENU_DATA = [
    {
        name: TEXT.BLOG,
        link: LINKS_MAIN.BLOG.replace(':post', ''),
    },
    // {name: TEXT.SALES, link: LINKS_MAIN.SALES, active: LINKS_MAIN.SALES.replace(':post?', '')},
    {
        name: TEXT.DELIVERY,
        link: LINKS_MAIN.INFO_DELIVERY,
        metrics: () => sendMetric(LINK_DELIVERY)
    },
    {
        name: TEXT.HELP,
        link: LINKS_MAIN.HELP.replace(':tab', ''),
        metrics: () => sendMetric(LINK_HELP)
    }
];

/**
 * Меню в верхней части шапки
 */
const MenuTop = memo(() => {

    return (
        <div className={`${s.headerMenu} ${s.topMenu}`}>
            {MENU_DATA.map((item, i) => <NavLink className={s.menuItem}
                                                 activeClassName={s.active}
                                                 to={item.link}
                                                 onClick={item.metrics}
                                                 key={i}>{item.name}</NavLink>)}
        </div>
    );
});

export default MenuTop;
