import React, { Component, memo } from 'react';
import { createPortal } from "react-dom";

// import { ResizeContext } from 'contexts/resizeContext';
import ResizeObserver from 'resize-observer-polyfill';

import MEDIA from "config/media";

import PaginatorList from './PaginatorList';

import s from './paginator.scss';


/**
 * Пагинатор
 *
 * props:
 * className    {string} - доп. класс
 * currentPage  {number} - активная страница
 * totalPages   {number} - всего страниц
 * onSelectPage {function} - callback при выборе страницы (return {number})
 * portal       {boolean} - следует ли порталить пагинатор, когда он ниже экрана
 * currentPage  {null,number} - текущая страница пагинатора
 * totalPages   {null,number} - всего страниц в пагинаторе
 */
export default class Paginator extends Component {

    state = {
        top: 0,         // высота главного контейнера (this.holder)
        // left: 0,        // отступ слева главного контейнера (this.holder)
        width: 0,       // ширина главного контейнера (this.holder)
        // fixed: true,    // если true то фиксировать пагинатор на экране (класть в spa-top > fixHolder)
        small: false,   // если true то уменьшаем пагинатор (для маленьких экранов)
        portal: null,   // текущий контейнер для портала (ref). Опряделяет фиксировать пагинатор на экране или нет
        currentPage: null,
        totalPages: null
    };

    resizeObject = null;
    componentDidMount() {
        // Вешаем триггер на скролл
        window.addEventListener( "scroll", this.updatePaginatorPosition,true );
        // Вешаем триггер на ресайз главного блока
        this.resizeObject = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.setState( {
                        width: entry.contentRect.width,
                        small: entry.contentRect.width < MEDIA.sm
                    });
            }
            // Обновляем state.top
            this.updatePaginatorPosition();
        });
        this.resizeObject.observe(document.getElementById('main-wrap'));

    }

    // Удаляем триггер на скролл при удалении компонента
    componentWillUnmount() {
        window.removeEventListener( "scroll", this.updatePaginatorPosition );
        if ( this.resizeObject ) {
            this.resizeObject.unobserve(document.getElementById('main-wrap'));
        }
    }

    shouldComponentUpdate( nextProps, nextState ) {
        // Условия обновления компонента
        if (! nextProps.totalPages) return false;

        // При скроле/ресайзе, определяем где должен лежать пагинатор (fixed or static)
        if ( nextState.top !== this.state.top || nextState.width !== this.state.width ) {
            this.setState( { portal: this.isFixed() ? this.fixHolder : this.holder } ); // для портала задаем контейнер, который выше на экране
            return true;
        }

        if ( nextProps.currentPage !== this.props.currentPage || nextProps.totalPages !== this.props.totalPages ) {
            this.setState( { currentPage: nextProps.currentPage, totalPages:nextProps.totalPages } ); // обновляем страницы из props в state
            this.setState( { portal: this.isFixed() ? this.fixHolder : this.holder } ); // для портала задаем контейнер, который выше на экране
            return false;
        }

        return (nextState.portal !== this.state.portal) || ( nextState.currentPage !== this.state.currentPage) || (nextState.totalPages !== this.state.totalPages);
    }

    // Получить позицию top элемента на экране (crossbrowser version) TODO: удалить или использовать после проверки в разных браузерах
    getTop = ( elem ) => {
        if (!elem) return null;

        const box = elem.getBoundingClientRect();
        const body = document.body;
        const docEl = document.documentElement;

        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const clientTop = docEl.clientTop || body.clientTop || 0;

        return box.top +  scrollTop - clientTop;
    };

    isFixed = () => {
        const  holderTop = this.getTop(this.holder);         // top статичного контейнера
        const  fixHolderTop = this.getTop(this.fixHolder );  // top фиксированного контейнера
        return !holderTop || !fixHolderTop || holderTop > fixHolderTop;
    };

    // Обновление top пагинатора в state
    updatePaginatorPosition = () => {
        if ( !this.holder ) return null;
        this.setState( { top: this.holder.getBoundingClientRect().top} );
    };

    render() {
        const {className, portal, ...other} = this.props;
        const paginatorCN = s.paginator + (className ? (' ' + className) : '') + (this.state.small ? (' ' + s.small) : '');

        // Сам пагинатор
        const PagEl = () => {
            return  (
                <div className={paginatorCN}>
                    <div className={s.paginatorBlock}>
                        <PaginatorList {...other} small={this.state.small}/>
                    </div>
                </div>);
        };

        // Стили для фиксированного контейнера, чтобы размеры совпадали со статичным
        const fixedHolderStyle = this.state.width ? { width: this.state.width, left: this.state.left } : null;

        return (
            (portal && !process.env.server_render) ?
                <div className={s.holder} ref={r => this.holder = r}>

                    {this.state.portal && createPortal( <PagEl/>, this.state.portal )}

                    {createPortal(
                        <div className={s.fixedHolder} ref={r => this.fixHolder = r} style={fixedHolderStyle}/>,
                        document.getElementById( 'spa-top' )
                    )}
                </div>
            :
                <PagEl/>
        );
    }
};

{/*
<FixedHolder left={this.state.left} width={this.state.width} ref={r => this.fixHolder = r}/>,

const FixedHolder = forwardRef(({left, width}, ref) => {
    // Стили для фиксированного контейнера, чтобы размеры совпадали со статичным
    const fixedHolderStyle = width ? {width: width, left: left}: null;
    return <div className={s.fixedHolder} ref={ref} style={fixedHolderStyle}/>
});*/}
