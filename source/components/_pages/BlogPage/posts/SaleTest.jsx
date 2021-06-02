import React from 'react';

import {StyledPost} from '../styles';


const PostTest = ( { title, src  } ) => {
    return (<StyledPost>
        <div className="postImage">
            <img src={src} alt={title}/>
        </div>
        <h1>{title}</h1>

        <h3>Условия акции 1</h3>

    </StyledPost>);
};

export default PostTest;