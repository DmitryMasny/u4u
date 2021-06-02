/** Interfaces */
interface IFontTypeItem {
    font: string;
}
interface IFontTypes {
    regular : IFontTypeItem,
    bold?   : IFontTypeItem,
    italic? : IFontTypeItem,
    boldItalic? : IFontTypeItem
}
interface IFont {
    id: number;
    name: string;
    title: string;
    types: IFontTypes;
}

const ROOT_FONTS = '/spa-img/fonts/'

/**
 * Константа описание шрифта
 */
export const FONTS: IFont[] = [
    {
        id: 1,
        name: 'Alice',
        title: 'Alice',
        types: {
            regular: {
                font: ROOT_FONTS + 'Alice-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Alice-Regular.ttf'
            }
        }
    },
    {
        id: 2,
        name: 'AmaticSC',
        title: 'AmaticSC',
        types: {
            regular: {
                font: ROOT_FONTS + 'AmaticSC-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'AmaticSC-Bold.ttf'
            }
        }
    },
    /*
    {
        id: 3,
        name: 'Bitter',
        title: 'Bitter',
        types: {
            regular: {
                font: ROOT_FONTS + 'Bitter-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Bitter-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'Bitter-Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'Bitter-BoldItalic.ttf'
            }
        }
    },*/
    {
        id: 4,
        name: 'Brygada1918',
        title: 'Brygada1918',
        types: {
            regular: {
                font: ROOT_FONTS + 'Brygada1918-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Brygada1918-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'Brygada1918-RegularItalic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'Brygada1918-BoldItalic.ttf'
            }
        }
    },
    {
        id: 5,
        name: 'CaviarDreams',
        title: 'CaviarDreams',
        types: {
            regular: {
                font: ROOT_FONTS + 'CaviarDreams.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'CaviarDreams_Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'CaviarDreams_Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'CaviarDreams_BoldItalic.ttf'
            }
        }
    },
    {
        id: 6,
        name: 'ChristmasScriptC',
        title: 'Christmas ScriptC',
        types: {
            regular: {
                font: ROOT_FONTS + 'Christmas ScriptC.ttf'
            }
        }
    },
    {
        id: 7,
        name: 'CormorantGaramond',
        title: 'CormorantGaramond',
        types: {
            regular: {
                font: ROOT_FONTS + 'CormorantGaramond-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'CormorantGaramond-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'CormorantGaramond-Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'CormorantGaramond-BoldItalic.ttf'
            }
        }
    },
    {
        id: 8,
        name: 'Cuprum',
        title: 'Cuprum',
        types: {
            regular: {
                font: ROOT_FONTS + 'Cuprum-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Cuprum-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'Cuprum-Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'Cuprum-BoldItalic.ttf'
            }
        }
    },
    /*
    {
        id: 9,
        name: 'Kazmann Sans',
        title: 'Kazmann Sans',
        types: {
            regular: {
                font: ROOT_FONTS + 'Kazmann Sans.ttf'
            }
        }
    },*/
    /*
    {
        id: 10,
        name: 'Oswald',
        title: 'Oswald',
        types: {
            regular: {
                font: ROOT_FONTS + 'Oswald-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Oswald-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'Oswald-RegularItalic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'Oswald-BoldItalic.ttf'
            }
        }
    },*/
    {
        id: 11,
        name: 'Philosopher',
        title: 'Philosopher',
        types: {
            regular: {
                font: ROOT_FONTS + 'Philosopher-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Philosopher-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'Philosopher-Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'Philosopher-BoldItalic.ttf'
            }
        }
    },
    /*
    {
        id: 12,
        name: 'Prata-Regular',
        title: 'Prata-Regular',
        types: {
            regular: {
                font: ROOT_FONTS + 'Prata-Regular.ttf'
            }
        }
    },*/
    {
        id: 13,
        name: 'Prosto',
        title: 'Prosto',
        types: {
            regular: {
                font: ROOT_FONTS + 'Prosto.ttf'
            }
        }
    },
    /*
    {
        id: 14,
        name: 'PTSerifRegular',
        title: 'PTSerif-Regular',
        types: {
            regular: {
                font: ROOT_FONTS + 'PTSerif-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'PTSerif-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'PTSerif-Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'PTSerif-BoldItalic.ttf'
            }
        }
    },*/
    {
        id: 15,
        name: 'Roboto',
        title: 'Roboto',
        types: {
            regular: {
                font: ROOT_FONTS + 'Roboto-Regular.ttf'
            },
            bold: {
                font: ROOT_FONTS + 'Roboto-Bold.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'Roboto-Italic.ttf'
            },
            boldItalic: {
                font: ROOT_FONTS + 'Roboto-BoldItalic.ttf'
            }
        }
    },
    {
        id: 16,
        name: 'RussoOne',
        title: 'Russo_One',
        types: {
            regular: {
                font: ROOT_FONTS + 'Russo_One.ttf'
            }
        }
    },
    {
        id: 17,
        name: 'TMVinogradFilled',
        title: 'TMVinograd-Filled',
        types: {
            regular: {
                font: ROOT_FONTS + 'TMVinograd-Filled.ttf'
            }
        }
    },
    /*
    {
        id: 18,
        name: 'yiggivoo-unicode',
        title: 'yiggivoo-unicode',
        types: {
            regular: {
                font: ROOT_FONTS + 'yiggivoo-unicode-regular.ttf'
            },
            italic: {
                font: ROOT_FONTS + 'yiggivoo-unicode-italic.ttf'
            },
        }
    }*/
];