import s from './menuAuth.scss';
import React from 'react';
import TEXT from 'texts/main';

const MenuAuthView = props => {
    return (<div className={props.isFooter ? s.footerMenu : s.headerMenu}>
        <div className={s.menuItem} onClick={props.showLoginFormHandler}>{TEXT.LOGIN}</div>
        {!props.isMobile && <div className={s.menuItem} onClick={props.showRegFormHandler}>{TEXT.REGISTER}</div>}
    </div>);
};

export default MenuAuthView;
