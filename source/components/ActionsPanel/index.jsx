import React from 'react';

import s from './index.scss';
import ActionsPanelBtn from './_ActionsPanelBtn';


const ActionsPanel = ({disabled, mobile, content, fixed}) => {
    return (
            <div className={s.actionsPanel + (fixed ? ` ${s.fixed}`:'') + (disabled ? ` ${s.disabled}`:'')}>
                {content.map( ( item, i ) => <ActionsPanelBtn data={item} key={(item.type && item.type + i) || 'key' + i} mobile={mobile} disabled={disabled}/> )}
            </div>
    );
};

export default ActionsPanel;