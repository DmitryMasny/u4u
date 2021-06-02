import React from 'react';
import { StyledReviewAva } from './styles';

const ReviewAva = ( { ava, name } ) => {

    let miniName = name && name.split(' ');
    miniName = miniName[ 0 ][ 0 ] + (miniName[ 1 ] ? miniName[ 1 ][ 0 ] : '');

    return <StyledReviewAva url={ava}>
                {!ava && miniName ? <div className="miniName">
                                        { miniName }
                                    </div> : null}
           </StyledReviewAva>;
};

export default ReviewAva;

