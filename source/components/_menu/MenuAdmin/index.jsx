import React, {memo} from 'react';
// import { useSelector } from "react-redux";

import {NavLink, withRouter} from 'react-router-dom'
import s from './index.scss'

import TEXT from 'texts/main';
import LINKS from "config/links";
import LINKS_MAIN from "../../../config/links";
import { generateThemesUrl } from "__TS/libs/tools";


/**
 * Меню шапки админа
 */
const MenuAdminView = (props) => {

    const menuItems = [
        {name: TEXT.PRODUCTS,       link: LINKS.ADMIN_PRODUCTS},
        {name: TEXT.THEMES,         link: generateThemesUrl({isAdmin: true}) },
        {name: TEXT.STICKERS,       link: LINKS.ADMIN_STICKERS},
        {name: TEXT.BACKGROUNDS,       link: LINKS.ADMIN_BACKGROUNDS},
        // {name: TEXT.FRAMES,         link: LINKS.ADMIN_FRAMES},
        // {name: TEXT.FONTS,          link: LINKS.ADMIN_FONTS},
        {divider: 'Это разделитель'},
        {name: TEXT.SHOP,           link: LINKS.SHOP_MAIN, active: LINKS.SHOP_MAIN},
        {name: TEXT.DELIVERY,       link: LINKS.INFO_DELIVERY},
        {name: TEXT.BLOG,           link: LINKS_MAIN.BLOG, active: LINKS_MAIN.BLOG.replace(':post','') },
    ].map((item, key) => {

        if (item.divider) {
            // Если это разделитель
            return <div className={s.menuItemDivider} key={key}/>;
        } else if (item.link) { // Если есть ссылка (это простой пункт меню)

            const isActive = (active, match, location) => {
                if (match) return true;
                if (active) return !!~location.pathname.indexOf(active);
                return false;
            };

            return (
                <NavLink className={s.menuItem}
                         activeClassName={s.active}
                         to={item.link}
                         onClick={item.metrics}
                         isActive={(match, location) => isActive(item.active, match, location)}
                         key={key}>
                    {item.name}
                </NavLink>);
        } else if (item.sublinks) {
            // Если есть подссылки (это выпадающее меню)
            console.log('подссылки пока не работают');
            return null;
            // return <Select title={item.name} list={item.sublinks} isHover
            //                className={`${s.menuItem} ${s.menuItemSelect}`} custom key={key}/>;

        }

    });

    return <div className={s.mainMenu}>
        <div className={s.mainMenuRow}>
            {menuItems}
        </div>
    </div>
};

export default MenuAdminView;
