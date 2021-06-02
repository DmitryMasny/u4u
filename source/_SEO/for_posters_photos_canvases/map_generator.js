/**
 * Генератор ссылкок для sitemap
 * @type {string}
 */
const fs = require( 'fs' );
//const { promisify } = require('util');
const cities = require( './cities.js');
//const words = require( './words.js' );

//-------- КОНФИГ
const siteRoot = 'https://u4u.ru';
const dir = './map/';
const URLsLimitByFile = 10000; //количество ссылок в одном xml файле
const nextLoopsSize = 3000; //количество используемых слов после первого цикла

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

let linksObjects = [
    { url: `${siteRoot}/postery/4` },
    { url: `${siteRoot}/postery/6` },
    { url: `${siteRoot}/photo/5` },
    { url: `${siteRoot}/photo/7` },
    { url: `${siteRoot}/canvas/8` },
    { url: `${siteRoot}/sozdat-fotoknigu/0`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/2`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/3`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/4`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/5`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/7`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/8`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/9`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/10`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/11`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/12`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/13`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/14`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/15`, textId: '1' },
    { url: `${siteRoot}/sozdat-fotoknigu/16`, textId: '1' }
];


const startGenerateForPosters = ( fileStartNumber, cyrillic_to_translit ) => {

    //const blocksCount = words.length;

    console.log( '' );
    console.log( '' );
    console.log( '************** ГЕНЕРАЦИЯ КАРТЫ САЙТА ДЛЯ ПОСТЕРОВ, ФОТОГРАФИЙ И ХОЛСТОВ ******************' );

    let links = [],
        totalCount = 0,
        fileNumber = fileStartNumber;

    /*
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


    //подставляем города

    linksObjects.map( ( { url, textId = null } ) => {
        Object.keys( cities ).map( ( key ) => {
            const city = cities[ key ];
            let link_w_city = `${url}/c=9_${city[ 0 ]}_${city[ 1 ]}`;

            if ( textId ) link_w_city += `=textId_${textId}`;

            links.push( `
        <url>
            <loc>${cyrillic_to_translit( link_w_city )}</loc>
        </url>` );
        } );

        if ( links.length > URLsLimitByFile ) {
            saveFileData( links );
            totalCount += links.length;
            links = [];
        }
    });



    saveFileData( links );
    totalCount += links.length;

    return {
        citiesFilesCountPosters: fileNumber - fileStartNumber,
        linksCountPosters: totalCount
    };
};

module.exports = startGenerateForPosters;



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

