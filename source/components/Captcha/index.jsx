import React, { Component } from "react";
import { ReCaptcha } from 'react-recaptcha-google'

export default class Captcha extends Component {
    key = '6LevvyMUAAAAAAGhAGs-aiq1_51S6uG9NsmJQm1W';
    action = 'homepage';
    componentDidMount = () => {


    };
    onLoadCaptcha = () => {
        this.captchaObjReInit();
        this.props.onLoadCaptcha();
    };
    verifyCallback = ( token ) => {
        this.props.verifyCallback( token );
    };
    expiredCallback = ( props ) => {
        this.props.expiredCallback( props );
    };
    render()
    {
        const reCaptchaProps = {
            size: "invisible",
            render: "explicit",
            sitekey: "",
            hl: 'ru'
        };
        return (
            <ReCaptcha
                ref={(r) => {this.captchaObj = r}}
                {...reCaptchaProps}
                onloadCallback  = {this.onLoadCaptcha}
                verifyCallback  = {this.verifyCallback}
                expiredCallback = {this.expiredCallback}
                errorCallback   = {this.expiredCallback}
            />
        )
    }
}

