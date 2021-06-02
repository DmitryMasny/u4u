interface IPageStructurePage {
    type?: string;
    name?: string;
    renderBarcodeOnPage?: boolean;
    disableMove?: boolean;
}
interface IPageStructure {
    minAreas: number;
    maxAreas: number;
    startAreas: number;
    disableBarcode?: boolean;
    areas?: {
        [key: string]: IPageStructurePage
    };
}


const getPagesStructure = ( { productSlug }: { productSlug: string } ): IPageStructure => {

    switch( productSlug ) {
        case 'CALENDAR_WALL_FLIP':
            return {
                minAreas: 14,
                maxAreas: 14,
                startAreas: 14,
                disableBarcode: true,
                areas: {
                    '0': {
                        type: 'cover',
                        name: 'обложка',
                        disableMove: true
                    },
                    'last': {
                        renderBarcodeOnPage: true,
                    }
                }
            }
        case 'CALENDAR_TABLE_FLIP':
            return {
                minAreas: 14, //+1 пустая
                maxAreas: 14,
                startAreas: 14,
                disableBarcode: true,
                areas: {
                    '0': {
                        type: 'cover',
                        name: 'обложка',
                        disableMove: true
                    },
                    '1': {
                        type: 'empty',
                        name: 'пустая',
                        disableMove: false
                    },
                    'last': {
                        type: 'empty',
                        renderBarcodeOnPage: true,
                        name: 'пустая',
                        disableMove: false
                    }
                }
            }
        case 'CALENDAR_WALL_SIMPLE':
        case 'PUZZLE_SIMPLE':
        default:
            return {
                minAreas: 1,
                maxAreas: 1,
                startAreas: 1
            }
    }
}

export { getPagesStructure }