import { IMG_DIR } from "config/dirs";
import LINKS from "config/links";
import { generatePath } from 'react-router';

const calendarPath = generatePath( LINKS.PRODUCT, {
    productType: 10,
    format: 0,
    themeId: 0
});


export default [
    {
        id: 'May_20',
        title: 'Скидка 30% на самый популярный формат фотокнига в твердой обложке книжном переплете формата 20x20.',
        src: IMG_DIR + 'pr/2021/05.20.png', date: new Date('05-31-2021'),
        description: `
            Скидка 30%<br/>
            Весенняя скидка<br/>
            на самый популярный формат:<br/>
            фотокнига в твердой обложке<br/>
            книжном переплете<br/>
            формата 20x20<br/>
            <br/>
            промокод: MAY30<br/>
            <br/>
            Скидка действует на 36 страниц фотокниги<br/>
            Акция продлится до 30 мая включительно<br/>
        `,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'April_29',
        title: 'Скидка 30% на фотокнигу на пружине в твердой облолжке формата 20х30.',
        src: IMG_DIR + 'pr/2021/04.29.png', date: new Date('05-10-2021'),
        description: `
            Скидка 30%<br/>
            Фотокнига на пружине в твердой обложке 20x30<br/>
            Акция действует до 9 мая включительно<br/>
            промокод:<br/>
            SUN
        `,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'April_18',
        title: 'Скидка 31% на 36 страниц на фотокниги в книжном переплете в твердой обложке формата 30x20.',
        src: IMG_DIR + 'pr/2021/04.01.jpg', date: new Date('04-19-2021'),
        description: `
            Скидка 31%<br/>
            Фотокнига в книжном переплете в твердой обложке 30x20<br/>
            Акция действует до 18 апреля включительно<br/>
            промокод:<br/>
            PP-APREL
        `,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'mart_14',
        title: 'Всего 4 дня! Скидка 33% скидка на фотокниги в твердой обложке на пружине формата 30х20.',
        src: IMG_DIR + 'pr/2021/03.25.png', date: new Date('03-29-2021'),
        description: `
            Скидка 33%<br/>
            Всего 4 дня!<br/>
            Фотокнига в твердой обложке на пружине 30x20<br/>
            Акция действует до 28 марта включительно<br/>
            промокод:<br/>
            MART33       
        `,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'mart_14',
        title: 'Весна уже близко! Скидка 30% на фотокниги в твердой обложке!',
        src: IMG_DIR + 'pr/2021/pp-vesna.jpg', date: new Date('03-15-2021'),
        description: `
            Скидка распространяется <br/> 
            на 36 страниц фотокниги <br/> 
            в твердой обложке <br/> 
            книжном переплете <br/> 
            формата 20x20 <br/> <br/> 
            Промокод: <br/> 
            PP-VESNA<br /><br />
            Акция действует до 14 марта!         
        `,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'feb_30_books_sale',
        title: 'Скидка 30% на фотокниги на пружине формата 20х20',
        src: IMG_DIR + 'pr/2021/30feb.png', date: new Date('02-15-2021'),
        description: `Фотокниги на пружине - самые быстрые в изготовлении, поэтому это лучший выбор, когда до праздничной даты остается мало времени!<br />
                      Недорогой и эксклюзивный подарок всего<br /> 
                      за 1-2 рабочих дня.<br /><br />
                      Скидка распространяется<br />
                      на первые 20 страниц<br />
                      фотокниги на пружине<br />
                      формата 20x20<br /><br />
                      промокод:<br />
                      PP-LOVE-30             
        `,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'feb_4_books_sale',
        title: 'Выпускные фотокниги. Выгодные условия для тиражей фотокниг (4 и более экземпляров), созданных в нашем редакторе.',
        src: IMG_DIR + 'pr/2021/4books_discount.png', date: new Date('01-1-2025'),
        description: `Если вы хотите воспользоваться скидкой:
                      до оформления и оплаты заказа свяжитесь с нами по почте <a target="_blank" href="mailto:support@u4u.ru">support@u4u.ru</a> или через социальные сети. 
                      Особые условия могут применяться и к тиражам фотокниг другой тематики, если предполагается 4 и больше экземпляров. 
                      Размер скидки зависит от тиража и выбранного типа переплета, рассчитывается индивидуально.`,
        email: 'mailto: support@u4u.ru',
        buttonText: 'support@u4u.ru'
    },
    {
        id: 'january_calendar',
        title: '30% скидка на календари',
        src: IMG_DIR + 'pr/2021/calendar-dar-30.png', date: new Date('02-1-2021'),
        description: `Скидка действует до 31 января<br />
                      на многостраничный настенный<br />
                      и настольный календари<br />
                      Промокод: <b>DAR-30</b>`,
        url: calendarPath
    },
    {
        id: 'december',
        title: 'Скидка 33% на фотокниги 36 страниц в книжном переплете, твердая обложка, все форматы',
        src: IMG_DIR + 'pr/dec/ppnew.jpg', date: new Date('01-1-2021'),
        description: `Скидка действует до 31 декабря<br />
                      на все темы и все форматы<br />
                      на фотокниги в книжном переплете<br />
                      в твердой обложке<br />
                      Промокод: <b>PP-NEW</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'sale_test11',
        title: '40% скидка на 36 страниц, фотокниги в книжном переплете формата 20х30',
        src: IMG_DIR + 'pr/november/19.11.jpeg', date: new Date('12-7-2020'),
        description: `Скидка действует до 6 декабря<br />
                      на все темы<br />
                      на фотокниги в книжном переплете<br />
                      в твердой обложке формата 20x30<br />
                      Промокод: <b>PP-BLACK</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'sale_test10',
        title: 'Скидка 45% на фотокнигу в твердой обложке, на пружине формата 20x20 объемом 20 страниц, на все темы',
        src: IMG_DIR + 'pr/november/5.11.jpg', date: new Date('11-9-2020'),
        description: `Скидка действует всего 4 дня, до 8 ноября включительно!<br />
                      на все темы<br />
                      Промокод: <b>PP-NOVEMBER</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'sale_test9',
        title: 'Фотокнига в книжном переплете! Формат 30х20. 40% скидка!',
        src: IMG_DIR + 'pr/october/22.10.jpg', date: new Date('11-1-2020'),
        description: `Скидка действует до 1 ноября<br />
                      на все темы<br />
                      на фотокниги в книжном переплете<br />
                      в твердой обложке формата 30x20<br />
                      Промокод: <b>FALL40</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'sale_test8',
        title: 'Фотокнига на пружине! 20x30. Скидка 30%!',
        src: IMG_DIR + 'pr/sept/24.jpg', date: new Date('10-12-2020'),
        description: `Все страницы раскрываются на 180 градусов, а выбор дизайна из нашей галереи позволяет создать и детский фотоальбом, и портфолио школьника, и запоминающуюся свадебную книгу.<br /><br />                      
                      Скидка действует до 11 октября включительно<br />
                      на все темы<br />
                      на фотокниги на пружине<br />
                      в твердой обложке формата 20x30<br />
                      Промокод: <b>SEPT30</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'sale_test7',
        title: 'Фотокнига по цене открытки! Скидка 44%!',
        src: IMG_DIR + 'pr/sept/17.jpg', date: new Date('09-21-2020'),
        description: `Фотокнига на скрепке формата 20х20!<br />
                      Скидка действует до 20 сентября<br />
                      на все темы<br />
                      на фотокниги на скрепке<br />
                      в мягкой обложке<br />
                      формата 20x20<br /><br />
                      Промокод: <b>SKREPKA</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'soft-clip' )
    },
    {
        id: 'sale_test6',
        title: 'В честь праздника знаний мы рады предложить вам скидку 40%!',
        src: IMG_DIR + 'pr/sсhool/sсhool.jpg', date: new Date('09-14-2020'),
        description: `Фотокнига компактного формата 20х20 уместится на любой книжной полке и поможет надежно сохранить до нескольких сотен фотографий!<br />
                      Скидка действует до 13 сентября<br />
                      на все темы<br />
                      на фотокниги в книжном переплете<br />
                      в твердой обложке<br />
                      формата 20x20<br /><br />
                      Промокод: <b>SCHOOL</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'sale_test5',
        title: 'Фотокниги вертикального формата - неустаревающая классика! Успейте заказать фотокнигу в твердой обложке формата 20x30 со скидкой 40%',
        src: IMG_DIR + 'pr/mainpage/for-site-30.jpg', date: new Date('08-17-2020'),
        description: `Скидка действует до 16 августа<br />
                        на все темы<br />
                        на фотокниги в книжном переплете<br /> 
                        в твердой обложке<br />
                        формата 20x30<br /><br />
                        Промокод: <b>AVG40</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'sale_test4',
        title: 'Быстрый и летний! Скидка 45%!',
        src: IMG_DIR + 'pr/mainpage/for_site_23july.jpg', date: new Date('07-27-2020'),
        description: `Успейте воспользоваться короткой акцией!<br />
                      Всего три дня, чтобы создать и заказать альбом!<br /><br />
                      Скидка 45% действует до 26 июля<br />
                      на фотокниги на пружине<br />
                      в твердой и мягкой обложке формата 20x20.<br /><br />
                      Промокод: <b>JULY45</b>`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'sale_test3',
        title: 'Скидка 33% на фотокниги на пружине в твердой обложке формата 30х30',
        src: IMG_DIR + 'pr/mainpage/leto33.jpg', date: new Date('07-13-2020'),
        description: `Лето только начинается?<br />
                      Первый месяц почти позади! Надеемся, вам есть что вспомнить и чему порадоваться. Пересматривайте яркие моменты июня снова и снова на страницах  наших фотокниг!<br />
                      CКИДКА 33% действует до 12 июля<br />
                      на фотокниги на пружине<br />
                      в твердой обложке формата 30x30.<br />
                      Сохраним впечатления вместе!`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        id: 'sale_test',
        title: 'Скидка 40% на все темы в книжном переплете и твердой обложке формата 20х30',
        src: IMG_DIR + 'pr/sales/deti40.jpg', date: new Date('06-14-2020'),
        description: `Приближается Международный день защиты детей! Отличный повод заказать альбом для любимых малышей! На нашем сайте вы найдете огромный выбор детских тем, а приятная скидка будет кстати для любого альбома!`,
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        id: 'sale_test2',
        title: 'Скидка 40% на все темы в книжном переплете и твердой обложке формата 20х30',
        src: IMG_DIR + 'pr/sales/may40.jpg', date: new Date( '05-17-2020' ),
        description: "Майские праздники закончились, а скидки продолжаются. Успейте воспользоваться праздничным предложением до 17 мая!",
        url: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    }
];