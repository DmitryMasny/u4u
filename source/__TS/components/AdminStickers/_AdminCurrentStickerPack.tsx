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

// @ts-ignore
import { toast } from '__TS/libs/tools';

// @ts-ignore
import Library from "__TS/components/Library";
import {IadminCurrentStickerPack, IcurrentStickerPack} from "../../interfaces/admin/adminStickers";
import {Divider, HRStyled, ActionsBarTextStyled, BtnRow } from "../../styles/admin";

/** Actions */
import {
    deselectStickersAction,
    selectAllStickersAction,
    deleteStickerPackAction,
    updateStickerPackAction,
    selectStickerPackAction,
    sortStickersAction,
    bulkDeleteStickerAction,
} from "../../actions/admin/adminStickers";
import {adminCurrentStickerPackSelector} from "./selectors";


/** Interfaces */
// interface IadminListItem extends IadminStickersList {
//     onSelect: (id: string)=>any;
//     active: boolean;
// }
//

/**
 * Текущий стикерпак
 */
const AdminCurrentStickerPack: React.FC<IadminCurrentStickerPack> = ({ onSelectStickerAction, showAddStickersModalAction, showMoveStickersModalAction, showConstrainProportionsAction}): any => {

    const data: IcurrentStickerPack = useSelector( adminCurrentStickerPackSelector );

    const [name, setName] = useState('');
    const [stickersList, setStickersList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isIconSelect, setIsIconSelect] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [haveIcon, setHaveIcon] = useState(false);
    const [isDeleting, setIsDeleting] = useState('');

    // Обновление локального state из props
    useEffect(() => {
        if (data) {
            setName(data.name || '');
            setHaveIcon(!!data.iconFrom);
            setStickersList(data.stickersList || []);
            if (data.status) setIsPublished(data.status === 'enable');
        }
    }, [ data ]);

    // Изменить название стикерпака
    const changeNameHandler = useCallback((value) => {
        setName(value);
        updateStickerPackAction(data.id, {name: value});
    }, [ data && data.id]);

    // Выбор стикера в коллекции
    const selectActionHandler = useCallback((o) => {
        // если режим выбора иконки, то обновляем иконку стикерсета
        if (isIconSelect) {
            updateStickerPackAction(data.id, {icon_from: o.data.id});
            setIsIconSelect(false);
        } else {    // иначе пробрасываем экшен в родитель (выделяем или открываем превью)
            onSelectStickerAction({data: o.data, showPreview: !isEdit });
        }
    }, [isIconSelect, isEdit,  data && data.id]);

    // Опубликовать / Снять с публикации
    const togglePublishHandler = useCallback((publish) => {
        if (!stickersList || !stickersList.length) {
            toast.error('Загрузите стикеры, прежде чем опубликовать', {
                autoClose: 5000
            });
        } else {
            if (!publish || haveIcon) {
                setIsPublished(publish);
                updateStickerPackAction(data.id, {status: publish ? 'enable' : 'disable'});
            } else toast.error('Выберите иконку для стикерпака, прежде чем опубликовать', {
                autoClose: 5000
            });
        }

    }, [isIconSelect, data && data.id, haveIcon, stickersList && stickersList.length]);

    // Сортировка
    const onSortEndHandler = useCallback(({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) return null;
        const sortedList = arrayMove(stickersList, oldIndex, newIndex);

        setStickersList(sortedList);
        sortStickersAction(sortedList, data.id, ({error})=>{
            if (error)  setStickersList(stickersList);
        });

    }, [stickersList,  data && data.id]);

    if (!data || !data.id) return null;

    // Удалить стикерпак
    const removeStickerPackHandler = () => {
        if (isDeleting){
            setIsDeleting('inProgress');
            deleteStickerPackAction(data.id, ()=>{
                setIsDeleting('');
                selectStickerPackAction();
            });
        } else setIsDeleting('confirm');
    };


    // Отмена редактирования стикерпака
    const cancelHandler = () => {
        deselectStickersAction(data.id);
        setIsEdit(false);
    };

    // console.log('data',data);

    // Список выделенных стикеров
    const stickersSelection = stickersList.length && stickersList.filter((item)=>item.selected) || [];


    // Удалить выбранные стикеры
    const removeStickersHandler = () => {
        bulkDeleteStickerAction(stickersSelection.map((x)=>x.id), data.id);
    };

    return <>
        {isEdit ?   // Кнопки при редактировании коллекции стикеров
            <BtnRow style={{paddingTop: 21}}>
                <Btn onClick={cancelHandler} >Отмена</Btn>
                <Btn onClick={() => selectAllStickersAction(data.id)} >Выбрать все</Btn>
                <ActionsBarTextStyled>
                    {stickersSelection.length ?
                        `${declOfNum(stickersSelection.length, ['Выбран', 'Выбрано', 'Выбрано'])} ${stickersSelection.length} ${declOfNum(stickersSelection.length, ['стикер', 'стикера', 'стикеров'])}`
                        :
                        `Выберите стикеры для редактирования`
                    }
                </ActionsBarTextStyled>
                {/*<Btn intent="primary" onClick={() => setIsIconSelect(true)}>Сохранить порядок</Btn>*/}
                {/*<Btn onClick={() => showConstrainProportionsAction(stickersSelection.map((item)=>item.id))} disabled={!stickersSelection.length}>Правила пропорций...</Btn>*/}
                <Btn onClick={() => showMoveStickersModalAction(stickersSelection.map((item)=>item.id))} disabled={!stickersSelection.length}>В другой набор...</Btn>
                <Btn onClick={removeStickersHandler} disabled={!stickersSelection.length}>Удалить</Btn>

            </BtnRow>
            : isDeleting ?   // Кнопки при удалении коллекции стикеров (подтверждение действия)
            <BtnRow style={{paddingTop: 21}}>
                <Divider/>
                <ActionsBarTextStyled>Вы уверены?</ActionsBarTextStyled>

                <Btn intent="danger" onClick={removeStickerPackHandler}>{isDeleting === 'inProgress' ? <Spinner size={24}/> : 'Да, удалить!'}</Btn>
                <Btn onClick={() => setIsDeleting('')} disabled={!stickersList.length}>Отмена</Btn>
            </BtnRow>
            :   // Кнопки коллекции стикеров (по умолчанию)
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
                             title={isPublished ? 'Набор стикеров опубликован. Нажмите, чтобы скрыть': 'Набор стикеров сейчас скрыт. Нажмите, чтобы опубликовать'}>
                            {isPublished ? <IconEye/> : <IconEyeOff2/>}
                        </Btn>
                        <Btn onClick={() => setIsIconSelect(!isIconSelect)} disabled={!stickersList.length} intent={isIconSelect ? 'warning' : ''}>Выбрать иконку</Btn>
                        <Divider/>
                        {
                            isIconSelect ?
                                <ActionsBarTextStyled>Выберите стикер, который будет иконкой коллекции</ActionsBarTextStyled>
                                : <>
                                    <Btn onClick={()=>showAddStickersModalAction(true)} icon={<IconEye/>}><IconAddPhoto/>&nbsp;Добавить стикеры</Btn>
                                    <Btn onClick={() => setIsEdit(true)} disabled={!stickersList.length}>Редактировать</Btn>
                                    <Btn onClick={removeStickerPackHandler}>Удалить набор</Btn>
                                </>
                        }
                    </BtnRow>
                </Col>
            </Row>
        }
        <HRStyled/>
        <Library
            items={stickersList}
            disabled={false}
            selectionActive={isEdit}
            sortable={isEdit}
            selectAction={selectActionHandler}
// @ts-ignore
            onSortEnd={onSortEndHandler}
            axis={'xy'}
        />
    </>;
};

export default AdminCurrentStickerPack;
