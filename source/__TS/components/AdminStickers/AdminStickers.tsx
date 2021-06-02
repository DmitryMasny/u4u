// @ts-ignore
import React, { useState, useEffect, memo, useCallback } from 'react';

// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {Page} from "components/Page";
// @ts-ignore
import OnlyAuth from 'hoc/OnlyAuth';
// @ts-ignore
import { Btn } from 'components/_forms';

import AdminStickerPacksPanel from './_AdminStickerPacksPanel';
import AdminCurrentStickerPack from './_AdminCurrentStickerPack';
import ModalCreateStickerPack from './_ModalCreateStickerPack';
import ModalStickerPreview from './_ModalStickerPreview';
import ModalStickerMove from './_ModalStickerMove';
import ModalConstrainProportions from './_ModalConstrainProportions';


/** Selectors */
import {
    adminStickersSelector,
    adminCurrentStickerPackIdSelector,
} from "./selectors";

/** Actions */
import {
    selectStickerAction,
    createStickerPackAction,
    selectStickerPackAction,
    sortStickerPackAction,
    addUploadedStickersAction,
} from "../../actions/admin/adminStickers";

import {uploadSticker} from '../../libs/upload';


/** Interfaces */
import {IadminStickers, IadminStickersList, IcurrentStickerPack} from "../../interfaces/admin/adminStickers";

/** Styles */
import {
    AdminPageStyled,
    AdminHeaderStyled,
    AdminPageHeader,
    Divider
} from "../../styles/admin";



/**
 * Страница админки стикеров
 */
const AdminStickers: React.FC<IadminStickers> = () => {
    // const isMobile: boolean = useSelector( windowIsMobileSelector );

// @ts-ignore
    const adminStickers: IadminStickersList[] = useSelector( adminStickersSelector );

    const currentStickerPackId: string = useSelector( (state)=>adminCurrentStickerPackIdSelector(state) );
    //const currentStickerPack: IcurrentStickerPack = useSelector( (state)=>adminCurrentStickerPackSelector(state) );

    const [showCreateStickerPackModal, setShowCreateStickerPackModal] = useState(false);
    const [showStickerModal, setShowStickerModal] = useState(null);
    const [showMoveStickerPackModal, setShowMoveStickerPackModal] = useState(null);
    const [showConstrainProportionsModal, setShowConstrainProportionsModal] = useState(null);
    const [isSortStickerPacks, setIsSortStickerPacks] = useState(false);

    useEffect(() => {
        if (adminStickers && adminStickers.length) selectStickerPackAction(adminStickers[0].id);
    }, [adminStickers]);


    const createStickerPackHandler = useCallback((name) => {
        createStickerPackAction(name);
    }, []);

    const showConstrainProportionsHandler = useCallback((o) => {
        setShowConstrainProportionsModal(o || true);
    }, []);

    const toggleAddStickersModalHandler = useCallback((show) => {
        if (show) uploadSticker({packId: currentStickerPackId, acceptFormats: ['png']}).then((data)=>{
            addUploadedStickersAction(currentStickerPackId, data);
        }).catch( ( err ) => {
            console.error( 'ERROR ', err );
        } );

    }, [currentStickerPackId]);

    const showMoveStickerHandler = useCallback((o) => {
        setShowMoveStickerPackModal(o);
    }, [currentStickerPackId]);

    // Выбор стикера (в зависимости от режима - просмотр или выделение)
    const onSelectHandler = useCallback((o) => {
        if (!o) return null;
        if (o.showPreview) {
            setShowStickerModal(o.data);    // превью
        } else selectStickerAction({           // выделить
            packId: currentStickerPackId,
            // @ts-ignore
            id: o.data && o.data.id,
            selected: !o.data.selected
        });
    }, [currentStickerPackId]);

    // Сортировка стикерпаков
    const onSortEndHandler = useCallback(({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) return null;
        sortStickerPackAction({adminStickers, oldIndex, newIndex});
    }, [adminStickers]);

    // console.log('adminStickers',adminStickers);
// console.log('currentStickerPack',currentStickerPack);
    return <OnlyAuth onlyAdmin>
        {/*// @ts-ignore*/}
        <Page>
            <AdminPageStyled>
                {/*ШАПКА*/}
                <AdminPageHeader>
                    <div className="label">
                        Редактирование наборов стикеров
                    </div>
                    <Divider/>
                    <Btn onClick={()=>setIsSortStickerPacks(!isSortStickerPacks)}
                         disabled={!adminStickers || !adminStickers.length}
                         intent={isSortStickerPacks ? 'warning' : ''}
                    >
                        {isSortStickerPacks ? 'Сортировка' : 'Сортировать'}
                        </Btn>
                    <Btn onClick={()=>setShowCreateStickerPackModal(true)}>Добавить набор</Btn>
                </AdminPageHeader>

                {/*НАБОРЫ СТИКЕРОВ*/}
                <AdminStickerPacksPanel onSelect={selectStickerPackAction} onSortEnd={onSortEndHandler} list={adminStickers} activeId={currentStickerPackId} sort={isSortStickerPacks}/>

                {/*КОНКРЕТНЫЙ НАБОР СТИКЕРОВ*/}
                <AdminCurrentStickerPack onSelectStickerAction={onSelectHandler}
                                         showMoveStickersModalAction={showMoveStickerHandler}
                                         showConstrainProportionsAction={showConstrainProportionsHandler}
                                         showAddStickersModalAction={toggleAddStickersModalHandler}
                />

            </AdminPageStyled>
        </Page>

        {/*Модалка создания нового стикерпака*/}
        <ModalCreateStickerPack isOpen={showCreateStickerPackModal}
                                closeCallback={()=>setShowCreateStickerPackModal(false)}
                                createStickerPackAction={createStickerPackHandler}
        />
        {/*Просмотр стикера*/}
        <ModalStickerPreview isOpen={!!showStickerModal}
                             closeCallback={()=>setShowStickerModal(null)}
                             showMoveStickerAction={showMoveStickerHandler}
                             data={showStickerModal}
        />
        {/*Модалка загрузки стикеров*/}
        {/*<ModalAddStickers isOpen={showAddStickersModal}*/}
                          {/*closeCallback={toggleAddStickersModalHandler}*/}
                          {/*packId={currentStickerPackId}*/}

        {/*/>*/}
        {/*Модалка выбора коллекции (для перемещения стикера)*/}
        <ModalStickerMove isOpen={!!showMoveStickerPackModal}
                          closeCallback={()=>setShowMoveStickerPackModal(null)}
                          movedStickersList={showMoveStickerPackModal}
                          currentStickerPackId={currentStickerPackId}
                          createStickerPackAction={()=>setShowCreateStickerPackModal(true)}
        />
        {/*Модалка выбора правил сохранения пропорций стикера */}
        <ModalConstrainProportions isOpen={!!showConstrainProportionsModal}
                          closeCallback={()=>setShowConstrainProportionsModal(null)}
                          selectedList={showConstrainProportionsModal}
        />
    </OnlyAuth>;
};
// @ts-ignore
export default memo(AdminStickers);
