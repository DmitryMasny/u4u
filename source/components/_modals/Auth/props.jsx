import TEXT from 'texts/main';
import React from "react";

export const loginInputFormProps = {
    // label: TEXT.PHONE_OR_EMAIL_LABEL,
    labelFor: "name-input",
    autoComplete: "current-login",
    type: 'email'
};
export const pwdInputFormProps = {
    // label: TEXT.PASSWORD_LABEL,
    labelFor: "password-input",
    autoComplete: "current-password",
    type: 'password'
};
export const loginInputProps = {
    id:"name-input",
    placeholder: TEXT.PHONE_OR_EMAIL_LABEL,
    // large: false
};
export const pwdInputProps = {
    id:"password-input",
    placeholder: TEXT.PASSWORD_LABEL,
    // large: false
};

export const tooltipProps = {
    placement: 'top',
    intent: 'danger',
    usePortal: false
};

export const tooltipPropsPwdShow = {
    placement: 'bottom',
    //intent: 'warning',
    usePortal: true
};