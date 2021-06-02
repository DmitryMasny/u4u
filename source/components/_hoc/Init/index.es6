import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserTokenAction, userGetPersonalInfo, get } from 'actions/user';
import { userTokenSelector, userRoleSelector } from 'selectors/user';
import WS from 'server/ws.es6';

//import { logs } from 'libs/logs';
import { getCartCountAction } from "pages/MyProductsPage/actions";
import { resetDefaultPhotos } from "components/_pages/MyPhotosPage/actions";

//import { MY_PRODUCTS_CART} from 'const/myProducts';

class InitHOC extends Component {
    constructor( props ) {
        super( props );
        this.props.getUserTokenAction(); //запускаем action Redux на получение аутентификации пользователя
    }
    componentDidMount() {
        //this.updateUserDataAndCart();
    }
    updateUserDataAndCart() {
        this.props.userGetPersonalInfo();
        this.props.getCartCountAction();
    }
    UNSAFE_componentWillReceiveProps( nextProps ) { // TODO: скоро это исчезнет из React
        //как получили токен, то создаем подключение к WebSocket
        if ( nextProps.token !== this.props.token ) {
            //стартуем WS
            WS.reconnect( nextProps.token );
            this.props.resetDefaultPhotos();
        } else if ( nextProps.token ) {
            WS.reconnect( nextProps.token );
        }
        if ( nextProps.userRoleSelector !== this.props.userRoleSelector) {
            this.updateUserDataAndCart();
        }
    }
    render() {
        return null;//this.props.children;
    }
}
export default connect(
    state => ({
        token: userTokenSelector( state ),
        userRoleSelector: userRoleSelector( state )
    }),
    dispatch => ({
        getUserTokenAction: () => dispatch( getUserTokenAction() ),
        userGetPersonalInfo: () => dispatch( userGetPersonalInfo() ),
        getCartCountAction: () => dispatch( getCartCountAction( ) ),
        resetDefaultPhotos: () => dispatch( resetDefaultPhotos( ) )
    })
)( InitHOC );
