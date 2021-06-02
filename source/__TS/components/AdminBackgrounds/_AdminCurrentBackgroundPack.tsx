// @ts-ignore
import React, {useState, useEffect, useCallback} from 'react';

// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {Row, Col} from 'const/styles'
// @ts-ignore
import {Input, Btn} from 'components/_forms'
// @ts-ignore
import {IconEye, IconEyeOff2, IconAddPhoto} from "components/Icons";
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import { declOfNum, arrayMove } from "libs/helpers";


import Library from "__TS/components/Library";
import {IadminCurrentBackgroundPack, IcurrentBackgroundPack} from "../../interfaces/admin/adminBackgrounds";
import {Divider, HRStyled, ActionsBarTextStyled, BtnRow } from "../../styles/admin";

/** Actions */
import {
    deselectBackgroundsAction,
    selectAllBackgroundsAction,
    deleteBackgroundPackAction,
    updateBackgroundPackAction,
    selectBackgroundPackAction,
    sortBackgroundsAction,
    bulkDeleteBackgroundAction,
} from "../../actions/admin/adminBackgrounds";
import {adminCurrentBackgroundPackSelector} from "./selectors";


/** Interfaces */
// interface IadminListItem extends IadminBackgroundsList {
//     onSelect: (id: string)=>any;
//     active: boolean;
// }
//

/**
 * Текущая коллекция фонов
 */
const AdminCurrentBackgroundPack: React.FC<IadminCurrentBackgroundPack> = ({ onSelectBackgroundAction, showAddBackgroundsModalAction, showMoveBackgroundsModalAction, showConstrainProportionsAction}): any => {

    const data: IcurrentBackgroundPack = useSelector( adminCurrentBackgroundPackSelector );

    const [name, setName] = useState('');
    const [backgroundsList, setBackgroundsList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [isDeleting, setIsDeleting] = useState('');

    // Обновление локального state из props
    useEffect(() => {
        if (data) {
            setName(data.name || '');
            setBackgroundsList(data.backgroundsList || []);
            if (data.status) setIsPublished(data.status === 'enable');
        }
    }, [ data ]);

    // Изменить название коллекции
    const changeNameHandler = useCallback((value) => {
        setName(value);
        updateBackgroundPackAction(data.id, {name: value});
    }, [ data && data.id]);

    // Выбор фона в коллекции
    const selectActionHandler = useCallback((o) => {
        onSelectBackgroundAction({data: o.data, showPreview: !isEdit });
    }, [isEdit]);

    // Опубликовать / Снять с публикации
    const togglePublishHandler = useCallback((publish) => {
        setIsPublished(publish);
        updateBackgroundPackAction(data.id, {status: publish ? 'enable' : 'disable'});
    }, [data && data.id]);

    // Сортировка
    const onSortEndHandler = useCallback(({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) return null;
        const sortedList = arrayMove(backgroundsList, oldIndex, newIndex);

        setBackgroundsList(sortedList);
        sortBackgroundsAction(sortedList, data.id, ({error})=>{
            if (error)  setBackgroundsList(backgroundsList);
        });

    }, [backgroundsList,  data && data.id]);

    if (!data || !data.id) return null;

    // Удалить коллекцию фонов
    const removeBackgroundPackHandler = () => {
        if (isDeleting){
            setIsDeleting('inProgress');
            deleteBackgroundPackAction(data.id, ()=>{
                setIsDeleting('');
                selectBackgroundPackAction();
            });
        } else setIsDeleting('confirm');
    };


    // Отмена редактирования коллекции фонов
    const cancelHandler = () => {
        deselectBackgroundsAction(data.id);
        setIsEdit(false);
    };

    // console.log('data',data);

    // Список выделенных фонов
    const backgroundsSelection = backgroundsList.length && backgroundsList.filter((item)=>item.selected) || [];


    // Удалить выбранные фоны
    const removeBackgroundsHandler = () => {
        bulkDeleteBackgroundAction(backgroundsSelection.map((x)=>x.id), data.id);
    };

    return <>
        {isEdit ?   // Кнопки при редактировании коллекции фонов
            <BtnRow style={{paddingTop: 21}}>
                <Btn onClick={cancelHandler} >Отмена</Btn>
                <Btn onClick={() => selectAllBackgroundsAction(data.id)} >Выбрать все</Btn>
                <ActionsBarTextStyled>
                    {backgroundsSelection.length ?
                        `${declOfNum(backgroundsSelection.length, ['Выбран', 'Выбрано', 'Выбрано'])} ${backgroundsSelection.length} ${declOfNum(backgroundsSelection.length, ['фон', 'фона', 'фонов'])}`
                        :
                        `Выберите фоны для редактирования`
                    }
                </ActionsBarTextStyled>
                {/*<Btn intent="primary" onClick={() => setIsIconSelect(true)}>Сохранить порядок</Btn>*/}
                <Btn onClick={() => showConstrainProportionsAction(backgroundsSelection.map((item)=>item.id))} disabled={!backgroundsSelection.length}>Позиционирование...</Btn>
                <Btn onClick={() => showMoveBackgroundsModalAction(backgroundsSelection.map((item)=>item.id))} disabled={!backgroundsSelection.length}>В другой набор...</Btn>
                <Btn onClick={removeBackgroundsHandler} disabled={!backgroundsSelection.length}>Удалить</Btn>

            </BtnRow>
            : isDeleting ?   // Кнопки при удалении коллекции фонов (подтверждение действия)
            <BtnRow style={{paddingTop: 21}}>
                <Divider/>
                <ActionsBarTextStyled>Вы уверены?</ActionsBarTextStyled>
                <Btn intent="danger" onClick={removeBackgroundPackHandler}>
                    {isDeleting === 'inProgress' ?

                    <Spinner size={24}/> : 'Да, удалить!'}
                </Btn>
                <Btn onClick={() => setIsDeleting('')} disabled={!backgroundsList.length}>Отмена</Btn>
            </BtnRow>
            :   // Кнопки коллекции фонов (по умолчанию)
            <Row>
                <Col w={4}>
                    <Input label={'Название набора'}
                           value={name || ''}
                           onChange={changeNameHandler}
                           noMargin latent
                    />
                </Col>
                <Col w={4} x={3}>
                    <BtnRow style={{paddingTop: 21}}>
                        <Btn onClick={() => togglePublishHandler(!isPublished)}
                             intent={isPublished ? 'success' : ''}
                             title={isPublished ? 'Набор фонов опубликован. Нажмите, чтобы скрыть': 'Набор фонов сейчас скрыт. Нажмите, чтобы опубликовать'}>
                            {isPublished ? <IconEye/> : <IconEyeOff2/>}
                        </Btn>
                        <Divider/>
                        <Btn onClick={()=>showAddBackgroundsModalAction(true)} icon={<IconEye/>}><IconAddPhoto/>&nbsp;Добавить фоны</Btn>
                        <Btn onClick={() => setIsEdit(true)} disabled={!backgroundsList.length}>Редактировать</Btn>
                        <Btn onClick={removeBackgroundPackHandler}>Удалить набор</Btn>
                    </BtnRow>
                </Col>
            </Row>
        }
        <HRStyled/>
        <Library
            items={backgroundsList}
            disabled={false}
            selectionActive={isEdit}
            sortable={isEdit}
            selectAction={selectActionHandler}
            onSortEnd={onSortEndHandler}
            axis={'xy'}
        />
    </>;
};

export default AdminCurrentBackgroundPack;
