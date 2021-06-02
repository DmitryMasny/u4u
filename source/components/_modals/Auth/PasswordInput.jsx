import React, { useEffect, memo, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import s from './Auth.scss';

import {
    IconEye
} from "components/Icons";

import { Btn, Input } from "components/_forms";
import Tooltip from "components/_forms/Tooltip";

import { IconLockOpen } from "components/Icons";
import TEXT from "texts/main";
import { tooltipPropsPwdShow } from "./props";


import { userFormInProgressSelector, userLoginFailSelector } from "selectors/user";

//иконка для поля пароля
const PwdIcon = ( { isOn, onClick, className } ) => (
    <Tooltip {...tooltipPropsPwdShow} className={className} tooltip={isOn ? TEXT.HIDE_PWD : TEXT.SHOW_PWD}>
        <Btn intent="minimal" className={s.showPwdIcon} onClick={onClick}>
            <IconEye intent={isOn ? 'danger' : 'mute'} onClick={onClick}/>
        </Btn>
    </Tooltip>);

const PasswordInput = ( {onFocus, pwd, pwdError, setPwd, waitCaptcha } ) => {
    const $userFormInProgressSelector = useSelector( userFormInProgressSelector );
    const $userLoginFailSelector = useSelector( userLoginFailSelector );

    const [showPassword, setShowPassword] = useState( false );

    const pwdIntent   = pwdError && 'danger' ||
                        $userLoginFailSelector && 'danger' ||
                        pwd.length >= 6 ? 'success' : '';

    return <Input name="password"
                   type={showPassword ? 'text' : 'password'}
                   onChange={e => setPwd( e.target.value )}
                   onFocus={onFocus}
                   placeholder={TEXT.PASSWORD_LABEL}
                   disabled={waitCaptcha || $userFormInProgressSelector}
                   intent={pwdIntent}
                   error={pwdError && TEXT.ERROR_PWD}
                   autoComplete="current-password"
                   leftEl={<IconLockOpen intent={pwdIntent}/>}
                   rightEl={<PwdIcon isOn={showPassword} onClick={() => setShowPassword( !showPassword )}/>}
            />
}

export default memo( PasswordInput );