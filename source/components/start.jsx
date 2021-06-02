import React from 'react';
import ReactDOM from 'react-dom';

//import './app.css';

import 'normalize.css';

//для SEO
Window.prototype.setText = ( w, text ) => {
    if ( w === "z" || w === "Z" || w === "" ) return "";
    return w || text;
}

Window.dataLayer = Window.dataLayer || [];

Array.prototype.getById = function ( id ) {
    for ( let i = 0; i < this.length; i++ ) {
        if ( this[i].id === id ) return this[i];
    }
};
Array.prototype.getSelected = function () {
    for ( let i = 0; i < this.length; i++ ) {
        if ( this[i].selected ) return this[i];
    }
    return this[0];
};
Array.prototype.setSelectedById = function ( id ) {
    return this.map( ( item ) => {
        if ( item.id === id ) {
            item.selected = true;
        } else {
            if ( item.selected ) delete (item.selected);
        }
        return item;
    });
};
Array.prototype.setSelectedByFormatSlug = function ( id ) {
    return this.map( ( item ) => {
        if ( item.formatSlug === id ) {
            item.selected = true;
        } else {
            if ( item.selected ) delete (item.selected);
        }
        return item;
    });
};
Array.prototype.getNewById = function ( id ) {
    return {...this.getById( id )}
};
Array.prototype.getNewSelected = function () {
    return {...this.getSelected()};
};
Array.prototype.setSelectedDefault = function() {
    return this.map( ( item ) => {
        if ( item.selectedDefault ) {
            item.selected = true;
        } else {
            if ( item.selected ) delete (item.selected);
        }
        return item;
    });
};

window.altIsPressed = false;
document.addEventListener('keydown',function(event){
    if ( event.altKey )
        window.altIsPressed = true;
});

document.addEventListener('keyup',function(){
    window.altIsPressed = false;
});


// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if ( !Array.prototype.includes ) {
    Object.defineProperty( Array.prototype, 'includes', {
        value: function ( searchElement, fromIndex ) {

            if ( this == null ) {
                throw new TypeError( '"this" is null or not defined' );
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object( this );

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if ( len === 0 ) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max( n >= 0 ? n : len - Math.abs( n ), 0 );

            function sameValueZero( x, y ) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN( x ) && isNaN( y ));
            }

            // 7. Repeat, while k < len
            while ( k < len ) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if ( sameValueZero( o[ k ], searchElement ) ) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }

            // 8. Return false
            return false;
        }
    } );
}

if ( !Object.getOwnPropertyDescriptor ) {
    Object.getOwnPropertyDescriptor = function ( object, key ) {

        var hasSupport =
            typeof object.__lookupGetter__ === 'function' &&
            typeof object.__lookupSetter__ === 'function'

        // TODO: How does one determine this?!
        var isGetterSetter = !hasSupport ? null :
            object.__lookupGetter__( key ) ||
            object.__lookupSetter__( key )

        return isGetterSetter != null ? {
            configurable: true,
            enumerable: true,
            get: object.__lookupGetter__( key ),
            set: object.__lookupSetter__( key )
        } : {
            configurable: true,
            writable: true,
            enumerable: true,
            value: object[ key ]
        }

    }
}

if ( !Object.values ) {
    const objectToValuesPolyfill = ( object ) => Object.keys( object ).map( key => object[ key ] );
    Object.values = objectToValuesPolyfill;
}

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// if (!Function.prototype.bind) {
//     Function.prototype.bind = function ( oThis ) {
//         if ( typeof this !== 'function' ) {
//             // closest thing possible to the ECMAScript 5
//             // internal IsCallable function
//             throw new TypeError( 'Function.prototype.bind - what is trying to be bound is not callable' );
//         }
//
//         var aArgs = Array.prototype.slice.call( arguments, 1 ),
//             fToBind = this,
//             fNOP = function () {},
//             fBound = function () {
//                 return fToBind.apply( this instanceof fNOP
//                                           ? this
//                                           : oThis,
//                                       aArgs.concat( Array.prototype.slice.call( arguments ) ) );
//             };
//
//         if ( this.prototype ) {
//             // Function.prototype doesn't have a prototype property
//             fNOP.prototype = this.prototype;
//         }
//         fBound.prototype = new fNOP();
//
//         return fBound;
//     };
// }

import App from 'components/App';
/*const App = ()=>{

    return <div>TEST TEST</div>
}*/

//ReactDOM.render( <TurnJs />, document.getElementById('spa'));
ReactDOM.render( <App/>, document.getElementById( 'spa' ) );

