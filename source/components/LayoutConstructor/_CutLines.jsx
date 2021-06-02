import React, {memo} from 'react';

const CutLines = memo(({size, offset, left, right, top, bottom, strokeWidth = .5}) => {

    const stroke = {
        a: {color: '#000', width: strokeWidth/2},
        b: {color: '#fff', width: strokeWidth}
    },
        left1 = left - offset,
        right1 = right + offset,
        top1 = top - offset,
        bottom1 = bottom + offset;

    const left2 = left1 - size,
        right2 = right1 + size,
        top2 = top1 - size,
        bottom2 = bottom1 + size;


    return <g>
        {/*Угол 1*/}
        <line x1={left1} x2={left2} y1={top} y2={top} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={left} x2={left} y1={top1} y2={top2} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={left1} x2={left2} y1={top} y2={top} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>
        <line x1={left} x2={left} y1={top1} y2={top2} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>

        {/*Угол 2*/}
        <line x1={right} x2={right} y1={top1} y2={top2} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={right1} x2={right2} y1={top} y2={top} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={right} x2={right} y1={top1} y2={top2} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>
        <line x1={right1} x2={right2} y1={top} y2={top} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>

        {/*Угол 3*/}
        <line x1={right1} x2={right2} y1={bottom} y2={bottom} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={right} x2={right} y1={bottom1} y2={bottom2} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={right1} x2={right2} y1={bottom} y2={bottom} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>
        <line x1={right} x2={right} y1={bottom1} y2={bottom2} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>

        {/*Угол 4*/}
        <line x1={left} x2={left} y1={bottom1} y2={bottom2} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={left1} x2={left2} y1={bottom} y2={bottom} stroke={stroke.b.color} strokeWidth={stroke.b.width}/>
        <line x1={left} x2={left} y1={bottom1} y2={bottom2} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>
        <line x1={left1} x2={left2} y1={bottom} y2={bottom} stroke={stroke.a.color} strokeWidth={stroke.a.width}/>
   </g>;

});

export default CutLines;