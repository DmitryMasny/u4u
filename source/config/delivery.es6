import TEXT_MY_PRODUCTS from 'texts/my_products';

const companyDeliveryDataById = {
    4:   { name: 'Boxberry', url: 'https://boxberry.ru/tracking/' },
    153: { name: 'ПЭК:EASYWAY', url: 'https://easyway.ru/' },
    111: { name: 'DPD Consumer Казахстан', url: 'http://www.dpd.kz/' },
    121: { name: 'DPD e-Book', url: 'https://www.dpd.ru/' },
    42:  { name: 'IML', url: 'https://iml.ru/status',  trek: true },
    27:  { name: 'DPD Economy', url: 'https://www.dpd.ru/' },
    107: { name: 'DPD Parcel Казахстан', url: 'https://http://www.dpd.kz/' },
    53:  { name: 'Great Express', url: 'http://www.gr-x.ru/index.php?page=otsledit-napravlenie' },
    58:  { name: 'Logsis', url: 'https://logsis.ru/traking' },
    151: { name: 'Royal Project Company', url: null },
    106: { name: 'Вестовой', url: 'https://vestovoy.ru/monitoring_dostavki/' },
    128: { name: 'Вестовой СПБ', url: 'https://vestovoy.ru/monitoring_dostavki/' },
    26:  { name: 'СДЭК', url: 'https://www.cdek.ru/track.html?order_id=', trek: true },
    101: { name: 'Шустрый Заяц', url: 'https://shustrim.com'},
    143: { name: 'Call IM', url: 'http://call-im.ru/'},
    142: { name: 'DDelivery', url: 'http://call-im.ru/'},
    1:   { name: 'PickPoint', url: 'https://pickpoint.ru/', shop: 'DDelivery'},
    130: { name: 'ПОЧТА РОССИИ', url: 'https://www.pochta.ru/tracking/'}
};

const contactFormData = [
    {name:'name',       label: TEXT_MY_PRODUCTS.NAME,       require: true, validator: 'exist', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD},
    {name:'surname',    label: TEXT_MY_PRODUCTS.SURNAME,    require: true, validator: 'exist', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD},
    {name:'fathername', label: TEXT_MY_PRODUCTS.FATHERNAME, require: true, validator: 'exist', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD},
    {name:'email',      label: TEXT_MY_PRODUCTS.EMAIL,      validator: 'email', error: TEXT_MY_PRODUCTS.ERROR_EMAIL, className: 'emailInput'},
    {name:'phone',      label: TEXT_MY_PRODUCTS.PHONE,      require: true, validator: 'phone', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD,
     error: TEXT_MY_PRODUCTS.ERROR_PHONE, mask: '+7 (999) 999-99-99'},
    {name:'comments',   label: TEXT_MY_PRODUCTS.COMMENTS, textArea: true, maxLength: 190, className: 'commentsInput'}
];

const addressFormData = [
    {name:'address',    label: 'Адрес',         require: true, validator: 'exist', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD},
    {name:'building',   label: 'Дом',           require: true, validator: 'exist', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD},
    {name:'flat',       label: 'Квартира',      require: true, validator: 'exist', errorEmpty: TEXT_MY_PRODUCTS.ERROR_REQUIRE_FILL_FIELD},
];

export { companyDeliveryDataById, contactFormData, addressFormData };