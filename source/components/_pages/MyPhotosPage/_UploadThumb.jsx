import React, {memo} from 'react';
import Tooltip from 'components/_forms/Tooltip';

import Spinner from 'components/Spinner';

import TEXT_MY_PHOTOS from 'texts/my_photos';
import s from "./MyPhotosPage.scss";

/**
 * Компонент миниатюры загружаемой фотографии
 */
const UploadThumb = (props) => {
const {loading, thumbUrl, percent, loaded, error, file} = props;
    let className = s.myPhotosUploadThumb;
    let text = '';
    let src =  thumbUrl || '';
    if (loading){
        // text = percent ? <span className={s.percent}>{percent}%</span> : TEXT_MY_PHOTOS.UPLOAD_LOAD;
        text = <Spinner value={percent ? percent/100 : null} size={40} />;
        className += ` ${s.loading}`
    } else if(loaded){
        if (error){
            text = TEXT_MY_PHOTOS.UPLOAD_ERROR;
            className += ` ${s.error}`;
        } else {
            className += ` ${s.loaded}`;
            text = src ? '' : file.name || 'загружен';
        }
    } else {
        text = 'очередь';
    }
    const thumb = <div className={className}>
        {src && <img className={s.myPhotosUploadThumbImage} src={src}/>}
        <div className={s.myPhotosUploadThumbText} title={file.name || null}>{text}</div>
    </div>;

        return error ? <Tooltip tooltip={error} intent="danger" placement="top" >{ thumb }</Tooltip> : thumb;
};

export default memo(UploadThumb);