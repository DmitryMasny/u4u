import React, { memo } from 'react';
import styled from 'styled-components';
import {COLORS} from 'const/styles'
import {hexToRgbA} from 'libs/helpers'


const PosterPreviewStyled = styled.div`
    position: relative;
    width: ${({width})=>width ? `${width}px` : 'inherit'};
    height: ${({height})=>height ? `${height}px` : 'inherit'};
    & > .svg {
        font-size: 0;
        & > svg{
            box-shadow: 3px 5px 16px ${hexToRgbA(COLORS.BLACK, .33)};
        }
    }
    & > .gloss {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 77;
        background: ${( { glance } ) => glance ? 
            `linear-gradient(135deg, rgba(242, 246, 248, 0) 0%, rgba(255, 255, 255, 0.2) 25%, rgba(117, 123, 131, 0.07) 27%, rgba(78, 98, 112, 0.03) 100%)`
            :
            `linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(142, 148, 156, 0.09) 27%, rgba(201, 215, 225, 0.04) 100%)`
        };
        &:after{
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,.03) 0%, rgba(255,255,255,.07) 33%, rgba(255,255,255,0) 100%);
            mix-blend-mode: overlay;
        }
    }
`;

export const PosterPreviewMini = memo( ({ svg, lamination, aspect } ) => {
    if (!svg) return null;
    const svgConverted = svg.split('/%IMAGESIZE%/').join('w300');

    return (
        <PosterPreviewStyled height={aspect > 1 ? Math.floor(150/aspect) : 0}
                             width={aspect < 1 ? Math.floor(150*aspect) : 0}
                             glance={lamination.glance}
        >
            <div className="svg" dangerouslySetInnerHTML={{ __html: svgConverted }}/>
            {lamination.lamination && <div className="gloss"/>}
        </PosterPreviewStyled>
    );
});