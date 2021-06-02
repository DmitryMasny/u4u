import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { generateUID, getMillisecondsDate } from 'libs/helpers';
import EXIF from 'libs/exif2';
import { toast } from '__TS/libs/tools';

import { PHOTO_MAX_WEIGHT, PHOTO_ACCEPT_FORMATS, PHOTO_MAX_SENDING_COUNT, PHOTO_MIN_WEIGHT, PHOTO_MIN_SIZE } from 'config/main';
import { SOCIAL_GOOGLE, SOCIAL_INSTAGRAM, SOCIAL_VK, SOCIAL_YA } from 'const/myPhotos';

import { IconInstagram, IconVk, IconYandex } from 'components/Icons';
import {IconGooglePhoto} from "components/Icons/ColorIcon";

import TEXT_MY_PHOTOS from 'texts/my_photos';
import s from "./MyPhotosPage.scss";
import { uploadPhotosAction } from "./actions";
import { modalPhotosUploadAction, modalUploadSocialPhotosAction } from "actions/modals";

import sendMetric from 'libs/metrics';

import UploadThumb from "./_UploadThumb";
import {userRoleSelector} from "selectors/user";
import {windowIsMobileSelector} from "selectors/global";
import { Tooltip } from "../../_forms";


const formatInfoText = <div><p>Принимаются фотографии в формате ".jpg", не менее 450х450px и не более 50Мб.</p>
    <p>Если вы редактируете фотографии, сохраняйте их в цветовом профиле "sRGB"</p></div>


/**
 * Компонент загрузки фотографий
 */
class AddPhotos extends Component {
    state = {
        photoUploadList: [],
        photoUploading: false,
        percentTimeout: false,
        globalProgress: 0,
        uploadSuccess: false,
        uploadedCount: 0,
        visitorLimitOver: false
    };
    uploadPercents = {};
    setTimer = null;

    componentDidMount() {
        if (this.props.droppedFiles) this.uploadFiles(this.props.droppedFiles);
    }
    componentWillUnmount() {
        if (this.setTimer) clearTimeout( this.setTimer );
    }

    shouldComponentUpdate ( nextProps, nextState ) {
        // console.log('nextState',nextState);
        if (nextProps.droppedFiles !== this.props.droppedFiles) {
            this.uploadFiles(nextProps.droppedFiles);
        }
        // Если будет загрузка, блокируем модалку, если загрузка закончилась - снимаем блокировку
        if ( nextState.photoUploading !== this.state.photoUploading ) {
            let nextList = nextState.photoUploadList;

            const totalCount = nextList.length;
            const uploadedCount = !nextState.photoUploading && nextList.length;
            const successfulCount = uploadedCount && nextList.filter((item)=>!item.error).length;
            // Передаем свойства в модалку загрузки для элементов футера
            this.props.photosUploadModalAction( {
                                                    success: true,
                                                    photoUploadList: nextList,
                                                    disabled: nextState.photoUploading,
                                                    ...successfulCount && {successfulCount : successfulCount},
                                                    ...totalCount && {totalCount : totalCount},
                                                } );
            this.setState({
                              uploadSuccess: !nextState.photoUploading,
                              ...!nextState.photoUploading && { globalProgress: 0 },
                              ...uploadedCount && { uploadedCount: uploadedCount }
            });
            return true;
        }
        // if ( nextState.uploadSuccess !== this.state.uploadSuccess ) {
        //     this.props.photosUploadModalAction( { success: nextState.uploadSuccess, disabled: nextState.photoUploading } );
        //     return true;
        // }

        if ( this.state.photoUploadList !== nextState.photoUploadList ) {
            let uploadList = nextState.photoUploadList;
            const uploadListLength = uploadList.length;
            // Если есть загружаемые файлы
            if ( uploadListLength ) {

                // считаем глобалый прогресс загрузки
                let globalProgress = 0;
                let successful = 0;
                uploadList.forEach((item)=>{
                    if (item.percent){
                        globalProgress += item.percent;
                        if (item.percent === 100) successful ++;
                    }
                });
                this.setState( { globalProgress : Math.round( (globalProgress - nextState.uploadedCount*100 )/(uploadListLength - nextState.uploadedCount) ) } );

                // Считаем, сколько грузится в данный момент
                let loadingCount = 0;

                for ( let i = 0; i < uploadListLength && loadingCount <= PHOTO_MAX_SENDING_COUNT; i++ ) {
                    if ( uploadList[i].loading ) loadingCount++;
                }

                // "Подкидываем дровишки", если загружается в данный момент меньше PHOTO_MAX_SENDING_COUNT
                if ( loadingCount < PHOTO_MAX_SENDING_COUNT && loadingCount < uploadListLength ) {
                    let haveNew = false;
                    const newUploadList = uploadList.map( ( file ) => {
                        if ( loadingCount < PHOTO_MAX_SENDING_COUNT && !file.loading && !file.loaded ) {
                            haveNew = true;
                            loadingCount++;
                            file.loading = true;
                            this.sendToServer( file );
                        }
                        return file;
                    } );
                    haveNew && this.setState( { photoUploadList: newUploadList, photoUploading: true } );
                }

                if ( loadingCount === 0 ) this.setState( { photoUploading: false } );
            }
            return true;
        }

        return false;
    };

    /**
     * Загрузка фотографий пользователем с устройства.
     * Валидация на фронте по размеру и типу файла
     *
     * @param files {Array} - Массив файлов
     */
    uploadFiles = ( files ) => {

        if ( this.state.visitorLimitOver ) {
            toast.error('Превышен лимит загрузки для незарегистрированного пользователя', {
                autoClose: 6000
            });
            return null;
        }

        let acceptFiles = [];
        //функция проверки на повтор файла
        const checkFileDuplicate = ( file ) => {
            let isCopy = false;
            for ( let i=0; i < this.state.photoUploadList.length; i++ ) {
                const item = this.state.photoUploadList[i];
                if ( !item.file) return false;
                if ( (item.file.name === file.name) && (item.file.size === file.size) ) {
                    if (item.error){
                        this.setState({ photoUploadList:  this.state.photoUploadList.filter((item,j)=>j !== i) });
                        return false;
                    }
                    isCopy = true;
                    break;
                }
            }
            return isCopy;
        };

        //перебор поступивших фотографий
        for ( let i = 0; i < files.length; i++ ) {
            let file = files[i];
            //проверка на размер
            if ( parseInt( file.size ) > PHOTO_MAX_WEIGHT ) {
                toast.error('Большой фаил ' + file.name + '. Превышение ' + (PHOTO_MAX_WEIGHT / 1024 / 1024) + 'Mb', {
                    autoClose: 3000
                });
                continue; //прерываем выполение перебора, переходим к следующему файлу
            }

            //проверка на тип и формат файла
            let isCorrectFormat = false;
            PHOTO_ACCEPT_FORMATS.forEach( ( format ) => {
                if ( !!~file.type.indexOf( format ) ) {
                    isCorrectFormat = true
                }
            } );
            if ( !isCorrectFormat ) {
                toast.error('Неверный тип файла "' + file.name + '". Необходим файл JPEG', {
                    autoClose: 3000
                });
                continue; //прерываем выполение перебора, переходим к следующему файлу
            }

            //проверка на повтор файла
            if ( checkFileDuplicate( file ) ) {
                toast.error('Файл ' + file.name + ' уже загружен', {
                    autoClose: 3000
                });
                continue; //прерываем выполение перебора, переходим к следующему файлу
            }

            //добавленяем в массив фаил, подходящий под валидацию
            acceptFiles.push( file );
        }

        //if ( acceptFiles.length ) this.simpleLoading( acceptFiles ); // передаем файлы на загрузку
        if ( acceptFiles.length ) this.upLoading( acceptFiles );  // передаем файлы на анализ по EXIF
    };

    /**
     * Простая загрузка файлов, без проверки EXIF
     * @param files
     */
    simpleLoading = ( files ) => {
        this.addToUploadList( files.map( ( file ) => {
            return {
                id: generateUID(),
                file: file,
            };
        } ) );

    };
    upLoading = ( files ) => {
        let fileReaderList = [];

        // После перебора всех файлов кладем их в state
        const checkFileReaderList = () => {
            if ( fileReaderList.length === files.length ) this.addToUploadList( fileReaderList.filter( ( item ) => !item.error ) );
        };

        for ( let i = 0; i < files.length; i++ ) {
            //читаем файлы
            const reader = new FileReader();

            // Событие на загрузку файла на сервер (ответ по rest)
            reader.onload = (( file ) => ( readAsArrayBuffer ) => {

                //получаем EXIF информацию из загрудженных данных

                //let photoData = EXIF.getDataFromReadedFile( readAsArrayBuffer );
                let photoData = EXIF.getData( readAsArrayBuffer );

                const exif = (photoData ? photoData.exifdata : null);

                //проверка на наличие EXIF информации
                if ( exif ) {
                    // if ( false ) {
                    //валидация на размеры изображения
                    checkImageSizeValid( file, photoData.exifdata, ( valid ) => {

                        if ( valid ) {
                            const id = generateUID();
                            fileReaderList.push( {
                                                     id: id,
                                                     file: file,    //исходный фаил
                                                     exif: exif,    //exif информация
                                                     thumb: getThumbnail( readAsArrayBuffer, file ),    //превью
                                                     // thumb: false,  //превью
                                                     timeOrigin: (exif.DateTimeOriginal ? getMillisecondsDate( exif.DateTimeOriginal ) : 0) //вычисляем время в мс
                                                 } );
                            checkFileReaderList();
                            //получаем readAsDataURL данные по фотографии
                            // takeBase64ObjectImage( file, ( readAsDataURL ) => {
                            //     // Кладем подготовленный список файлов в очередь на загрузку
                            //
                            // } )
                        } else {
                            //НЕ ВАЛИДНЫЙ ГЕОМЕТРИЧЕСКИЙ РАЗМЕР
                            fileReaderList.push( {
                                                     error: {
                                                         file: file,
                                                         exifdata: photoData.exifdata
                                                     }
                                                 } );
                            checkFileReaderList();
                        }

                    } );
                } else {
                    // если нет exif, размеры изображения не проверяем
                    fileReaderList.push( {
                                             id: generateUID(),
                                             file: file,
                                             thumb: getThumbnail( readAsArrayBuffer, file ),    //превью
                                             // thumb: false,
                                         } );
                    checkFileReaderList();
                }
            })( files[i] );

            reader.readAsArrayBuffer( files[i].slice( 0, 50000 ) );
        }

        // Возвращает миниатюру из exif или открывает файл с устройства
        const getThumbnail = ( fileObject, file ) => getExifThumbnail( fileObject ) || (window.URL || window.webkitURL).createObjectURL( file );

        const getExifThumbnail = ( fileObject ) => {

            let array = new Uint8Array( fileObject.target.result ), start = 0, end;
            for ( let i = 2; i < array.length; i++ ) {
                if ( array[i] === 0xFF ) {

                    if ( !start && array[i + 1] === 0xD8 ) { //0xDA
                        start = i;
                    } else if ( array[i + 1] === 0xD9 ) {
                        end = i;
                        break;
                    }
                }
            }

            if ( start && end ) {
                const urlCreator = (window.URL || window.webkitURL);
                const blob = new Blob( [ array.subarray( start, end ) ], { type: 'image/*' } );
                // return urlCreator.createObjectURL( blob );

                const bugZone = array.subarray( start, end ).slice(0,5);

                if ( (bugZone[ 0 ] === 255) && (bugZone[ 1 ] === 216) && (bugZone[ 2 ] === 255) ) {
                    // Проверка пройдена, blob корректный
                    return urlCreator.createObjectURL( blob );
                }
            }
            return false;
        };

        const checkImageSizeValid = ( file, exif, callback ) => {

            let width = exif.PixelXDimension || false;
            let height = exif.PixelYDimension || false;

            const checkSize = ( width, height, size ) => {
                return (width >= size[0] && height >= size[1] || width >= size[1] && height >= size[0])
            };
            const alertWrongSize = () => {
                toast.error('Размер изображения должен быть не менее ' + PHOTO_MIN_SIZE[0] + 'x' + PHOTO_MIN_SIZE[1] +
                    ' или ' + PHOTO_MIN_SIZE[1] + 'x' + PHOTO_MIN_SIZE[0], {
                    autoClose: 3000
                });
            };

            if ( !width || !height ) {
                callback( true );
                //если же размеры есть, преверяим их на корректность
            } else if ( !checkSize( width, height, PHOTO_MIN_SIZE ) ) {
                alertWrongSize();
                callback( false );
            } else {
                callback( true );
            }
        };

        // const createThumbnail = ( readAsDataURL ) => {
        //
        //     generateImage( file, ( img ) => {
        //
        //         let canvas = document.createElement('canvas'),
        //             width = img.width,
        //             height = img.height;
        //
        //         if (width > height) {
        //             if (width > config.maxThumbSize) {
        //                 height *= config.maxThumbSize / width;
        //                 width = config.maxThumbSize;
        //             }
        //         } else {
        //             if (height > config.maxThumbSize) {
        //                 width *= config.maxThumbSize / height;
        //                 height = config.maxThumbSize;
        //             }
        //         }
        //
        //         canvas.width = width;
        //         canvas.height = height;
        //         canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        //
        //         const dataURL = canvas.toDataURL('image/jpeg');
        //
        //         if (dataURL != null && dataURL != undefined) {
        //             const urlCreator = window.URL || window.webkitURL;
        //             callback(urlCreator.createObjectURL(dataURItoBlob(dataURL)));
        //
        //             /*canvas.toBlob((result) => {
        //                 callback(urlCreator.createObjectURL( result ));
        //             }, 'image/jpeg', 0.95);*/
        //
        //         }
        //     });
        //
        // };

        // const takeBase64ObjectImage = ( file, callback = null ) => {
        //     const reader = new FileReader();
        //     reader.onload = function ( result ) {
        //         callback( result );
        //     };
        //     reader.readAsDataURL( file );
        // };

        //     const generateImage = ( file, callback = null ) => {
        //
        //         takeBase64ObjectImage( file, ( resultBase64Object ) => {
        //
        //             const createImage = ( file, resultBase64Object, callback) => {
        //                 return () => {
        //                     const img = new Image();
        //
        //                     img.onload = function (r) {
        //                         generatedImageObject[file.id] = img;
        //
        //                         callback(img);
        //                         queueImagesInProcess = false;
        //
        //                         if (queueImagesToProcess.length) {
        //                             queueImagesInProcess = true;
        //                             queueImagesToProcess.shift()();
        //                         }
        //                     };
        //                     img.src = resultBase64Object.target.result;
        //
        //                 }
        //             };
        //
        //             if (queueImagesInProcess) {
        //                 queueImagesToProcess.push(createImage( file, resultBase64Object, callback));
        //             } else {
        //                 createImage( file, resultBase64Object, callback )();
        //                 queueImagesInProcess= true;
        //             }
        //         });
        //     }
        //
    };

    addToUploadList = ( files ) => {
        this.setState( {
                           photoUploadList: [...this.state.photoUploadList, ...files]
                       } );
    };


    /**
     * отправка файла на сервер
     */
    sendToServer = ( file ) => {
        this.props.uploadPhotosAction( {
                                           photo: file,
                                           callback: ( response ) => this.uploadCallback( file.id, response ),
                                           updateProgress: this.updateProgress
                                       } );



    };

    /**
     * Ответ при завершении загрузки файла на сервер
     */
    uploadCallback = ( id, response ) => {
        const { photoId, error } = response;   // Сервер возвращает ошибку или photo_id
        const limit = (error === 'превышен лимит');
        if (this.state.visitorLimitOver && limit ) return null; // чтобы не падало несколько одинаковых тостов с ошибкой
        let photoUploadList = this.state.photoUploadList.map( ( item ) => {
            if ( item.id === id ) {
                delete item.loading;
                item.loaded = true;
                if (error) item.error = error;
                if (photoId) item.id = photoId;
            }
            return item;
        } );

        if (limit) {
            toast.error('Превышен лимит загрузки для незарегистрированного пользователя', {
                autoClose: 3000
            });
            photoUploadList = photoUploadList.filter( ( item ) => (item.id || item.error)  );
        }

        this.setState( {
                           photoUploadList: photoUploadList,
                            ...limit && {
                                visitorLimitOver: true,
                                photoUploading: false
                            }
                       } );
    };
    /**
     * Прогресс загрузки файла на сервер
     */
    updateProgress = ( id, percent ) => {
        // if (this.state.visitorLimitOver) {
        //     id && this.setState( {
        //         photoUploadList: this.state.photoUploadList.filter((item)=>!item.loading || item.id!==id)
        //     } );
        //     return null;
        // }
        if (this.state.visitorLimitOver) {
            // console.log('updateProgress');
            return null;
        }

        if (id) this.uploadPercents = { ...this.uploadPercents, [id]:{ percent : percent } };

        if (!this.state.percentTimeout) {
            const keys = Object.keys(this.uploadPercents);

            this.setState( {
                               photoUploadList: this.state.photoUploadList.map( ( item ) => {
                                   keys.filter( ( key ) => {
                                       if ( item.id === key ) {
                                           item.percent = this.uploadPercents[key].percent;
                                           return false;
                                       }
                                       return true;
                                   } );
                                   return item;
                               } ),
                               percentTimeout: true
                           } );
            if (this.setTimer) clearTimeout( this.setTimer );

        } else {
            if ( !this.setTimer ) this.setTimer = setTimeout( () => {
                this.setState( { percentTimeout: false } );
                clearTimeout( this.setTimer );
                this.setTimer = null;
            }, 500 );
        }

    };


    /**
     * Получить Google, Instagram, Vk, Yandex фотки
     */
    getSocialPhotos = (target) => {
        this.props.socialPhotosModalAction({target: target, closeCallback: ()=>this.props.photosUploadModalAction(false)});
        sendMetric(target + '_button');
    };


    render () {
        return <Fragment>

            <div className={s.myPhotosUpload} >
                <div className={s.myPhotosUploadBtnWrap}>
                    <div className={s.myPhotosUploadBtn} onClick={()=>this.fileInput.click()}>
                        { this.props.isMobile ? TEXT_MY_PHOTOS.UPLOAD_FROM_DEVICE : TEXT_MY_PHOTOS.UPLOAD_FROM_PC }
                        <input type="file" name="file"
                               multiple={true}
                               onChange={(e)=>this.uploadFiles(e.target.files)}
                               style={{display: 'none'}}
                               ref={(r)=> this.fileInput = r} />
                    </div>
                    <div className={`${s.myPhotosUploadText} ${s.formatUploadInfo} `}>
                        <Tooltip tooltip={formatInfoText} placement="bottom">
                            <span className={s.helpText}>{TEXT_MY_PHOTOS.UPLOAD_INFO}</span>
                        </Tooltip>
                    </div>
                    <p className={s.myPhotosUploadText}>{TEXT_MY_PHOTOS.U_CAN_DRAG_N_DROP}.</p>
                    <p className={s.myPhotosUploadText}>{TEXT_MY_PHOTOS.OR_SOC_UPLOAD}:</p>

                    <div className={s.socialWrap}>
                        <div className={`${s.socialBtn} ${s.google} ${this.state.photoUploading ? s.disabled : ''}`} onClick={()=>this.getSocialPhotos(SOCIAL_GOOGLE)}>
                            <IconGooglePhoto size={24} className={s.socialBtnIcon}/>
                            { TEXT_MY_PHOTOS.GOOGLE_PHOTOS }
                        </div>

                        <div className={`${s.socialBtn} ${s.instagram} ${this.state.photoUploading ? s.disabled : ''}`} onClick={()=>this.getSocialPhotos(SOCIAL_INSTAGRAM)}>
                            <div className={s.iconWrap}>
                                <IconInstagram size={24} className={s.socialBtnIcon}/>
                            </div>
                            { TEXT_MY_PHOTOS.INSTAGRAM }
                        </div>

                        <div className={`${s.socialBtn} ${s.vk} ${this.state.photoUploading ? s.disabled : ''}`} onClick={()=>this.getSocialPhotos(SOCIAL_VK)}>
                            <div className={s.iconWrap}>
                                <IconVk size={24} className={s.socialBtnIcon}/>
                            </div>
                            { TEXT_MY_PHOTOS.VK }
                        </div>
                        <div className={`${s.socialBtn} ${s.yandex} ${this.state.photoUploading ? s.disabled : ''}`} onClick={()=>this.getSocialPhotos(SOCIAL_YA)}>
                            <IconYandex size={24} className={s.socialBtnIcon}/>
                            { TEXT_MY_PHOTOS.YANDEX_PHOTO }
                        </div>
                    </div>


                </div>
            </div>


            <div className={s.myPhotosUploadThumbsWrap}>
                {!!this.state.photoUploadList.length && this.state.photoUploadList.map(
                    ( item ) =>
                        <UploadThumb
                            loading={item.loading}
                            thumbUrl={item.thumb}
                            percent={item.percent}
                            loaded={item.loaded}
                            error={item.error}
                            file={item.file}
                            key={item.id}/>
                )}
            </div>

            <div className={s.myPhotosUploadGlobalProgress + (this.state.photoUploading && !this.state.uploadSuccess ? ` ${s.show}` : '')} >
                <div className={s.myPhotosUploadGlobalProgressInner} style={this.state.globalProgress ? {width: this.state.globalProgress + '%'}: null}/>
            </div>

        </Fragment>;
    }
}

export default connect(
    state => ({
        userRoleSelector: userRoleSelector( state ),
        isMobile: windowIsMobileSelector( state ),
    }),
    dispatch => ({
        uploadPhotosAction: ( o ) => dispatch( uploadPhotosAction( o ) ),
        photosUploadModalAction: ( o ) => dispatch( modalPhotosUploadAction( o ) ),
        socialPhotosModalAction: ( o ) => dispatch( modalUploadSocialPhotosAction( o ) ),
    })
)( AddPhotos );


