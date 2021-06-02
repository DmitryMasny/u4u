// @ts-ignore
import React, {useState, useEffect} from 'react';
// @ts-ignore
import {useSelector} from "react-redux";
import styled from 'styled-components';

import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import { Divider, Row, Col} from 'const/styles'
import {StyledHeader, StyledHR} from './_styles'
// @ts-ignore
import {Btn, Input, Tooltip, Select, FormGroup} from 'components/_forms';


// @ts-ignore
import TEXT_MAIN from "texts/main";
// @ts-ignore
import { isSameObjects} from "libs/helpers";
// @ts-ignore
import {COLORS} from 'const/styles';

import {currentProductSetSelector} from "../../selectors/shop";
import {getProductSetAction, changeStatusProductSetAction, createProductSetAction, updateProductSetAction, deleteProductSetAction} from "../../actions/shop";

import ModalSelectProducts from "./_ModalSelectProducts";
import ProductsList from "./_ProductsList";



//получение по id
// const getItemById = ( items, id ) => {
//     for ( let i = 0; i < items.length; i++ ) {
//         if (items[i].id.toString() === id.toString()) return items[i];
//     }
//     return null;
// };

/** Interfaces */
interface Props {
    // isMobile: boolean; //флаг мобильного устройства
    id: string
    redirect: (id: string)=> any;
    categoriesList: any;
}

/** Styles */
const StyledMyProductSet = styled('div')`
    display: block;
    margin-bottom: 30px;
    .labelPadding {
        padding-top: 20px;
    }
`;
const StyledDeleteConfirm = styled('div')`
   margin-right: 10px;
`;

const StyledStatusText = styled('h4')`
   color: ${COLORS.TEXT_SUCCESS}
`;



// Проверка на возможность создания коллекции
const disableCreateAnalyze = (data) => {
    return !data.name || !data.category || !data.products.length;
};

// Проверка на возможность создания коллекции
const BtnSpinner = () => <Spinner light size={24} delay={0}/>;

/**
 * Страница продукта витрины
 */
const MyProductSet: React.FC<Props> = ({ id, redirect, categoriesList }) => {
    const productSetData: any = useSelector( currentProductSetSelector );

    const [productSet, setProductSet] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);

    const [validateErrors, setValidateErrors] = useState([]);

    const [inProgress, setInProgress] = useState(null);


    const isNewProductSet = id === 'new';

    useEffect(() => {
        //console.log('productSetData',productSetData && productSetData.id);
        //console.log('id',id);
        if (isNewProductSet) {
            setProductSet({
                name: '',
                category: '',
                products: []
            })
        } else {
            if (!productSetData || productSetData.id != id) {
                setProductSet(null);
                getProductSetAction(id);
            } else setProductSet(productSetData);
        }
    }, [id, productSetData]);

    if (!productSet) return <Spinner />;

    // сбросить все изменения
    const cancelAction = () => {
        setProductSet(productSetData);
        setValidateErrors([]);
    };

    // редирект и сброс inProgress после изменений
    const redirectAfterSaveCallback = (id) => {
        redirect(id && id.toString() || '');
        setInProgress(false);
    };

    // сохранить все изменения на сервере
    const saveAction = () => {
        // setValidateErrors([]);
        //
        // // валидация ошибок на клиенте
        // const updateParamsValidateErrors = validateProductInfo(productSet);
        // if (updateParamsValidateErrors) {
        //     setValidateErrors(updateParamsValidateErrors);
        // }else {
        //     // если нет ошибок валидации {
        //
        //     setProductSet({isLoading: true});
        // }
        setInProgress(true);


        if (isNewProductSet) {
            createProductSetAction(productSet, redirectAfterSaveCallback);
        } else updateProductSetAction(productSet, redirectAfterSaveCallback);

    };
    // сохранить все изменения на сервере
    const publishAction = (status) => {
        setInProgress(true);
        changeStatusProductSetAction(productSet.id, status, redirectAfterSaveCallback)
    };

    // изменить поле продаксета
    const handleChange = (e) => {
        setProductSet({
            ...productSet,
            [e.target.name]: e.target.value
        });
    };
    //
    const addProductsAction = (data) => {
        setProductSet({
            ...productSet,
            name: productSet.name || data[0].name,
            products: productSet.products.length ? [...data, ...productSet.products] : data.map((p, i)=> !i ? {...p, useForPreview: true } : p)
        });
    };
    //
    const removeProductAction = (id) => {
        setProductSet({
            ...productSet,
            products: productSet.products.filter((p)=>p.id !== id),
            ...(productSet.previewFrom === id ? {previewFrom: productSet.products[0] &&  productSet.products[0].id || null} : {})
        });
    };
    //
    const selectPreviewProductsAction = (id) => {
        setProductSet({
            ...productSet,
            products: productSet.products.map((p)=> ({...p, useForPreview: p.id === id})),
            previewFrom: id
        });
    };
    //
    const selectCategoryAction = (id) => {
        setProductSet({...productSet, category: id});
    };
    const deleteProductAction = () => {
        if (deleteConfirm) {
            deleteProductSetAction(productSet.id, ()=>redirect(''));
        } else setDeleteConfirm(true);
    };

    const noChanges = !isNewProductSet && isSameObjects(productSet, productSetData);
    const disableCreation = isNewProductSet && disableCreateAnalyze(productSet);
    const disableSaving = noChanges || disableCreateAnalyze(productSet);
    const isDraft = productSet.status !== 'published';

    const headerItems = {
        title: isNewProductSet ? <div className="label">Создание коллекции</div> : <div className="label">Редактирование коллекции</div>,
        divider: <Divider/>,
        btnSave: isNewProductSet ?
            <Btn intent="primary" disabled={disableCreation || inProgress} onClick={saveAction} >{!inProgress ? TEXT_MAIN.CREATE : <BtnSpinner/>}</Btn>
            : <Btn className="mr" intent="success" onClick={saveAction} disabled={inProgress}>{!inProgress ? TEXT_MAIN.SAVE : <BtnSpinner/>}</Btn>,
        btnCancel: <Btn className="mr" onClick={cancelAction} disabled={inProgress}>{TEXT_MAIN.CANCEL_CHANGES}</Btn>,
        deleteConfirm: <StyledDeleteConfirm>
            {deleteConfirm && !inProgress ?
                <span>
                    <span className="mr">Вы уверены, что хотите удалить всю коллекцию?</span>
                    <Btn className="mr" intent="danger" onClick={deleteProductAction}>Да</Btn>
                    <Btn className="looong" onClick={() => setDeleteConfirm(false)}>Нет</Btn>
                </span>
                :
                <Btn onClick={deleteProductAction} disabled={inProgress}>Удалить коллекцию</Btn>
            }
        </StyledDeleteConfirm>,
        btnPublish: isDraft ?
            <Btn intent="primary" onClick={()=>publishAction('published')} disabled={inProgress}>{!inProgress ? TEXT_MAIN.PUBLISH : <BtnSpinner/>}</Btn>
            : <Btn intent="warning" onClick={()=>publishAction('draft')} disabled={inProgress}>{!inProgress ? TEXT_MAIN.UNPUBLISH : <BtnSpinner/>}</Btn>,
    };

    return <StyledMyProductSet>

        { isNewProductSet ?
            <StyledHeader>
                {headerItems.title}
                {headerItems.divider}
                {headerItems.btnSave}
            </StyledHeader>
            :
            <StyledHeader>
                {headerItems.title}
                {headerItems.divider}
                {isDraft && headerItems.deleteConfirm}
                {!deleteConfirm && isDraft && !noChanges && headerItems.btnCancel}
                {!deleteConfirm && isDraft && !disableSaving && headerItems.btnSave}
                {!deleteConfirm && noChanges && headerItems.btnPublish}
            </StyledHeader>
        }

        <Row>
            <Col w={6} x={2}>
                {/*@ts-ignore*/}
                <Input name="name"
                       value={productSet.name || ''}
                       onChange={handleChange}
                       label={'Название коллекции'}
                       disabled={!isDraft}
                       // error={validateErrors.name}
                       // onFocus={()=>setValidateErrors({...validateErrors, name: false})}
                />
            </Col>
            <Col w={6} >
                <FormGroup label={'Категория'} >
                    <Tooltip tooltip={validateErrors} tooltipShown={false} intent="danger" placement="top">
                        <Select list={categoriesList}
                                onSelect={selectCategoryAction}
                                selectedId={productSet.category}
                                disabled={!isDraft}
                                // intent={errors.optionSlug && 'danger'}
                        />
                    </Tooltip>
                </FormGroup>
            </Col>
            <Col w={6} x={3} align="right" className="labelPadding">
                {isDraft ?
                <Btn intent="info" onClick={()=>setShowProductsModal(true)}>Добавить продукт</Btn>
                    :
                <StyledStatusText>Опубликован</StyledStatusText>
                }
            </Col>
        </Row>

       {/* <TextArea name="description"
                  value={productSet.description || ''}
                  onChange={handleChange}
                  label={'Описание на главной'}
                  rows={5}
            // maxLength={222}
            //       error={validateErrors.description}
            //       onFocus={()=>setValidateErrors({...validateErrors, description: false})}
        />*/}
        {productSet.products && productSet.products.length &&  <StyledHR/> || null}

        <ProductsList list={productSet.products} onSelect={selectPreviewProductsAction}  onRemove={removeProductAction} inProductSet disabled={!isDraft}/>

        <ModalSelectProducts isOpen={showProductsModal}
                             closeCallback={()=>setShowProductsModal(false)}
                             addProductsAction={addProductsAction}
        />

    </StyledMyProductSet>;
};


export default MyProductSet;