import React, { useState } from 'react';
import s from './warningBlock.scss';

export default ( props ) => {
    return (<div className={s.attentionWrapper}>
                <div className={s.attention}>
                    Внимание!<br />
                    С 4 по 7 мая, производство работает в обычном режиме!<br />
                    Учитывайте, что в праздничные дни транспортные компании могут увеличить сроки доставки.<br />
                    Офис самовывоза U4U будет работать только 6 мая с 10:00 - 19:00
                </div>
            </div>)
};

