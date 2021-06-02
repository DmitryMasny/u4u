import React, {useState, useEffect, useRef, memo} from 'react';

import styled, {css} from 'styled-components'
import {COLORS} from 'const/styles'


/** Styles */
const EditorNavbarWrap = styled.div`
    position: relative;
    display: flex;
    align-items: stretch;
    height: ${({height, size})=>height ? height : size === 'lg' ? 40 : 30}px;
    margin: ${({margin})=> margin ? margin === 'left' ? '0 0 0 10px' : margin === 'right' ? '0 10px 0 0' : '0 0 15px' : '0' };
    ${({disabled})=> disabled && css`opacity: .5; pointer-events: none;`}
    ${({isMobile})=> isMobile && css`background-color: ${COLORS.TEXT};`}
`;
const TabStyled = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-weight: bold;
    transition: color .2s ease-out;
    user-select: none;
    ${({isMobile, active})=> isMobile ?
        css`
            fill: ${active ? COLORS.TEXT_WARNING : COLORS.NEPAL};
            color: ${active ? COLORS.TEXT_WARNING : COLORS.NEPAL};
            flex-direction: column;
            flex-grow: 1;
            padding-top: 2px;
            width: 16.66%;
            .tab-title{
                font-size: 11px;
                text-transform: capitalize;
                margin-top: 2px;
            }
        ` : 
        css`
            fill: ${active ? COLORS.TEXT_WARNING : COLORS.MUTE};
            color: ${active ? COLORS.TEXT_WARNING : COLORS.MUTE};
            padding: 0;
            .tab-title{
                font-size: ${({size})=> size === 'xs' ? 14 : size === 'sm' ? 16 : 18}px;
                text-transform: uppercase;
                margin-left: 5px;
                padding-top: 2px;
                &:first-child{
                    margin-left: 0;
                }
            }
        `
    };
    ${({disabled})=> disabled &&
        css`
            fill: ${COLORS.LINE};
            color: ${COLORS.LINE};
        `
    };
    cursor: ${({active, disabled})=> (active || disabled) ? 'default' :'pointer'};
    &:not(:last-child) {
        ${({isMobile, size})=> !isMobile && `margin-right: ${ size === 'xs' ? 15 : size === 'sm' ? 20 : 30}px;` }
        &:after {
            content: '';
            position: absolute;
            height: 20px;
            width: 1px;
            background-color: rgba(255,255,255,.2);
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }
    }
    &:hover {
        ${({active, disabled})=> !active && !disabled && css`
        color: ${COLORS.TEXT_PRIMARY};
        fill: ${COLORS.TEXT_PRIMARY};
    `}
    }
    
`;
const TabUnderline = styled.div`
    position: absolute;
    height: 3px;
    ${({isMobile})=> isMobile ? 'top' : 'bottom'}: 0;
    left: 0;
    right: 0;
    background-color: ${COLORS.WARNING};
    transition: transform .3s ease-out, width .3s ease-out;
    transform: translateX(${({offset})=>Math.floor(offset)}px);
    width: ${({width})=>Math.floor(width)}px
`;
const TabDivider = styled.div`
   flex-grow: 1;
`;

// Таб
const Tab = memo(({id, title, icon, active, onSelect, init, isMobile, size,  disabled, hide}) => {
    const link = useRef(null);
    useEffect(() => {
        if (init && active) {
            onSelect(id, link.current)
        }
    }, [active]);

    if (hide) return null;

    return (
        <TabStyled active={active}
                   disabled={disabled}
                   size={size}
                   isMobile={isMobile}
                   onClick={(e) => (active || disabled) ? null : onSelect(id, e.currentTarget)}
                   ref={link}>
            {icon}
            <div className="tab-title">{title}</div>
        </TabStyled>
    )
});

/**
 * Панель навигации
 */
const Navbar = ({selectTabAction, currentTab, isMobile, isAdmin, tabs, height, disabled, size = 'sm', margin }) => {
    const tabsEl = useRef(null);

    const [underline, setUnderline] = useState({
        width: 0,
        offset: 50,
        target: null
    });

    const onSelectTab = ( id, target ) => {
        selectTabAction(id);
        setUnderline({
            width: target.offsetWidth,
            offset: target.offsetLeft,
            activeId: id
        });
    };

    return <EditorNavbarWrap disabled={disabled} isMobile={isMobile} height={height} size={size} ref={tabsEl} margin={margin}>

        <TabUnderline width={underline.width} offset={underline.offset} isMobile={isMobile}/>

        {tabs.map((tab) => tab.divider ?
            <TabDivider key={tab.id}/>
            :
            <Tab title={tab.title || tab.name}
                 icon={tab.icon}
                 onSelect={onSelectTab}
                 active={tab.id === currentTab}
                 id={tab.id}
                 init={tab.id === currentTab && underline.activeId !== tab.id}
                 isMobile={isMobile}
                 size={size}
                 disabled={tab.disabled}
                 hide={tab.adminOnly && !isAdmin}
                 key={tab.id}/>)}

    </EditorNavbarWrap>
};

export default memo(Navbar);