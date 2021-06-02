import React, { Component } from "react";

//мобольное ли устройство
const isMobile = !process.env.server_render ? ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) : false;

/**
 * Компонент
 * фон
 */
const Background = ( { block, isThumb } ) => {
    const styleDiv = {
            width: block.width + '%',
            height: block.height + '%',
            top: block.y + '%',
            left: block.x + '%',
        },
        styleImg = {
            width: block.content.width + '%',
            height: block.content.height + '%',
            top: block.content.y + '%',
            left: block.content.x + '%',
        },
        format = isThumb ? "_sm.jpg" : "_md.jpg";

    let img = ''; // Почему-то с "let img = block.content.image" не работает! (T_T)

    if ( !~block.content.image.indexOf('.png') && !~block.content.image.indexOf('.jpg') && !~block.content.image.indexOf('.jpeg') ) {
        img = block.content.image + format;
    } else if ( isThumb ) {
        img = block.content.image.replace('_md.jpg', '_sm.jpg');
    } else{
        img = block.content.image;
    }

    return <div className="block-preview-album__block-bg" style={styleDiv}>
                <img src={img} style={styleImg}/>
            </div>;
};

/**
 * Компонент
 * блок текста
 */
const Text = ( { block } ) => {
    const styleImg = {
            width: block.width + '%',
            height: block.height + '%',
            top: block.y + '%',
            left: block.x + '%',
          };
    return <img className="block-preview-album__text" src={block.url} style={styleImg} />
};


/**
 * Компонент
 * прямоугольник
 */
const Rectangle = ( { block } ) => {
    const styleDiv = {
            width: block.width + '%',
            height: block.height + '%',
            top: block.y + '%',
            left: block.x + '%',
            background: block.color
        };
    return <div className="block-preview-album__block-cover-inner" style={styleDiv} />;
};

/**
 * Компонент
 * фотография
 */
class Image extends Component {
    state = {image: false};
    UNSAFE_componentWillMount () {
        const block = this.props.block;
        this.styleBlock = {
            width: block.width + '%',
            height: block.height + '%',
            top: block.y + '%',
            left: block.x + '%',
        };
        this.styleImg = {
            width: block.content.width + '%',
            height: 'auto',
            top: block.content.y + '%',
            left: block.content.x + '%',
        };
        this.styleImgDiv = {
            width: block.content.width + '%',
            height: block.content.height + '%',
            top: block.content.y + '%',
            left: block.content.x + '%',
        };
        this.multiplier = (isMobile ? 2 : 1.5);
    }

    componentDidMount () {
        this.props.isThumb && this.setState({image: true});
    }

    render () {
        let img = null;
        if ( !this.state.image ) {
            img = <div className="ph" style={this.styleImgDiv} ref={r => this.div = r} data-multiplier={this.multiplier}
                       data-url={this.props.block.content.image}/>;
        } else {
            //const src = this.props.block.content.image + '=w' + Math.floor(this.props.block.content.width * this.props.block.width / 100);

            const size = this.div ? this.div.offsetWidth : Math.floor(this.props.block.content.width * this.props.block.width / 50);
            const src = this.props.block.content.image + '=w' + size;

            img = <img className="photo" style={this.styleImg} src={src}/>;
        }
        return <div className="block-preview-album__block" style={this.styleBlock}>
                    {img}
               </div>;
    }
}

export { Background, Text, Rectangle, Image }