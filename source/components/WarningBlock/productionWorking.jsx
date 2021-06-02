import React from 'react';
import s from './warningBlock.scss';

export default ( props ) =>
    <div className={s.attentionWrapper}>
        <div className={s.attentionGreen}>
            Наше производство возобновило работу в штатном режиме.<br />Все поступившие заказы будут отпечатаны в приоритетном порядке и переданы в службу доставки.
        </div>
    </div>
;

