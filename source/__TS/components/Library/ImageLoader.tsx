// // @ts-ignore
// import React, { useState } from 'react';
// // @ts-ignore
// import Spinner from 'components/Spinner';
//
// import {StyledImageLoader} from "./_styles";
// import {IimageLoaderComponent, IlibraryItemTags} from "./_interfaces";
//
// const ImageLoader: React.FC<IimageLoaderComponent> = ({}) => {
//
// export default class ImageLoader extends Component {
//     state = {
//         showLoader: false,
//         loading: true,
//         src: '',
//         preloading: null
//     };
//     loader = null;
//     i = null;
//
//     loadImage( src ) {
//         const isYaPhotoType = this.props.type && this.props.type === 'ya';
//         this.setState( {
//             loading: !this.props.preload,
//             preloading: isYaPhotoType ? null : src,
//             ...this.props.preload && { src: src + `=h${this.props.preloadSize || PHOTO_THUMB_SIZE[ 1 ]}` } || {}
//         } );
//
//         if (isYaPhotoType) {
//             const headers = new Headers();
//
//             headers.append( 'Content-Type', 'text/plain; charset=UTF-8' );
//             headers.append( 'Authorization', 'OAuth ' + this.props.authId );
//
//             const options = {
//                 method: 'GET',
//                 headers: headers,
//                 mode: 'cors',
//                 cache: 'default',
//             };
//             const request = new Request(src);
//
//             fetch( request, options ).then( ( response ) => {
//                 response.arrayBuffer().then( ( buffer ) => {
//                     const base64Flag = 'data:image/jpeg;base64,';
//                     const imageStr = arrayBufferToBase64( buffer );
//                     this.setState( { showLoader: false, loading: false, src: base64Flag + imageStr } );
//                 } );
//             } );
//
//             function arrayBufferToBase64(buffer) {
//                 let binary = '';
//                 const bytes = [].slice.call(new Uint8Array(buffer));
//
//                 bytes.forEach( ( b ) => binary += String.fromCharCode( b ) );
//
//                 return window.btoa(binary);
//             }
//
//         } else {
//
//             //показываем лоадер с задержкой
//             //this.loader = setTimeout( () => this.setState( { showLoader: true } ), 700 );
//
//             const url = src + (this.props.preload ? `=h${PHOTO_THUMB_SIZE[2]}` : '') ;
//
//             this.i = new Image();
//             this.i.src = url;
//
//             this.i.onload = () => {
//                 if (this.state.preloading === src) {
//                     clearTimeout( this.loader );
//                     this.setState( { showLoader: false, loading: false, src: url } );
//                 }
//             }
//         }
//     }
//     componentDidMount() {
//         this.loadImage( this.props.preload || this.props.src );
//     }
//     componentWillUpdate(nextProps) {
//         if ( nextProps.src !== this.props.src || nextProps.preload !== this.props.preload ) {
//             this.loadImage( nextProps.preload || nextProps.src );
//             return false;
//         }
//         return true;
//     }
//     componentWillUnmount() {
//         this.loader && clearTimeout( this.loader ); // убираем событие timeout
//         this.i = null;
//     }
//     render () {
//
//         const { className, classNameLoader:cnl, absolute, light, showLoader } = this.props;
//         const classNameImage = s.prevImage + (className ? ` ${className}` : '');
//         const classNameLoader = s.loaderWrap + (cnl ? ` ${cnl}` : '') + (absolute ? ` ${s.abs}` : '');
//         return <StyledImageLoader>
//             {!this.state.loading &&  <img className={classNameImage} src={this.state.src}/> }
//             {(this.state.showLoader || showLoader) && <div className={classNameLoader}><Spinner size={30} light={light}/></div> }
//         </StyledImageLoader>;
//     }
// }
