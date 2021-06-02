import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom'

import { Btn } from 'components/_forms';
import Tooltip from 'components/_forms/Tooltip';

import { IconMenu, IconClose } from 'components/Icons';

import s from './CompactMenu.scss';

// Пункт меню
const CompactMenuItem = ( {title, link, active, closeMe, divider} ) => {
    if(!link){
        return (divider ? <div className={s.divider}/> : null);
    }
    const className = s.compactMenuItem + (active ? ` ${s.active}` : '');
    const onClickAction = (e)=>{
        closeMe();
        if (active) {
            e.preventDefault();
            return null;
        }
    };
    return (
        <NavLink className={className} to={link} onClick={onClickAction} >
            {title}
        </NavLink>
    )
};

class CompactMenu extends PureComponent {

    closeMe = () => this.zeroDiv.click();

    render(){
        const {active, title, children, className, bordered, icon: iconProp, noIcon } = this.props;

        const content = children.length ?
            children.map(({id,...other},k)=>(
                <CompactMenuItem {...other} active={id === active} closeMe={this.closeMe} key={k}/>
            ))
            :
            children;

        // Выпадающее меню
        const compactMenu = <div className={s.compactMenu}>
                                {content}
                                <div ref={(r)=>this.zeroDiv = r}/>
                            </div>;

        const icon = noIcon ? null : (iconProp || <IconMenu/>);

        return (
            <Tooltip trigger="click" className={className || null} tooltip={compactMenu} intent="minimal" placement="bottom" >
                <Btn className={s.compactMenuBtn  + (bordered ? ` ${s.bordered}` : '')}>
                    {icon}
                    {title && <span>{title}</span>}
                </Btn>
            </Tooltip>
        );
    }
}
export default CompactMenu;