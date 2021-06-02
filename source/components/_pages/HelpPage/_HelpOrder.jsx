import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import LINKS_MAIN from 'config/links';
import { NAV } from 'const/help';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';
import { MY_PRODUCTS_CART, MY_PRODUCTS_INORDER, MY_PRODUCTS_NEW } from 'const/myProducts';
import { replaceTab } from 'libs/helpers';
import { IMG_DIR } from 'config/dirs'

const HelpEditor = ( { title } ) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-new-order.png'}/>
            <span className={s.helpImgBlockText}>Новый заказ в Корзине</span>
        </div>
        <p>
            После нажатия на кнопку "Заказать" в редакторе, вы попадаете в&nbsp;
            <NavLink to={replaceTab(LINKS_MAIN.MY_PRODUCTS,MY_PRODUCTS_CART)}>Корзину</NavLink>.
            Здесь вы можете ввести промокод, при его наличии и выбрать тираж.
        </p>
        <p>
            Нажмите на кнопку "Оформить заказ", выберите удобный вариант доставки и заполните контактные данные.
        </p>
        <p>
            После оплаты заказа проект запускается в производство.
            Вам на почту или телефон придет информация с номером заказа.<br/>
            Так же, вы будете получать информацию о состоянии заказа.
        </p>
        <p className={s.helpAttention}>
            Внимание! После оплаты внесение изменений в заказанный проект невозможно!
        </p>
        <p>
            Чтобы повторить заказ, создайте его копию на странице <NavLink to={replaceTab(LINKS_MAIN.MY_PRODUCTS,MY_PRODUCTS_INORDER)}>Заказов</NavLink>.
            Копия появится в <NavLink to={replaceTab(LINKS_MAIN.MY_PRODUCTS,MY_PRODUCTS_NEW)}>"Новых проектах"</NavLink>, где ее можно будет заказать.
        </p>
    </Fragment>);
};

export default HelpEditor;