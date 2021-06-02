/**
 * Генератор ссылкок для sitemap
 * @type {string}
 */
const start= new Date().getTime();

const fs = require( 'fs' );
const MD5 = require( 'crypto-js/md5' );

//const cyrillicToTranslit = require('./../../node_modules/cyrillic-to-translit-js');
const rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
      eng = "shh sh ch cz yu ya yo zh $$ y+ e$ a b v g d e z i j k l m n o p r s t u f x $".split(/ +/g);

const CyrillicToLatin = ( text, separator ) => {
    for ( let x = 0; x < rus.length; x++ ) {
        text = text.split( rus[ x ] ).join( eng[ x ] );
        text = text.split( rus[ x ].toUpperCase() ).join( eng[ x ].toUpperCase() );
    }
    if ( separator ) text = text.split( ' ' ).join( separator );
    return text;
}

//console.log('cyrillicToTranslit', cyrillicToTranslit().reverse("9_Sankt-Peterburge_v.Sankt-Peterburge","."));

const path = require('path');
const wordsFile  = require( './words.js');

//-------- КОНФИГ
const siteRoot = 'https://u4u.ru';
const dir = './map/';
const app_links_dir = './app-links/';
const URLsLimitByFile = 3000; //количество ссылок в одном xml файле

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

const wordsBlocksCount = wordsFile.length;

/**
 * преобразуем крилиллицу в транслит с разделителем точка
 * @param text
 * @returns text
 */
const cyrillicToTranslit = ( text ) => CyrillicToLatin( text, '.' );

console.log( '' );
console.log( '' );
console.log( '************** ГЕНЕРАЦИЯ КАРТЫ САЙТА ******************');


/*let links = [
        `${siteRoot}/`,
        `${siteRoot}/fotoknigi/hard-glue/`,
        `${siteRoot}/fotoknigi/soft-glue/`,
        `${siteRoot}/fotoknigi/hard-spring/`,
        `${siteRoot}/fotoknigi/soft-spring/`,
        `${siteRoot}/fotoknigi/soft-clip/`,
        `${siteRoot}/sozdat-fotoknigu/`,
        `${siteRoot}/kalkulyator/`,
        `${siteRoot}/info/o-kompanii/`,
        `${siteRoot}/info/dostavka-i-oplata/`,
        `${siteRoot}/pomosch/start`,
        `${siteRoot}/pomosch/redaktor`,
        `${siteRoot}/pomosch/my-photos`,
        `${siteRoot}/pomosch/photo-edit`,
        `${siteRoot}/pomosch/text-edit`,
        `${siteRoot}/pomosch/pages-edit`,
        `${siteRoot}/pomosch/binding`,
        `${siteRoot}/pomosch/order`,
        `${siteRoot}/pomosch/uvedomleniya`,
        `${siteRoot}/pomosch/promo`,
        `${siteRoot}/requisites/`,
        `${siteRoot}/offer/`
    ],*/
/*
let linksSource = [...links];

links = links.map( item => `
    <url>
        <loc>${item}</loc>
    </url>` );
*/

let totalCount = 0,
    fileNumber = 1;
    fileNumberLink = 1;

//Создадим директирию, если ее еще нет map
if ( !fs.existsSync( dir ) ) {
    fs.mkdirSync( dir );
} else {
    //удалим все файлы из директории
    const files = fs.readdirSync( dir );

    for ( const file of files ) {
        fs.unlinkSync( path.join( dir, file ));
    }
}

//Создадим директирию, если ее еще нет для app_links
if ( !fs.existsSync( app_links_dir ) ) {
    fs.mkdirSync( app_links_dir );
} else {
    //удалим все файлы из директории
    const files = fs.readdirSync( app_links_dir );

    for ( const file of files ) {
        fs.unlinkSync( path.join( app_links_dir, file ));
    }
}

const saveFileData = ( data ) => {
    const fileName = `sitemap${fileNumber}.xml`;
    fileNumber++;

    data = data.join('');
    data = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${data}
</urlset>`;

    fs.writeFile( dir + fileName, data, function ( err ) {
        if ( err ) {
            return console.log( err );
        }

        return console.log( `Фаил ${fileName} сохранен.` );
    } );
};

const saveFileLinksData = ( data ) => {
    const fileName = `links${fileNumberLink}.js`;
    fileNumberLink++;
    const renderedString = data.map(link=> {
        const md5 = (link === '/' ? 'index' : MD5( link ).toString());
        return (`["${md5}","${link}"]`);

    }).join(',\n');
    data = `module.exports = (function() {
        return [${renderedString}]
    })();`


    fs.writeFile( app_links_dir + fileName, data, function ( err ) {
        if ( err ) {
            return console.log( err );
        }

        return console.log( `Фаил ссылок ${fileName} сохранен.` );
    } );
};

/**
 * Собираем основной XML файил карты
 * @param filesCount
 */
const createMainXmlFile = ( filesCount ) => {

    let urls = '';

    for ( let i = 1; i < filesCount; i++ ) {
        if (urls !== '') {
            urls += `
    <sitemap>
        <loc>${siteRoot}/sitemap${i}.xml</loc>
    </sitemap>`;
        } else {
            urls += `<sitemap>
       <loc>${siteRoot}/sitemap${i}.xml</loc>
    </sitemap>`;
        }
    };

    const fileContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
</sitemapindex>`;
    fs.writeFile( dir + 'sitemap.xml', fileContent, function ( err ) {
        if ( err ) {
            return console.log( err );
        }
        return console.log( `Фаил sitemap.xml сохранен.` );
    } );


};

let links = [],
    linksForXml = [];

let basicUrls = {};

for ( let i = 0; i < wordsBlocksCount; i++ ) { //перебираем блоки (ссылки)
    const { url, text, words } = wordsFile[ i ];

    //основая ссылка на страницу
    if ( !basicUrls[ url ] ) {
        links.push( url );
        basicUrls[ url ] = true;
    }

    //собираем в массив все ссылки по комбинации слов
    for ( let wordsItem of words ) {
        //const keys = Object.keys( wordsItem );
        let w = {};
        for ( w[ 1 ] of wordsItem[ 1 ] ) {
            for ( w[ 2 ] of wordsItem[ 2 ] ) {
                for ( w[ 3 ] of wordsItem[ 3 ] ) {
                    for ( w[ 4 ] of wordsItem[ 4 ] ) {
                        for ( w[ 5 ] of wordsItem[ 5 ] ) {
                            for ( w[ 6 ] of wordsItem[ 6 ] ) {
                                for ( w[ 7 ] of wordsItem[ 7 ] ) {
                                    for ( w[ 9 ] of wordsItem[ 9 ] ) {
                                        for ( w[ 10 ] of wordsItem[ 10 ] ) {

                                            let seoLinks = [];
                                            for ( let k in w ) {
                                                seoLinks.push( `${k}_${w[ k ]}` );
                                            }
                                            const l = cyrillicToTranslit( url + 's=' + seoLinks.join( '=' ) + '=txt_' + text );

                                            links.push( l );

                                            linksForXml.push( `
                                                <url>
                                                    <loc>${siteRoot}${l}</loc>
                                                </url>`
                                            );

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if ( links.length > URLsLimitByFile ) {
        saveFileData( linksForXml );
        saveFileLinksData( links );
        totalCount += links.length;
        linksForXml=[];
        links = [];
    }
}

saveFileData( linksForXml );
saveFileLinksData( links );

createMainXmlFile( fileNumber );

const end = new Date().getTime();

console.log( '' );
console.log( 'Сгенерировано ссылок', totalCount + links.length );
console.log( '' );
console.log( `Время генерации: ${parseInt((end - start)) / 1000} сек.` );
console.log( '' );
console.log( '*******************************************************');
console.log( '' );

    /*for ( let onceCurrent = 0; onceCurrent < onceMax; onceCurrent++ ) {
        for ( let repeatCurrent = 0; repeatCurrent < repeatMax; repeatCurrent++ ) {

            let linksWords = '';

            o.keyOnce.map( ( obj ) => {
                const words = once[ obj.key ];

                if ( obj.position < (words.length - 1) ) {
                    obj.position++;
                }

                linksWords += '=' + obj.key + '_' + words[ obj.position ];
            });

            o.keyRepeat.map( obj => {
                const words = repeat[ obj.key ];

                obj.position++;

                if ( obj.firstLoop ) {
                    if ( obj.position > (words.length - 1) ) {
                        obj.position = 0;
                        obj.firstLoop = false;
                    }
                } else {
                    if ( obj.position > (words.length - 1) || obj.position > nextLoopsSizeLimit ) {
                        obj.position = 0;
                    }
                }

                linksWords += '=' + obj.key + '_' + words[ obj.position ];
            });

            //без города
            const link_wo_city = `${siteRoot}/c${linksWords}`;
            links.push( `
    <url>
        <loc>${cyrillic_to_translit(link_wo_city)}</loc>
    </url>` );

            //подставляем города
            Object.keys( cities ).map( ( key ) => {
               const city = cities[key],
                     link_w_city = `${siteRoot}/c${linksWords}=9_${city[ 0 ]}_${city[ 1 ]}`;
               linksSource.push( cyrillic_to_translit(link_w_city) );
               links.push( `
                <url>
                    <loc>${cyrillic_to_translit(link_w_city)}</loc>
                </url>` );
            });

            if ( links.length > URLsLimitByFile ) {
                saveFileData( links );
                saveFileLinksData( linksSource );
                totalCount += links.length;
                linksSource=[];
            }

        }
    }*/



    //console.log('o', o);
    //console.log('onceMax', onceMax);
    //console.log('repeatMax', repeatMax);
//}
//saveFileData( links );
//totalCount += links.length;


//const { citiesFilesCount, linksCount } = startGenerateForCities( fileNumber, cyrillic_to_translit );

//const { citiesFilesCountPosters, linksCountPosters } = startGenerateForPosters( fileNumber + citiesFilesCount, cyrillic_to_translit );

/*
createMainXmlFile( fileNumber + citiesFilesCount + citiesFilesCountPosters );

const end = new Date().getTime();

console.log( '' );
console.log( 'Сгенерировано обычных ссылок', totalCount );
console.log( 'Сгенерировано ссылок для "городов"', linksCount );
console.log( 'Сгенерировано ссылок для ПОСТОВ, ФОТОГРАФИЙ И ХОЛСТОВ', linksCountPosters );
console.log( 'Сгенерировано итого ссылок', totalCount + linksCount + linksCountPosters);
console.log( '' );
console.log( `Время генерации: ${parseInt((end - start)) / 1000} сек.` );
console.log( '' );
console.log( '*******************************************************');
console.log( '' );
*/



//const CHUNK_SIZE = 5000;

/*
const mainLinks = [
    '/:city/:data/',
    '/:city/kalkulyator/:data/',
    '/:city/sozdat-fotoknigu/:data/',
    '/:city/fotoknigi/:coverType-:bindingType-:size-:glance/:data/',
    '/:city/info/:data',
    '/:city/info/kontakty/:data/',
    '/:city/info/o-kompanii/:data/',
    // INFO_ONLINE_EDITOR:     '/info/redaktor/',
    // INFO_NOTIFICATIONS:     '/info/sms-i-email-uvedomleniya/',
    // INFO_PRICES:            '/info/ceny-i-razmery/',
    '/:city/info/dostavka-i-oplata/:data/',
    '/:city/pomosch/:data/',
    //'/:city/pomosch/:tab',
    '/:city/requisites/:data/',
    '/:city/offer/:data/',
];*/

/*
const mainLinks = [
    '/:city/',
    '/:city/kalkulyator/',
    '/:city/sozdat-fotoknigu/',
    '/:city/fotoknigi/:coverType-:bindingType-:size-:glance/',
    '/:city/info/',
    '/:city/info/kontakty/',
    '/:city/info/o-kompanii/',
    // INFO_ONLINE_EDITOR:     '/info/redaktor/',
    // INFO_NOTIFICATIONS:     '/info/sms-i-email-uvedomleniya/',
    // INFO_PRICES:            '/info/ceny-i-razmery/',
    '/:city/info/dostavka-i-oplata/',
    '/:city/pomosch/',
    //'/:city/pomosch/:tab',
    '/:city/requisites/',
    '/:city/offer/',
];


const coversMap = {
    'hard-glue': {
        '20x20': ['glance', 'mate'],
        '20x30': ['glance', 'mate'],
        '30x20': ['glance', 'mate'],
        '30x30': ['glance', 'mate']
    } ,
    'soft-glue': {
        '20x20': ['glance', 'mate'],
        '20x30': ['glance', 'mate'],
    } ,
    'hard-spring': {
        '20x20': ['glance'],
        '20x30': ['glance'],
        '30x20': ['glance'],
        '30x30': ['glance']
    },
    'soft-spring': {
        '20x20': ['glance', 'mate'],
    },
    'soft-clip': {
        '20x20': ['glance', 'mate'],
        '20x30': ['glance', 'mate'],
    }
};

let finalLinks = [];

//-------- ПОСТРОЕНИЕ ССЫЛОК

//прерващаем в массив
const toArray = ( a ) => Array.isArray( a ) ? a : [a];

//добавляем город
const _addCity = ( links ) => {
    links = toArray( links );
    let newLinks = [];

    const citiesUrlKeys = Object.keys( cities );

    //перебераем массив ссылок
    links.forEach(( link ) => {

        //если есть поле :city
        if ( ~link.indexOf( CITY_KEY ) ) {
            citiesUrlKeys.forEach( ( city ) => newLinks.push( link.replace( CITY_KEY, city.length ? city + '/' : '' ) ) );
        } else {
            newLinks.push( link );
        }

    });

    return newLinks;
};
//вставляем переплет
const _addProducts = ( links ) => {
    links = toArray( links );
    let newLinks = [];

    const coversMapKeys = Object.keys( coversMap );

    //перебераем массив ссылок
    links.forEach(( link ) => {
        //если есть поле :coverType-:bindingType
        if ( ~link.indexOf( BINDING_KEY ) ) {

            coversMapKeys.forEach( ( coverType ) =>
                                       Object.keys(coversMap[coverType]).forEach( ( format ) =>
                                                                                      coversMap[coverType][format].forEach( ( laminationType ) => {
                                                                                          newLinks.push( link.replace( BINDING_KEY, [coverType, format, laminationType].join('-') ) );
                                                                                      })
                                       )
            );

        } else {
            newLinks.push( link );
        }

    });

    return newLinks;
};
//вставляем данные и слова
const _addData = ( links ) => {
    links = toArray( links );
    let newLinks = [];

    //const coversMapKeys = Object.keys( coversMap );

    //перебераем массив ссылок
    links.forEach(( link ) => {
        //если есть поле :coverType-:bindingType
        if ( ~link.indexOf( DATA_KEY ) ) {

            for (let i=0; i < 5; i++) {
                newLinks.push( link.replace( DATA_KEY, i ) );
            }

        } else {
            newLinks.push( link );
        }

    });

    return newLinks;
};
mainLinks.forEach(( linkSource ) => {
    let midLinks = linkSource;

    //вставляем город
    midLinks =_addCity( midLinks );

    //вставляем переплеты
    midLinks =_addProducts( midLinks );

    //вставляем данные
    //midLinks =_addData( midLinks );


    midLinks.forEach( ( l ) => finalLinks.push( l ) );
});

console.log('Срегенированно ' + finalLinks.length + 'ссылок');



//console.log('words', words);



//-------- СОХРАНЕНИЕ В ФАИЛ




//Создадим директирию, если ее еще нет
if ( !fs.existsSync( dir ) ) {
    fs.mkdirSync( dir );
} else {

    //удалим все файлы из директории
    const files = fs.readdirSync( dir );

    for ( const file of files ) {
        fs.unlinkSync( path.join( dir, file ));
    }
}



let html = '', i, j, n = 0, temparray = [], chunk = CHUNK_SIZE;

for ( i = 0, j = finalLinks.length; i < j; i += chunk ) {
    n++;
    temparray = finalLinks.slice( i, i + chunk );

    html = `
        module.exports = (function() {
            return ` + JSON.stringify( temparray ) + `    
        })();
    `;

    (function ( z, h ) {
        fs.writeFile( dir + "links" + n + ".js", h, function ( err ) {
            if ( err ) {
                return console.log( err );
            }

            return console.log( "Фаил " + z + " сохранен." );
        } );
    })( n, html );
}

*/

