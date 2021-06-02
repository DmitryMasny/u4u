import React, {useState, useEffect, memo} from 'react';
import { useSelector, useDispatch } from "react-redux";

import { Divider, Row, Col} from 'const/styles'
import {
    StyledProductHeader,
    StyledProductLabel,
    StyledArrayItem,
    StyledArray,
    StyledHR,
    StyledPapersList, StyledNoContent,
    StyledOptionTableRow
} from '../_styles'
import {Btn } from 'components/_forms';
import Spinner from 'components/Spinner';
import {getAllOptionsAction} from "../Options/_actions";
import {allOptionsSelector} from "../Options/_selectors";
import { optionsBufferSelector} from "./_selectors";
import Tooltip from "components/_forms/Tooltip";

import TEXT_MAIN from "texts/main";
import {
    createProductOptionParameter,
    updateProductOptionParameter,
    deleteProductOptionParameter,
    disableNavigationAction,
    setOptionsBuffer,
} from './_actions';

// import {validateProductFormat} from "../_validators";
import {arrayMove, checkStateDifference, isSameObjects} from "libs/helpers";
import AdminTable from "../_table";

/**
 * Раздел ценообразования продукта
 */
const CurrentProductPrices = memo(({data, productId, format, setUrl}) => {
    const [productPrices, setProductPrices] = useState(null);
    const [validateErrors, setValidateErrors] = useState([]);
    const [wrongParams, setWrongParams] = useState([]);
    const allOptions = useSelector( allOptionsSelector );
    const optionsBuffer = useSelector( optionsBufferSelector );
    const selectedFormat = parseInt(format);

    const dispatch = useDispatch();

    useEffect(() => {
        if (wrongParams.length) {
            setProductPrices(data.map((format, i)=> i === selectedFormat ? {
                ...format,
                options: [...wrongParams, ...format.options]
            } : format ));
            setWrongParams([]);
        } else {
            setProductPrices(data);
        }
        if (allOptions === null) dispatch(()=>getAllOptionsAction({dispatch}));
    }, [data]);

    if (!productPrices || !allOptions) return <Spinner fill/>;

    if (selectedFormat < 0) {
        setUrl({format: 0});
        return null;
    }

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

    // Отменить изменения
    const cancelAction = () => {
        if (validateErrors.length) setValidateErrors([]);
        setProductPrices(data);
    };

    // Сохранить все изменения
    const saveAction = () => {
        if (validateErrors.length) setValidateErrors([]);

        let newOptionParams = [], updatedOptionParams = [], deletedOptionParams = [], productOptionParamsArray = [], oldParams = {};
        const productOptions = productPrices[selectedFormat].options;
        const virginOptions = data[selectedFormat].options;

        // Отсеиваем новые параметры опции в отдельный массив
        const existOptions = productOptions && productOptions.length && productOptions.filter(
            (option) => {
                let optionParameters = option.parameters && option.parameters.length ? option.parameters : null;
                if (optionParameters) {
                    const defaultPriceId = optionParameters.sort((a, b)=>a.price - b.price)[0].id;
                    optionParameters = optionParameters.map((o)=>({...o, defaultPrice: defaultPriceId === o.id}));
                    const existParams = optionParameters && optionParameters.filter(
                        (item) => {
                            if (item.new && !item.deleted && !option.deleted) {
                                newOptionParams.push(item);   // записываем новые параметры
                                return false;
                            }
                            return true;
                        }
                    );
                    existParams.length && productOptionParamsArray.push(...existParams);   // записываем существовавшие параметры
                }
                return true;
            }
        );

        // Создаем объект из параметров опций начальных данных для сравнения изменений
        const oldOptions = virginOptions && virginOptions.length && virginOptions.forEach(
            (option) => {
                if (option.parameters && option.parameters.length){
                    option.parameters.forEach((param)=>{oldParams[param.id] = param});
                }
            }
        );

        // Бежим по всем параметрам опций
        if (productOptionParamsArray.length) for (let i = 0; i < productOptionParamsArray.length; i++) {

            // Если у параметра deleted == true, значит он удален, отправляем на сервер DELETE
            if (productOptionParamsArray[i].deleted) {
                deletedOptionParams.push(productOptionParamsArray[i])

                // Если у параметра изменены свойства, значит отправляем на сервер UPDATE
            // } else if (JSON.stringify(productOptionParamsArray[i]) !== JSON.stringify(data[i])) {
            } else {
                const comparingParam = productOptionParamsArray[i];
                if (comparingParam !== oldParams[comparingParam.id]) updatedOptionParams.push(productOptionParamsArray[i])

            }
        }
        // console.log('OptionParams',{
        //     newOptionParams: newOptionParams,
        //     updatedOptionParams: updatedOptionParams,
        //     deletedOptionParams: deletedOptionParams,
        //     productOptionParamsArray: productOptionParamsArray
        // });

        // валидация ошибок на клиенте
        // const newOptionParamsValidateErrors = validateProductFormat(newOptionParams);
        // const updateParamsValidateErrors = validateProductFormat(updatedOptionParams);
        // if (newOptionParamsValidateErrors) setValidateErrors(newOptionParamsValidateErrors);
        // if (updateParamsValidateErrors) setValidateErrors(updateParamsValidateErrors);

        // if (!newOptionParamsValidateErrors && !updateParamsValidateErrors) {
            // Если есть созданные параметры опций
            if (newOptionParams.length) {
                createProductOptionParameter(
                    newOptionParams,
                    productPrices[selectedFormat].id,
                    (errorData)=>{
                        setWrongParams(errorData.map(
                            (errorItem) => productPrices.find(
                                (format) => format.id === errorItem.id)).filter((item) => item)
                        );
                        setValidateErrors(errorData);
                    }
                )
            }

            // Если есть удаленные форматы
            if (deletedOptionParams.length) {
                deleteProductOptionParameter(
                    deletedOptionParams.map((param)=>param.id)
                );
            }

            // Если есть измененные форматы
            if (updatedOptionParams.length) {
                updateProductOptionParameter(
                    updatedOptionParams,
                    productPrices[selectedFormat].id,
                    (errorData)=>{
                        setWrongParams(errorData.map((errorItem)=> productPrices.find((format)=>format.id === errorItem.id)).filter((item) => item));
                        setValidateErrors(errorData);
                    }
                );
            }
        // }
    };

    // Для выбранного формата перезаписываем опции цен
    const handleChange = (data, optId, optionCategoryId) => {
        // console.log('handleChange',{
        //     data:data,
        //     optId:optId,
        //     optionCategoryId:optionCategoryId
        // });
        setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {...item, options: item.options.map((option)=> option.id === optionCategoryId ?
                    {...option, parameters: option.parameters.map((p)=>p.id === optId ? {...p, ...data} : data.isRadio ? {...p, [Object.keys(data)[0]]: false} : p)}
                    : option)}
            : item)  );
    };

    // Чекбокс опции Активна/Неактивна
    const optionActiveToggle = (optionId) => {
        setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {...item, options: item.options.map((option)=> option.id === optionId ?
                    {...option, active: !option.active}
                    : option)}
            : item)  );
    };

    // Добавить опцию
    const addOptionAction = (id) => {
        const newOption = allOptions.find((option)=>option.id === id);

        setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {
                ...item,
                options: [{
                    ...newOption,
                    // id: newOption.id,
                    new: true,
                    // active: true,
                    parameters: [],
                },
                    ...(item.options || [])
                ]
            }
        : item)  );
    };

    // Добавить параметр опции
    const addOptionVariableAction = (optionId, paramId) => {
        const thisOption = allOptions.find((option)=>option.id === optionId);
        let newParam = thisOption && thisOption.parameters.find((p)=> p.id === paramId);

        const currentOption = productPrices[selectedFormat].options && // Опция, к которой доб. параметр
            productPrices[selectedFormat].options.find((option)=>option.id === optionId);

        const NeedToSetDefaultPrice = !(currentOption && currentOption.parameters &&    // если нет параметра с defaultPrice,
            currentOption.parameters.some((p)=>p.defaultPrice));                        // то назначаем defaultPrice: true

        newParam = {
            ...newParam,
            optionId: paramId,
            id: Math.round(Math.random()*10000 * -1 - 1),
            new: true,
            // active: true,
            price: 0,
            sort: 0,
            defaultPrice: NeedToSetDefaultPrice,
        };

        if (thisOption && thisOption.parameters) setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {
                ...item,
                options: currentOption ?
                    item.options.map(
                        (option) => option.id === optionId ? {
                            ...option,
                            // active: true,
                            parameters: [
                                newParam,
                                ...option.parameters.map((p, i)=> ({...p, sort: i+1}))
                            ],
                        } : option)
                    :
                    [{
                        ...thisOption,
                        parameters: [newParam],
                    },
                        ...(item.options && item.options.lenght ? item.options : [])
                    ]
            }
        : item)  );
    };

    // Удалить опцию или параметр опции
    const removeOptionAction = (optId, optionCategoryId) => {
        setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {...item, options: item.options.map((option)=> option.id === optionCategoryId ?
                    (optId ?
                        // проверяем - удаляется вариация опции или вся опция (вся опция, если нет optId)
                        // Удаление варианта опции
                        {...option, parameters: option.parameters.map((opt)=> opt.id === optId ? (
                                opt.new ? null : {...opt, deleted: true}
                            ) : opt).filter((item)=>item)}
                        // Удаление категории опции
                        : option.new ? null : {...option, deleted: true, parameters: option.parameters.length && option.parameters.map((p)=>
                                (p.new ? null : {...p, deleted: true})
        ).filter((item)=>item) || [] })
                    : option).filter((item)=>item)}
            : item));
    };

    const selectFormat = (i) => {
        checkStateDifference(productPrices, data, ()=>setUrl({format: i}));
    };
    const changeDefaultPrice = (id, optId) => {
        setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {...item, options: item.options.map((option)=> option.id === id ?
                    {...option, parameters: option.parameters.map((p)=>({
                            ...p, defaultPrice: p.id === optId
                        }))}
                    : option)}
            : item));
    };

    const copyAction = () => {
        if (productPrices[selectedFormat].options && productPrices[selectedFormat].options.length) {
            setOptionsBuffer(
                productPrices[selectedFormat].options
            );
        } else setOptionsBuffer( [] );
    };
    const pasteAction = () => {
        if (optionsBuffer && optionsBuffer.length) setProductPrices(
            productPrices.map((item, i)=> i === selectedFormat ?
                {...item, options: optionsBuffer.map(
                        (option)=> ({
                            ...option,
                            new: true,
                            // active: true,
                            parameters: option.parameters && option.parameters.length && option.parameters.map(
                                (param)=> ({
                                    ...param,
                                    new: true,
                                    // active: true,
                                    // price: 0
                                })
                            )
                        })
                    )}
            : item));
    };

    const onSortEnd = ({oldIndex, newIndex}, optionCategoryId) => {
        // console.log('onSortEnd',{
        //     array: productPrices[selectedFormat].options,
        //     moved: arrayMove(productPrices[selectedFormat].options, oldIndex, newIndex, 'sort'),
        //     optionCategoryId:optionCategoryId
        // });
        if (oldIndex === newIndex) return null;

        setProductPrices( productPrices.map((item, i)=> i === selectedFormat ?
            {...item, options: optionCategoryId ?
                // Если есть id опции (категория опций) то сортируем варианты внутри
                item.options.map((option) =>
                    option.id === optionCategoryId ?
                    {...option, parameters: arrayMove(option.parameters, oldIndex, newIndex, 'sort')}
                    : option)
                :
                // Если нет id опции, то сортируем категории опций
                arrayMove(item.options, oldIndex+1, newIndex+1, 'sort')
            }
            : item));
    };

    const noChanges = isSameObjects(productPrices, data);
    disableNavigationAction( !noChanges);
console.log('productPrices',productPrices);

    if (!productPrices || !productPrices.length) return <StyledNoContent>
        <span className="text">В этом продукте нет ни одного формата</span>
    </StyledNoContent>;

    return <div>
        <StyledProductHeader>
            <div className="label">Форматы продукта</div>
            <Btn disabled={!productPrices[selectedFormat].options || !productPrices[selectedFormat].options.length}
                 onClick={copyAction} className="mr">
                {TEXT_MAIN.COPY} {TEXT_MAIN.OPTIONS.toLowerCase()}
            </Btn>
            <Btn disabled={!optionsBuffer.length} onClick={pasteAction}>
                {TEXT_MAIN.PASTE} {TEXT_MAIN.OPTIONS.toLowerCase()}
            </Btn>
            <Divider/>
            <Btn className="mr"  disabled={noChanges} onClick={cancelAction}>{TEXT_MAIN.CANCEL}</Btn>
            <Btn intent="primary" disabled={noChanges} onClick={saveAction}>{TEXT_MAIN.SAVE}</Btn>
        </StyledProductHeader>

        <StyledArray>
            <Row>
                {productPrices.length && productPrices.map((format, i)=><AreaItem name={format.name}
                                                                                  size={[format.width, format.height]}
                                                                                  active={selectedFormat === i}
                                                                                  selectAction={()=>selectFormat(i)}
                                                                                  key={format.id}/>) || null}
            </Row>
        </StyledArray>
        <StyledHR/>

        <SelectedFormatConfig
            data={productPrices[selectedFormat]}
            onChange={handleChange}
            optionActiveToggle={optionActiveToggle}
            allOptions={allOptions}
            addOptionAction={addOptionAction}
            addOptionVariableAction={addOptionVariableAction}
            removeOptionAction={removeOptionAction}
            validateErrors={validateErrors}
            clearError={clearError}
            changeDefaultPrice={changeDefaultPrice}
            onSortEnd={onSortEnd}
        />

    </div>;
});
const AreaItem = ({name, size, active, selectAction}) => {
    return <StyledArrayItem small active={active}>
        <div className="header"/>
        <div className="name" onClick={()=>{!active && selectAction()}}>
            {name}
            <div className="size">{size[0]}x{size[1]}</div>
        </div>
    </StyledArrayItem>;
};

/**
 * Настройки ценообразования выбранного формата
 */
const SelectedFormatConfig = ({data, allOptions, onChange, removeOptionAction,
                                  addOptionAction, addOptionVariableAction, validateErrors, clearError, onSortEnd }) => {
    if (!data) return null;
    // Отделяем бумагу от остальных опций
    let options = [], paper = {};

    if (data.options) {
        for (let i =0; i < data.options.length; i++) {
            if (data.options[i].type === 'paper') {
                paper = data.options[i];
            } else {
                options.push(data.options[i]);
            }
        }
    }


    // const allPapersKey = Object.keys(allOptions).find((key)=>allOptions[key] && allOptions[key].type === 'paper');
    // Все виды бумаги из опций
    let allPapers = allOptions.find((opt)=>opt.type === 'paper');

    if (!paper.id) paper.id = allPapers.id;
    allPapers = allPapers && allPapers.parameters;

    // Виды используемой в продукте бумаги
    const usedPapers = paper.parameters && paper.parameters.map((opt) => opt.optionId) || [];

    // Определение неиспользуемой бумаги и опций (что можно добавить к продукту)
    let unusedPapers = allPapers && allPapers.filter((paper)=>!usedPapers.some((p)=>p === paper.id) ) || [],
        unusedOptions = data.options ? allOptions.filter((option)=> option.type !== 'paper' && !data.options.some((o)=>o.id === option.id) ) : [...allOptions];

    const PapersList = () => <StyledPapersList>
        {unusedPapers.map((p)=><div className="item" onClick={()=>addOptionVariableAction(paper.id, p.id)} key={p.id}>{p.name}</div>)}
    </StyledPapersList>;

    const OptionsList = () => <StyledPapersList>
        {unusedOptions.map((option)=><div className="item" onClick={()=>addOptionAction(option.id)} key={option.id}>{option.name}</div>)}
    </StyledPapersList>;

    return <div>
        <StyledProductLabel>
            <div className="label">Учет страниц</div>
            <Divider/>
            <Tooltip trigger="click" intent="minimal" tooltipShown={!unusedPapers.length ? false : undefined} tooltip={<PapersList/>} placement="bottom">
                <Btn small disabled={!unusedPapers.length}>Добавить учет страниц</Btn>
            </Tooltip>
        </StyledProductLabel>

        {paper.parameters && paper.parameters.length ?
            <AdminTable sortable useDragHandle
                        data={paper.parameters}
                        head={[
                            {title: 'Начальная цена',       width: 150},
                            {title: 'Тип страниц',          width: 280},
                            {title: 'type',                 width: 200},
                            {title: 'Стоимость',            width: 120},
                        ]}
                        row={[{
                            name: 'defaultPrice',
                            type: 'radio',
                        }, {
                            name: 'optionId',
                            type: 'select',
                            list: (rowId)=>{
                                return allPapers.filter((item)=> !usedPapers.some((used)=>used !== rowId && used === item.id));
                            },
                        }, {
                            name: 'optionSlug',
                            type: 'text',
                        }, {
                            name: 'price',
                            type: 'input',
                            format: 'number'
                        }]}
                        onChange={(data, index)=> onChange(data, paper.parameters[index].id, paper.id)}
                        onRemoveRow={(index)=>removeOptionAction(paper.parameters[index].id, paper.id)}
                        errors={validateErrors}
                        clearError={clearError}
                        onSortEnd={(data)=>onSortEnd(data, paper.id) }
            />

            :
            <StyledNoContent>
                <span className="text">К этому формату не привязано ни одной бумаги</span>
                <Tooltip trigger="click" intent="minimal" tooltipShown={!unusedPapers.length ? false : undefined} tooltip={<PapersList/>} placement="bottom">
                    <Btn small disabled={!unusedPapers.length}>Добавить учет страниц</Btn>
                </Tooltip>
            </StyledNoContent>
        }
        <StyledHR/>

        <StyledProductLabel>
            <div className="label">Учет опций</div>
            <Divider/>

            <Tooltip trigger="click" intent="minimal" tooltipShown={!unusedOptions.length ? false : undefined} tooltip={<OptionsList/>} placement="bottom">
                <Btn small disabled={!unusedOptions.length}>Добавить опцию</Btn>
            </Tooltip>
        </StyledProductLabel>

        <ProductOptionsTable
            // sortable useDragHandle
            //                  onSortEnd={(data)=>onSortEnd(data)}
                             onOptSortEnd={(data, id)=>onSortEnd(data, id)}
                             data={options}
                             allOptions={allOptions}
                             removeOptionAction={removeOptionAction}
                             addOptionVariableAction={addOptionVariableAction}
                             validateErrors={validateErrors}
                             clearError={clearError}
                             optionsList={<OptionsList/>}
                             unusedOptions={unusedOptions}
                             onChange={onChange}
        />

    </div>;
};


const ProductOptionsTable = memo(({data, onChange, allOptions, removeOptionAction, addOptionVariableAction, validateErrors, clearError, optionsList, onOptSortEnd, unusedOptions}) => {
    if (!data) return  null;

    return data.length ? <div>
            {data.map((option, index)=> {
                const optionCategory = allOptions.find((opt)=>opt.id === option.id );
                return <OptionTableRow option={option}
                                       name={option.name}
                                       allOpts={optionCategory && optionCategory.parameters}
                                       onChange={onChange}
                                       removeAction={removeOptionAction}
                                       addOptionVariableAction={addOptionVariableAction}
                                       errors={validateErrors.filter((item)=> option.parameters.some((p)=>item.id === p.id))}
                                       clearError={clearError}
                                       onOptSortEnd={(data)=>onOptSortEnd(data, option.id)}
                                       key={index}
                                       // index={index}
                />
            })}
        </div>
        :
        <StyledNoContent>
            <span className="text">К этому формату не привязано ни одной опции</span>
            <Tooltip trigger="click" intent="minimal" tooltipShown={!unusedOptions.length ? false : undefined}
                     tooltip={optionsList} placement="bottom">
                <Btn small disabled={!unusedOptions.length}>Добавить опцию</Btn>
            </Tooltip>
        </StyledNoContent>;
});

// const OptionTableSortHandle = SortableHandle(() => {
//     return <div className="cell sort">
//             <IconLib/>
//         </div>;
// });

/**
 * Опции формата
 */
const OptionTableRow = memo(({option, allOpts, name, optionActiveToggle, onChange, removeAction, addOptionVariableAction, errors, onOptSortEnd, clearError, changeDefaultPrice}) => {
    if (option.deleted) return null;

    // Все доступные опции из объекта в массив {id: {...props}} -> [{id: id, ...props}] затем фильтром отсеиваются уже выбранные опции
    // const allOptionsList = allOptions && Object.keys(allOptions).map((key)=>({...allOptions[key], id: key})).filter((item)=> !usedOptions.some((used)=>used !== option.id && used === item.id));

    // const selectedIndex = allOptionsList.findIndex((item)=>item.id === option.id) || 0;

    const changeOptionAction = (name, value) => {
        onChange({
            optionId: option.id,
            name: name,
            value: value
        });
    };

    const ParamsList = () => <StyledPapersList>
        {allOpts && allOpts.length && allOpts.map((param)=><div className="item" onClick={()=>addOptionVariableAction(option.id, param.id )} key={param.id}>{param.name}</div>)}
    </StyledPapersList>;


    return <StyledOptionTableRow>
            <div className="headRow">
                {/*<OptionTableSortHandle/>*/}

                <div className="cell title">
                    {name}
                </div>
                <div className="cell kind">
                    {option.type}
                </div>
                <div className="cell actions">
                    <Tooltip trigger="click" intent="minimal" tooltip={<ParamsList/>} placement="bottom">
                        <Btn small className="mr">Добавить выбор</Btn>
                    </Tooltip>
                    <Btn small intent="danger" onClick={()=>removeAction(null, option.id)}>Удалить</Btn>
                </div>
            </div>

        {option.parameters && option.parameters.length ?
            <AdminTable sortable useDragHandle
                        data={option.parameters}
                        head={[
                            {title: 'Начальная цена',       width: 150},
                            {title: 'Вариант опции',        width: 280},
                            {title: 'type',                 width: 200},
                            {title: 'Стоимость',            width: 120},
                        ]}
                        row={[{
                            name: 'defaultPrice',
                            type: 'radio',
                        }, {
                            name: 'optionId',
                            type: 'select',
                            list: allOpts,
                        }, {
                            name: 'optionSlug',
                            type: 'text',
                        }, {
                            name: 'price',
                            type: 'input',
                            format: 'number'
                        }]}
                        onChange={(data, index)=> onChange(data, option.parameters[index].id, option.id)}
                        onRemoveRow={(index)=>removeAction(option.parameters[index].id, option.id)}
                        errors={errors}
                        clearError={clearError}
                        onSortEnd={onOptSortEnd}
            />
            :
            <StyledNoContent>
                <span className="text">У этой опции нет вариантов для выбора</span>
                <Tooltip trigger="click" intent="minimal" tooltip={<ParamsList/>} placement="bottom">
                    <Btn small className="mr">Добавить выбор</Btn>
                </Tooltip>
            </StyledNoContent>
        }
        <StyledHR/>
        </StyledOptionTableRow>;
});

export default CurrentProductPrices;