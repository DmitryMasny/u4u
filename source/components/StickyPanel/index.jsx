import React, { Component, Fragment } from 'react';
import { createPortal } from "react-dom";
import ResizeObserver from 'resize-observer-polyfill';
import { getTop } from 'libs/helpers';

import s from './StickyPanel.scss';

import MEDIA from "config/media";


/**
 * Липкая панель
 */
class StickyPanel extends Component {

    state = {
        top: 0,         // высота главного контейнера (this.holder)
        width: 0,       // ширина главного контейнера (this.holder)
        mobile: false,  // mobile size
        portal: null,   // текущий контейнер для портала (ref). Опряделяет фиксировать панель на экране или нет
        fixed: false
    };
    resizeObject = null;

    componentDidMount () {
        // триггеры на scroll и resize
        window.addEventListener( "scroll", () => this.updatePanelPosition(), true );
        this.resizeObject = new ResizeObserver( entries => {
            for ( let entry of entries ) {
                this.setState( {
                                   width: entry.contentRect.width,
                                   top: this.stickyPanelWrap && this.stickyPanelWrap.getBoundingClientRect().top
                               } );
            }
        } );
        this.resizeObject.observe( document.getElementById( this.props.observe || 'main-wrap' ) );

        // Определяем начальное положение панели
        this.updatePanelPosition();

        // this.props.onChange && this.props.onChange( {fixed: this.state.fixed, mobile: this.state.mobile} );
    }

    // Удаляем триггеры
    componentWillUnmount () {
        window.removeEventListener( "scroll", this.updatePanelPosition );
        if ( this.resizeObject ) {
            this.resizeObject.unobserve( document.getElementById( this.props.observe || 'main-wrap' ) );
        }
    }

    shouldComponentUpdate ( nextProps, nextState ) {
        // console.log('this.state',this.state);
        // console.log('nextState---',nextState);
        // При смене папки или размера окна, обновляем позицию для панели
        if ( (this.props.folderId !== nextProps.folderId) || (this.state.width !== nextState.width) || (this.state.top !== nextState.top) ) {
            this.updatePanelPosition( nextState.width );
            return true;
        }

        // Изменения для перерисовки компонента
        if ( (this.state.portal !== nextState.portal)
            || (this.state.mobile !== nextState.mobile) ) {
            nextProps.onChange && nextProps.onChange( { fixed: nextState.fixed, mobile: nextState.mobile } );
        }
        return true;
    }

    // Обновление позиции панели (state)
    updatePanelPosition = ( width ) => {
        if ( !this.stickyPanelWrap ) return null;
        const fixed = this.isFixed();
        this.setState(
            {
                fixed: fixed,
                portal: fixed ? this.stickyPanelFixed : this.stickyPanelWrap,
                ... width && { mobile: width < MEDIA.sm ? (width < MEDIA.xs ? 'xs' : 'sm') : false }
            } );
    };

    // Определение какая панель (статичная или "fixed в портале") выше
    isFixed = () => {
        const holderTop = getTop( this.stickyPanelWrap );      // top статичного контейнера
        const fixHolderTop = getTop( this.stickyPanelFixed );  // top фиксированного контейнера
        return !holderTop || !fixHolderTop || (this.props.position === 'top' ? holderTop < fixHolderTop : holderTop > fixHolderTop);
    };

    render () {
        const { mobile, fixed, width, portal } = this.state;
        return (
            <div className={s.stickyPanelWrap} ref={r => this.stickyPanelWrap = r}>
                {portal && createPortal(
                    <div className={s.stickyPanelInner + ` ${fixed ? s.fixed : ''}`} style={Number.isInteger(this.props.padding ) ? {paddingLeft: this.props.padding} : null}>
                        {this.props.children}
                    </div>
                    , portal )}
                {createPortal(
                    <div className={s.stickyPanelFixed + ` ${this.props.position ? s[this.props.position] : s.bottom}`}
                         ref={r => this.stickyPanelFixed = r}
                         style={width ? { width: width } : null}/>,
                    document.getElementById( 'spa-top' )
                )}
            </div>);
    }
}

export default StickyPanel;
