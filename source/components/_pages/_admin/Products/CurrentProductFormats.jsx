import React, {useState, useEffect, memo} from 'react';
import { useSelector } from "react-redux";

import {Divider, Row, Col} from 'const/styles'
import {StyledProductHeader, StyledNoContent } from '../_styles'
import {Btn} from 'components/_forms';
import {IconChevronUp, IconChevronDown, IconRotateToHor, IconEye2} from 'components/Icons';
import Spinner from 'components/Spinner';

import TEXT_MAIN from "texts/main";
import {
    createProductFormat,
    updateProductFormat,
    deleteProductFormat,
    disableNavigationAction,
    setFormatsBuffer,
} from './_actions';
import {validateProductFormat} from "../_validators";
import AdminTable from "../_table";
import {isSameObjects, arrayMove} from "libs/helpers";
import { formatsBufferSelector} from "./_selectors";



/**
 * Раздел форматов продукта
 */
const CurrentProductFormats = memo(({data, productId}) => {
    const [productFormats, setProductFormats] = useState(null);
    const [validateErrors, setValidateErrors] = useState([]);
    const [wrongParams, setWrongParams] = useState([]);
    const [autoSortFormats, setAutoSortFormats] = useState(null);
    const [autoSortSizes, setAutoSortSizes] = useState(null);
    const formatsBuffer = useSelector( formatsBufferSelector );

    useEffect(() => {
        if (wrongParams.length) {
            setProductFormats([...wrongParams, ...data]);
            setWrongParams([]);
        } else {
            setProductFormats(data);
        }
    }, [data]);

    if (!productFormats) return <Spinner fill/>;

    // Очистить ошибку выделенного поля
    const clearError = (optionId, field) => {
        setValidateErrors(validateErrors.map((err)=> {
            if (err.id === optionId) {
                err[field] && delete err[field];
            }
            return err;
        }).filter(
            (err) => Object.keys(err).length > 1
        ));
    };
    const cancelAction = () => {
        setValidateErrors([]);
        setProductFormats(data);
    };
    const saveAction = () => {
        setValidateErrors([]);

        let newFormats = [], updatedFormats = [], deletedFormats = [];

        // Отсеиваем новые в отдельный массив
        const FormatsArray = productFormats.length && productFormats.filter(
            (item) => {
                if (item.id < 0) {              // Если у параметра отрицательный id, значит он новый,
                    newFormats.push(item);      // отправляем на сервер CREATE
                    return false;               // и убираем из массива
                }
                return true;
            }
        );

        if (FormatsArray) {
            // Бежим по всем параметрам выбранной опции
            for (let i = 0; i < FormatsArray.length; i++ ) {

                // Если у параметра deleted == true, значит он удален, отправляем на сервер DELETE
                if (FormatsArray[i].deleted) {
                    deletedFormats.push(FormatsArray[i])

                // Если у параметра изменены свойства, значит отправляем на сервер UPDATE
                } else {
                    // Находим параметр в начальных и конечных данных
                    // Он может переместиться в массиве, поэтому ищем по id
                    // for (let j=0; j < data.length; j++) {
                    //     if (!isSameObjects(FormatsArray[i], data[i])) {
                    //
                    //     }
                    // }

                    if (!isSameObjects(FormatsArray[i], data[i]) ) {
                        updatedFormats.push(FormatsArray[i])
                    }
                }

            }

            // валидация ошибок на клиенте
            const newFormatsValidateErrors = validateProductFormat(newFormats);
            const updateParamsValidateErrors = validateProductFormat(updatedFormats);
            if (newFormatsValidateErrors) setValidateErrors(newFormatsValidateErrors);
            if (updateParamsValidateErrors) setValidateErrors(updateParamsValidateErrors);

            if (!newFormatsValidateErrors && !updateParamsValidateErrors) {
                // Если есть созданные форматы
                if (newFormats.length) {
                    createProductFormat(
                        newFormats,
                        productId,
                        (errorData)=>{
                            setWrongParams(errorData.map(
                                (errorItem) => productFormats.find(
                                    (format) => format.id === errorItem.id)).filter((item) => item)
                            );
                            setValidateErrors(errorData);
                        }
                    )
                }

                // Если есть удаленные форматы
                if (deletedFormats.length) {
                    deleteProductFormat(
                        deletedFormats.map((param)=>param.id)
                    );
                }

                // Если есть измененные форматы
                if (updatedFormats.length) {
                    updateProductFormat(
                        updatedFormats,
                        productId,
                        (errorData)=>{
                            setWrongParams(errorData.map((errorItem)=> productFormats.find((format)=>format.id === errorItem.id)).filter((item) => item));
                            setValidateErrors(errorData);
                        }
                    );
                }
            }
        }
    };

    const copyAction = () => {
        setFormatsBuffer(
             productFormats && productFormats.length ? productFormats : []
        );
    };
    const pasteAction = () => {
        if (formatsBuffer && formatsBuffer.length) setProductFormats([
            ...formatsBuffer.map((f)=>({
                ...f,
                id: Math.round(Math.random()*10000 * -1 - 1),
                options: []
            })),
            ...productFormats
        ]);
    };

    const addFormatAction = () => {
        setProductFormats( [
            ...productFormats.map((f, i)=> ({...f, sort: i+1})),
            {
                id: Math.round(Math.random()*10000 * -1 - 1),
                name: '',
                width: 0,
                height: 0,
                dpi: 200,
                allowRotate: false,
                barcodePosition: 'LONG_SIDE',
                sort: 0,
                visible: true
            }
        ].sort((a, b)=> a.sort - b.sort) );
    };
    const removeFormatAction = (index) => {
        setProductFormats( productFormats.map((f, i)=> i === index ? (f.id < 0 ? null : {...f, deleted: true}) : f ).filter((item)=>item));
    };

    const handleChangeFormat = (data, index) => {
        setProductFormats( productFormats.map((f, i)=> i === index ? {...f, ...data } : f) );
    };

    const onSortEnd = ({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) return null;
        setProductFormats(arrayMove(productFormats, oldIndex, newIndex, 'sort'));
    };

    const AutoSortFormatsAction = () => {
        let sorted = productFormats.sort( ( a, b ) => a.height - b.height);
        if (autoSortFormats) sorted = sorted.reverse();
        setProductFormats(sorted);
        setAutoSortFormats(!autoSortFormats);
    };
    const AutoSortSizesAction = () => {
        setProductFormats(productFormats.map( ( f ) => {
           const isHor = autoSortSizes ? f.width > f.height : f.width < f.height ;
           return {
               ...f,
               width: isHor ? f.width : f.height,
               height: !isHor ? f.width : f.height
           }
        }));
        setAutoSortSizes(!autoSortSizes);
    };

    const noChanges = isSameObjects(productFormats, data);
    disableNavigationAction(!noChanges);

    return <div>
        <StyledProductHeader>
            <div className="label">Форматы продукта</div>
            <Btn className="mr" onClick={addFormatAction}>Добавить формат</Btn>
            <Btn className="mr" onClick={AutoSortFormatsAction} intent={autoSortFormats === null ? '' : 'info'}>{autoSortFormats ? <IconChevronUp/> : <IconChevronDown/>} Сорт. формата</Btn>
            <Btn onClick={AutoSortSizesAction} intent={autoSortSizes === null ? '' : 'info'}>{autoSortSizes ? <b>H </b> : <b>W </b>}&nbsp;Сорт. размера</Btn>
            <Divider/>
            <Btn disabled={!productFormats || !productFormats.length}
                 onClick={copyAction} className="mr">
                {TEXT_MAIN.COPY}
            </Btn>
            <Btn disabled={!formatsBuffer.length} onClick={pasteAction} className="mr">
                {TEXT_MAIN.PASTE}
            </Btn>
            <Btn className="mr" disabled={noChanges} onClick={cancelAction}>{TEXT_MAIN.CANCEL}</Btn>
            <Btn intent="primary" disabled={noChanges} onClick={saveAction}>{TEXT_MAIN.SAVE}</Btn>
        </StyledProductHeader>

        {productFormats.length ?
            <AdminTable sortable useDragHandle
                        data={productFormats.map((f)=>({...f, dpiInPx: `${ Math.round(f.width / 25.4 * f.dpi) } x ${ Math.round(f.height / 25.4 * f.dpi) }` }))}
                        head={[
                            {title: <IconEye2/>,            width: 60},
                            {title: 'Название',             width: 240},
                            {title: 'Ширина (мм)',          width: 100},
                            {title: 'Высота (мм)',          width: 100},
                            {title: 'DPI',                  width: 100},
                            {title: 'px',                   width: 130},
                            {title: <IconRotateToHor/>,     width: 60},
                            {title: 'Barcode',              width: 150},
                        ]}
                        row={[{
                            name: 'visible',
                            type: 'checkbox',
                        },{
                            name: 'name',
                            type: 'input',
                        }, {
                            name: 'width',
                            type: 'input',
                            format: 'number'
                        }, {
                            name: 'height',
                            type: 'input',
                            format: 'number'
                        }, {
                            name: 'dpi',
                            type: 'input',
                            format: 'number'
                        }, {
                            name: 'dpiInPx',
                            type: 'text',
                        }, {
                            name: 'allowRotate',
                            type: 'checkbox',
                        }, {
                            name: 'barcodePosition',
                            type: 'select',
                            list: [{id: 'LONG_SIDE', name: 'По длинной'}, {id: 'SHORT_SIDE', name: 'По короткой'}],
                        }]}
                        onChange={handleChangeFormat}
                        onRemoveRow={removeFormatAction}
                        errors={validateErrors}
                        clearError={clearError}
                        onSortEnd={onSortEnd}
            />
        :
            <StyledNoContent>
                <span className="text">В этом продукте нет ни одного формата</span>
                <Btn onClick={addFormatAction}>Добавить формат</Btn>
            </StyledNoContent>
        }

    </div>;
});

export default CurrentProductFormats;