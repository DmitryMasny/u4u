/**
 * Генератор ссылкок для построения статики для SEO
 * @type {string}
 */
const fs = require( 'fs' );
const path = require('path');
const { promisify } = require('util')
const cities = require( './cities.js');
//const words  = require('./words.js');

//-------- КОНФИГ
const siteRoot = 'https://u4u.ru';
//const dir = './../../../app-links/';
const dir = './app-links/';

const CITY_KEY = ':city/';
const BINDING_KEY = ':coverType-:bindingType-:size-:glance';
const DATA_KEY = ':data';
const CHUNK_SIZE = 5000;

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
    '/:city/blog/',
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



