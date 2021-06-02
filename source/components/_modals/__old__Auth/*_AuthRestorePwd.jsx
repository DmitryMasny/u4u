import React, { Component } from 'react';
import { connect } from 'react-redux';


import { Input, Btn } from 'components/_forms';

//import isEmail from 'validator/lib/isEmail';
import TEXT from 'texts/main';
import s from './Auth.scss';

import { userLoginShowAction } from 'actions/user';
import PropTypes from "prop-types";
import TEXT_PROFILE from "../../../texts/profile";
import {IconCheck} from "../../Icons";

class AuthRestorePwd extends Component {
    state = {
        login: '',
        pwd: '',
    };
    static contextTypes = {
        setModalTitle: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.context.setModalTitle( TEXT.RESTORE_PASSWORD );
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.validator();
    };

    validator () {
        console.log('isEmail', isEmail(this.state.login));
    }

    render () {
        return (
            <div className='bp3-dialog-body'>
                <div className={s.authForm}>
                    <Input name="login"
                           type="email"
                           value={this.state.login}
                           onChange={this.handleChange}
                           placeholder={TEXT.PHONE_OR_EMAIL_LABEL}
                           autoComplete="current-login"
                    />

                    <Btn intent="primary" className={s.authFormBtnMain}>
                        {TEXT.SEND_PWD}
                    </Btn>

                    <div className={s.authFormBottomText}>
                        <Btn onClick={() => this.props.userLoginShowAction()} className={s.authFormBtn}>
                            {TEXT.BACK}
                        </Btn>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        userLoginShowAction:   () => {dispatch(userLoginShowAction())}
    })
)(AuthRestorePwd);
