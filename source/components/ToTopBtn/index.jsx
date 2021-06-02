import React, { memo } from 'react';
//import {createPortal} from "react-dom";

import { ScrollContext } from 'contexts/scrollContext';
import { scrollToTop } from 'libs/helpers';
import s from './ToTopBtn.scss';
import { IconChevronUp } from "components/Icons";

const ToTopBtn = ( { className: classNameProp, small, disabled } ) => {

    // Определяем css классы
    let className = s.toTopBtn;
    classNameProp       ? (className += ` ${classNameProp}`) : null;            // Доп. класс
    small               ? (className += ` ${s.small}`) : null;                  // Уменьшенный
    disabled            ? (className += ` ${s.disabled}`) : null;               // disabled

    return <ScrollContext.Consumer>
            {( scroll ) => <ToTopBtnElement show={scroll > 300} className={className}/>}
           </ScrollContext.Consumer>
};
const ToTopBtnElement = memo(( { show, className } ) => {
    return <div className={className + (show ? ` ${s.show}` : '')} onClick={() => scrollToTop( { scrollDuration: 700 } )}>
                <IconChevronUp className={s.toTopBtnIcon}/>
           </div>
});

export default ToTopBtn;
