import React, {useEffect, useState, memo} from 'react';

import {COLORS} from 'const/styles'


const PageRuler = memo(({show, size, config = { offset: 2, height: 10}}) => {
    const [s, setSize] = useState(null);

    const
        color = config.color || COLORS.NEPAL,
        strokeWidth1 = .5 / size.ratio,
        strokeWidth2 = .8 / size.ratio,
        fontSize = Math.round((config.fontSize || 5) / size.ratio),
        textWidth = fontSize * 2;

    useEffect(() => {
        if (size.ratio ) {
            const
                x2 = size.x + size.w + config.offset,
                y2 = size.y + size.h + config.offset;

            setSize({
                w: {
                    sizeLine1: {
                        type: 'line',
                        x1: size.x,
                        x2: size.x + size.w/2 - textWidth,
                        y: y2 + config.height*.8 + fontSize/2 + size.padding,
                        color: color,
                        strokeWidth: strokeWidth1,
                    },
                    sizeLine2: {
                        type: 'line',
                        x1: size.x + size.w/2 + textWidth,
                        x2: size.x + size.w,
                        y: y2 + config.height*.8 + fontSize/2 + size.padding,
                        color: color,
                        strokeWidth: strokeWidth1,
                    },
                    startLine: {
                        type: 'line',
                        x: size.x,
                        y1: y2,
                        y2: y2 + config.height + fontSize/2 + size.padding,
                        color: color,
                        strokeWidth: strokeWidth2,
                    },
                    endLine: {
                        type: 'line',
                        x: size.x + size.w,
                        y1: y2,
                        y2: y2 + config.height + fontSize/2 + size.padding,
                        color: color,
                        strokeWidth: strokeWidth2,
                    },
                    text: {
                        type: 'text',
                        value: size.w,
                        y: y2 + config.height*.8 + fontSize*.7 + size.padding,
                    },
                },
                h: {
                    sizeLine1: {
                        type: 'line',
                        x: x2 + config.height*.8 + fontSize/2 + size.padding,
                        y1: size.y,
                        y2: size.y + size.h/2 - textWidth,
                        color: color,
                        strokeWidth: strokeWidth1,
                    },
                    sizeLine2: {
                        type: 'line',
                        x: x2 + config.height*.8 + fontSize/2 + size.padding,
                        y1: size.y + size.h/2 + textWidth,
                        y2: size.y + size.h,
                        color: color,
                        strokeWidth: strokeWidth1,
                    },
                    startLine: {
                        type: 'line',
                        y: size.y,
                        x1: x2,
                        x2: x2 + config.height + fontSize/2 + size.padding,
                        color: color,
                        strokeWidth: strokeWidth2,
                    },
                    endLine: {
                        type: 'line',
                        y: size.y + size.h,
                        x1: x2,
                        x2: x2 + config.height + fontSize/2 + size.padding,
                        color: color,
                        strokeWidth: strokeWidth2,
                    },
                    text: {
                        type: 'text',
                        value: size.h,
                        x: x2 + config.height*.8 + fontSize*.7 + size.padding,
                    },
                },
                ...(size.padding ? {
                    w2: {
                        sizeLine1: {
                            type: 'line',
                            x1: size.x - size.padding,
                            x2: size.x + size.w/2 - textWidth,
                            y: y2 + config.height*2 + fontSize + size.padding,
                            color: color,
                            strokeWidth: strokeWidth1,
                        },
                        sizeLine2: {
                            type: 'line',
                            x1: size.x + size.w/2 + textWidth,
                            x2: size.x + size.w + size.padding,
                            y: y2 + config.height*2 + fontSize + size.padding,
                            color: color,
                            strokeWidth: strokeWidth1,
                        },
                        startLine: {
                            type: 'line',
                            x: size.x -size.padding,
                            y1: y2 + size.padding,
                            y2: y2 + config.height*2.2 + fontSize + size.padding,
                            color: color,
                            strokeWidth: strokeWidth2,
                        },
                        endLine: {
                            type: 'line',
                            x: size.x + size.w + size.padding,
                            y1: y2 + size.padding,
                            y2: y2 + config.height*2.2 + fontSize + size.padding,
                            color: color,
                            strokeWidth: strokeWidth2,
                        },
                        text: {
                            type: 'text',
                            value: size.w + size.padding*2,
                            y: y2 + config.height*2 + fontSize*1.4 + size.padding,
                        },
                    },
                    h2: {
                        sizeLine1: {
                            type: 'line',
                            x: x2 + config.height*2 + fontSize + size.padding,
                            y1: size.y - size.padding,
                            y2: size.y + size.h/2 - textWidth,
                            color: color,
                            strokeWidth: strokeWidth1,
                        },
                        sizeLine2: {
                            type: 'line',
                            x: x2 + config.height*2 + fontSize + size.padding,
                            y1: size.y + size.h/2 + textWidth,
                            y2: size.y + size.h + size.padding,
                            color: color,
                            strokeWidth: strokeWidth1,
                        },
                        startLine: {
                            type: 'line',
                            y: size.y - size.padding,
                            x1: x2 + size.padding,
                            x2: x2 + config.height*2.2 + fontSize + size.padding,
                            color: color,
                            strokeWidth: strokeWidth2,
                        },
                        endLine: {
                            type: 'line',
                            y: size.y + size.h + size.padding,
                            x1: x2 + size.padding,
                            x2: x2 + config.height*2.2 + fontSize + size.padding,
                            color: color,
                            strokeWidth: strokeWidth2,
                        },
                        text: {
                            type: 'text',
                            value: size.h + size.padding*2,
                            x: x2 + config.height*2 + fontSize*1.4 + size.padding,
                        },
                    }
                } : {})
            });
        }
    }, [size, config]);

    if (!s || !size.ratio) return null;
    return <g className={`page-ruler ${show ? 'show' : ''}`}>

        {Object.values(s).map((g, i)=>
            <g key={i}>
                {Object.values(g).map((el, j)=>
                    el.type === 'text' ?
                        <text dominantBaseline="middle" textAnchor="middle"
                              y={el.x || el.y}
                              transform={`translate(${el.x ? 0 : size.w/2},${el.x ? size.h/2 : 0}) rotate(${ el.x ? -90 : 0} 0 0)`}
                              fontSize={fontSize}
                              fill={color}
                              key={j}
                        >
                            {el.value}
                        </text>
                        :
                        <line x1={el.x1 || el.x} x2={el.x2 || el.x} y1={el.y1 || el.y} y2={el.y2 || el.y} stroke={el.color} strokeWidth={el.strokeWidth} key={j}/>

                )}
            </g>
        )}

        </g>;

});

export default PageRuler;