import {IMG_DIR} from 'config/dirs'

export default {
    title: 'Доставка и оплата',
    textData: [
        {
            header: 'Сроки и способы доставки фотокниг',
            texts: [
                {numberList: [
                        { label:'Курьером U4U по Москве в пределах МКАД', text:'от 1 рабочего дня' },
                        { label:'Курьером по Москве и России', text:'от 2 рабочих дней' },
                        { label:'В пункт выдачи заказов', text:'от 2 рабочих дней' },
                        { label:'Почтой России', text:'от 7 рабочих дней' },
                        { label:'Самовывоз бесплатно', text:'из офиса U4U в Москве' },
                    ]
                },
                {
                    style: {color: 'red'},
                    title: 'Внимание',
                    p: `Время указанное в виджете доставки приблизительное и включает только рабочие дни!`
                },
                {
                    title: 'Адрес самовывоза',
                    navlinkTemp: 'г. Москва, ул. Красная Пресня, дом 28 стр.2, офис 211',
                    p: `(Метро «Улица 1905 года» или «Краснопресненская»)<br/> 
                        Только будние дни, c 10:30 до 19:30.<br/>                        
                        Телефоны: +7 (495) 258 86 46, +7 (925) 516-98-99<br/>`,
                },
                {
                    title: 'Дополнительная информация',
                    p: `Доставка фотоальбомов за пределами МКАД осуществляется через сервис SafeRoute. <br/>
                        Стоимость доставки - от 150 руб., в зависимости от региона.<br/>
                        Оплата производится только на нашем сайте в момент заказа.<br/>`,
                },
                {
                    title: 'Решение проблем возникших при доставке альбома',
                    p: `Обязательно проверяйте состояние альбома при получении. В случае, если альбом имеет механические
                       повреждения (не предусмотренные сгибы, замятия)`,
                },
            ]
        },
    ],

    text2: `
        <style>
            .pay-logos{
                margin-top: 20px;
            }
            .pay-logos-img{
                margin: 0 10px 20px;
            }
        </style>
      
        <h3>Способы оплаты</h3>
        <p><b>Оплата онлайн на сайте:</b>
            Вы можете оплатить заказ фотокниги онлайн в момент оформления заказа. Это безопасно:
            U4U принимает платежи через систему  <a href="http://info.paymaster.ru/" target="_blank" rel="nofollow">Paymaster</a> 
            по защищённому соединению.<br/>
            Используются следующие платежные системы:<br/>
            <div class="pay-logos">
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-visa.png"
                     alt="карты Visa"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-mastercard.png"
                     alt="карты MasterCard"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-mir.png"
                     alt="карты МИР"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-sberbank.png"
                     alt="Сбербанк Онлайн"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-alfabank.png"
                     alt="Интернет-банк Альфа-банка"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-vtb24.png"
                     alt="Интернет-банк Банка ВТБ24"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-rustandart.png"
                     alt="Интернет-банк Банка «Русский Стандарт»"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-promsvyaz.png"
                     alt="Интернет-банк Промсвязьбанка"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-webmoney.png"
                     alt="WebMoney "/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-yandex.png"
                     alt="Яндекс.Деньги"/>
                <img class="pay-logos-img" src="${IMG_DIR}paylogos/paylogo-qiwi.png"
                     alt="QIWI"/>
            </div>
        </p>
        
        <h3>Юридическим лицам</h3>
        <p>
            U4U может сделать для вашей компании корпоративные подарки на выгодных условиях.
        </p>
        <p>
            О скидках и возможностях вы можете узнать
            по телефону <a href="tel:+74952588646">+7 (495) 258 86 46</a>
            или почте <a href="mailto:support@u4u.ru">support@u4u.ru</a>
        </p>
    `,
    buttonWidgetText: 'Расчитать стоимость доставки',
    buttonOfficeText: 'Показать офис самовывоза на картах',
    ddWidgetTitle: 'Расчёт стоимости доставки',
}