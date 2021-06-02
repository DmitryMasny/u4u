import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views';

import { connect } from 'react-redux';

import { showAuthFormTypeSelector } from 'selectors/auth';
import { closeAuthFormAction } from 'actions/auth';
import AuthLogin from 'components/auth/AuthLogin';

import TEXT from 'texts/main';

import { SHOW_AUTH_FORM_TYPE_LOGIN,
         SHOW_AUTH_FORM_TYPE_REG,
         SHOW_AUTH_FORM_TYPE_RESTORE
       } from 'const/actionTypes';

class AuthPopup extends Component {
    state = {value: 0};
    handleChangeTab = (event, value) => {
        this.setState({ value });
    };
    handleChangeIndex = value => {
        this.setState({ value });
    };
    componentWillUpdate(nextProps) {
        const index = [SHOW_AUTH_FORM_TYPE_LOGIN,
                       SHOW_AUTH_FORM_TYPE_REG,
                       SHOW_AUTH_FORM_TYPE_RESTORE].indexOf(nextProps.showAuthFormTypeSelector);
        if (index > -1 ) this.state.value = index;
    }
    render() {
        const { showAuthFormTypeSelector, closeAuthFormAction } = this.props;
        const { value } = this.state;

        return (<Modal open={!!showAuthFormTypeSelector} onClose={() => closeAuthFormAction()}>
                        <Tabs value={value}
                              onChange={this.handleChangeTab}
                              indicatorColor="secondary"
                              textColor="secondary"
                              fullWidth>
                            <Tab label={TEXT.LOGIN} />
                            <Tab label={TEXT.REGISTER} />
                        </Tabs>
                        <SwipeableViews
                                  axis={'x'}
                                  index={this.state.value}
                                  onChangeIndex={this.handleChangeIndex}>
                            <AuthLogin />
                            <div>Регистрация</div>
                            <div>Востановление пароля</div>
                        </SwipeableViews>
                </Modal>)
    }
}

export default connect(
    state => ({
        showAuthFormTypeSelector: showAuthFormTypeSelector(state)
    }),
    dispatch => ({
        closeAuthFormAction: () => {dispatch( closeAuthFormAction() )},
    })
)(AuthPopup);
