// @ts-ignore
import React, {useState, useEffect, useContext, useRef, memo} from 'react';
// @ts-ignore
import {useSelector, useDispatch} from "react-redux";
// @ts-ignore
import {TYPES} from 'const/types';
import Spinner from '__TS/components/_misc/Spinner';


// @ts-ignore
import {Input, Btn, Checkbox} from 'components/_forms';
// @ts-ignore
import { toast } from '__TS/libs/tools';
// @ts-ignore
import { generateUID, declOfNum } from "libs/helpers";
// @ts-ignore
import { ModalContext} from 'components/Modal';
// @ts-ignore
import {hexToRgbA} from "libs/helpers";
// @ts-ignore
import {PageInner} from "components/Page";
// @ts-ignore
import { COLORS, TextOverflow } from 'const/styles';

import styled, {css, keyframes} from 'styled-components';

import Library from "__TS/components/Library";

import { modalUploadBackgroundsSelector, IUploadModalSelector } from "__TS/selectors/modals"

/** Actions */
import {
    uploadBackgroundAction,
} from "__TS/libs/request";
import {createStickerLink} from "../../../libs/sticker";


/** Interfaces */
interface ImodalUploadBackgrounds {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    // moveBackgroundAction: (name: string)=>any;     // экшен перенести фон
}
interface IbackgroundsUploadProgressBar {
    uploadCount?: number;
    totalPercent?: number;
    errorCount?: number;
}
interface IuploudFilesBtn {
    onUploadFileHandler: any;
}


/** Styles */
const UploadedBackgroundsWrap = styled('div')`
    margin-bottom: 20px;
    min-height: 200px;
`;

// Create the keyframes
const uploadProgressAnimation = keyframes`
  from {
    background-position: 0 0;
  }

  to {
    background-position: 50px 50px;
  }
`;

const StyledProgressBar = styled('div')`
    position: relative;
    margin-top: 5px;
    margin-left: 10px;
    margin-right: 20px!important;
    height: 30px;
    flex-grow: 1;
    background-color: ${COLORS.LINE};
    border-radius: 15px;
    overflow: hidden;
    transition: opacity .1s ease-out;
    .innerBar{
        position: relative;
        width: 0;
        height: 100%;
        background-color: ${COLORS.INFO};
        transition: width .5s ease-in-out;
        //box-shadow:
        //        inset 0 1px 5px rgba(255, 255, 255, 0.1),
        //        inset 0 -1px 6px rgba(0, 0, 0, 0.2);

        &:after {
            display: ${({isDone}: {isDone: boolean;})=>!isDone ? 'block' : 'none'};
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-image: linear-gradient(
                            -45deg,
                            rgba(255, 255, 255, .2) 25%,
                            transparent 25%,
                            transparent 50%,
                            rgba(255, 255, 255, .2) 50%,
                            rgba(255, 255, 255, .2) 75%,
                            transparent 75%,
                            transparent
            );
            z-index: 1;
            background-size: 50px 50px;
            animation: ${uploadProgressAnimation} 2s linear infinite;
        }
        &.loading:after {
        
        }
    }
    .innerText{
        position: absolute;
        padding: 0 10px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        font-size: 13px;
        line-height: 30px;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 1px 3px ${hexToRgbA(COLORS.BLACK, .3)};
        &.error {
            color: ${COLORS.TEXT_DANGER};
        }
    }
`;


const FILE_MAX_WEIGHT = 20 * 1024 * 1024; // Максимальный размер файла

const UploudFilesBtn: React.FC<IuploudFilesBtn> = ({onUploadFileHandler}) => {

    const fileInputRef = useRef(null);

    return <Btn onClick={() => fileInputRef.current && fileInputRef.current.click()} intent="success">
        Выбрать файлы
        <input type="file" name="file"
               multiple={true}
               onChange={(e) => onUploadFileHandler(e.target.files)}
               style={{display: 'none'}}
               ref={fileInputRef}/>
    </Btn>;
};


/**
 *  Прогресс загрузки загрузки
 */
const BackgroundsUploadProgressBar: React.FC<IbackgroundsUploadProgressBar> = ({ uploadCount, totalPercent, errorCount }) =>
    <StyledProgressBar isDone={totalPercent >= 100}>
        {uploadCount ? <>
            <div className="innerBar" style={totalPercent ? {width: totalPercent + '%'}: null}/>
        {totalPercent >= 100 ?
            <div className="innerText">Загружено: {uploadCount}</div>
            :
            <div className="innerText">Загрузка: {totalPercent}%</div>
        }
        </>
            :
            errorCount ?
                <div className="innerText error">Ошибка загрузки</div>
                :  null
        }
    </StyledProgressBar>;

/**
 * Модалка загрузки фонов
 */
const ModalUploadBackgrounds: React.FC<ImodalUploadBackgrounds> = () => {
    const modalData: IUploadModalSelector = useSelector( modalUploadBackgroundsSelector );
    const {setModal, closeModal} = useContext(ModalContext);

    const [uploadList, setUploadList] = useState([]);
    const [uploadInfo, setUploadInfo] = useState({
        totalPercent: 0,
        uploadCount: 0,
        errorCount: 0,
        totalCount: 0,
        alreadyCount: 0,
    });

    /** Обновление футера модалки */
    useEffect(()=>{
        setModal({
            footer: [
                {type: TYPES.COMPONENT, component: <UploudFilesBtn onUploadFileHandler={onUploadFileHandler}/>},
                uploadInfo.totalCount ? {type: TYPES.COMPONENT, component:  <BackgroundsUploadProgressBar {...uploadInfo}/>} : {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: 'Готово', intent: uploadInfo.totalPercent >= 100 ? 'primary' : '', action: completeUploadHandler, disabled: uploadInfo.totalPercent && uploadInfo.totalPercent < 100},
            ]
        });
    }, [uploadInfo]);

    /** Поштучная загрузка файлов на сервер */
    useEffect(()=>{
        // console.log('!!upload useEffect!!', {uploadList, uploadInfo});

        // Если есть загружаемые файлы
        if ( uploadList.length && uploadList.length > uploadInfo.totalCount || uploadInfo.totalPercent < 100 ) {
            let nextUpload = null, completeList = [], errorList = [];

            uploadList.map((item, i)=>{
                if (!item.id && !item.error && !nextUpload) {
                    nextUpload = {id: generateUID(), file: item.file, index: i};
                    return nextUpload;
                } else if (item.error) {
                    errorList.push(item);
                } else if (item.width) {
                    completeList.push(item);
                }
                return item;
            });

            // callback после успешной загрузки файла
            const uploadCallback = ({data, error}) => {

                setUploadList(uploadList.map((item, i)=>
                    i === nextUpload.index ?
                        (error || !data ? {...item, error: error } : {
                            ...data,
                            file: item.file,
                            name:  item.file.name,
                            src: createStickerLink({stickerConfig: {...modalData.config, ext: data.ext}, id: data.id, size: 'sm'})
                        })
                        : item));
            };

            // если есть незагруженный файл - загружаем
            if ( nextUpload ) {
                if ( modalData.themeId ) {
                    uploadBackgroundAction( {
                        themeId: modalData.themeId,
                        file: nextUpload.file,
                        uploadCallback
                    } );
                } else {
                    uploadBackgroundAction( {
                        backgroundSetId: modalData.packId,
                        file: nextUpload.file,
                        uploadCallback
                    } );
                }
            }

            // если есть загруженные файлы или ошибки - считаем количество и проценты загрузки
            if (completeList.length || errorList.length) setUploadInfo({
                totalPercent: Math.round((completeList.length + errorList.length)/ uploadList.length * 100),
                uploadCount: completeList.length,
                errorCount: errorList.length,
                totalCount: uploadList.length,
                alreadyCount: uploadInfo.alreadyCount || 0
            });
        }
    }, [uploadList]);

    const completeUploadHandler = () => {
        modalData.uploadCallback(uploadList);
        closeModal();
    };

    /**
     * Загрузка фонов
     * Валидация по типу файла
     */
    const onUploadFileHandler = (files) => {
        const acceptFormats = modalData.acceptFormats || ['png'];
        let acceptFiles = [];
        let duplicatedFiles = [];
        //функция проверки на повтор файла
        const checkFileDuplicate = ( file ) => {
            let isCopy = false;
            for ( let i=0; i < uploadList.length; i++ ) {
                const item = uploadList[i];
                if ( !item.file) return false;
                if ( (item.file.name === file.name) && (item.file.size === file.size) ) {
                    if (item.error){
                        setUploadList(uploadList.filter((x,j)=>j !== i) );
                        return false;
                    }
                    isCopy = true;
                    break;
                }
            }
            return isCopy;
        };

        //перебор поступивших файлов
        for ( let i = 0; i < files.length; i++ ) {
            let file = files[i];
            let isCorrectFormat = false;

            //проверка на размер и формат файла
            acceptFormats.forEach( ( format ) => {
                if ( !!~file.type.indexOf( format ) ) {
                    isCorrectFormat = true
                }
            } );
            if ( !isCorrectFormat ) {
                toast.error('Неверный тип файла "' + file.name + '".\n Необходим файл формата ' + acceptFormats.join(', ').toUpperCase());
                continue; //прерываем выполение перебора, переходим к следующему файлу
            }
            if ( parseInt( file.size ) > FILE_MAX_WEIGHT ) {
                toast.error('Большой файл ' + file.name + '. Превышение ' + (FILE_MAX_WEIGHT / 1024 / 1024) + 'Mb');
                continue; //прерываем выполение перебора, переходим к следующему файлу
            }

            //проверка на повтор файла
            if ( checkFileDuplicate( file ) ) {
                duplicatedFiles.push( file.name );
                continue; //прерываем выполение перебора, переходим к следующему файлу
            }

            //добавленяем в массив фаил, подходящий под валидацию
            acceptFiles.push( file );
        }

        const dups = duplicatedFiles.length;
        if (dups) toast.info(
            dups > 1 ?
                `${declOfNum(dups, ['файл', 'файла', 'файлов'])} уже ${declOfNum(dups, ['загружен', 'загружено', 'загружено'])}`
                :
                `Файл ${duplicatedFiles[0]} уже загружен`
            );

        // кладем файлы в очередь на загрузку
        if ( acceptFiles.length ) {
            setUploadList([...uploadList, ...acceptFiles.map((f)=>({file: f, name: f.name}))]);
            if (uploadInfo.uploadCount) setUploadInfo({
                ...uploadInfo,
                totalPercent: 0,
                alreadyCount: uploadInfo.uploadCount
            });
        }

    };

    return <UploadedBackgroundsWrap>
        <Library items={uploadList}/>
    </UploadedBackgroundsWrap>;

};

export default memo(ModalUploadBackgrounds);



