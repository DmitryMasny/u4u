/**
 * Генератор ссылкок для sitemap
 * @type {string}
 */
const fs = require( 'fs' );
//const { promisify } = require('util');
//const cities = require( './cities.js');
const words = require( './words.js' );
const cyrillicToTranslit = require('cyrillic-to-translit-js');

//-------- КОНФИГ
const siteRoot = 'https://u4u.ru';
const dir = './map/';
const URLsLimitByFile = 10000; //количество ссылок в одном xml файле
const nextLoopsSize = 3000; //количество используемых слов после первого цикла

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

const startGenerateForCities = ( fileStartNumber, cyrillic_to_translit ) => {

    const blocksCount = words.length;

    console.log( '' );
    console.log( '' );
    console.log( '************** ГЕНЕРАЦИЯ КАРТЫ САЙТА ДЛЯ FOR_CITIES ******************' );

    const getKeys = ( obj, a ) => {
        let b = [];
        const x = Object.keys( obj ).map( ( i ) => {
            b.push( obj[ i ].length );
            return {
                key: i, position: -1, firstLoop: true
            }
        } );
        a( Math.max( ...b ) );
        return x;
    };

    let links = [],
        totalCount = 0,
        fileNumber = fileStartNumber;

//Создадим директирию, если ее еще нет
    /*
    if ( !fs.existsSync( dir ) ) {
        fs.mkdirSync( dir );
    } else {
        //удалим все файлы из директории
        const files = fs.readdirSync( dir );

        for ( const file of files ) {
            fs.unlinkSync( path.join( dir, file ));
        }
    }*/

    const saveFileData = ( data ) => {
        const fileName = `sitemap${fileNumber}.xml`;
        fileNumber++;

        data = data.join( '' );
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

    for ( let i = 0; i < blocksCount; i++ ) { //перебираем блоки
        const b = words[ i ],
              { once, repeat, mix, config, textId } = b;

        let nextLoopsSizeLimit = config && config.nextLoopsSize || nextLoopsSize,
            onceMax = 0,
            repeatMax = 0,
            o = {
                keyOnce: once && getKeys( once, a => onceMax = a ) || 0,
                keyRepeat: repeat && getKeys( repeat, a => repeatMax = a ) || 0
            };

        //если есть смешанные, используем их
        if ( mix ) {
            const keys = Object.keys( mix );

            const getAllParams = ( keyNumber, linkString ) => {
                if ( !keys[ keyNumber ] ) {
                    links.push( `
    <url>
        <loc>${cyrillic_to_translit( `${linkString}=textId_${textId}` )}</loc>
    </url>` );

                    if ( links.length > URLsLimitByFile ) {
                        saveFileData( links );
                        totalCount += links.length;
                        links = [];
                    }
                    return;
                }
                mix[ keys[ keyNumber ] ].map( data => {
                    getAllParams( keyNumber + 1, `${linkString}/${keys[ keyNumber ]}_${data}`);
                });
            };

            getAllParams( 0, `${siteRoot}/c` );
        }
        //если нет Once и Repeat то прерываем текущую итерацию for и начинаем следующую
        if ( !once && !repeat ) continue;

        for ( let onceCurrent = 0; onceCurrent < onceMax; onceCurrent++ ) {
            for ( let repeatCurrent = 0; repeatCurrent < repeatMax; repeatCurrent++ ) {

                let linksWords = '';

                o.keyOnce.map( obj => {
                    const words = once[ obj.key ];

                    if ( obj.position < (words.length - 1) ) {
                        obj.position++;
                    }

                    linksWords += '=' + obj.key + '_' + words[ obj.position ];
                } );

                o.keyRepeat.map( ( obj ) => {
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
                } );

                linksWords+='=textId_' + textId;

                //без города
                const link_wo_city = `${siteRoot}/c${linksWords}`;
                links.push( `
    <url>
        <loc>${cyrillic_to_translit( link_wo_city )}</loc>
    </url>` );

                //подставляем города
                /*
                Object.keys( cities ).map( ( key ) => {
                    const city = cities[ key ],
                        link_w_city = `${siteRoot}/c${linksWords}/9_${city[ 0 ]}_${city[ 1 ]}`;
                    links.push( `
    <url>
        <loc>${encodeURI( link_w_city )}</loc>
    </url>` );
                } );*/

                if ( links.length > URLsLimitByFile ) {
                    saveFileData( links );
                    totalCount += links.length;
                    links = [];
                }

            }
        }
        //console.log('o', o);
        //console.log('onceMax', onceMax);
        //console.log('repeatMax', repeatMax);
    }
    saveFileData( links );
    totalCount += links.length;

    return {
        citiesFilesCount: fileNumber - fileStartNumber,
        linksCount: totalCount
    };
};

module.exports = startGenerateForCities;



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

