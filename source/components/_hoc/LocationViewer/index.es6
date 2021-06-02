import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

import {scrollToTop} from 'libs/helpers';
import LINKS from 'config/links';
import HASHES from 'const/hashes';
import { modalPaymentAcceptedAction, modalPaymentDeclinedAction, modalPaymentInfoAction  } from 'actions/modals';


// разделы, которые не скролятся наверх при смене подраздела
const NO_SCROLL = [
    LINKS.PHOTOBOOKS.replace('/:coverType-:bindingType/',''),
];

/**
 * HOC для скрола в начало страницы при изменении url'а
 */
class LocationViewer extends Component {

    componentDidMount(){
        this.checkHash();
        if ( this.props.location && this.props.location.pathname ) {
            const params = new URLSearchParams( this.props.location.search );
            const p = {
                amount: params.get('amount' ),
                to_email: params.get('to_email' ),
                to_phone: params.get('to_phone' ),
            };
            switch ( this.props.location.pathname.replace('/','') ) {
                case HASHES.PAYMENT_GIFTCARD_ACCEPTED:
                    this.props.paymentInfoAction({...p, accept: true});
                    break;
                case HASHES.PAYMENT_GIFTCARD_DECLINED:
                    this.props.paymentInfoAction({...p, decline: true});
                    // this.props.history.replace(this.props.location.pathname);
                    break;
            }

        }

    }

    checkHash = (hash = this.props.location.hash) => {
        if (!hash) return null;

        switch ( hash.replace('#','').replace('/','') ) {
            case HASHES.PAYMENT_ACCEPTED:
                this.props.paymentAcceptedAction(true);
                break;
            case HASHES.PAYMENT_DECLINED:
                this.props.paymentDeclinedAction(true);
                break;
        }
        this.props.history.replace(this.props.location.pathname);
    };

    shouldComponentUpdate(nextProps){
        if (!nextProps.location) return false;

        if(
            this.props.location.pathname !== nextProps.location.pathname &&
            this.props.location.pathname.slice(0, 12) !== nextProps.location.pathname.slice(0, 12)
        ){
            this.checkHash();
            for ( let i=0; i < NO_SCROLL.length; i++ ){
                if( ~this.props.location.pathname.indexOf(NO_SCROLL[i]) && ~nextProps.location.pathname.indexOf(NO_SCROLL[i]) ){
                    return false;
                }
            }
            scrollToTop({scrollDuration: 0});
        }
        return false;
    }
    render() {
        return null;
    }
}

export default withRouter(connect(
    state => ({}),
    dispatch => ({
        paymentAcceptedAction: ( show ) => dispatch( modalPaymentAcceptedAction ( show ) ),
        paymentDeclinedAction: ( show ) => dispatch( modalPaymentDeclinedAction ( show ) ),
        paymentInfoAction: ( show ) => dispatch( modalPaymentInfoAction ( show ) ),
    })
)(LocationViewer));