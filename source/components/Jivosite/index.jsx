import React  from 'react';
import { useSelector } from "react-redux";

import Tooltip from 'components/_forms/Tooltip';
import { useLocation } from "react-router-dom";

import { IconChat } from 'components/Icons';
import TEXT from 'texts/main';
import s from './jivosite.scss';
import { windowIsMobileSelector } from "selectors/global";


const Jivosite = () => {
    const location = useLocation();
    const isMobile = useSelector( windowIsMobileSelector );

    if (location && isMobile && ~location.pathname.indexOf('/edit/')) return null;

    const widget_id = 'M24L6vsNNB';
    // Вставляем скрипт Jivosite в HEAD (КОСТЫЛЬ)
    const script = document.createElement("script");
    script.src = '//code.jivosite.com/script/widget/' + widget_id;
    script.async = true;
    document.head.appendChild(script);

    return <div onClick={() => {window.jivo_api.open()}} className={s.jivoBtn}>
                <Tooltip tooltip={TEXT.JIVO_CHAT}  placement="top" >
                    <IconChat />
                </Tooltip>
            </div>
};

export default Jivosite;
