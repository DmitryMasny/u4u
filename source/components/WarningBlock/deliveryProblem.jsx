import React, { useState } from 'react';
import s from './warningBlock.scss';

export default ( props ) => {
    return (<div className={s.attentionWrapper}>
                <div className={s.attention}>
                    Внимание!<br/><br />
                    {/*Пункт самовывоза U4U на Красной Пресне дом 28с2 закрыт до 30 апреля.<br/><br />*/}
                    В связи с введенными ограничениями в Российской Федерации, связанными с COVID-19, увеличен срок обработки заказов курьерскими компаниями, возможны задержки.<br /><br />
                    Многие пункты самовывоза могут быть закрыты.<br/>
                    Уточняйте у курьерской компании о работе пункта самовывоза или заказывайте доставку курьером.<br/><br/>
                    Узнать о работе пунктов самовывоза вы можете по ссылкам:<br/>
                    <a target={'_blank'} href={'https://boxberry.ru/find_an_office/'}>Boxberry</a>
                    &nbsp;&nbsp;&nbsp;
                    <a target={'_blank'} href={'https://cdek.ru/news/view/2020-03-30-rezim-raboty-sdek-s-30-marta-po-30-aprela-2020g'}>СДЭК</a>
                    &nbsp;&nbsp;&nbsp;
                    <a target={'_blank'} href={'https://www.dpd.ru/dpd/chooser.do2'}>DPD</a>
                    &nbsp;&nbsp;&nbsp;
                    <a target={'_blank'} href={'https://pickpoint.ru/about/news/?id=768'}>PickPoint</a>
                    &nbsp;&nbsp;&nbsp;
                    <a target={'_blank'} href={'https://www.pochta.ru/offices/?from=mainpageStAtHo'}>Почта России</a>
                </div>
            </div>)
};

