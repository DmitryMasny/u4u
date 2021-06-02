
// @ts-ignore
import {IMG_DIR} from "config/dirs";
// @ts-ignore
import {SLUGS} from 'const/productsTypes';



export interface ViewOptionsProps {
    id: string;
    preview?: string;
    src?: string;
    size?: number;
    max?: [number, number];
    min?: number;
    position?: {
        x?: number;
        y?: number;
        p?: number;
        po?: [number, number];
        rx?: number;
        ry?: number;
        rz?: number;
    }
}
export interface productDescProps {
    [name: string]: {
        print?: productDescItemProps;
        printDpi?: productDescItemProps;
        paper?: productDescItemProps|any;
        lamination?: productDescItemProps;
        pack?: productDescItemProps;
        time?: productDescItemProps;
        delivery?: productDescItemProps;
    }
}
export interface productDescItemProps {
    label: string;
    value: string;
}

export const VIEW_OPTIONS: ViewOptionsProps[] = [
    {id: 'pencil' },
    {
        id: 'white-n-chair',
        preview: `${IMG_DIR}posters/preview_1.jpg`,
        src: `${IMG_DIR}posters/view_1.jpg`,
        size: 2200,
        max: [1500, 1500],
        min: 1600,
        position: {
            x: 20, y: -16,
        }
    },
    {
        id: 'yellow',
        preview: `${IMG_DIR}posters/preview_4.jpg`,
        src: `${IMG_DIR}posters/view_4.jpg`,
        size: 3500,
        max: [2500, 1500],
        min: 1900,
        position: { x: 0, y: -20, }
    },
    {
        id: 'blue-livingroom',
        preview: `${IMG_DIR}posters/preview_5.jpg`,
        src: `${IMG_DIR}posters/view_5.jpg`,
        size: 3200,
        max: [2000, 1400],
        min: 1900,
        position: { x: 0, y: -20, }
    },
    {
        id: 'grey',
        preview: `${IMG_DIR}posters/preview_6.jpg`,
        src: `${IMG_DIR}posters/view_6.jpg`,
        size: 2100,
        max: [2200, 1100],
        min: 1900,
        position: { x: 20, y: -22}
    },
    {
        id: 'violet',
        preview: `${IMG_DIR}posters/preview_7.jpg`,
        src: `${IMG_DIR}posters/view_7.jpg`,
        size: 3000,
        max: [2200, 1100],
        min: 1900,
        position: {x: 10, y: -25}
    },
    // {
    //     id: 'beton-bed',
    //     preview: `${IMG_DIR}posters/preview_8.jpg`,
    //     src: `${IMG_DIR}posters/view_8.jpg`,
    //     size: 3500,
    //     max: [1200, 1100],
    //     min: 1000,
    //     position: {x: 7, y: -26, ry: -25, p: 200, po: [60, 48]}
    // },
];
const PAPER_DESCRIPTION_MAP = {
    "MEL_200": 'плотная мелованная',
    "PERGRAPHICA_ART": 'художественная',
    "ROLLED_MAT": 'матовая',
    "ROLLED_GLANCE": 'глянцевая',
    "ROLLED_ART": 'матовая',
};

const onlyExistPaper = (paper) => {
    if (!paper || !paper.length) return null;
    const existPapers = {};
    paper.map((p)=>{
        if (p.optionSlug) existPapers[p.optionSlug] = PAPER_DESCRIPTION_MAP[p.optionSlug];
    });

    const rolledPapers = [existPapers['ROLLED_MAT'], existPapers['ROLLED_GLANCE'], existPapers['ROLLED_ART']].filter((x)=>x)

    return {
        label: 'Бумага',
        value: existPapers['MEL_200'] ? (existPapers['PERGRAPHICA_ART'] ?
                `${existPapers['MEL_200']} или ${existPapers['PERGRAPHICA_ART']} бумага, 250 гр/м2`
                :
                `${existPapers['MEL_200']} бумага, 250 гр/м2`)
            : existPapers['PERGRAPHICA_ART'] ? `${existPapers['PERGRAPHICA_ART']} бумага, 250 гр/м2`
        : rolledPapers.length ?
            `${rolledPapers.join()} бумага для струйной печати`
            : null
    };
};

export const PRODUCT_DESC_DATA: productDescProps = {
    [SLUGS.POSTER_SIMPLE]: {
        print: { label: 'Печать', value: 'цифровая печать на Xerox Color C-800' },
        printDpi: { label: 'Разрешение печати', value: '300 dpi' },
        paper: onlyExistPaper,
        pack: { label: 'Упаковка', value: 'в надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза.' },
    },
    [SLUGS.POSTER_PREMIUM]: {
        print: { label: 'Печать', value: 'широкоформатная струйная печать на Epson SureColor SC-P8000.' },
        printDpi: { label: 'Разрешение печати', value: '2880 х 1440 dpi' },
        // paper: { label: 'Бумага', value: 'сатинированная фотобумага премиум класса 180-190 гр/м2.' },
        paper: onlyExistPaper,
        pack: { label: 'Упаковка', value: 'в надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза.' },
    },
    [SLUGS.POSTER_CANVAS]: {
        print: { label: 'Печать', value: 'широкоформатная струйная печать на Epson SureColor SC-P8000' },
        printDpi: { label: 'Разрешение печати', value: '2880 х 1440 dpi' },
        paper: { label: 'Холст', value: ' натуральный льняной холст долгого хранения 350-400 гр/м2.' },
        pack: { label: 'Упаковка', value: 'в надежный картонный тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза.' },
    },
    default: {
        pack: { label: 'Упаковка', value: 'надежный картонный конверт или тубус' },
        time: { label: 'Срок изготовления', value: '1 день' },
        delivery: { label: 'Доставка', value: 'по всей России курьером, почтой или в пункты самовывоза. Бесплатный самовывоз из офиса U4U в Москве.' },
    },
};