import React, {useEffect, useState, memo} from 'react';

//import {COLORS} from 'const/styles'

import styled from 'styled-components';

const TextBlock = styled.text`
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;  
`;

const PaddingInfo = memo(({show, size, config = { offset: 2, height: 10}}) => {
    const [s, setSize] = useState(null);

    const
        color = config.color || '#658ad8',
        text = config.text || 'Область для натяжки',
        strokeWidth = 1 / size.ratio + .5,
        strokeDasharray = 5 / size.ratio,
        fontSize = Math.round((config.fontSize || 5) / size.ratio),
        zoomIndex = Math.round((size.w + size.h) * size.ratio * size.ratio)/100;

    useEffect(() => {
        if (size.ratio ) {
            const
                x2 = size.x + size.w,
                y2 = size.y + size.h;

            setSize({
                top: {
                    line: {
                        x1: size.x - size.padding,
                        x2: x2 + size.padding,
                        y: size.y,
                    },
                    text: {
                        y: size.y - size.padding/2,
                    },
                },
                left: {
                    line: {
                        y1: size.y - size.padding,
                        y2: y2 + size.padding,
                        x: size.x,
                    },
                    text: {
                        x: size.x - size.padding/2 ,
                    },
                },
                bottom: {
                    line: {
                        x1: size.x - size.padding,
                        x2: x2 + size.padding,
                        y: y2,
                    },
                    text: {
                        y: y2 + size.padding/2,
                    },
                },
                right: {
                    line: {
                        y1: size.y - size.padding,
                        y2: y2 + size.padding,
                        x: x2,
                    },
                    text: {
                        x: x2 + size.padding/2,
                    },
                },
            });
        }
    }, [size, config]);

    if (!s || !size.ratio) return null;
    return <g className={`padding-info ${show ? 'show' : ''}`}>

        {Object.values(s).map((g, i)=>
            <g key={i}>
                <line x1={g.line.x1 || g.line.x} x2={g.line.x2 || g.line.x} y1={g.line.y1 || g.line.y} y2={g.line.y2 || g.line.y}
                      stroke={color} strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} key={'l'+i}/>

                {size.padding && <TextBlock dominantBaseline="middle" textAnchor="middle"
                      y={g.text.x || g.text.y}
                      transform={`translate(${g.text.x ? 0 : size.w/2},${g.text.x ? size.h/2 : 0}) rotate(${ g.text.x ? -90 : 0} 0 0)`}
                      fontSize={fontSize}
                      fill={color}
                      key={'t'+i}
                      className={`padding-info-text ${zoomIndex > 4 ? 'show' : ''}`}
                >
                    {text}
                </TextBlock>}

            </g>
        )}

        </g>;

});

export default PaddingInfo;