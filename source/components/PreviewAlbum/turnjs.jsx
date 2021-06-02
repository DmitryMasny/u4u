import React, { Component } from "react";
import $ from "jquery";
import turn from "./turn.js";

import PagesConstructor from './_PagesConstructor';

import { IconChevronRight, IconChevronLeft } from 'components/Icons'

//мобольное ли устройство
const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );

/**
 * Компонет инициализирует листалку на отрендеренные страницы книги
 */
export default class TurnJs extends Component {
    constructor(props) {
        super(props);
        //console.log('TURNJS CONSTRUCTOR');
        //проверяем на наличие инициализации turnjs и инициализируем
        if (!$.fn || !$.fn.turn) $.extend($.fn, turn($));

        this.state = {
            albumWidth: 0,
            albumHeight: 0
        };

        this.proportions = 0;    //пропорции альбома
        this.pageTotalCount = 0; //число страниц в альбоме
        this.pageCurrent = 1;    //текущая страница
    }
    //применение изменений при перевороте страницы
    acceptChangeAfterTurn() {
        //устанавливаем состояние стрелок листания в родительском компоненте
        if ( this.albumControlButtonLeft && this.albumControlButtonRight ) {
            this.albumControlButtonLeft.handlerActive(this.pageCurrent > 0);
            this.albumControlButtonRight.handlerActive(this.pageCurrent < this.pageTotalCount);
        }
    }

    //так как плагин turnjs возвращает то четное, то нечетный номер страницы, приводим к нормальному виду
    setCurrentPage ( pageTurn ) {
        this.pageCurrent = Math.floor(pageTurn / 2);

        if (this.props.fullScreen) {
            this.paginate.setCurrentPage(this.pageCurrent);
            this.acceptChangeAfterTurn();
        }
    }
    keyControll = ( event ) => {
        //console.log('event.keyCode', event.keyCode);
        switch ( event.keyCode ) {
            case 37:
                this.prevPage();
                break;
            case 39:
                this.nextPage();
                break;
        }
    };
    initBook () {
        const self = this;

        this.$book = $( this.book );
        const size = this.calculateAlbumSize();
        try {
            this.$book.turn( {
                width: size.width,
                height: size.height,
                duration: (isMobile ? 0 : 1500), //отключаем анимацию для мобильных устройств
                elevation: 150,
                gradients: true,
                autoCenter: true,
                acceleration: !isMobile, //отключаем акселерацию для мобильных устройств
                page: this.pageCurrent,
                when: {
                    //обработчик события завершения переворота страницы
                    turning: function ( e, page, view ) {
                        //установка текущей страницы
                        self.setCurrentPage( page );

                        //устанавливаем классы fixed для обложки
                        $( self.book ).find( '.p2' ).toggleClass( 'fixed', page >= 2 );
                        $( self.book ).find( '.p' + (self.$book.turn( 'pages' ) - 1) ).toggleClass( 'fixed', page < self.$book.turn( 'pages' ) );
                    },
                }

            } );
        } catch( error ) {
            console.log('Custom Error', error);
        }

        //устанавливаем общее число страниц (оперируем разворотами)
        this.pageTotalCount = Math.floor( this.$book.turn( "pages" ) / 2 );

        if (this.props.fullScreen) {
            this.paginate.handlerSetTotalPages( this.pageTotalCount );
        }

        //устанавливаем активную страницу
        this.setCurrentPage( this.$book.turn( "page" ) );
        const _self = this;

        //обработчик стрелок на клавиатуре
        document.addEventListener( 'keydown',  this.keyControll);
    };
    componentDidUpdate () {
        //инициализируем скрип листалки
        if ( this.state.albumWidth ) {
            this.initBook();
        }
    }
    calculateAlbumSize () {
        //получаем размеры блока куда вставляем альбом и считаем пропорции блока
        let { offsetWidth: windowWidth } = this.bookBlock,
            { innerHeight: windowHeight } = window;

        const xs = windowWidth < 480,
                xsLand = windowWidth < 740 && (windowHeight < 420);
        windowWidth -= xs ? 20 : 80; //отступ по горизонтали для фона вокруг книги
        windowHeight -= xsLand ? 120 : 300;

        if (this.props.sizeFix ) windowHeight -= this.props.sizeFix; //фикс высоты если ниже показывать инфо о выбранном типе

        const windowProportion = (windowWidth / windowHeight);

        let width = 0,
            height = 0;

        if ( windowProportion >= this.proportions ) {
            height = windowHeight;
            width = height * this.proportions;
        } else {
            width = windowWidth;
            height = width / this.proportions;
        }

        //возвращаем размер альбома на экране в пикселях
        return {
            width: width,
            height: height
        }
    }
    componentDidMount() {
        const { width, height } = this.calculateAlbumSize();
        this.setState({
            albumWidth: width,
            albumHeight: height
        });
    }
    componentWillUnmount() {
        document.removeEventListener( 'keydown',  this.keyControll);
        if ( !this.$book ) return;
        this.$book.turn("destroy").remove();
    }
    nextPage = () => {
        if ( !this.$book ) return;
        this.$book.turn('next');
    };
    prevPage = () => {
        if ( !this.$book ) return;
        this.$book.turn('previous');
    };
    render() {
        const { layout } = this.props;

        if (!layout.coverSize) return null;

        const { coverParams, coverSize } = layout;

        //задаем пропорции альбома
        this.proportions = (coverSize.width * 2) / coverSize.height;

        //собираем классы по типу переплета и обложки
        let classBook = 'real-book__viewport';
        if ( coverParams.roundedCorners ) classBook += ' rounded';
        if ( coverParams.hardCover ) classBook += ' hard';
        if ( coverParams.pur ) classBook += ' pur';
        if ( coverParams.clip ) classBook += ' clip';
        if ( coverParams.spring ) classBook += ' spring';

        if ( this.props.fullScreen) classBook += 'full';

        return (
            <div className="real-book" ref={(r)=>this.bookBlock = r}>
                <div className="real-book-control-btn left" onClick={()=>this.prevPage()}>
                    <IconChevronLeft  size={36} />
                </div>
                <div className="real-book-control-btn right" onClick={()=>this.nextPage()}>
                    <IconChevronRight size={36} />
                </div>
                <div className={classBook}>
                    <div className="real-book__main" >
                        <div className="block-preview-album flipbook" ref={(r)=>this.book = r}>
                        {this.state.albumHeight &&
                            <PagesConstructor
                                pxWidth={this.state.albumWidth}
                                pxHeight={this.state.albumHeight}
                                pages={layout.pages}
                                coverSize={layout.coverSize}
                                coverParams={layout.coverParams}
                            />
                        }
                        </div>
                    </div>
                </div>
            </div>
           )
    }
}