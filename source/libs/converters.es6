/**
    конвертируем массив адресов роутинга вида:
    [
        {id: 'INDEX', path: '/abc/',  component: ..., exact: ..., ext: true},
        {id: 'INFO',  path: '/info/', component: ..., exact: ...}
    ]
    в объект вида:
    LINKS
    {
        INDEX: {path: '/abc/', ext: true},
        INFO: {path: '/info/', ext: false}
    }


**/
const pathPrefix = ''; //префикс пути

export const RouteComponentsLinkConverter = RouteComponentsLinksArray => {
    let links = {},
        breadCrumbs = [];
    for ( let i = 0; i < RouteComponentsLinksArray.length; i++ ) {
        const { id, path, ext, name, component } = RouteComponentsLinksArray[ i ];
        links[ id ] = {
            path: pathPrefix + path,
            ext: ext || false
        };
        if (component) {
            breadCrumbs.push({
                path: pathPrefix + path,
                breadcrumb: name
            });
        }
    }
    return { LINKS: links, BREAD_CRUMBS_LINKS: breadCrumbs };
};

// Превращаем формат телефона в человечускую запись
export const formatPhone = ( txt ) => {
    const num = txt.replace(/\D/g, ''),
          char = { 0: '(', 3: ') ', 6: '-' };

    if (num < 8) {
        return num;
    }

    txt=  '+7 ';
    for (let i = 0; i < num.length; i++) {
        txt += (char[i] || '') + num[i];
    }
    return txt;
};

// Превращаем формат телефона в 10 цифровую запись
export const getPhoneFormatFor10 = ( phone ) => phone.replace(/\D/g, '').slice(-10);

// Формирование даты и времени
export const timeConverter = ( timeFromServer ) => {
    const datetime_arr = timeFromServer.split( 'T' ),
        time_arr = datetime_arr[1].split( '.' ),
        time_str = time_arr[0].slice( 0, -3 ),
        date_str = datetime_arr[0].split( '-' ).reverse().join( '.' );
    return time_str + ' - ' + date_str;
};

// Конвертируем строку в base64 ascii
export const stringToBase64 = ( str ) => window.btoa( unescape( encodeURIComponent( str ) ) );

// Декодируем base64 ascii в строку
export const base64ToString = ( str ) => decodeURIComponent( escape( window.atob( decodeURIComponent( str ) ) ) );

// Конвертируем объект в base64 ascii
export const objectToBase64 = ( obj ) => stringToBase64( JSON.stringify( obj ) );

// Декодируем base64 ascii в объект
export const base64ToObject = ( b64 ) => {
    let result = null;
    try {
        result = JSON.parse( base64ToString( b64 ) )
    } catch (err ) {
        console.error( 'base64ToObject JSON parse error',  err );
    }
    return result;
};


const rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
        eng = "shh sh ch cz yu ya yo zh $$ y+ e$ a b v g d e z i j k l m n o p r s t u f x $".split(/ +/g);

export const cyrillicToLatin = ( text, separator ) => {
    for ( let x = 0; x < rus.length; x++ ) {
        text = text.split( rus[ x ] ).join( eng[ x ] );
        text = text.split( rus[ x ].toUpperCase() ).join( eng[ x ].toUpperCase() );
    }
    if ( separator ) text = text.split( ' ' ).join( separator );
    return text;
}

export const latinToCyrillic = ( text, separator ) => {
    for ( let x = 0; x < rus.length; x++ ) {
        text = text.split( eng[ x ] ).join(  rus[ x ] );
        text = text.split( eng[ x ].toUpperCase() ).join( rus[ x ].toUpperCase() );
    }
    if ( separator ) text = text.split( separator ).join( ' ' );
    return text;
}


//console.log( 'cccc', base64ToObject( 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MywiZ3JvdXBJZCI6OSwiaWQiOjcyOSwibmFtZSI6ItCS0LXRgdC10L3QvdC40Lkg0LLQt9GA0YvQsiJ9LCJwcm9kdWN0Ijp7ImJpbmRpbmdUeXBlIjoiZ2x1ZSIsImNvdmVyVHlwZSI6ImhhcmQiLCJmb3JtYXRJZCI6MywiaWQiOjQsInBhZ2VzIjpudWxsLCJ0aGVtZSI6eyJuYW1lIjoi0JLQtdGB0LXQvdC90LjQuSDQstC30YDRi9CyIiwiaWQiOjcyOSwicHJldmlld19mb3JtYXRfOV8zIjp7ImlkIjo3MjksInByZXZpZXciOiIvbWVkaWEvcHJvZHByZXYvNzI5LzBfMmYwMzQ2YjMtMTAwMC00MzRlLWE0OGItMjZiOWQ2ODk2OWRiLmpwZyJ9fX0sInR5cGUiOiJzaG93UHJldmlld0FsYnVtIn0=' ) );

/*
const x =  objectToBase64(
    {
        type: 'setAlbumFormatAndBinding',
        bindingType: "glue",
        coverType: "hard",
        formatId: 3,
        id: 4,
        pages: {
            fix: 36,
            max: 300,
            min: 36,
            step: 2
        }
    }
);

console.log('x', x);*/