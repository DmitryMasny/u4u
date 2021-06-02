import React, { Component, Fragment, useEffect, useRef, useState } from 'react';
import Spinner from 'components/Spinner';
import { PHOTO_THUMB_SIZE } from 'config/main';
import s from './ImageLoader.scss';
/*
const ImageLoader = ( {
                          type,
                          src,
                          preload,
                          preloadSize,
                          authId,
                          showLoader,
                          className,
                          classNameLoader: cnl,
                          absolute,
                          light
                      } ) => {
    const [showLoaderState, showLoaderStateSet] = useState( false );
    const [loadingState, loadingStateSet] = useState( true );
    const [srcState, srcStateSet] = useState( '' );
    const [preloadingState, preloadingStateSet] = useState( null );
    const loader = useRef( null );
    const i = useRef( null );

    //componentDidMount
    useEffect(()=> {
        loadImage( preload || src );

        //componentWillUnmount
        return () => {
            loader.current && clearTimeout( loader.current ); // убираем событие timeout
            i.current = null;
        }
    }, []);

    useEffect(()=> {
        loadImage( preload || src );
    }, [src, preload] );

    const loadImage = ( srcImage ) => {
        const isYaPhotoType = type && type === 'ya' || false;

        console.log('isYaPhotoType 2', isYaPhotoType ? null : srcImage);
        console.log('srcImage', srcImage);

        loadingStateSet( !preload );
        preloadingStateSet( isYaPhotoType ? null : srcImage );
        srcStateSet(preload && srcImage + `=h${preloadSize || PHOTO_THUMB_SIZE[ 1 ]}` || '');

        if ( isYaPhotoType ) {
            const headers = new Headers();

            headers.append( 'Content-Type', 'text/plain; charset=UTF-8' );
            headers.append( 'Authorization', 'OAuth ' + authId );

            const options = {
                method: 'GET',
                headers: headers,
                mode: 'cors',
                cache: 'default',
            };
            const request = new Request( srcImage );

            const arrayBufferToBase64 = buffer => {
                let binary = '';
                const bytes = [].slice.call( new Uint8Array( buffer ) );
                bytes.forEach( ( b ) => binary += String.fromCharCode( b ) );
                return window.btoa( binary );
            };

            fetch( request, options ).then( response => {
                response.arrayBuffer().then( buffer => {
                    const base64Flag = 'data:image/jpeg;base64,';
                    const imageStr = arrayBufferToBase64( buffer );
                    showLoaderStateSet( false );
                    loadingStateSet( false );
                    srcStateSet( base64Flag + imageStr );

                } );
            } );
        } else {

            //показываем лоадер с задержкой
            loader.current = setTimeout( () => showLoaderStateSet( true ), 700 );

            const url = srcImage + (preload ? `=h${PHOTO_THUMB_SIZE[ 2 ]}` : '');

            i.current = new Image();
            i.current.src = url;

            console.log('X1', i.current);
            i.current.onload = () => {
                console.log('ZAS 1', preloadingState);
                console.log('ZAS 2', srcImage);
                if ( preloadingState === srcImage ) {
                    clearTimeout( loader.current );
                    showLoaderStateSet( false );
                    loadingStateSet( false );
                    srcStateSet( url );
                }
            }
        }
    };

    const classNameImage = s.prevImage + (className ? ` ${className}` : '');
    const classNameLoader = s.loaderWrap + (cnl ? ` ${cnl}` : '') + (absolute ? ` ${s.abs}` : '');
    return <Fragment>
                {!loadingState && <img className={classNameImage} src={srcState}/>}
                {(showLoaderState || showLoader) && <div className={classNameLoader}><Spinner size={30} light={light}/></div>}
           </Fragment>;
};
export default ImageLoader;

*/
export default class ImageLoader extends Component {
    state = {
        showLoader: false,
        loading: true,
        src: '',
        preloading: null
    };
    loader = null;
    i = null;

    loadImage( src ) {
        const isYaPhotoType = this.props.type && this.props.type === 'ya';
        this.setState( {
            loading: !this.props.preload,
            preloading: isYaPhotoType ? null : src,
               ...this.props.preload && { src: src + `=h${this.props.preloadSize || PHOTO_THUMB_SIZE[ 1 ]}` } || {}
        } );

        if (isYaPhotoType) {
            const headers = new Headers();

            headers.append( 'Content-Type', 'text/plain; charset=UTF-8' );
            headers.append( 'Authorization', 'OAuth ' + this.props.authId );

            const options = {
                method: 'GET',
                headers: headers,
                mode: 'cors',
                cache: 'default',
            };
            const request = new Request(src);

            fetch( request, options ).then( ( response ) => {
                response.arrayBuffer().then( ( buffer ) => {
                    const base64Flag = 'data:image/jpeg;base64,';
                    const imageStr = arrayBufferToBase64( buffer );
                    this.setState( { showLoader: false, loading: false, src: base64Flag + imageStr } );
                } );
            } );

            function arrayBufferToBase64(buffer) {
                let binary = '';
                const bytes = [].slice.call(new Uint8Array(buffer));

                bytes.forEach( ( b ) => binary += String.fromCharCode( b ) );

                return window.btoa(binary);
            }

        } else {

            //показываем лоадер с задержкой
            //this.loader = setTimeout( () => this.setState( { showLoader: true } ), 700 );

            const url = src + (this.props.preload ? `=h${PHOTO_THUMB_SIZE[2]}` : '') ;

            this.i = new Image();
            this.i.src = url;

            this.i.onload = () => {
                if ( this.state.preloading === src ) {
                    clearTimeout( this.loader );
                    this.setState( { showLoader: false, loading: false, src: url } );
                }
            }
        }
    }
    componentDidMount() {
        this.loadImage( this.props.preload || this.props.src );
    }
    UNSAFE_componentWillUpdate(nextProps) {
        if ( nextProps.src !== this.props.src || nextProps.preload !== this.props.preload ) {
            this.loadImage( nextProps.preload || nextProps.src );
            return false;
        }
        return true;
    }
    componentWillUnmount() {
        this.loader && clearTimeout( this.loader ); // убираем событие timeout
        this.i = null;
    }
    render () {

        const { className, classNameLoader:cnl, absolute, light, showLoader } = this.props;
        const classNameImage = s.prevImage + (className ? ` ${className}` : '');
        const classNameLoader = s.loaderWrap + (cnl ? ` ${cnl}` : '') + (absolute ? ` ${s.abs}` : '');
        return <Fragment>
                    {!this.state.loading &&  <img className={classNameImage} src={this.state.src}/> }
                    {(this.state.showLoader || showLoader) && <div className={classNameLoader}><Spinner size={30} light={light}/></div> }
                </Fragment>;
    }
}
