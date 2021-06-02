import React, { PureComponent } from 'react';

import s from './BorderBtn.scss';
import { INTENT_NAMES } from 'config/main';

class BorderBtn extends PureComponent {

    render() {
        const {className: classNameProp, small, large, intent, icon, title, children, onClick, disabled, fill  } = this.props;
        // Определяем css классы
        let className = s.borderBtn;
        classNameProp       ? (className += ` ${classNameProp}`) : null;            // Доп. класс
        small               ? (className += ` ${s.small}`) : null;                  // Уменьшенный
        large               ? (className += ` ${s.large}`) : null;                  // Увеличенный
        disabled            ? (className += ` ${s.disabled}`) : null;               // disabled
        fill                ? (className += ` ${s.filled}`) : null;                 // width: 100%
        if ( intent && (INTENT_NAMES.some( elem => elem === intent )) ) className += ' ' + s['intent-' + intent]; // Цвет

        return (
            <div className={className} onClick={onClick}>
                {icon && <span className={s.filterBtnIcon}>
                    {icon}
                </span>}
                {title && <span className={s.filterBtnTitle}>
                    {title}
                </span>}
                {children}
            </div>);

    }
}

export default BorderBtn;
