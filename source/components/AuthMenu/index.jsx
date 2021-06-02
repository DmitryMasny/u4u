import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MenuProfileView from 'menu/MenuProfile';
import MenuAuthView from 'menu/MenuAuth';
import { userHasProfileSelector, userPersonalInfoSelector, userRoleSelector} from 'selectors/user';
import { userLoginShowAction,
         userRegShowAction } from 'actions/user';

import { myCartQuantitySelector } from "pages/MyProductsPage/selectors";

const AuthMenu = props => (props.hasProfileAccess ? <MenuProfileView {...props} role={props.userRoleSelector}/> :
      <MenuAuthView {...props} showLoginFormHandler = {() => props.userLoginShowAction()}
                               showRegFormHandler = {() => props.userRegShowAction()} />
);

export default withRouter(connect(
    state => ({
        hasProfileAccess:  userHasProfileSelector(state),
        userRoleSelector:  userRoleSelector(state),
        userPersonalInfoSelector: userPersonalInfoSelector(state),
        myCartQuantitySelector: myCartQuantitySelector( state)
    }),
    dispatch => ({
        userLoginShowAction: () => {dispatch( userLoginShowAction( true ) )},
        userRegShowAction:   () => {dispatch( userRegShowAction( true ) )}
    })
)(AuthMenu));
