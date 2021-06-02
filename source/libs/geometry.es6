const pi180 = Math.PI / 180;

const cosCache = {};
const sinCache = {};

const calculateCos = rad => cosCache[ rad ] || (cosCache[ rad ] = Math.cos( rad ));
const calculateSin = rad => sinCache[ rad ] || (sinCache[ rad ] = Math.sin( rad ));

/**
 * Перевод из радиан в градусы
 * @param degrees - угол поворота в градусах
 * @returns {number}
 */
const degrees_to_radians = degrees => degrees * pi180;

/**
 * Поворот точки вокруг оси
 * @param x = null - координата точки
 * @param y = null - координата точки
 * @param cx = 0- координата центра вращения
 * @param cy = 0 - координата центра вращения
 * @param rotate = 0 - угол поворота в градусах
 * @param tX = null - возможная временная точка
 * @param tY = null - возможная временная точка
 * @param invertCalc = false - необходимость инвертировать расчеты cos <-> sin
 * @returns {{x: *, y: *}}
 */
const turnXY = ( { x = null,
                   y = null,
                   cx = 0,
                   cy = 0,
                   rotate = 0,
                   tX = null,
                   tY = null,
                   invertCalc = false} ) => {

    const rad = degrees_to_radians( rotate ),
          tempX = tX != null ? tX : x - cx,
          tempY = tY != null ? tY : y - cy,
          cos = calculateCos( rad ),
          sin = calculateSin( rad );

    if ( invertCalc ) {
        return {
            'x': cos * tempX + sin * tempY + cx,
            'y': cos * tempY - sin * tempX + cy
        };
    }

    return {
        'x': cos * tempX - sin * tempY + cx,
        'y': cos * tempY + sin * tempX + cy
    };
};

const getOutsizeRectSizeAfterTurn = ( { x1, x2, y1, y2, deg } ) => {
    let rad = degrees_to_radians( deg );
    let cx = x1 + (x2 - x1) / 2;
    let cy = y1 + (y2 - y1) / 2;

    const rotatePoint = ( x, y ) => {
        let tempX = x - cx;
        let tempY = y - cy;
        return {
            x: tempX * Math.cos( rad ) - tempY * Math.sin( rad ) + cx,
            y: tempX * Math.sin( rad ) + tempY * Math.cos( rad ) + cy
        }
    };

    let h = [];
    let v = [];
    const addToArray = ( obj ) => {
        h.push( obj.x );
        v.push( obj.y );
    };

    addToArray( rotatePoint( x1, y1 ) );
    addToArray( rotatePoint( x2, y1 ) );
    addToArray( rotatePoint( x1, y2 ) );
    addToArray( rotatePoint( x2, y2 ) );

    //console.log( '{ x1, x2, y1, y2, deg }', { x1, x2, y1, y2, deg } );
    const coordinatesWithRotated = [
        rotatePoint( x1, y1 ),
        rotatePoint( x2, y1 ),
        rotatePoint( x2, y2 ),
        rotatePoint( x1, y2 )
    ]

    h.sort( ( a, b ) => a - b );
    v.sort( ( a, b ) => a - b );

    x1 = h[ 0 ];
    x2 = h[ h.length - 1 ];
    y1 = v[ 0 ];
    y2 = v[ v.length - 1 ];
    return { x1, x2, y1, y2, coordinatesWithRotated }
};

export { getOutsizeRectSizeAfterTurn, turnXY, degrees_to_radians }