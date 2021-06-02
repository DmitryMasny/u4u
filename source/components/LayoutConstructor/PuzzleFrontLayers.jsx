import React, { memo } from 'react';
import { IMG_DIR } from "config/dirs";
import styled from "styled-components";

const ImgPuzzle = styled('image')`
    pointer-events: none;
    opacity: ${( { opacity } ) => opacity};
`;

const PuzzleFrontLayers = ( { formatSlug, puzzleSizeType, opacity = 0.5, width = 0, height = 0, x = 0, y = 0 } ) => {

    const size = formatSlug.split('_');

    if ( !size || !size[1] || !puzzleSizeType ) return  null;

    const urlImage = IMG_DIR + `puzzle/${size[ 0 ]}x${size[ 1 ]}_${puzzleSizeType}.png`;
    return <ImgPuzzle y={y}
                      x={x}
                      width={width || size[0]}
                      height={height || size[1]}
                      href={urlImage}
                      opacity={opacity}
           />

}

export default memo( PuzzleFrontLayers );

