import React from 'react';
import { createPortal } from "react-dom";
import { CSSTransition, Transition } from 'react-transition-group';

import { NavLink } from 'react-router-dom'

import { IconArrowBack } from 'components/Icons';
import s from './sideMenu.scss';


const SideMenuBlock = ( { closeAction, menu, children, parentId, title, right, show } ) => {
    const menuItems = (menu && menu.length) ?
        menu.map( ( item, key ) => (
            item.link ?
                <NavLink
                    className={s.sideMenuItem}
                    activeClassName={item.active || item.active === undefined ? s.active : ''}
                    to={item.link}
                    onClick={()=>closeAction({metricAction: item.metrics})}
                    key={key}>
                    {item.name}
                </NavLink>
                :
                item.name ?
                    <div className={s.sideMenuItem} key={key}>{item.name}</div>
                    :
                    <div className={s.sideMenuItemDivider} key={key}/>
        ) )
        : null;
    return createPortal(
        <Transition
            in={show}
            timeout={250}
        >
            {state =>{
                return (<div className={s.sideMenuWrap + (state && ` ${s['transition-' + state]}`) + (right ? ` ${s.right}` : '')}>
                    <div className={s.sideMenu}>
                        <div className={s.sideMenuHeader}>
                            <div onClick={closeAction} className={s.sideMenuCloseBtn}><IconArrowBack/></div>
                            {title && <span className={s.sideMenuTitle}>{title}</span>}
                        </div>
                        {menuItems}
                        {children}
                    </div>
                    <div className={s.sideMenuShadow} onClick={closeAction}/>
                </div>)}
            }
        </Transition>
        ,
        document.getElementById( parentId )
    );

};

export default SideMenuBlock;