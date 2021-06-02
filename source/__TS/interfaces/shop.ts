import {productDescItemProps} from "../components/ProductSet/_config";

/**
 * Интерфесы магазина
 */
export interface Props {
    match: any;
    history: any;
}
export interface ShopWrapProps {
    isMobile: boolean; //флаг мобильного устройства
}
export interface IredirectProps {
    id?: string|number;
    page?: string|number;
    category?: string|number;
    productType?: string|number;
    format?: string|number;
    pageName?: string|number;
    replace?: boolean;
}

export interface IIconSizes {
    aspect: number;
    w?: number;
    h?: number;
}
export interface IFormatIcon {
    format: string;
}

export type Iredirect = (prop: IredirectProps) => any;

// Описание продукта
export interface IproductDesc {
    [name: string]: {
        print?: productDescItemProps;
        printDpi?: productDescItemProps;
        paper?: productDescItemProps;
        lamination?: productDescItemProps;
        pack?: productDescItemProps;
        time?: productDescItemProps;
        delivery?: productDescItemProps;
    }
}


// _CategoriesList.tsx
export interface IcategoriesList {
    isMobile?: boolean;      //флаг мобильного устройства
    category: string;       //категория товара
    categoriesList: any;    // все категории
    setCategory: (string) => any;   //выбрать категорию товара
}

export interface IcategoryItemProps {
    active: boolean;  //true если выбрана текущая категория
}
