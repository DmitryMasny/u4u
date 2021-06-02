import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {IMAGE_TYPES} from "const/imageTypes";
import {IMG_DIR} from 'config/dirs'

let axiosInstance = axios.create({
    baseURL: '',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});
let mock = new MockAdapter(axiosInstance, { delayResponse: 0 });


//эмуляция ответов сервера
mock.onPost('/get/products').reply(200, {
    products: [
        { id: 1, name: 'КНЫЖКА 1' },
        { id: 2, name: 'КНЫЖКА 2' },
        { id: 3, name: 'КНЫЖКА 3' },
        { id: 4, name: 'КНЫЖКА 4' },
    ]
});


//эмуляция ответов сервера
mock.onPost('/getcategories/').reply(200, {
    0: { id: 0, name: 'ALL' },
    1: { id: 1, name: 'NEW_YEAR' },
    2: { id: 2, name: 'FAMILY' },
    3: { id: 3, name: 'TRAVEL' },
    4: { id: 4, name: 'ROMANTIC' },
    5: { id: 5, name: 'CHILDREN' },
    6: { id: 6, name: 'BIRTHDAY' },
    7: { id: 7, name: 'WEDDING' },
    8: { id: 8, name: 'WTF' }
});

//эмуляция ответов сервера
mock.onPost('/getproducts/').reply(200, {
    0: { id: 0, name: 'ALL' },
    1: { id: 1, name: 'NEW_YEAR' },
    2: { id: 2, name: 'FAMILY' },
    3: { id: 3, name: 'TRAVEL' },
    4: { id: 4, name: 'ROMANTIC' },
    5: { id: 5, name: 'CHILDREN' },
    6: { id: 6, name: 'BIRTHDAY' },
    7: { id: 7, name: 'WEDDING' },
    8: { id: 8, name: 'WTF' }
});

//эмуляция ответов сервера
mock.onPost('/getthemeexample/').reply(200, {
        pages: [
            {
                left: 'https://u4u.ru/media/prodprev/2946/2_bfab0c3a-0d0b-4ecd-9b10-d645361eeff3.jpg',
                right: 'https://u4u.ru/media/prodprev/2946/3_0e08fc68-e2ff-4d58-bdd4-743b8c82c4e6.jpg',
            },
            {
                left: 'https://u4u.ru/media/prodprev/2946/4_d1a66f6e-c676-471f-b085-df9bf7bdad14.jpg',
                right: 'https://u4u.ru/media/prodprev/2946/5_a7d93258-9606-404c-9d68-8aca8a01cc30.jpg',
            }
        ],
        title: 'Название темы длинное. Очень длинное. Но все хорошо =)'
});

//эмуляция ответов сервера
mock.onGet('/api/fake/photos/').reply(200, [
    {
        id: "0116d330-e2bb-4c5c-af31-38643c6a377d",
        url: 'https://lh3.googleusercontent.com/ca3yzWe6lv8C8OiA1XXWnI36T-jqA1_fwbcPomXoHbfFGBHWP6fpNCXSIyvgtKFqAk---DujlUfS0Ybi7y4SZxo',
        type: IMAGE_TYPES.GPHOTO,
        size: {w: 3662, h: 3662}
    }
]);

//эмуляция ответов сервера
mock.onGet('/api/fake/themes/').reply(200, [
    {id: 'sxdcfm1', url: 'media/te/f1/fb/f1fbbc99e00a476cb70fd90b82bc5cab', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm2', url: 'media/te/bb/8f/bb8f8adbbbc24b498e8251b9087fe2e2', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm3', url: 'media/te/a8/6a/a86ac33996724095b4d21f1a0e34fb1b', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm4', url: 'media/te/12/04/120429ffb19c42b9aac7c68f47769ae9', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm5', url: 'media/te/0b/0e/0b0e098cc6f44a0295bfa2fa95649532', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm6', url: 'media/te/75/3c/753cb0ed47964b508633d35e8468fc52', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm7', url: 'media/te/4a/21/4a2158b21c4749e8abd9bab88889de8c', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm8', url: 'media/te/3c/05/3c05fb016f134a9ab9aa745de4e065fb', size: {w: 3662, h: 3662}},
    {id: 'sxdcfm9', url: 'media/te/65/4c/654cb7f06bb24af5b058a7ee7cb869a0', size: {w: 3662, h: 3662}},
    {id: 'sxdcf10', url: 'media/te/d2/d9/d2d97a1dcfd346d59971d60e54944480', size: {w: 3662, h: 3662}},
]);


//эмуляция ответов сервера
mock.onPost('/gettypes/').reply(200, [
    {
        id: 4,
        coverType: 'hard',
        bindingType: 'glue',
        formats: [
            { id:2, price: 1290, more: 25, width: 20, height: 20 },
            { id:4, price: 1790, more: 29, width: 20, height: 30 },
            { id:3, price: 1840, more: 29, width: 30, height: 20 },
            { id:5, price: 2790, more: 42, width: 30, height: 30 }
        ],
        paperPagesDestiny: 200,
        pages: { min: 36, fix: 36, max: 200, step: 2 },
        coverLaminationTypes: ['glance', 'mat']
    },
    {
        id: 3,
        coverType: 'soft',
        bindingType: 'glue',
        formats: [
            { id:2, price: 1190, more: 25, width: 20, height: 20 },
            { id:4, price: 1290, more: 29, width: 20, height: 30 }
        ],
        paperPagesDestiny: 170,
        pages: { min: 48, fix: 48, max: 200, step: 2 },
        coverLaminationTypes: ['glance', 'mat']
    },
    {
        id: 2,
        coverType: 'hard',
        bindingType: 'spring',
        formats: [
            { id:2, price: 790, more: 25, width: 20, height: 20 },
            { id:4, price: 890, more: 29, width: 20, height: 30 },
            { id:3, price: 890, more: 29, width: 30, height: 20 },
            { id:5, price: 1090, more: 42, width: 30, height: 30 }
        ],
        paperPagesDestiny: 170,
        pages: { min: 4, fix: 20, max: 150, step: 2 },
        coverLaminationTypes: ['glance'/*, 'mat'*/]
    },
    {
        id: 1,
        coverType: 'soft',
        bindingType: 'spring',
        formats: [
            { id:2, price: 480, more: 25, width: 20, height: 20 }
        ],
        paperPagesDestiny: 170,
        pages: { min: 4, fix: 20, max: 150, step: 2 },
        coverLaminationTypes: ['glance', 'mat']
    },
    {
        id: 0,
        coverType: 'soft',
        bindingType: 'clip',
        formats: [
            { id:2, price: 390, more: 25, width: 20, height: 20 },
            { id:4, price: 490, more: 29, width: 20, height: 30 }
        ],
        paperPagesDestiny: 170,
        pages: { min: 4, fix: 12, max: 32, step: 4 },
        coverLaminationTypes:  ['glance', 'mat']
    }
]);

/*
"techOptions": [{
    "name": "Постер",
    "type": "poster",
    "order": 1,
    "pages": [
        {
            "type": "poster_page",
            "shadow": "none",
            "editable": true,
            "w": "$formatWidht$ + $printMarginLeft$ + $printMarginRight$",
            "h": "$formatHeight$ + $printMarginTop$ + $printMarginBottom$",
            "x": "- $printMarginLeft$",
            "y": "- $printMarginTop$",
        }
    ],
    "printOptions": {
        "printMarginTop": 3,
        "printMarginBottom": 3,
        "printMarginLeft": 3,
        "printMarginRight": 3,
    }
}]
*/


//эмуляция ответов сервера
mock.onGet('/getposters/').reply(200, [
    {
        name: 'simplePoster',
        info: {
            name: 'Постер',
            desc_main: 'Описание для главной',
            title_product: 'Постеры - это здорово!',
            desc_product: [
                'Если у вас есть фотография в хорошем качестве...',
                'Вы можете сделать постер с ней.',
                'Подарите постер близкому человеку, или повесьте у себя на стене любое изображение.',
            ],
            desc_paper: [],
        },
        images: {
            main: [],
            product_main: `${IMG_DIR}posters/poster_0.jpg`,
            product: [
                `${IMG_DIR}posters/poster_1.jpg`,
                `${IMG_DIR}posters/poster_2.jpg`,
                `${IMG_DIR}posters/poster_3.jpg`,
            ]
        },
        formats: {
            'CustomExample': {
                name: 'Свой размер',
                type: 'CustomExample',
                sizeType: 'custom',
                w_min: 100,
                w_max: 841,
                h_min: 100,
                h_max: 1189,
                step: 10,
                order: 10,
                allow_rotate: true
            },
            'A0': {
                active: true,
                name: 'A0',
                type: 'A0',
                sizeType: 'fix',
                w: 841,
                h: 1189,
                order: 10,
                allow_rotate: true
            },
            'A1': {
                active: true,
                name: 'A1',
                type: 'A1',
                sizeType: 'fix',
                w: 594,
                h: 841,
                order: 10,
                allow_rotate: true
            },
            'A2plus': {
                active: true,
                name: 'A2+',
                type: 'A2plus',
                sizeType: 'fix',
                w: 530,
                h: 750,
                order: 10,
                allow_rotate: true
            },
            'A2': {
                active: true,
                name: 'A2',
                type: 'A2',
                sizeType: 'fix',
                w: 420,
                h: 594,
                order: 10,
                allow_rotate: true
            },
            'A3plus': {
                active: true,
                name: 'A3+',
                type: 'A3plus',
                sizeType: 'fix',
                w: 310,
                h: 470,
                order: 5,
                allow_rotate: true
            },
            'A3': {
                active: true,
                name: 'A3',
                type: 'A3',
                sizeType: 'fix',
                w: 297,
                h: 420,
                order: 8,
                allow_rotate: true
            },
            'A4plus': {
                active: true,
                name: 'A4+',
                type: 'A4plus',
                sizeType: 'fix',
                w: 230,
                h: 310,
                order: 100,
                allow_rotate: true
            },
            'A4': {
                active: true,
                name: 'A4',
                type: 'A4',
                sizeType: 'fix',
                w: 210,
                h: 297,
                order: 1,
                allow_rotate: true
            },
        },
        areas: {
            'poster-12t749de-adb7-4136-48d4-ydr506b5dde4': {
                name: 'Постер',
                type: 'poster',
                order: 1,
                pages: [
                    {
                        type: 'poster_page',
                        id: 'poster_page',
                        shadow: 'none',
                        editable: true,
                        w: '$fW$ + $pML$ + $pMR$',
                        h: '$fH$ + $pMT$ + $pMB$',
                        x: '- $pML$',
                        y: '- $pMT$',
                    }
                ],
                paper_allows: [
                    {
                        id: 'poster_paper',
                        min: 1,
                        max: 1,
                        default: 1,
                    },
                    {
                        id: 'lux_paper',
                        min: 1,
                        max: 1,
                        default: 1,
                    },
                ],
                print_options: {
                    cropTop: 3,
                    cropBottom: 3,
                    cropLeft: 3,
                    cropRight: 3,
                }
            },
            'poster-12t749de-adb7-4136-438d4-ydr506b5dde4': {
                name: 'Постер2',
                type: 'poster2',
                order: 2,
                pages: [
                    {
                        type: 'poster_page2',
                        id: 'poster_page2',
                        shadow: 'none',
                        editable: true,
                        w: '$fW$ + $pML$ + $pMR$',
                        h: '$fH$ + $pMT$ + $pMB$',
                        x: '- $pML$',
                        y: '- $pMT$',
                    },
                    {
                        type: 'poster_page4',
                        id: 'poster_page4',
                        shadow: 'none',
                        editable: false,
                        w: '$fW$ + $pML$ + $pMR$',
                        h: '$fH$ + $pMT$ + $pMB$',
                        x: '- $pML$',
                        y: '- $pMT$',
                    }
                ],
                paper_allows: [
                    {
                        id: 'poster_paper',
                        min: 1,
                        max: 1,
                        default: 1,
                    },
                    {
                        id: 'lux_paper',
                        min: 1,
                        max: 1,
                        default: 1,
                    },
                ],
                print_options: {
                    cropTop: 3,
                    cropBottom: 3,
                    cropLeft: 3,
                    cropRight: 3,
                }
            },
        },
        areasList:['poster-12t749de-adb7-4136-48d4-ydr506b5dde4'],
        prices: [               // первый элемент списка будет дефолтным,
            {                   // поэтому нужна возможность сортировки
                id: 'A0',               // ссылка на формат
                type: 'A0',             // название типа
                format_price: 3000,     // стоимость базовая формата
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                active: true,
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            // {
                            //     id: 'id-lux_paper',    // ссылка на id
                            //     include: 1,         // включено в стоимость
                            //     count_price: 0,     // цена за штуку
                            //     fix_price: 300,     // поправка к общей стоимости
                            // },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        active: true,
                        parameters: [
                            {id: 'id-no', active: true, include: 0, count_price: 0, fix_price: 0},
                            // {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        active: true,
                        parameters: [
                            {id: 'id-no', active: true, include: 0, count_price: 0, fix_price: 0},
                            // {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            },
            {
                id: 'A1',
                format_price:
                    2000,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        active: true,
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                active: true,
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                active: false,
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        active: false,
                        parameters: [
                            {id: 'id-no', active: true, include: 0, count_price: 0, fix_price: 0},
                            // {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        active: true,
                        parameters: [
                            {id: 'id-no', active: true, include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', active: true, include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
            ,
            {
                id: 'A2plus',
                format_price:
                    1800,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
            ,
            {
                id: 'A2',
                format_price:
                    1500,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
            ,
            {
                id: 'A3plus',
                format_price:
                    1200,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
            ,
            {
                id: 'A3',
                format_price:
                    900,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
            ,
            {
                id: 'A4plus',
                format_price:
                    500,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
            ,
            {
                id: 'A4',
                format_price:
                    300,
                options: [      // первый элемент списка будет дефолтным,
                    {
                        id: 'id-paper',
                        parameters: [ // первый элемент списка будет дефолтным,
                            {
                                id: 'id-poster_paper', // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 0,       // поправка к общей стоимости
                            },
                            {
                                id: 'id-lux_paper',    // ссылка на id
                                include: 1,         // включено в стоимость
                                count_price: 0,     // цена за штуку
                                fix_price: 300,     // поправка к общей стоимости
                            },
                        ]
                    },
                    {
                        id: 'id-lamination',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    },
                    {
                        id: 'id-round_corners',
                        parameters: [
                            {id: 'id-no', include: 0, count_price: 0, fix_price: 0},
                            {id: 'id-yes', include: 0, count_price: 0, fix_price: 100},
                        ]
                    }
                ]
            }
        ]
    }
]);

//эмуляция ответов сервера
mock.onGet('/getoptions/').reply(200, [
    {id: 'id-paper', name: 'Бумага'},
    {id: 'id-lamination', name: 'Ламинирование'},
    {id: 'id-round_corners', name: 'Закругленные углы'},
]);

//эмуляция ответов сервера
mock.onGet('/getoptionsAll/').reply(200,
    {
        '1': {
            name: 'Ламинация',  // название, выводится на экран
            type: 'lamination',
            parameters: {
                '3': {
                    name: 'Без ламинации',
                    type: 'no',
                    props: {}       // какой угодно объект вида { 'prop1': 'String', 'prop2': 'String',.. }
                },
                '4': {
                    name: 'Глянцевая ламинация',
                    type: 'glance',
                    props: {}
                },
                '5': {
                    name: 'Матовая ламинация',
                    type: 'mat',
                    props: {}
                },
            },
        },
        '3': {
            name: 'decoration',
            type: 'decoration',
            parameters: {
                '6': {
                    name: 'Нет',
                    type: 'no',
                    description: 'description',
                    props: {}
                },
                '7': {
                    name: 'На подложке с рамкой',
                    type: 'frame',
                    description: 'Описание: На подложке с рамкой',
                    props: {}
                },
                '8': {
                    name: 'Накатка на пенокартон',
                    type: 'foamBoard',
                    description: 'description',
                    props: {}
                },
            },
        },
        '2': {
            name: 'Бумага',
            type: 'paper',
            parameters: {
                'id-poster_paper': {
                    name: 'Бумага для постера',
                    type: 'poster_paper',
                    props: {
                        size: 'format',
                        paper_thickness: 0.2,
                        paper_density: 200,
                        info: 'Описание бумаги'
                    }
                },
                'id-lux_paper': {
                    name: 'Бумага премиум',
                    type: 'lux_paper',
                    props: {
                        size: 'custom',
                        size_w: 600,
                        size_h: 1200,
                        paper_thickness: 0.2,
                        paper_density: 200,
                        info: 'Описание бумаги'
                    }
                },
                '1': {
                    name: 'Фотобумага глянцевая',
                    type: 'photo_paper_glance',
                    props: {
                        size: 'custom',
                        size_w: 600,
                        size_h: 1200,
                        paper_thickness: 0.2,
                        paper_density: 200,
                        info: 'Описание бумаги'
                    }
                },
                '2': {
                    name: 'Фотобумага матовая',
                    type: 'photo_paper_mat',
                    props: {
                        size: 'custom',
                        size_w: 600,
                        size_h: 1200,
                        paper_thickness: 0.2,
                        paper_density: 200,
                        info: 'Описание бумаги'
                    }
                },
            }
        }
    }
);

//эмуляция ответов сервера
/*
mock.onPost('/createPoster/').reply(200,
    {
        id: '654932154982436',
        userId: '0123571113',
        name: 'Постернейм'
    }
);*/

//эмуляция ответов сервера
mock.onGet('/getProducts/').reply(200,[
        {
            id: 'id-product-001',
            name: 'Постер',
            group: 'poster'
        },
        {
            id: 'id-product-002',
            name: 'Постер в рамке',
            group: 'poster'
        },
        {
            id: 'id-product-003',
            name: 'Пазл',
            group: 'other'
        },
        {
            id: 'id-product-004',
            name: 'Календарь настенный',
            group: 'calendar'
        },
        {
            id: 'id-product-005',
            name: 'Календарь настольный',
            group: 'calendar'
        },
        {
            id: 'id-product-006',
            name: 'Фотокнига в книжном переплете с твердой обложкой',
            group: 'photobook'
        },
        {
            id: 'id-product-007',
            name: 'Фотокнига в книжном переплете с мягкой обложкой',
            group: 'photobook'
        },
        {
            id: 'id-product-008',
            name: 'Фотокнига на пружине с твердой обложкой',
            group: 'photobook'
        },
        {
            id: 'id-product-009',
            name: 'Фотокнига на пружине с мягкой обложкой',
            group: 'photobook'
        },
        {
            id: 'id-product-010',
            name: 'Фотокнига на скрепке',
            group: 'photobook'
        },
    ]
);


export default axiosInstance;
