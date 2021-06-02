import React, { Component } from 'react';
import { connect } from 'react-redux';

import MEDIA from "config/media";
import { ResizeContext } from 'contexts/resizeContext';
import { ScrollContext } from 'contexts/scrollContext';
import {
    SET_WINDOW_SIZES,
    SET_FUTURE,
} from "const/actionTypes";


class ResizeHOC extends Component {

    state = {
        size: {
            width: 0,
            height: 0,
            media: null,
        },
        scroll: 0,
    };

    resizeTimeout = null;

    componentDidMount () {
        if ( !process.env.server_render ) {
            this.handleResize();
            window.addEventListener( "resize", this.handleResize );
            document.getElementById( 'spa' ).addEventListener( "scroll", this.handleScroll );
            window.showFuture = () => this.props.setFuture();
        }
    }
    componentWillUnmount () {
        const spaEl = document.getElementById( 'spa' );
        window.removeEventListener( "resize", this.handleResize );
        spaEl && spaEl.removeEventListener( "scroll", this.handleScroll );
    }

    handleResize = () => {
        const width = window.innerWidth,
            height = window.innerHeight;

        //определяем градацию размеров для медиа
        let media = null;
        if ( width <= MEDIA.xl ) {
            if ( width <= MEDIA.lg ) {
                if ( width <= MEDIA.md ) {
                    if ( width <= MEDIA.sm ) {
                        if ( width <= MEDIA.xs ) {
                            media = 'xs';
                        } else media = 'sm';
                    } else media = 'md';
                } else media = 'lg';
            } else media = 'xl';
        } else media = 'xxl';

        //устанавилваем в state значения размера окна браузера
        this.setState( {
                           size: {
                               width: width,
                               height: height,
                               media: media
                           }
                       } );

        if (this.resizeTimeout) clearTimeout( this.resizeTimeout );

        this.resizeTimeout = setTimeout(()=>{
            this.props.setWindowSizeAction({
                width: width,
                height: height,
                media: media,
                isMobile: media === 'xs' || media === 'sm',
                orientation: width > height ? 'landscape' : 'portrait',
            });
            this.resizeTimeout = null;
        },300);

    };

    handleScroll = ( e ) => {
        //устанавилваем в state значения размера окна браузера
        this.setState( {
                           scroll: e.target.scrollTop
                       } );
    };

    render () {


        return (
            <ResizeContext.Provider value={this.state.size}>
                <ScrollContext.Provider value={this.state.scroll}>
                    {this.props.children}
                </ScrollContext.Provider>
            </ResizeContext.Provider>
        );

    }
}

const setSizeAction  = ( o ) => ({ type: SET_WINDOW_SIZES, payload: o });
const setFuture  = (  ) => ({ type: SET_FUTURE, payload: true });

export default connect(
    state => ({}),
    dispatch => ({
        setWindowSizeAction: ( o ) => dispatch( setSizeAction( o ) ),
        setFuture: (  ) => dispatch( setFuture(  ) ),
    })
)( ResizeHOC ) ;