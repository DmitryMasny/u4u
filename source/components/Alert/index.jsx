import React from 'react';

import { toast } from '__TS/libs/tools';
import TEXT_PROFILE from "../../texts/profile";

let started = false;

const AlertMessage = props => {

    if (started) return null;
    setTimeout( function () {
        toast.warn('Внимание! По техническим причинам, до 9 сентября, остутсвует оформление доставки.\n Приносим извинения за временные неудобства.', {
            autoClose: 3000
        });
    }, 3000 );

    started = true;
    return null;
};

export default AlertMessage;