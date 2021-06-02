import React from 'react';
import Spinner from 'components/Spinner';

import s from './ModalManager.scss';

const Loading = () => {
    return <div className={s.loading}>
                <Spinner />
            </div>
};

export default Loading;
