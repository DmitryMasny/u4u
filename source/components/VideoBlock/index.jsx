import React  from 'react';
import s from './index.scss';

const VideoBlock = ( { hash } ) => {
    if (!hash) return null;
    return <div className={s.videoBlock}>
        <iframe width="800" height="450" src={'https://www.youtube.com/embed/' + hash + '?rel=0&modestbranding=1&enablejsapi=1'}
                frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope;" allowFullScreen/>
    </div>
};

export default VideoBlock;
