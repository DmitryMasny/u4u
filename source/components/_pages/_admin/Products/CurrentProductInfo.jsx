import React, {useState, useEffect, memo, useRef} from 'react';
import {useSelector} from "react-redux";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

import { Divider, Row, Col} from 'const/styles'
import { THEME_PRODUCT_GROUP } from 'const/productsTypes'
import {StyledProductHeader, StyledProductLabel, StyledIconAdd, StyledArrayItem, StyledArray, StyledHR} from '../_styles'
import {Btn, Input, TextArea, Tooltip, Select, FormGroup} from 'components/_forms';
import {IconLib, IconDelete2, IconInOrder, IconUpload, IconAddPhoto, IconError, IconEye, IconEyeOff2 } from 'components/Icons';
import Spinner from 'components/Spinner';
import {updateProduct, createProduct, deleteProduct, disableNavigationAction, uploadImageAction, removeAdminPhotoAction, getAvailableProductTypesAction, getAvailableProductGroupsAction} from './_actions';
import TEXT_MAIN from "texts/main";
import {validateProductInfo} from "../_validators";
import {disableNavSelector, adminProductImagesSelector, adminProductTypesSelector, adminProductGroupsSelector} from "./_selectors";
import {arrayMove, generateUID, isSameObjects} from "libs/helpers";


/**
 * Раздел описания продукта
 */
const CurrentProductInfo = memo(({data, productId, setUrl}) => {
    const [productInfo, setProductInfo] = useState(null);
    const [arrayView, setArrayView] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [validateErrors, setValidateErrors] = useState({});
    const [productTypesList, setProductTypesList] = useState(null);
    const [productGroupsList, setProductGroupsList] = useState(null);
    const disableNav = useSelector(state => disableNavSelector(state));
    const adminProductImages = useSelector(state => adminProductImagesSelector(state));
    const adminProductTypes = useSelector(state => adminProductTypesSelector(state));
    const adminProductGroups = useSelector(state => adminProductGroupsSelector(state));

    useEffect(() => {
        setProductInfo(data);
    }, [data]);

    useEffect(() => {
        if (!adminProductTypes) {
            getAvailableProductTypesAction();
        } else {
            setProductTypesList(adminProductTypes.map((item)=>({id: item.name, name: item.description })));
        }
    }, [adminProductTypes]);

    useEffect(() => {
        if (!adminProductGroups) {
            getAvailableProductGroupsAction();
        } else {
            setProductGroupsList([
                {id: '', name: '- Без группы тем -', serverId: '' },
                ...adminProductGroups.map((item)=>({id: item.slug, name: item.name, serverId: item.id }))
            ]);
        }
    }, [adminProductGroups]);

    // Если есть стэк с загруженными изображениями (после ответа по ws для админа)
    // то обновляем данные компонента
    useEffect(() => {
            let photoId = null;
            if (productInfo && adminProductImages[0]) setProductInfo({
                ...productInfo,
                productInfo: productInfo.productInfo.map((item) => {
                    if ( item.id === adminProductImages[0].id ) {
                        photoId = item.id;
                        return {...item, ...adminProductImages[0], loading: false}
                    } else return item;
                }),
                productImages: productInfo.productImages.map((item) => {
                    if ( item.id === adminProductImages[0].id ) {
                        photoId = item.id;
                        return {...item, ...adminProductImages[0], loading: false}
                    } else return item;
                }),
            });
            photoId && removeAdminPhotoAction( photoId );

    }, [adminProductImages]);

    if (!productInfo || productInfo.isLoading) return <Spinner fill/>;

    // сбросить все изменения
    const cancelAction = () => {
        setProductInfo(data);
        setValidateErrors([]);
    };

    // сохранить все изменения на сервере
    const saveAction = () => {
        setValidateErrors([]);
        setProductInfo({
            ...productInfo,
            ...(productInfo.productInfo && { productInfo: productInfo.productInfo.filter((item) => !item.isFailed )} || {}),
            ...(productInfo.productImages && { productImages: productInfo.productImages.filter((item) => !item.isFailed )} || {})
        });

        const getProductGroupIdForServer = () => {
            const current = productGroupsList.find((x)=>x.id === productInfo.productGroup);
            console.log('current', current);
            return current && current.serverId
        }

        const exportedProductInfo = {
            ...productInfo,
            productGroup: getProductGroupIdForServer(),
            productInfo: productInfo.productInfo.map((p)=>({...p, description: p.description ? p.description.replace(/[\r\n]+/g, '\\n') : ''}))
        };
console.log('exportedProductInfo', exportedProductInfo);
        // валидация ошибок на клиенте
        const updateParamsValidateErrors = validateProductInfo(productInfo);
        if (updateParamsValidateErrors) setValidateErrors(updateParamsValidateErrors);

        // если нет ошибок валидации
        if (!updateParamsValidateErrors) {
            // если нет productId, то create иначе update
            if (productId) {
                updateProduct(
                    exportedProductInfo,
                    productId,
                    (errorData) => {
                        setValidateErrors(errorData);
                    }
                );
            } else {
                createProduct(
                    exportedProductInfo,
                    (callback) => {
                        if (!callback) return null;
                        if (callback.error) {
                            setValidateErrors(callback.error);
                        } else {
                            callback[0] && callback[0].id && setUrl({productId: callback[0].id, name: callback[0].name});
                        }
                    }
                );
            }
            setProductInfo({isLoading: true});
        }
    };

    // изменить поле в state
    const handleChange = (e) => {
        setProductInfo({
            ...productInfo,
            [e.target.name]: e.target.value
        });
    };

    // изменить "Описание на странице продукта" или "Изображения на главной"
    const handleChangeInfoItem = (n, value, isProductImages = false) => {
        const propName = isProductImages ? 'productImages' : 'productInfo';
        if (!productInfo[propName]) return null;
        if (validateErrors[propName]) setValidateErrors({...validateErrors, [propName]: false});
        setProductInfo({
            ...productInfo,
            [propName]: productInfo[propName].map((item, i) => (i === n ? {...item, ...value} : item))
        });
    };
    // добавить "Описание на странице продукта"
    const addProductInfo = () => {
        if (validateErrors.productInfo) setValidateErrors({...validateErrors, productInfo: false});
        const newData = { id: generateUID(), description: '', url: null};
        setProductInfo({
            ...productInfo,
            productInfo: productInfo.productInfo ?
                [...productInfo.productInfo, newData]
                :
                [newData]
        });
    };
    // удалить "Описание на странице продукта"
    const removeProductInfo = (index) => {
        // пока в тестовых данных местами отсутствует id, поэтому иногда вместо id передается порядковый номер

        if (validateErrors.productInfo) setValidateErrors({...validateErrors, productInfo: false});
        setProductInfo({
            ...productInfo,
            productInfo: productInfo.productInfo.filter((item, i)=> index !== i )
        });
    };
    // добавить "Изображения на главной"
    const addProductImage = () => {
        if (validateErrors.productImages) setValidateErrors({...validateErrors, productImages: false});
        const newData = { id: generateUID(), description: '', url: null};
        setProductInfo({
            ...productInfo,
            productImages: productInfo.productImages ?
                [...productInfo.productImages, newData]
                :
                [newData]
        });
    };
    // удалить "Изображения на главной"
    const removeProductImage = (index) => {
        if (validateErrors.productImages) setValidateErrors({...validateErrors, productImages: false});
        setProductInfo({
            ...productInfo,
            productImages: productInfo.productImages.filter((url, i)=> index !== i)
        });
    };
    // Спрятать продукт для юзера
    const hideProductAction = () => {
        setProductInfo({
            ...productInfo,
            visible: !productInfo.visible
        });
    };
    // Удалить весь продукт
    const deleteProductAction = () => {
        if (deleteConfirm) {
            deleteProduct(
                productId,
                () => {
                    setUrl({productId: null, tab: null, format: null})
                }
            );
        } else {
            setDeleteConfirm(true);
        }
    };
    // Загрузка изображения
    const uploadImage = (itemId, file, isProductImages = false) => {
        const propName = isProductImages ? 'productImages' : 'productInfo';

        uploadImageAction(
            file[0],
            (r) => {
                if (r.isLoading) {
                    setProductInfo({
                        ...productInfo,
                        [propName]: productInfo[propName].map((item) => (item.id === itemId ? {...item, loading: true} : item))
                    });
                } else if (r.error) {
                    console.log('error',r.error);
                    setProductInfo({
                        ...productInfo,
                        [propName]: productInfo[propName].map((item) => (item.id === itemId ? {...item, loading: false, isFailed: true} : item))
                    });
                } else if (r.id) {
                    setProductInfo({
                        ...productInfo,
                        [propName]: productInfo[propName].map((item) => (item.id === itemId ? {...item, id: r.id, loading: true} : item))
                    });
                }
            }
        );

    };

    // Сортировка "Описание на странице продукта"
    const onSortEnd = ({oldIndex, newIndex}, isProductImages = false) => {
        if (oldIndex === newIndex) return null;
        const propName = isProductImages ? 'productImages' : 'productInfo';
        setProductInfo({...productInfo, [propName]: arrayMove(productInfo[propName], oldIndex, newIndex)});
    };

    const noChanges = isSameObjects(productInfo, data);
    if (disableNav === noChanges) disableNavigationAction(!noChanges);


    return <div>
        <StyledProductHeader>
            <div className="label">Описание продукта</div>
            <Divider/>
            {productId && productId !== 'new' ?
                <>
                    {deleteConfirm ?
                        <span>
                            <span className="mr">Вы уверены?</span>
                            <Btn className="mr" intent="danger" onClick={deleteProductAction}>Да</Btn>
                            <Btn width={120} onClick={()=>setDeleteConfirm(false)}>Нет</Btn>
                        </span>
                        :
                        <>
                            <Btn className="mr" intent="danger" onClick={deleteProductAction}>Удалить продукт</Btn>
                            <Btn className="mr" disabled={noChanges} onClick={cancelAction}>{TEXT_MAIN.CANCEL}</Btn>
                            <Btn intent="primary" disabled={noChanges} onClick={saveAction}>{TEXT_MAIN.SAVE}</Btn>
                        </>
                    }
                </>
                :
                <Btn intent="primary" disabled={noChanges} onClick={saveAction}>{TEXT_MAIN.CREATE}</Btn>
            }
            </StyledProductHeader>

        <Row>
            <Col w={4}>
                <Input name="name"
                       value={productInfo.name || ''}
                       onChange={handleChange}
                       label={'Название продукта'}
                       error={validateErrors.name}
                       onFocus={()=>setValidateErrors({...validateErrors, name: false})}
                />
            </Col>
            <Col w={4}>
                <FormGroup label={'Метка продукта'} intent={validateErrors.productSlug ? 'danger' : 'default'}>
                    <Tooltip tooltip={validateErrors.productSlug} tooltipShown={!!validateErrors.productSlug} intent={'danger'} placement="top">
                        <Select list={productTypesList}
                                onSelect={(id)=>handleChange({target: {name: 'productSlug', value: id }})}
                                selectedId={productInfo.productSlug} />
                    </Tooltip>
                </FormGroup>
            </Col>

            <Col w={4}>
                <FormGroup label={'Группа продукта'} intent={validateErrors.productGroup ? 'danger' : 'default'}>
                    <Tooltip tooltip={validateErrors.productGroup} tooltipShown={!!validateErrors.productGroup} intent={'danger'} placement="top">
                        <Select list={productGroupsList}
                                onSelect={(id)=>handleChange({target: {name: 'productGroup', value: id }})}
                                selectedId={productInfo.productGroup} />
                    </Tooltip>
                </FormGroup>
            </Col>
{/*            <Col w={8}>
                <Input name="productionTime"
                       value={productInfo.productionTime || ''}
                       onChange={handleChange}
                       label={'Сроки'}
                       error={validateErrors.productionTime}
                       onFocus={()=>setValidateErrors({...validateErrors, productionTime: false})}
                       disabled
                />
            </Col>*/}
            <Col w={4} align="right" >
                {productId && productId !== 'new' && <div className="rightProductBlock">
                    <div className={`iconWrap ${productInfo.visible ? 'success' : 'mute'}`}>{productInfo.visible ? <IconEye/> : <IconEyeOff2/> }</div>
                    <span className={(productInfo.visible ? 'success' : 'mute') + ' mr'} >{productInfo.visible ? 'виден' : 'скрыт' }</span>
                    <Btn intent={productInfo.visible ? '' : 'success'} onClick={hideProductAction}>{productInfo.visible ? 'Скрыть' : 'Показать'}</Btn>
                </div>}
            </Col>
        </Row>

        <TextArea name="description"
                  value={productInfo.description || ''}
                  onChange={handleChange}
                  label={'Описание на главной'}
                  rows={5}
                  // maxLength={222}
                  error={validateErrors.description}
                  onFocus={()=>setValidateErrors({...validateErrors, description: false})}
        />

        {/* PRODUCT_IMAGES */}
        <StyledProductLabel>
            <Tooltip tooltip={'Проверьте данные ниже'} tooltipShown={!!validateErrors.productImages} intent={ validateErrors.productImages && 'danger' } placement="top">
                <div className={`label ${validateErrors.productImages && 'error'}`}>Изображения на главной</div>
            </Tooltip>
            <Divider/>
            <Btn small onClick={addProductImage}>Добавить изображение</Btn>
        </StyledProductLabel>

        <ProductInfoSortable data={productInfo.productImages}
                             arrayView={arrayView}
                             handleChangeInfoItem={(i, value)=>handleChangeInfoItem(i, value, true)}
                             removeAction={removeProductImage}
                             uploadImage={(id, value) => uploadImage(id, value, true)}
                             validateErrors={validateErrors && validateErrors.productImages}
                             useDragHandle
                             axis={'xy'}
                             onSortEnd={(data)=>onSortEnd(data, true)}
        />
        <StyledHR/>

        {/* PRODUCT_INFO */}
        <StyledProductLabel>
            <Tooltip tooltip={'Проверьте данные ниже'} tooltipShown={!!validateErrors.productInfo} intent={ validateErrors.productInfo && 'danger' } placement="top">
                <div className={`label ${validateErrors.productInfo && 'error'}`}>Описание на странице продукта</div>
            </Tooltip>
            <Divider/>
            <Btn small className="mr" intent="minimal" onClick={() => setArrayView(!arrayView)}><IconInOrder/></Btn>
            <Btn small onClick={addProductInfo}>Добавить описание</Btn>
        </StyledProductLabel>

        <ProductInfoSortable data={productInfo.productInfo}
                             arrayView={arrayView}
                             handleChangeInfoItem={handleChangeInfoItem}
                             removeAction={removeProductInfo}
                             uploadImage={uploadImage}
                             validateErrors={validateErrors && validateErrors.productInfo}
                             useDragHandle
                             axis={'xy'}
                             onSortEnd={(data)=>onSortEnd(data, false)}
        />
        <StyledHR/>

    </div>;
});

const ProductInfoSortable = SortableContainer(({data, arrayView, handleChangeInfoItem, removeAction, uploadImage, validateErrors}) => {

    return <StyledArray arrayView={arrayView}>
        <Row>
            {data && data.length && data.map((item, i) =>
                item && <InfoArrayItem fullWidth={arrayView}
                               onChange={(value) => handleChangeInfoItem(i, value)}
                               removeAction={()=>removeAction(i)}
                               uploadImageAction={(value)=>uploadImage(item.id, value)}
                               error={validateErrors && validateErrors.length && validateErrors.find((v)=>v.id === item.id)}
                               index={i}
                               key={item.id || i}>
                    {item}
                </InfoArrayItem>) || null}
        </Row>
    </StyledArray>;
});

const InfoArrayItem = SortableElement(memo(({children, onChange, loading, fullWidth, url, error = {}, removeAction, uploadImageAction}) => {
    const imgUrl = url || children && children.url;
    const isLoading = loading || children && children.loading;
    const uploadBtn = useRef(null);

    return <StyledArrayItem fullWidth={fullWidth}>
        <Tooltip tooltip={error.url} tooltipShown={!!error.url} intent={ error.url && 'danger' } placement="top">
            <div className="header">
                <SortHandle/>
                <div className="headerBtn upload" onClick={()=>uploadBtn && uploadBtn.current.click()}>
                    <IconUpload/>
                    <input type="file" name="file"
                           onChange={(e)=>uploadImageAction(e.target.files)}
                           style={{display: 'none'}}
                           ref={uploadBtn} />

                </div>
                <div className="headerBtn remove" onClick={()=>removeAction()}>
                    <IconDelete2 size={18}/>
                </div>
            </div>
        </Tooltip>
        <div className="flexWrap">
            {imgUrl && <div className="img" style={{backgroundImage: `url(${imgUrl})`}}/>
            || isLoading &&
            <StyledIconAdd>
                <Spinner size={50} delay={0}/>
            </StyledIconAdd>
            || children.isFailed &&
            <StyledIconAdd>
                <IconError size={48} intent="danger"/>
            </StyledIconAdd>
            ||
            <StyledIconAdd clickable onClick={() => uploadBtn && uploadBtn.current.click()}>
                <IconAddPhoto size={48}/>
            </StyledIconAdd>
            }
            {children && <TextArea name="description"
                                   value={children.description || ''}
                                   onChange={(e) => onChange({description: e.target.value})}
                                   className="textArea"
                                   error={error.description}
            />}
        </div>
    </StyledArrayItem>;
}));
const SortHandle = SortableHandle(() => {
    return <div className="headerBtn move"><IconLib/></div>;
});

export default CurrentProductInfo;