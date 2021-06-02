/**
 * Интерфесы админки магазина
 */
export interface Props {
    match: {params: {productId: string}};
    history: any;
}

export interface Ipages {
    current: number;
    total: number;
}

//_MyShopTopPanel
export interface ImyShopTopPanel {
    isMobile: boolean; //флаг мобильного устройства
    tab: string; //выстота блока
    setTab: (string)=>any; //выстота блока
}

