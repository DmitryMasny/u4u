import React from 'react';

import s from './HelpHover.scss';
import { IconHelp } from "../Icons";
import  Tooltip  from "components/_forms/Tooltip";

const HelpHover = ({children, position}) => {

    return <Tooltip tooltip={children} placement={position || 'top'} intent="info">
        <IconHelp className={s.helpHover}/>
    </Tooltip>;
};

export default HelpHover;
