import React, {  memo } from 'react';

import { MoreVertical } from 'components/Icons/LineIcon';

import s from './index.scss';
import Tooltip from "components/_forms/Tooltip";


const ActionsPanelBtn = ( { data, children, disabled } ) => {
    if ( !data ) return null;

    switch ( data.type ) {
        case 'divider':
            return <div className={s.divider}/>;
        case 'component':
            return data.component || null
        case 'menu':

            const menu = <div className={s.actionsPanelMenu}>
                {data.content.map( ( item, i ) => item.type === 'divider' ? (
                    <div className={s.actionsPanelMenuDivider} key={i}/>
                    ) : (
                    <div className={s.actionsPanelMenuItem} onClick={item.action} key={i}>
                        { item.icon && React.cloneElement( item.icon, { className: s.actionBtnIcon, size: 18 } ) }
                        {item.text}
                    </div>)
                )}
            </div>;

            return <Tooltip
                // placement={ mobile ? 'top' : 'bottom'}
                placement={'bottom'}
                intent={'minimal'}
                trigger="click"
                tooltip={menu}
            >
                <ActionsPanelBtn data={{ icon: <MoreVertical size={18} className={s.actionsPanelBtnIcon}/>, className: s.menuBtn }}/>
            </Tooltip>;


        default:
            // Button
            const className = `${ s.actionsPanelBtn } ${ s[data.intent] || '' } ${ data.className || '' } ${ disabled || data.disabled ? s.disabled : '' }
                ${ data.rounded ? s.rounded : ((!data.text && data.icon) ? s.noText : '') }`;
            return (
                <div className={className} onClick={data.action}>
                    { data.icon && React.cloneElement( data.icon, { className: s.actionBtnIcon, size: 18 } ) }
                    {data.text}
                    {children}
                </div>
            );
    }
};

export default memo(ActionsPanelBtn);