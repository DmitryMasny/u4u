import React, {useState, useEffect, memo, useRef} from 'react';
import {createPortal} from "react-dom";

import { useSelector, useDispatch } from "react-redux";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import OnlyAuth from 'hoc/OnlyAuth';

import {Divider, Row, Col} from 'const/styles'
import {
    StyledProductHeader,
    StyledProductLabel,
    StyledArrayItem,
    StyledArray,
    StyledHR,
} from '../_styles'
import {Btn, FormGroup, Input, TextArea, Select, Tooltip} from 'components/_forms';
import {IconLib, IconClose } from 'components/Icons';
import Spinner from 'components/Spinner';

import TEXT_MAIN from "texts/main";
import {checkStateDifference, clickOutsideListener, arrayMove, isSameObjects} from "libs/helpers";


import {
    getAllOptionsAction,
    createProductOptionParameter,
    getAllOptionTypesAction,
    deleteProductOptionParameter,
    updateProductOptionParameter,
    updateProductOption,
    createProductOption,
    deleteProductOption
} from "./_actions";
import {allOptionsSelector, allOptionTypesSelector} from "./_selectors";
import {validateCreateProductOptionParameter, validateOption} from "../_validators";
import {Page, PageInner} from "components/Page";

// import Navbar from "components/Navbar";
import Modal from 'components/Modal/Modal';

// const OPTIONS_TABS = [
//     {id: 1, title: 'old'},
//     {id: 2, title: 'Категории'},
//     {id: 3, title: 'Опции'},
// ];


/**
 * Админка опций
 */
const Options = (props) => {
    const [productsOptions, setProductsOptions] = useState(null);
    const [selectedOption, setSelectedOption] = useState(0);
    const [validateErrors, setValidateErrors] = useState([]);
    const [optionValidateErrors, setOptionValidateErrors] = useState([]);
    const [wrongParams, setWrongParams] = useState([]);
    const [isSortChanges, setIsSortChanges] = useState([]);
    // const [tab, setTab] = useState(1);
    const [techOptionsModal, setTechOptionsModal] = useState(null);

    // wrongParams - параметры с ошибкой от сервера откладываются в state, чтобы добавить после обновления в redux всех опций

    const dispatch = useDispatch();
    const allOptions = useSelector( state => allOptionsSelector( state ) );
    const allOptionTypes = useSelector( state => allOptionTypesSelector( state ) );
    const currentOptionsDOM = useRef(null);

    useEffect(() => {
        if (!allOptions) {
            getAllOptionsAction()
        } else {
            // Если есть параметры с ошибкой от сервера
            if (wrongParams.length) {
                console.log('wrongParams',wrongParams);
                setProductsOptions(allOptions.map((opt)=>opt.id === selectedOption ? {
                    ...opt,
                    parameters: [...wrongParams, ...opt.parameters]
                } : opt));
                setWrongParams([]);
            } else {
                setProductsOptions(allOptions);
            }
            setIsSortChanges(false);
        }
        if (allOptionTypes === null) {
            dispatch(()=>getAllOptionTypesAction({dispatch}))
        }
    }, [allOptions]);

    useEffect(() => {
        if (wrongParams.length) {
            getAllOptionsAction()
        }
    }, [wrongParams]);


    // console.log('productsOptions',productsOptions);
    const currentOption = productsOptions && productsOptions.find((opt)=> opt.id === selectedOption);
    const virginOption = allOptions && allOptions.find((opt)=> opt.id === selectedOption);

    const noChanges =  !currentOption || isSameObjects(currentOption, virginOption) && !isSortChanges;

    clickOutsideListener(currentOptionsDOM, !noChanges);   // прослушка клика вне компонента

    if (!productsOptions) return <Spinner fill/>;

    // Выбрать опцию по порядковому номеру
    const setSelectedOptionByIndex = (i) => {
        if (productsOptions[i]) setSelectedOption( productsOptions[i].id);
    };

    if (!currentOption) {
        if (!productsOptions.length) return <Page>
                <PageInner>
                    <h2>Отсутствуют категории опций.<br/>Обратитесь к Айрату.</h2>
                </PageInner>
            </Page>;
        setSelectedOptionByIndex(0);
        return null;
    }

    // Выбрать опцию
    const selectOptionAction = (i) => {
        checkStateDifference(productsOptions, allOptions, ()=>setSelectedOptionByIndex(i));
    };


    // Очистить ошибку выделенного поля
    const clearError = (optionId, field) => {
        if (optionId) {
            setValidateErrors(validateErrors.map((err)=> {
                if (err.id === optionId) {
                    err[field] && delete err[field];
                }
                return err;
            }).filter(
                (err) => Object.keys(err).length > 1
            ));
        } else {
            optionValidateErrors[field] && delete optionValidateErrors[field];
            setOptionValidateErrors(optionValidateErrors);
        }
    };

    // Отменить изменения
    const cancelAction = () => {
        setProductsOptions(allOptions);
        setValidateErrors([]);
        setIsSortChanges(false);
    };

    // Сохранить изменения
    const saveAction = () => {
        setValidateErrors([]);

        let updatedOptions = [];
        // Проверка на изменение сортировки категорий опций
        if (isSortChanges) {
            for (let i = 0; i < allOptions.length; i++ ) {
                if (allOptions[i].id !== productsOptions[i].id ) {
                    updatedOptions.push(productsOptions[i])
                }
            }
            setIsSortChanges(false);
        }

        // Проверяем изменение опции в целом
        if (!isSameObjects(currentOption, virginOption)) {

            // валидация ошибок полей опции на клиенте
            const optionValErrors = validateOption(currentOption);
            if (optionValErrors) {
                setOptionValidateErrors(optionValErrors);
            } else {
                // Создать или обновить?
                if (currentOption.new) {
                    // Создать
                    dispatch(() => createProductOption(
                        {dispatch},
                        currentOption,
                        (errorData) => {
                            console.log('errorData',errorData);
                        }
                    ));

                } else {
                    // Обновить
                    // Проверяем изменение name и description для выбранной опции
                    if (currentOption.name !== virginOption.name || currentOption.description !== virginOption.description) {
                        if ( !updatedOptions.some((item)=> item.id === currentOption.id ) ) {
                            updatedOptions.push(currentOption);
                        }
                    }

                    // Проверяем на изменение параметров
                    if (currentOption.parameters !== virginOption.parameters) {
                        let newOptionParams = [], updatedOptionParams = [], deletedOptionParams = [];

                        const optionParamsArray = currentOption.parameters.length && currentOption.parameters.filter(
                            (item) => {
                                if (item.id < 0) {              // Если у параметра отрицательный id, значит он новый,
                                    newOptionParams.push(item); // отправляем на сервер CREATE
                                    return false;           // и убираем из массива
                                }
                                return true;
                            }
                        );

                        if (optionParamsArray) {
                            // Бежим по всем параметрам выбранной опции
                            for (let i = 0; i < optionParamsArray.length; i++) {

                                // Если у параметра deleted == true, значит он удален, отправляем на сервер DELETE
                                if (optionParamsArray[i].deleted) {
                                    deletedOptionParams.push(optionParamsArray[i])

                                    // Если у параметра изменены свойства, значит отправляем на сервер UPDATE
                                } else if (
                                    virginOption &&
                                    virginOption.parameters[i] &&
                                    optionParamsArray[i] !== virginOption.parameters[i]
                                ) {
                                    updatedOptionParams.push(optionParamsArray[i])
                                }

                            }

                            // валидация ошибок на клиенте
                            const newOptionParamsValidateErrors = validateCreateProductOptionParameter(newOptionParams);
                            const updateParamsValidateErrors = validateCreateProductOptionParameter(updatedOptionParams);
                            if (newOptionParamsValidateErrors) setValidateErrors(newOptionParamsValidateErrors);
                            if (updateParamsValidateErrors) setValidateErrors(updateParamsValidateErrors);

                            if (!newOptionParamsValidateErrors && !updateParamsValidateErrors) {
                                // Если есть созданные опции
                                if (newOptionParams.length) {
                                    dispatch(() => createProductOptionParameter({dispatch}, newOptionParams.map((param) => ({
                                            ...param,
                                            optionCategory: currentOption.id
                                        })),
                                        (errorData) => {
                                            setWrongParams(errorData.map(
                                                (errorItem) => currentOption.parameters.find(
                                                    (param) => param.id === errorItem.id)).filter((item) => item)
                                            );
                                            setValidateErrors(errorData);
                                        }
                                    ))
                                }

                                // Если есть удаленные опции
                                if (deletedOptionParams.length) {
                                    dispatch(() => deleteProductOptionParameter(
                                        {dispatch},
                                        deletedOptionParams.map((param) => param.id)
                                    ));
                                }

                                // Если есть измененные опции
                                if (updatedOptionParams.length) {
                                    dispatch(() => updateProductOptionParameter(
                                        {dispatch},
                                        updatedOptionParams.map((param) => ({
                                            ...param,
                                            optionCategory: currentOption.id
                                        })),
                                        (errorData) => {
                                            setWrongParams(errorData.map((errorItem) => currentOption.parameters.find((param) => param.id === errorItem.id)).filter((item) => item));
                                            setValidateErrors(errorData);
                                        }
                                    ));
                                }
                            }
                        }
                    }
                }

            }
        }

        // Если есть отсортированные категории опции
        if (updatedOptions.length) {
            dispatch(() => updateProductOption(
                {dispatch},
                updatedOptions,
                (errorData)=>{
                    console.log('errorData',errorData);
                    // setWrongParams(errorData.map((errorItem)=> currentOption.parameters.find((param)=>param.id === errorItem.id)).filter((item) => item));
                    // setValidateErrors(errorData);
                }
            ));
        }

    };

    // Удалить опцию
    const removeOptionAction = (index) => {
        setProductsOptions(productsOptions.filter((item, i)=> i !== index));
    };
    // Изменение свойства опции
    const handleChange = (data) => {
        setProductsOptions(productsOptions.map((option) => option.id === selectedOption ? {...option, ...data} : option));
    };
    // Изменение вариантов опции
    const updateParamsData = (data, index) => {
        setProductsOptions(productsOptions.map((option) => option.id  === selectedOption ? {
            ...option,
            parameters: option.parameters.map((item, i)=> i === index ? {
                ...item, ...data
            } : item)
        } : option));
    };
    // добавление параметра опции
    const addParamAction = () => {
        setProductsOptions(productsOptions.map((option) => option.id === selectedOption ? {
            ...option,
            parameters: [{
                    id: Math.round(Math.random()*10000 * -1 - 1),
                    optionSlug: undefined,
                    sort: option.parameters && option.parameters.length && (option.parameters.length + 1) || 1
                },
                ...(option.parameters || [])
            ]
        } : option));
    };
    // удаление параметра опции
    const removeParamAction = (index) => {
        setProductsOptions(productsOptions.map((option) => option.id  === selectedOption ? {
            ...option,
            parameters: option.parameters.map((item, i)=> i === index ? (item.id < 0 ? null : {...item, deleted: true}) : item).filter((item)=>item)
        } : option));
    };
    // Сортировка Опций
    const onSortEnd = ({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) return null;
        setProductsOptions(arrayMove(productsOptions, oldIndex, newIndex, 'sort'));
        setIsSortChanges(true);
    };
    // Новая опция (категория)
    const addOptionAction = () => {
        const newId = Math.round(Math.random()*10000 * -1 - 1);
        setProductsOptions([
            ...productsOptions,
            {
                new: true,
                id: newId,
                name: "",
                description: "",
                type: "*new*",
                sort: productsOptions.length,
                parameters:  []
            }
        ]);
        setSelectedOption(newId);
    };
    // Новая опция (категория)
    const deleteOptionAction = (id) => {
        dispatch(() => deleteProductOption(
            {dispatch},
            id,
            () => {
            }
        ));
    };
    // Модалка технических опций
    const openTechOptionsModal = (parameter) => {

        if (!parameter) return null;

        const tDescription = parameter.technicalDescription || {},
            tDescriptionKeys =  Object.keys(tDescription);

        setTechOptionsModal({
            id: parameter.id,
            params: tDescription && tDescriptionKeys.length  ?
                tDescriptionKeys.map((k) => {
                    return {name: k, value:tDescription[k] || ''};
                })
                :
                [
                    {name: 'name', value: ''},
                    {name: 'printer', value: ''},
                    {name: 'roll_width', value: ''},
                    {name: 'printCutLineTop', value: ''},
                    {name: 'printCutLineLeft', value: ''},
                    {name: 'printCutLineRight', value: ''},
                    {name: 'printCutLineBottom', value: ''},
                ]
        });
    };

    const closeTechOptionsModal = () => {
        setTechOptionsModal(null);
    };
    const objectifyParams = (params) => {
        if (!params) return {};
        return Object.fromEntries(params.filter((p)=>p.name && p.value).map((p)=> ([p.name, p.value])));
    };
    const saveTechOptions = (data) => {
        closeTechOptionsModal();
        if (data) setProductsOptions(productsOptions.map((option) => option.id  === selectedOption ? {
            ...option,
            parameters: option.parameters.map((item)=> data.id === item.id ?  {...item, technicalDescription:  objectifyParams(data.params) } : item )
        } : option));
    };

    return <OnlyAuth onlyAdmin>
        <Page ref={currentOptionsDOM}>
            <PageInner>
                {/*<Navbar selectTabAction={setTab}
                        currentTab={tab}
                        isMobile={false}
                        tabs={OPTIONS_TABS}
                        disabled={!noChanges}
                    margin={"bottom"}
                />*/}
                <StyledProductHeader>
                    <div className="label">Категории опций</div>
                    <Btn onClick={addOptionAction} disabled={!noChanges}>Добавить опцию</Btn>
                    <Divider/>
                    <Btn className="mr" disabled={noChanges}
                         onClick={cancelAction}>{TEXT_MAIN.CANCEL}</Btn>
                    <Btn intent="primary" disabled={noChanges}
                         onClick={saveAction}>{currentOption.new ? TEXT_MAIN.CREATE : TEXT_MAIN.SAVE}</Btn>
                </StyledProductHeader>

                <ProductOptionsSortable
                    productsOptions={productsOptions}
                    selectedOption={selectedOption}
                    selectOptionAction={selectOptionAction}
                    removeOptionAction={removeOptionAction}
                    onSortEnd={onSortEnd}
                    useDragHandle
                    axis={'xy'}
                />
                <StyledHR/>

                <SelectedOptionConfig option={currentOption}
                                      onChange={handleChange}
                                      updateParamsData={updateParamsData}
                                      removeParamAction={removeParamAction}
                                      addParamAction={addParamAction}
                                      allOptionTypes={allOptionTypes}
                                      validateErrors={validateErrors}
                                      optionValidateErrors={optionValidateErrors}
                                      clearError={clearError}
                                      deleteOption={deleteOptionAction}
                                      openTechOptionsModal={openTechOptionsModal}
                />

                {techOptionsModal && <ModalParams data={techOptionsModal} saveAction={saveTechOptions} closeAction={closeTechOptionsModal}/>}

            </PageInner>
        </Page>
    </OnlyAuth>;
};

const TECH_PARAMS_TYPES = [
    'name', 'printer', 'roll_width', 'printCutLineTop', 'printCutLineLeft', 'printCutLineRight', 'printCutLineBottom'
];

// Все опции (категории опций) - сортируемый список
const ModalParams = ({data, saveAction, closeAction}) => {

    const [modalData, setModalData] = useState(data);

    // useEffect(()=>{
    //     setModalData(data);
    // }, [data]);

    if (!data || !modalData) return null;

    const updateModalData = ( o, i) => {
         if (modalData.params) setModalData({
             id: modalData.id,
             params: modalData.params.map((item, index)=> i === index ? {...item, ...o} : item)
         });
    };

    const addParam = (p) => {
        setModalData({...modalData, params: [
            {name: p || '', value: ''},
            ...modalData.params
        ]});
    };

    const NewPropNames = () => {
        const newParams = TECH_PARAMS_TYPES.filter((type)=> !modalData.params.some((o)=>o.name === type));
        return newParams && <Row>
            <Btn fill intent="minimal" onClick={()=>addParam(null)}>+</Btn>
            {newParams.map((p, i) => <Btn fill intent="minimal" small onClick={()=>addParam(p)} key={i}>{p}</Btn>)}
        </Row> || null;
    };

    return createPortal(
        <Modal size={'sm'} title={'Технические опции'} isOpen={modalData} action={closeAction}>
            <Row>
                <Col w={1} style={{marginBottom: 20}}>
                    <Tooltip trigger="click" tooltip={<NewPropNames/>} intent="minimal" placement="bottom" >
                        <Btn fill>Добавить параметр</Btn>
                    </Tooltip>
                </Col>
            </Row>
            {modalData.params && modalData.params.map(
                (param, i)=><ModalParam data={param} onChange={(o)=>updateModalData(o, i)} key={i}/>
            )}

            <Row>
                <Col w={2}>
                    <Btn onClick={closeAction}>Отмена</Btn>
                </Col>
                <Col w={2} align={'right'}>
                    <Btn intent="primary" onClick={()=>saveAction(modalData)} >Сохранить</Btn>
                </Col>
            </Row>
        </Modal> || null,
        document.getElementById( 'spa-top' )
    );
};

// Все опции (категории опций) - сортируемый список
const ModalParam = memo(({data, onChange}) => {

    return <Row>
        <Col w={2}>
            <Input value={data.name || ''} onChange={(e) => onChange({name: e.target.value})}/>
        </Col>
        <Col w={2}>
            <Input value={data.value || ''} onChange={(e) => onChange({value: e.target.value})}/>
        </Col>
    </Row>;
});

// Все опции (категории опций) - сортируемый список
const ProductOptionsSortable = SortableContainer(memo(({productsOptions, selectedOption, selectOptionAction, removeOptionAction}) => {

    return <StyledArray>
        <Row>
            {productsOptions.length && productsOptions.map((option, i) =>
                <AreaItem option={option}
                          active={selectedOption === option.id}
                          selectAction={() => selectOptionAction(i)}
                          removeAction={() => removeOptionAction(i)}
                          key={option.id || i}
                          index={i}
                />) || null}
        </Row>
    </StyledArray>
}));

// опция - элемент сортируемого списка
const AreaItem = SortableElement(({option, active, selectAction }) => {

    return <StyledArrayItem small active={active}>
        <div className="header">
            <SortHandle/>
            {/*<div className="headerBtn remove" onClick={removeAction}>
                <IconDelete2 size={18}/>
            </div>*/}
        </div>
        <div className="name" onClick={()=>{!active && selectAction()}}>{option.name}</div>
    </StyledArrayItem>;
});

const SortHandle = SortableHandle(() => {
    return <div className="headerBtn move"><IconLib/></div>;
});

// Выбранная опция
const SelectedOptionConfig = ({option, onChange, addParamAction, removeParamAction,  updateParamsData, allOptionTypes, validateErrors, optionValidateErrors, clearError, deleteOption, openTechOptionsModal }) => {
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(()=>{
        setDeleteConfirm(false);
    }, [option]);

    if (!option) return null;

    // Удалить опцию
    const deleteOptionAction = () => {
        if (deleteConfirm) {
            deleteOption(option.id);
        } else {
            setDeleteConfirm(true);
        }
    };

    const usedTypes = option.parameters && option.parameters.map( ( opt ) => opt.optionSlug ) || [];
    const unusedTypes = allOptionTypes && allOptionTypes.filter( ( type ) => !usedTypes.some( ( u ) => u === type.id ) ) || [];

    return <div>
        <Row>
            <Col w={3}>
                <TextArea
                    label={'Название'}
                    placeholder={'Название'}
                    onChange={(e)=>onChange({description: e.target.value})}
                    value={option.description || ''}
                    rows={1}
                    error={optionValidateErrors.description}
                    onFocus={()=>clearError(false, 'description')}
                />
            </Col>
            <Col w={6}>
                <Input value={option.name || ''}
                       onChange={(e)=>onChange({name: e.target.value})}
                       placeholder={'Имя опции'}
                       label={'Имя опции'}
                       error={optionValidateErrors.name}
                       onFocus={()=>clearError(false, 'name')}
                />
            </Col>
            <Col w={6}>
                <Input value={option.type || ''}
                       onChange={(e)=>onChange({type: e.target.value})}
                       placeholder={'Тип опции'}
                       label={'Тип опции'}
                       disabled={true}
                />
            </Col>
            <Col w={3} align="right">
                {!option.new && <div style={{paddingTop: 20}}>
                    {deleteConfirm ?
                        <span>
                            <span className="mr">Вы уверены?</span>
                            <Btn className="mr" intent="danger" onClick={deleteOptionAction}>Да</Btn>
                            <Btn className="looong" onClick={()=>setDeleteConfirm(false)}>Нет</Btn>
                        </span>
                        :
                        <Btn intent="danger" onClick={deleteOptionAction}>Удалить опцию</Btn>
                    }
                </div>}
            </Col>
        </Row>

        {!option.new && <StyledProductLabel>
            <div className="label">Параметры опции</div>
            <Divider/>
            <Btn small onClick={addParamAction}>Добавить параметр</Btn>
        </StyledProductLabel>}

        {/*<TransitionGroup>
            {option.parameters && option.parameters.length && option.parameters.map(
                (parameter, i) => <CSSTransition key={i}
                                                 timeout={500}
                                                 classNames="product-fade">
                    <OptionParameter parameter={parameter}
                                     allOptionTypes={allOptionTypes}
                                     onChange={(data) => updateParamsData(data, i)}
                                     removeAction={() => removeParamAction(i)}/>
                </CSSTransition>
            ) || null}
        </TransitionGroup>*/}
            {!option.new && option.parameters && option.parameters.length && option.parameters.map(
                (parameter, i) => <OptionParameter key={i}
                                                   parameter={parameter}
                                                   errors={validateErrors && validateErrors.find((item)=>parameter && (item.id === parameter.id))}
                                                   allOptionTypes={allOptionTypes}
                                                   unusedTypes={unusedTypes}
                                                   onChange={(data) => updateParamsData(data, i)}
                                                   clearError={clearError}
                                                   openTechOptionsModal={openTechOptionsModal}
                                                   removeAction={() => removeParamAction(i)}/>
            ) || null}
    </div>;
};

// Параметр опции (строка таблицы параметров опции)
const OptionParameter = memo(({parameter, onChange, removeAction, allOptionTypes, unusedTypes, errors = {}, clearError, openTechOptionsModal}) => {
    if (parameter.deleted) return null;

    const typesList = [ allOptionTypes ? allOptionTypes.find(item => item.id === parameter.optionSlug) : null , ...unusedTypes].filter((t)=>t);

    return <div style={{position: 'relative'}} onClick={()=>{console.log('OptionParameter',parameter.id);}}>
        <Row>
            <Col w={2}>
                <FormGroup label={'Тип параметра'} >
                    <Tooltip tooltip={errors.optionSlug} tooltipShown={!!errors.optionSlug} intent="danger" placement="top">
                        <Select
                            list={typesList}
                            selected={typesList && typesList.findIndex(item => item.id === parameter.optionSlug)}
                            onSelect={(index)=>onChange({optionSlug: typesList[index].id})}
                            label={'Тип параметра'}
                            intent={errors.optionSlug && 'danger'}
                        />
                    </Tooltip>
                </FormGroup>
            </Col>
            <Col w={2}>
                <Row>
                    <Col w={3} x={2}>
                        <Input value={parameter.name|| ''}
                               onChange={(e)=>onChange({name: e.target.value})}
                               placeholder={'Название'}
                               label={'Название'}
                               error={errors.name}
                               onFocus={()=> errors.name && clearError( parameter.id,'name')}
                        />
                    </Col>
                    <Col w={3} align={"right"}>
                        <Btn small iconed intent="minimal"  onClick={removeAction}><IconClose/></Btn>
                    </Col>
                </Row>
            </Col>

        </Row>
        <Row>
            <Col w={2}>
                <TextArea
                    label={'Описание'}
                    placeholder={'Описание'}
                    onChange={(e)=>onChange({description: e.target.value})}
                    value={parameter.description || ''}
                    rows={1}
                    error={errors.description}
                    onFocus={()=> errors.description && clearError( parameter.id,'description')}
                />
            </Col>
            <Col w={6} x={2}>
                <TextArea
                    label={'Техническое описание'}
                    value={parameter.technicalDescription && JSON.stringify(parameter.technicalDescription) || '  '}
                    placeholder={'Нажмите "Ред."'}
                    disabled
                    rows={1}
                    error={errors.technicalDescription}
                    // onFocus={()=> errors.technicalDescription && clearError( parameter.id,'technicalDescription')}
                />
            </Col>
            <Col w={6} x={1} style={{paddingTop: 21}}>
                <Btn onClick={()=>openTechOptionsModal(parameter)}>ред.</Btn>
            </Col>
        </Row>
        <StyledHR/>

    </div>;
});

// const OptionParameterConfig = memo((props) => {
//     const AdminDialogSelector = useSelector(modalAdminDialogSelector);
//     const dispatch = useDispatch();
//
//     const addAreaParam = () => {
//         dispatch(modalAdminDialogAction({
//             ...AdminDialogSelector,
//             contentData: AdminDialogSelector.contentData ? {
//                 ...AdminDialogSelector.contentData,
//                 params: [
//                     ...AdminDialogSelector.contentData.params,
//                     {
//                         name: '',
//                         formula: '',
//                     }
//                 ]
//             } : {
//                 params: [{name: '', formula: '',}]
//             }
//         }))
//     };
//     const editParam = (value, index) => {
//         dispatch(modalAdminDialogAction({
//             ...AdminDialogSelector,
//             contentData: {
//                 ...AdminDialogSelector.contentData,
//                 params: AdminDialogSelector.contentData.params.map(
//                     (param, i)=> i === index ? {
//                         ...param,
//                         ...value
//                     } : param
//                 )
//             }
//         }))
//     };
//     const removeParam = (index) => {
//         dispatch(modalAdminDialogAction({
//             ...AdminDialogSelector,
//             contentData: {
//                 ...AdminDialogSelector.contentData,
//                 params: AdminDialogSelector.contentData.params.filter((param, i) => i !== index)
//             }
//         }))
//     };
//
//     return <StyledAreasOptions>
//         <div className="leftCol">
//             <div>
//                 <div className="title">Свойства:</div>
//                 <Btn onClick={addAreaParam}>Добавить свойство</Btn>
//             </div>
//             { AdminDialogSelector.contentData && AdminDialogSelector.contentData.params &&
//             <div className="ParamsList">
//                 <div className="label">
//                     <div className="cl0">Название</div>
//                     <div className="cl1">Формула</div>
//                 </div>
//                 {AdminDialogSelector.contentData.params.map(
//                     (param, i)=> <div className="ParamsListRow" key={i}>
//                     <div className="cl0">
//                         <Input name="name"
//                                value={param.name || ''}
//                                onChange={(e)=>editParam({name : e.target.value}, i)}
//                         />
//                     </div>
//                     <div className="cl1">
//                         <Input name="formula"
//                                value={param.formula || ''}
//                                onChange={(e)=>editParam({formula: e.target.value}, i)}
//                         />
//                     </div>
//                     <div className="cl2">
//                         <Btn intent="minimal" onClick={()=>removeParam(i)}><IconClose/></Btn>
//                     </div>
//                 </div>)}
//             </div> }
//         </div>
//
//         <div className="rightCol">
//             <div className="title">Вставить:</div>
//
//         </div>
//     </StyledAreasOptions>
// });

// const showOptionParameterConfig = () => {
//     dispatch(modalAdminDialogAction({
//         title: 'Свойства параметра опции',
//         content: <OptionParameterConfig/>,
//         contentData: {params: Object.keys(parameterContentData).map(
//                 (key)=> ({name: key, formula: parameterContentData[key]})
//             )},
//         confirmAction: (rrr)=>{console.log('rrr',rrr);}
//     }));
// };
// const getPageParams = (data) => {
//     if (!data) return null;
//     return Object.keys(data).map((key)=>`${key}: ${data[key]}; `)
// };


export default Options;