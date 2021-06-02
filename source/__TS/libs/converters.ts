//преобразуем в верхний регистр удаляя символ "_"
const toCamel = (s: string) => {
    return s.replace(/([_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            //.replace('-', '')
            .replace('_', '');
    });
};
export const isArray = ( a: any ): boolean => Array.isArray( a );
export const isObject = ( o: any ): boolean => o === Object( o ) && !isArray( o ) && typeof o !== 'function';

//преобразуем свойства объекта snake_case в camelCase
export const keysToCamel = ( o: any ): any => {
    if ( isObject( o ) ) {
        const n = {};

        Object.keys( o ).forEach( ( k ) => {
            n[ toCamel( k ) ] = keysToCamel( o[ k ] );
        });
        return n;
    } else if ( isArray( o ) ) {
        return o.map( ( i ) => keysToCamel( i ) );
    }
    return o;
};