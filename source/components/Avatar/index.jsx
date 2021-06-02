import React, { Component } from 'react';

import s from './Avatar.scss';
import Spinner from 'components/Spinner'
import {IMG_DIR} from 'config/dirs'
const Avatar = ( { className, avatar, inProgress, gender } ) => {

    const noPhoto = IMG_DIR + 'common/' + (gender === 'female' ? 'noPhotoWoman.png': 'noPhotoMan.png');
    const avatarStyle = { backgroundImage: `url('${avatar && avatar.length ? avatar : noPhoto}')` };
    const className2 = `${className || ''} ${s.avatar} ${avatar && s.active} ${inProgress && s.inProgress || ''}`;

    return <div className={className2} style={avatarStyle}>{inProgress &&  <Spinner delay={10} size={50} />}</div>;
};

export default Avatar;
