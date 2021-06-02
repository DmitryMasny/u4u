import React, { Component, Fragment, lazy } from 'react';
import { connect } from "react-redux";
import { userHasProfileSelector, userAuthTypeSelector, userRoleIsAdmin } from 'selectors/user';
import {
    SHOW_USER_LOGIN,
    SHOW_USER_REG,
    SHOW_USER_REG_RESTORE_SUCCESS,
    SHOW_USER_RESTORE
} from 'const/actionTypes';

import TEXT from 'texts/main';
import s from './index.scss';
//import { retry } from 'libs/helpers';

//const Auth = lazy( () => import('modals/Auth') );
import Auth from 'modals/Auth';

class OnlyAuth extends Component {
    render () {
        let title = '';
        if ( !this.props.hasProfileAccess ) {
            switch ( this.props.userAuthTypeSelector ) {
                case SHOW_USER_LOGIN:
                    title = TEXT.LOGIN;
                    break;
                case SHOW_USER_REG:
                    title = TEXT.REGISTER;
                    break;
                case SHOW_USER_RESTORE:
                    title = TEXT.RESTORE_PASSWORD;
                    break;
                case SHOW_USER_REG_RESTORE_SUCCESS:
                    title = TEXT.SUCCESS;
                    break;
            }
        }
        return (<Fragment>
            {(!this.props.onlyAdmin && this.props.hasProfileAccess || this.props.onlyAdmin && this.props.userRoleIsAdmin) ? this.props.children :
                <div className={s.onlyAuth}>
                    <h3 className={s.onlyAuthTitle}>
                        Данная страница доступна только {this.props.onlyAdmin ? 'Администратору' : 'авторизованным пользователям'}
                    </h3>
                    <div className={s.onlyAuthModal}>
                        <div className="bp3-dialog-header">
                            <h4 className="bp3-heading">{title}</h4>
                        </div>
                        <Auth/>
                    </div>
                </div>
            }
        </Fragment>);
    }
}

export default connect(
    state => ({
        userRoleIsAdmin: userRoleIsAdmin( state ),
        hasProfileAccess: userHasProfileSelector( state ),
        userAuthTypeSelector: userAuthTypeSelector( state )
    })
)( OnlyAuth );
