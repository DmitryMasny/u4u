/**
 * Генератор слов для создания индекса
 * @type {string}
 */
const fs = require( 'fs' );
const path = require( 'path' );
const cities = require( './cities.js');

const csvFile = [
    {
        title: 'ТЕКСТ ОБЩИЙ НА ГЛАВНУЮ СТРАНИЦУ',
        url: ['/'],
        text: 'mainpage',
        file: './words/mainPage.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ ОБЩИЙ НА ГЛАВНУЮ СТРАНИЦУ 2',
        url: ['/'],
        text: 'mainpage2',
        file: './words/mainPage2.csv'
    },
    {
        title: 'ФОТОАЛЬБОМ/ АЛЬБОМ - ТЕКСТ НА ГЛАВНУЮ СТРАНИЦУ ДЛЯ ГЛАГОЛОВ + (ГОРОДА)',
        url: ['/'],
        text: 'mainpage3',
        file: './words/mainPage3.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ НА ГЛАВНУЮ СТРАНИЦУ ДЛЯ ГЛАГОЛОВ (ГОРОДА)',
        url: ['/'],
        text: 'mainpage4',
        file: './words/mainPage4.csv'
    },
    {
        title: 'ФОТОАЛЬБОМ/АЛЬБОМ - ТЕКСТ ОБЩИЙ НА СТРАНИЦУ ГАЛЕРЕЯ + (ГОРОДА)',
        url: ['/sozdat-fotoknigu/'],
        text: 'gallery',
        file: './words/galleryPage.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ ОБЩИЙ НА СТРАНИЦУ ГАЛЕРЕЯ (ГОРОДА)',
        url: ['/sozdat-fotoknigu/2/'],
        text: 'gallery2',
        file: './words/galleryPage2.csv'
    },
    {
        title: 'ФОТОАЛЬБОМ/АЛЬБОМ - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (свадебный) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/3/'],
        text: 'gallery3',
        file: './words/galleryPage3.csv'
    },
    {
        title: 'ФОТОАЛЬБОМ/АЛЬБОМ - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (выпускной) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/4/'],
        text: 'gallery4',
        file: './words/galleryPage4.csv'
    },
    {
        title: 'ФОТОАЛЬБОМ/АЛЬБОМ - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (детский) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/5/'],
        text: 'gallery5',
        file: './words/galleryPage5.csv'
    },
    {
        title: 'ФОТОАЛЬБОМ/АЛЬБОМ - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (семейный) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/7/'],
        text: 'gallery6',
        file: './words/galleryPage6.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (свадебная) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/8/'],
        text: 'gallery7',
        file: './words/galleryPage7.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (выпускная) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/9/'],
        text: 'gallery8',
        file: './words/galleryPage8.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ (детская) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/10/'],
        text: 'gallery9',
        file: './words/galleryPage9.csv'
    },
    {
        title: 'ФОТОКНИГА - ТЕКСТ НА СТРАНИЦУ ГАЛЕРЕЯ ДЛЯ ПРИЛАГАТЕЛЬНЫХ ( семейная) - (ГОРОДА)',
        url: ['/sozdat-fotoknigu/11/'],
        text: 'gallery10',
        file: './words/galleryPage10.csv'
    },
    {
        title: 'КАЛЕНДАРИ - СОЗДАТЬ КАЛЕНДАРЬ ОДНОСТРАНИЧНЫЙ - (ГОРОДА)',
        url: ['/product/9/'],
        text: 'calendar',
        file: './words/calendarPage.csv'
    },
    {
        title: 'КАЛЕНДАРИ - СОЗДАТЬ КАЛЕНДАРЬ ПЕРЕКИДНОЙ - (ГОРОДА)',
        url: ['/product/10/'],
        text: 'calendar1',
        file: './words/calendarPage.csv'
    },
    {
        title: 'КАЛЕНДАРИ - СОЗДАТЬ КАЛЕНДАРЬ НАСТОЛЬНЫЙ - (ГОРОДА)',
        url: ['/product/11/'],
        text: 'calendar2',
        file: './words/calendarPage.csv'
    }
];



const addCity = ( city ) => {
    if ( typeof city !== 'string' ) return '';
    const cityCapitalized = city.charAt( 0 ).toUpperCase() + city.slice( 1 );

    if ( city === 'Z' || city === 'z' ) return 'z';

    let pluralArray = null,
        pluralArray2 = null,
        pluralArray3 = null;

    for ( let key in cities ) {
        if ( cities[ key ][ 0 ] === cityCapitalized ) {
            pluralArray = cities[ key ][ 1 ];
            pluralArray2 = cities[ key ][ 2 ];
            pluralArray3 = cities[ key ][ 3 ];
            break;
        }
    }

    if ( pluralArray ) return [cityCapitalized, pluralArray, pluralArray2, pluralArray3].join( '_' );

    return [cityCapitalized, cityCapitalized, cityCapitalized, cityCapitalized].join( '_' );
}

const getSeoTexts = ( str ) => {
    //str = str.split( /(".*?"|[^",]+)(?=\s*,|\s*$|,)/g )[ 3 ];
    str = str.replace('\n', '').replace(/^(.+?),|,*$/g, '');
    str = str.replace(/^"|"$/gm, '').replace(/[ ]{2,}/gm, ' ');
    str = str.replaceAll("'", '"').replaceAll("’", '"');
    return str;
}

const createWordsArray = ( file ) => {

    const words = fs.readFileSync( file, "utf8" );
    let wordsArray = words.split( /\r?\n|\r/g );

    const title = wordsArray.shift(),
          description = wordsArray.shift(),
          seo = wordsArray.shift();

    console.log('wordsArray', wordsArray);

    wordsArray = wordsArray.map( string => {
        string = string.replace( /\r?\n|\r/g, '' )
                       .replace( ',,,', ',z,z,' )
                       .replace( ',,', ',z,' );


        let item = string.split( /(".*?"|[^",]+)(?=\s*,|\s*$|,)/g )
            .filter( el => el.length && el !== ',' )
            .map( el => el.split( '/' ).map( word => word.trim().replace( '"', '' ) ).join( '/' ) );

        const cities = item[ 14 ].split( '/' ).map( city => addCity( city.trim() ) ).join( '/' );

        return `{
                    1: [${item[ 0 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    2: [${item[ 2 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    3: [${item[ 4 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    4: [${item[ 5 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    5: [${item[ 7 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    6: [${item[ 9 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    7: [${item[ 11 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}],
                    9: [${cities.split( '/' ).map( i => `'${i}'` )}],
                    10: [${item[ 15 ].split( '/' ).map( i => `'${i.replace(/^"|"$/gm, '')}'` )}]
                }`;

    } );

    return {
        words: wordsArray,
        seo: getSeoTexts( seo ),
        title: getSeoTexts( title ),
        description: getSeoTexts( description )
    };
}

let seoArray = [];

const word = `
    const pagesWords = [
        ${csvFile.map( (page, i) => {
            
            const {  words, seo, title, description } = createWordsArray( page.file );
            
            seoArray.push( {
                               seo: seo,
                               title: title,
                               description: description,
                               tag: page.text
                           } );
            
            return `{
                title: '${page.title}',
                url: '${page.url}',
                text: '${page.text}',
                words: [
                    ${words.join( ',' )}
                ]
            }`;
            
        })}
    ];
    module.exports = pagesWords;
`;

let setFileWithTexts = `
    const setText = ( w, text ) => {
        if ( w === "z" || w === "Z" || w === "" ) return "";
        return w || text;
    };
    const seoTexts = {
        ${seoArray.map( (item, i) => {
            return `"${item.tag}": ({w1,w2,w3,w3s,w4,w5,w6,w7,w8,w9,w9s,w9i,w9a,w10}) => ({
                "title": \`${item.title}\`,
                "description": \`${item.description} \`,
                "seo": \`${item.seo}\`
            })
            `      
        })}
    };
    export default seoTexts;
`;

fs.writeFile( "./words.js", word , function ( err ) {
    if ( err ) return console.log( err );
    return console.log( "Фаил words.js сохранен." );
})

fs.writeFile( "./seoTexts.js", setFileWithTexts , function ( err ) {
    if ( err ) return console.log( err );
    return console.log( "Фаил seoTexts.js сохранен." );
})

//console.log( wordsArray );


