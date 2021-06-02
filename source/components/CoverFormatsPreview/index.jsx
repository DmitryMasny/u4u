import React, {Fragment} from 'react';
import s from './coverFormatsPreview.scss';

const CoverFormatsPreview = ( {width, height}) => {

    let size = null;

    switch ( [width,height].join('x') ) {
        case '20x20':size = s.s20x20;break;
        case '20x30':size = s.s20x30;break;
        case '30x20':size = s.s30x20;break;
        case '30x30':size = s.s30x30;break;
    }

    return (
        <div className={s.coverWrap}>
            <div className={`${s.cover} ${s.coverMain}`}>
                <div className={`${s.cover}  ${s.s20x20}`}/>
                <div className={`${s.cover}  ${s.s30x20}`}/>
                <div className={`${s.cover}  ${s.s20x30}`}/>
                <div className={`${s.cover} ${s.selected}  ${size}`}>
                    <span className={s.text}>{width}x{height} см</span>
                </div>
            </div>

        </div>
    );
};

export default CoverFormatsPreview