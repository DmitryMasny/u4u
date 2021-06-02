import React  from 'react';

import s from './AlbumThumbnail.scss';
import ImageLoader from 'components/ImageLoader';

const AlbumThumbnail = ({className, formatId, children, src}) => {
    return (
        <div className={s.albumThumbnail + (formatId ? (' ' + s['album-thumbnail_s'+formatId]) : '') + (className ? ` ${className}`: '')}>
            { children ?
                children
                :
                (src && <ImageLoader absolute src={src}/>)
            }
        </div>
    );
};
export default AlbumThumbnail;