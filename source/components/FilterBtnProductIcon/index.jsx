import React from 'react';

import s from './photobookIcon.scss';

// Default конфигурация
const CONFIG = {
    size: 30,           // Размер svg иконки
    maxFormat: 30,      // Максимальный размер фотокниги в см.
    scale: 1,           // Множитель размера иконки (Иконка увеличится пропорционально вместе с тольщиной линий)
    padding: 4,         // Отступы содержимого svg от края
    type: null,         // Тип иконки
    width: 20,          // Ширина фотокниги (см.)
    height: 20,         // Высота фотокниги (см.)
    borderRadius: 2,    // Закругление краев
    glueWidth: 12,      // Ширина расстава %
    filled: true        // Залить фон фотокниги
};

/**
 * Иконкаи фоткниги
 */
const FilterBtnProductIcon = props => {

    const c = { ...CONFIG, ...props };

    c.k = c.size / c.maxFormat;

    let book = {
        w: Math.round( c.width * c.k ),
        h: Math.round( c.height * c.k ),
        x: 0,
        y: 0,
        br: c.borderRadius,
        sw: 2           // stroke-width
    };
    book.x = (c.size - book.w) / 2 + c.padding;
    book.y = (c.size - book.h) / 2 + c.padding;

    let glueLine = null;
    if (c.type){
        switch (c.type) {
            case 'photobook_glue':
                const x = book.x + Math.round(c.maxFormat * c.glueWidth/100);
                const glue = {
                    x1: x,
                    y1: book.y ,
                    x2: x,
                    y2: book.y + book.h,
                };
                glueLine = <line className={s.photobookIconGlue}
                                 x1={glue.x1} y1={glue.y1} x2={glue.x2} y2={glue.y2}/>;
                break;

            case 'poster':
                book.br = 0;
                book.sw = 1;
                break;

            case 'poster_frame':
                book.br = 0;
                book.sw = 3;
                break;

        }
    }
    if(c.type === 'photobook_glue'){


    }


    const classNameSVG = s.photobookIcon +
                         (c.active ? (' ' + s.active) : '') +
                         (c.minimal ? (' ' + s.minimal) : '') +
                         (c.isDisabled ? (' ' + s.disabled) : '');
    return (
        <svg className={classNameSVG}
             width={c.size * c.scale + c.padding * 2} height={c.size * c.scale + c.padding * 2}
             viewBox={`0 0 ${c.size + c.padding * 2} ${c.size + c.padding * 2}`}
             xmlns="http://www.w3.org/2000/svg">

            {c.filled && <rect className={s.photobookIconBookBack}
                  x={book.x} y={book.y}
                  width={book.w} height={book.h}
                  rx={book.br} ry={book.br}/>}
            {glueLine}
            <rect className={s.photobookIconBookLine}
                  x={book.x} y={book.y}
                  width={book.w} height={book.h}
                  rx={book.br} ry={book.br}
                  strokeWidth={book.sw}
            />
        </svg>);
};

export default FilterBtnProductIcon;
