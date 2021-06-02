import React, {useState, useEffect, memo} from 'react';
import { useSelector, useDispatch } from "react-redux";

import {COLORS, Divider, Row, Col} from 'const/styles'
import {
    StyledProductHeader,
    StyledProductLabel,
    StyledParamsText,
    StyledArrayItem,
    StyledArray,
    StyledHR,
    StyledAreasOptions, StyledNoContent,
} from '../_styles'
import {Btn, Checkbox, Input} from 'components/_forms';
import {IconLib, IconDelete2} from 'components/Icons';
import Spinner from 'components/Spinner';
import {IconClose} from "components/Icons";

import TEXT_MAIN from "texts/main";
import { modalAdminDialogAction } from 'actions/modals';
import { modalAdminDialogSelector } from 'selectors/modals';
import {
    disableNavigationAction,
} from './_actions';
import {isSameObjects} from "libs/helpers";
import AdminTable from "../_table";

/**
 * Раздел областей продукта
 */
const CurrentProductAreas = memo(({data}) => {
    const [productAreas, setProductAreas] = useState(null);
    const [selectedArea, setSelectedArea] = useState(0);

    useEffect(() => {
        setProductAreas(data);
    }, [data]);

    if (!productAreas) return <Spinner fill/>;

    if (!productAreas[selectedArea]) {
        setSelectedArea(0);
        return null;
    }

    const cancelAction = () => {
        setProductAreas(data);
    };
    const saveAction = () => {
       console.log('SAVE');
    };
    const addAreasAction = () => {
        const areaNewId = Math.round(Math.random()*100);
        setProductAreas([
            ...productAreas, {
            id: 'id'+ areaNewId,
            name: "Постер " + areaNewId,
            pages: [],
            printOptions: {
                printMarginBottom: 3,
                printMarginLeft: 3,
                printMarginRight: 3,
                printMarginTop: 3
            }
        }]);
        setSelectedArea(productAreas.length);
    };
    const removeAreaAction = (index) => {
        setProductAreas(productAreas.filter((item, i)=> i !== index));
        // if (selectedArea === index) setSelectedArea(index > 0 ? (index - 1) : 0);
    };
    const moveAreaAction = (index) => {
       console.log('moveAreasAction', index);
    };
    const handleChange = (data) => {
        setProductAreas(productAreas.map((area, i) => i === selectedArea ? {...area, ...data} : area));
    };
    // изменение свойств страницы
    const updatePagesData = (data, index) => {
        setProductAreas(productAreas.map((area, i) => i === selectedArea ? {
            ...area,
            pages: area.pages.map((item, i)=> i === index ? {
                ...item, ...data
            } : item)
        } : area));
    };
    // добавление страницы
    const addPageAction = () => {
        const pageNewId = Math.round(Math.random()*100);
        setProductAreas(productAreas.map((area, i) => i === selectedArea ? {
            ...area,
            pages: [ ...area.pages, {
                id: 'id' + pageNewId,
                type: 'poster_page' + pageNewId,
                editable: true
            }]
        } : area));
    };
    // удаление страницы
    const removePageAction = (id) => {
        setProductAreas(productAreas.map((area, i) => i === selectedArea ? {
            ...area,
            pages: area.pages.filter((item)=> item.id !== id)
        } : area));
    };
    // изменение свойств страницы
    const updatePrintOptions = (data) => {
        setProductAreas(productAreas.map((area, i) => i === selectedArea ? {
            ...area,
            printOptions: {
                ...area.printOptions,
                ...data
            }
        } : area));
    };

    const noChanges = isSameObjects(productAreas, data);
    disableNavigationAction(!noChanges);

    return <div>
        <StyledProductHeader>
            <div className="label">Области продукта</div>
            <Btn onClick={addAreasAction}>Добавить область</Btn>
            <Divider/>
            <Btn className="mr"  disabled={noChanges} onClick={cancelAction}>{TEXT_MAIN.CANCEL}</Btn>
            <Btn intent="primary" disabled={noChanges} onClick={saveAction}>{TEXT_MAIN.SAVE}</Btn>
        </StyledProductHeader>

        <StyledArray>
            <Row>
                {productAreas.length && productAreas.map((area, i)=> <AreaItem area={area}
                                                                            active={selectedArea === i}
                                                                            selectAction={()=>setSelectedArea(i)}
                                                                            removeAction={()=>removeAreaAction(i)}
                                                                            moveAction={()=>moveAreaAction(i)}
                                                                            key={area.id}/>) || null}
            </Row>
        </StyledArray>
        <StyledHR/>

        <SelectedAreaConfig area={productAreas[selectedArea]}
                            onChange={handleChange}
                            updatePagesData={updatePagesData}
                            removePageAction={removePageAction}
                            addPageAction={addPageAction}
                            updatePrintOptions={updatePrintOptions}
        />

    </div>;
});

const AreaItem = ({area, active, selectAction, removeAction, moveAction }) => {

    return <StyledArrayItem small active={active}>
        <div className="header">
            <div className="headerBtn move">
                <IconLib/>
            </div>
            <div className="headerBtn remove" onClick={removeAction}>
                <IconDelete2 size={18}/>
            </div>
        </div>
        <div className="name" onClick={()=>{!active && selectAction()}}>{area.name}</div>
    </StyledArrayItem>;
};

const SelectedAreaConfig = ({area, onChange, addPageAction, removePageAction, addPaperAction, removePaperAction, updatePagesData, updatePrintOptions }) => {
    if (!area) return null;

    const showAreaPageProps = () => {
        // dispatch(modalAdminDialogAction({
        //     title: 'Свойства страницы',
        //     content: <AreaPageProps/>,
        //     contentData: {params: Object.keys(pageContentData).map(
        //             (key)=> ({name: key, formula: pageContentData[key]})
        //         )},
        //     confirmAction: (rrr)=>{console.log('rrr',rrr);}
        // }));
    };

    return <div>
        <Row>
            <Col w={3}>
                <Input name="name"
                       value={area.name || ''}
                       onChange={(e)=>onChange({name: e.target.value})}
                       placeholder={'Название области'}
                       label={'Название области'}
                />
            </Col>
            <Col w={6}>
                <Input name="type"
                       value={area.type || ''}
                       onChange={(e)=>onChange({type: e.target.value})}
                       placeholder={'Тип'}
                       label={'Тип'}
                />
            </Col>
        </Row>

        <StyledProductLabel>
            <div className="label">Страницы</div>
            <Divider/>
            <Btn small onClick={addPageAction}>Добавить страницу</Btn>
        </StyledProductLabel>

        {area.pages && area.pages.length ?
            <AdminTable sortable={false} data={area.pages}
                        head={[
                            {title: 'Тип',              width: 280},
                            {title: 'Редактируемая',    width: 140},
                            {title: 'Свойства',         width: 280},
                        ]}
                        row={[{
                            name: 'type',
                            type: 'input',
                        }, {
                            name: 'editable',
                            type: 'checkbox',
                        }, {
                            name: 'text',
                            type: 'text',
                            value: 'Свойства пока не отображаются',
                        }]}
                        onChange={(data, index)=> updatePagesData(data, index)}
                        onRemoveRow={(index)=>removePageAction(area.pages[index].id)}
            />
            :
            <StyledNoContent>
                <span className="text">У этой области нет страниц</span>
                <Btn small onClick={addPageAction}>Добавить страницу</Btn>
            </StyledNoContent>
        }
        <StyledHR/>

       {/* <StyledProductLabel>
            <div className="label">Вариации бумаги</div>
            <Divider/>
            <Btn small onClick={addPaperAction}>Добавить бумагу</Btn>
        </StyledProductLabel>*/}

        {/*<StyledProductTable>
            <thead>
            <tr>
                <th>Тип</th>
                <th>min</th>
                <th>max</th>
                <th>default</th>
                <th> </th>
            </tr>
            </thead>
            <tbody>
            {area.paper_allows && area.paper_allows.length && area.paper_allows.map((paper, i)=> <PaperTableRow key={i} paper={paper} onChange={onChange} removeAction={removePaperAction}/> ) || null}
            </tbody>
        </StyledProductTable>
        <StyledHR/>*/}

        <StyledProductLabel>
            <div className="label">Параметры печати</div>
        </StyledProductLabel>
        <Row>
            <Col w={6}>
                <Input name="printMarginLeft"
                       value={area.printOptions && area.printOptions.printMarginLeft || ''}
                       onChange={(e)=>updatePrintOptions({printMarginLeft: parseFloat(e.target.value || 0)})}
                       label={'Обрез слева'}
                />
            </Col>
            <Col w={6}>
                <Input name="printMarginRight"
                       value={area.printOptions && area.printOptions.printMarginRight || ''}
                       onChange={(e)=>updatePrintOptions({printMarginRight: parseFloat(e.target.value || 0)})}
                       label={'Обрез справа'}
                />
            </Col>
            <Col w={6}>
                <Input name="printMarginTop"
                       value={area.printOptions && area.printOptions.printMarginTop || ''}
                       onChange={(e)=>updatePrintOptions({printMarginTop: parseFloat(e.target.value || 0)})}
                       label={'Обрез сверху'}
                />
            </Col>
            <Col w={6}>
                <Input name="printMarginBottom"
                       value={area.printOptions && area.printOptions.printMarginBottom || ''}
                       onChange={(e)=>updatePrintOptions({printMarginBottom: parseFloat(e.target.value || 0)})}
                       label={'Обрез снизу'}
                />
            </Col>
        </Row>

    </div>;
};


const TableRow = memo(({page, onChange, removeAction}) => {
    const dispatch = useDispatch();
    console.log('page',page);
    const { type, editable, ...pageContentData } = page;

    const showAreaPageProps = () => {
        dispatch(modalAdminDialogAction({
            title: 'Свойства страницы',
            content: <AreaPageProps/>,
            contentData: {params: Object.keys(pageContentData).map(
                    (key)=> ({name: key, formula: pageContentData[key]})
                )},
            confirmAction: (rrr)=>{console.log('rrr',rrr);}
        }));
    };
    return <tr>
        <td>
            <Input name="type"
                   value={type|| ''}
                   onChange={(e)=>onChange({type: e.target.value})}
                   placeholder={'Тип'}
                   className="noMargin"
            />
        </td>
        <StyledParamsText>
            <span>
                { getPageParams(pageContentData) }
            </span>
        </StyledParamsText>
        <td>
            <Checkbox checked={editable} onChange={(value)=>onChange({editable: value})}/>
        </td>
        <td>
            <Btn className={'mr'} small onClick={showAreaPageProps}>Изменить</Btn>
            <Btn small onClick={removeAction}>Удалить</Btn>
        </td>
    </tr>;
});
/*const PaperTableRow = memo(({paper, onChange, removeAction}) => {

    return <tr>
        <td style={{width: '250px'}}>
            {paper.id}
        </td>
        <td style={{width: '75px'}}>
            <Input name="min"
                   value={paper.min}
                   onChange={(e)=>onChange(paper.id, 'min', e.target.value)}
                   placeholder={'min'}
                   className="noMargin"
            />
        </td>
        <td style={{width: '75px'}}>
            <Input name="max"
                   value={paper.max}
                   onChange={(e)=>onChange(paper.id, 'max', e.target.value)}
                   placeholder={'min'}
                   className="noMargin"
            />
        </td>
        <td style={{width: '75px'}}>
            <Input name="default"
                   value={paper.default}
                   onChange={(e)=>onChange(paper.id, 'default', e.target.value)}
                   placeholder={'страниц включено'}
                   className="noMargin"
            />
        </td>
        <td>
            <Btn small onClick={()=>removeAction(paper.id)}>Удалить</Btn>
        </td>
    </tr>;
});*/

const getPageParams = (data) => {
    if (!data) return null;
    return Object.keys(data).map((key)=>`${key}: ${data[key]}; `)
};

const AreaPageProps = memo((props) => {
    const AdminDialogSelector = useSelector(modalAdminDialogSelector);
    const dispatch = useDispatch();

    const addAreaParam = () => {
        dispatch(modalAdminDialogAction({
            ...AdminDialogSelector,
            contentData: AdminDialogSelector.contentData ? {
                ...AdminDialogSelector.contentData,
                params: [
                    ...AdminDialogSelector.contentData.params,
                    {
                        name: '',
                        formula: '',
                    }
                ]
            } : {
                params: [{name: '', formula: '',}]
            }
        }))
    };
    const editParam = (value, index) => {
        dispatch(modalAdminDialogAction({
            ...AdminDialogSelector,
            contentData: {
                ...AdminDialogSelector.contentData,
                params: AdminDialogSelector.contentData.params.map(
                    (param, i)=> i === index ? {
                        ...param,
                        ...value
                    } : param
                )
            }
        }))
    };
    const removeParam = (index) => {
        dispatch(modalAdminDialogAction({
            ...AdminDialogSelector,
            contentData: {
                ...AdminDialogSelector.contentData,
                params: AdminDialogSelector.contentData.params.filter((param, i) => i !== index)
            }
        }))
    };

    return <StyledAreasOptions>
        <div className="leftCol">
            <div>
                <div className="title">Свойства:</div>
                <Btn onClick={addAreaParam}>Добавить свойство</Btn>
            </div>
            { AdminDialogSelector.contentData && AdminDialogSelector.contentData.params &&
            <div className="ParamsList">
                <div className="label">
                    <div className="cl0">Название</div>
                    <div className="cl1">Формула</div>
                </div>
                {AdminDialogSelector.contentData.params.map(
                    (param, i)=> <div className="ParamsListRow" key={i}>
                    <div className="cl0">
                        <Input name="name"
                               value={param.name || ''}
                               onChange={(e)=>editParam({name : e.target.value}, i)}
                        />
                    </div>
                    <div className="cl1">
                        <Input name="formula"
                               value={param.formula || ''}
                               onChange={(e)=>editParam({formula: e.target.value}, i)}
                        />
                    </div>
                    <div className="cl2">
                        <Btn intent="minimal" onClick={()=>removeParam(i)}><IconClose/></Btn>
                    </div>
                </div>)}
            </div> }
        </div>

        <div className="rightCol">
            <div className="title">Вставить:</div>

        </div>
    </StyledAreasOptions>
});

export default CurrentProductAreas;