import React from 'react';
import { Page, PageInner, PageTitle } from 'components/Page';
import YaMaps from 'components/YaMaps';
import s from './Info.scss';

import Messengers from 'components/Footer/_Messengers';

const ContactPage = () => {
    return (
        <Page>
            <PageInner>
                <PageTitle>Контакты</PageTitle>

                <div className={s.contacts}>
                    <p>
                    <span itemProp="name">
                       ООО &laquo;Ю ФО Ю&raquo;
                    </span>
                    </p>
                    <p>
                        <b>Мы находимся по адресу: </b>

                        <span itemProp="addressLocality">г. Москва</span>,
                        <span itemProp="streetAddress">ул. Красная Пресня, 28с2, офис 211.</span><br/>
                    </p>
                    <p>
                        Около 5 минут пешком от метро «Улица 1905 года» или «Краснопресненская».<br/>
                        Вход со двора, со стороны дома 26. Подъезд с вывеской "Нотариус" и табличкой U4U у входа.
                    </p>
                    <p>
                        <b>E-mail: </b>
                        <a href="mailto:support@u4u.ru" itemProp="email">
                            support@u4u.ru
                        </a>
                    </p>
                    <p>
                        <b>Телефоны: </b>
                        <a href="tel:+74952588646" itemProp="telephone">
                            <span className="ya-phone-1">+7 (495) 258 86 46</span>
                        </a>,&nbsp;
                        <a href="tel:+79255169899" itemProp="telephone">
                            <span className="ya-phone-1">+7 (925) 516 98 99 <Messengers /></span>
                        </a>
                    </p>
                    <p>
                        <b>Время работы: </b> Пн.-Пт., c 10:00 до 19:00.
                    </p>
                    <p>
                        <strong>(Время для самовывоза альбомов: Пн.-Пт. , с 11:00 до 19:00)</strong>.
                    </p>
                </div>

                <YaMaps height={450}/>

            </PageInner>
        </Page>
    )
};

export default ContactPage
