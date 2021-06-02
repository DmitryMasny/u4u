import React from 'react';
import { NavLink } from 'react-router-dom'

import LINKS from 'config/links';
import { Page, PageInner, Wrapper, PageTitle } from 'components/Page';
import { IconPlace} from 'components/Icons';
import s from './Info.scss';

const AboutPage = () => {
    return (
        <Page>
            <PageInner className={s.about}>
                <Wrapper>
                    <PageTitle>Привет, мы - u4u.ru<br/>
                        сервис по созданию и печати фотокниг
                    </PageTitle>

                <div className={s.aboutAdvantages}>
                    <h3 className={s.aboutHeader}>Наши преимущества</h3>
                    <ol className={s.aboutAdvList}>
                        <li className={s.aboutAdvListItem}>Удобный онлайн-редактор для создания фотокниг</li>
                        <li className={s.aboutAdvListItem}>Свое производство фотокниг в Москве</li>
                        <li className={s.aboutAdvListItem}>Приятные цены и персональные скидки на фотокниги</li>
                        <li className={s.aboutAdvListItem}>Разнообразие дизайна фотокниг</li>
                        <li className={s.aboutAdvListItem}>Полиграфическая печать фотокниг</li>
                        <li className={s.aboutAdvListItem}>Доставка фотокниг по всей России</li>
                    </ol>
                </div>

                <NavLink  className={s.aboutLink} to={LINKS.INFO_CONTACTS}>
                  <IconPlace/> Наши контакты
                </NavLink>
                </Wrapper>
            </PageInner>
        </Page>
    )
};

export default AboutPage
