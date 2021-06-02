import React, { Component } from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './animate.css';

export default class AnimateHOC extends Component{
    render() {
        const cssName = this.props.cssName || "product-list";
        return (<ReactCSSTransitionGroup
                    transitionName={cssName}
                    //transitionEnterTimeout={50}
                    transitionLeaveTimeout={500}>
                    {this.props.children}
                </ReactCSSTransitionGroup>);
    }
};


