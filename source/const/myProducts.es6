// Константы страницы "Мои продукты"

export const MY_PRODUCTS_NEW = 'new';               // Незаконченые продукты
export const MY_PRODUCTS_INORDER = 'inorder';       // Заказанные продукты
export const MY_PRODUCTS_DELETED = 'deleted';       // Удаленные продукты
export const MY_PRODUCTS_CART = 'cart';             // Корзина

export const MY_DELIVERY_PICKUP = 'PICKUP';         // Самовывоз
export const MY_DELIVERY_DDELIVERY = 'DDELIVERY';   // Доставка
export const MY_DELIVERY_U4U = 'U4U DELIVERY';      // Доставка курьером U4U

export const DDELIVERY_TYPE_PVZ = 'PVZ';            // Тип доставки ddelivery для отправки на сервер
export const DDELIVERY_TYPE_COURIER = 'COURIER';    // Тип доставки ddelivery для отправки на сервер
export const DDELIVERY_TYPE_POCHTA = 'POCHTA';      // Тип доставки ddelivery для отправки на сервер

export const ORDER_STATUS_CART = 'OPEN';            // Название статуса, если заказ в корзине
export const ORDER_STATUS_INWORK = 'INWORK';        // Название статуса, если заказ оплачен
export const ORDER_STATUS_COMPLETED = 'COMPLETED';  // Название статуса, если заказ доставляется
export const ORDER_STATUS_U4U_READY = 'U4U_READY';  // Название статуса, если заказ готов к выдаче в офисе U4U
export const ORDER_STATUS_DONE = 'DONE';            // Название статуса, если заказ выдан

export const PRODUCT_STATUS_INORDER = 'INORDER';    // Название статуса, если продукт в заказах
export const PRODUCT_STATUS_COMPLETED = 'COMPLETED';// Название статуса, если продукт готов и можно заказать
export const PRODUCT_STATUS_OPEN = 'OPEN';          // Название статуса, если продукт не закончен
export const PRODUCT_STATUS_IN_WORK = 'IN_WORK';    // Название статуса, если продукт в работе
export const PRODUCT_STATUS_IN_SHOP = 'IN_SHOP';    // Название статуса, если продукт в работе

export const MY_PRODUCTS_SHOW_DD_WIDGET = 'Показать/скрыть DD widget'; // Скрыть/показать виджет DDelivery

export const DELIVERY_COMPANIES = {
    42:  { name: 'IML',                     url: 'https://iml.ru/status',  phone: '8 800 755-755-1' },
    4:   { name: 'Boxberry',                url: 'https://boxberry.ru/tracking/', phone: '8 800 222 80 00' },
    153: { name: 'ПЭК:EASYWAY',             url: 'https://easyway.ru/', phone: '8 (495) 640-01-02' },
    111: { name: 'DPD Consumer Казахстан',  url: 'http://www.dpd.kz/', phone: '8 8000 700 700' },
    121: { name: 'DPD e-Book',              url: 'https://www.dpd.ru/ru/private/index.html', phone: '+7 (910) 440 44 34' },
    27:  { name: 'DPD Economy',             url: 'https://www.dpd.ru/ru/private/index.html', phone: '+7 (910) 440 44 34' },
    107: { name: 'DPD Parcel Казахстан',    url: 'http://www.dpd.kz/', phone: '8 8000 700 700' },
    53:  { name: 'Great Express',           url: 'http://www.gr-x.ru/index.php?page=otsledit-napravlenie', phone: '+7 (343) 220 39 20' },
    58:  { name: 'Logsis',                  url: 'https://logsis.ru/traking', phone: '+7 (499) 322-32-95' },
    151: { name: 'Royal Project Company',   url: null, phone: '' },
    106: { name: 'Вестовой',                url: 'https://vestovoy.ru/monitoring_dostavki/', phone: '+7(495) 109-80-89' },
    128: { name: 'Вестовой СПБ',            url: 'https://vestovoy.ru/monitoring_dostavki/', phone: '+7(812) 600-23-38' },
    26:  { name: 'СДЭК',                    url: 'https://www.cdek.ru/track.html?order_id=', trek: true, phone: '+7 (495) 797-81-08' },
    101: { name: 'Шустрый Заяц',            url: 'https://shustrim.com', phone: '+ 7 (495) 151-84-55'},
    143: { name: 'Call IM',                 url: 'http://call-im.ru/', phone: '+7 (495) 777-65-37'},
    142: { name: 'SafeRoute',               url: 'http://call-im.ru/', phone: '+7 (495) 777-65-37'},
    1:   { name: 'PickPoint',               url: 'https://pickpoint.ru/', shop: 'SafeRoute', phone: '8 800 700 79 09'},
    130: { name: 'ПОЧТА РОССИИ',            url: 'https://www.pochta.ru/tracking/', phone: '8-800-1-000-000'},
    157: { name: 'ПОЧТА РОССИИ',            url: 'https://www.pochta.ru/tracking/', phone: '8-800-1-000-000'},
};