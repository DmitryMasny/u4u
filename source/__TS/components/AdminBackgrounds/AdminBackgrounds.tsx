// @ts-ignore
import React, { useState, useEffect, memo, useCallback } from 'react';
// @ts-ignore
import { withRouter } from 'react-router-dom';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {Page} from "components/Page";
// @ts-ignore
import OnlyAuth from 'hoc/OnlyAuth';
// @ts-ignore
import { Btn } from 'components/_forms';

import AdminBackgroundPacksPanel from './_AdminBackgroundPacksPanel';
import AdminCurrentBackgroundPack from './_AdminCurrentBackgroundPack';
import ModalCreateBackgroundPack from './_ModalCreateBackgroundPack';
import ModalBackgroundPreview from './_ModalBackgroundPreview';
import ModalBackgroundMove from './_ModalBackgroundMove';


/** Selectors */
import {
    adminBackgroundsSelector,
    adminCurrentBackgroundPackIdSelector,
    adminBackgroundsConfigSelector
} from "./selectors";

/** Actions */
import {
    selectBackgroundAction,
    createBackgroundPackAction,
    selectBackgroundPackAction,
    sortBackgroundPackAction,
    addUploadedBackgroundsAction,
} from "../../actions/admin/adminBackgrounds";

import {uploadBackground} from '../../libs/upload';


/** Interfaces */
import {IadminBackgrounds, IadminBackgroundsList} from "../../interfaces/admin/adminBackgrounds";

/** Styles */
import {
    AdminPageStyled,
    AdminPageHeader,
    Divider
} from "../../styles/admin";



/**
 * Страница админки фонов
 */
const AdminBackgrounds: React.FC<IadminBackgrounds> = () => {

    const adminBackgrounds: IadminBackgroundsList[] | boolean = useSelector( adminBackgroundsSelector );
    const backgroundsConfig: any = useSelector( adminBackgroundsConfigSelector );
    const currentBackgroundPackId: string = useSelector( (state)=>adminCurrentBackgroundPackIdSelector(state) );

    const [showCreateBackgroundPackModal, setShowCreateBackgroundPackModal] = useState(false);
    const [showBackgroundModal, setShowBackgroundModal] = useState(null);
    const [showMoveBackgroundPackModal, setShowMoveBackgroundPackModal] = useState(null);
    // const [showBackgroundPositionModal, setShowBackgroundPositionModal] = useState(null);
    const [isSortBackgroundPacks, setIsSortBackgroundPacks] = useState(false);

    useEffect(() => {
        if (adminBackgrounds && Array.isArray(adminBackgrounds) && adminBackgrounds[0]) selectBackgroundPackAction(adminBackgrounds[0].id);
    }, [adminBackgrounds]);
//console.log('adminBackgrounds',adminBackgrounds);
//console.log('backgroundsConfig',backgroundsConfig);

    const createBackgroundPackHandler = useCallback((name) => {
        createBackgroundPackAction(name);
    }, []);

    const showConstrainProportionsHandler = useCallback((o) => {
        // setShowBackgroundPositionModal(o || true);
    }, []);

    const toggleAddBackgroundsModalHandler = useCallback((show) => {
        //console.log('show',show);
        if (show) uploadBackground({
            packId: currentBackgroundPackId,
            acceptFormats: ['png', 'jpg', 'jpeg'],
            config: backgroundsConfig,
        }).then((data)=>{
            //console.log('then data bg',data);
            addUploadedBackgroundsAction(currentBackgroundPackId, data, backgroundsConfig);
        }).catch( ( err ) => {
            console.error( 'ERROR ', err );
        } );

    }, [currentBackgroundPackId, backgroundsConfig]);

    const showMoveBackgroundHandler = useCallback((o) => {
        setShowMoveBackgroundPackModal(o);
    }, [currentBackgroundPackId]);

    // Выбор фона (в зависимости от режима - просмотр или выделение)
    const onSelectHandler = useCallback((o) => {
        if (!o) return null;
        if (o.showPreview) {
            setShowBackgroundModal(o.data);    // превью
        } else selectBackgroundAction({           // выделить
            packId: currentBackgroundPackId,
            // @ts-ignore
            id: o.data && o.data.id,
            selected: !o.data.selected
        });
    }, [currentBackgroundPackId]);

    // Сортировка коллекций фонов
    const onSortEndHandler = useCallback(({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) return null;
        sortBackgroundPackAction({adminBackgrounds, oldIndex, newIndex});
    }, [adminBackgrounds]);


    return <OnlyAuth onlyAdmin>
        {/*// @ts-ignore*/}
        <Page>
            <AdminPageStyled>
                {/*ШАПКА*/}
                <AdminPageHeader>
                    <div className="label">
                        Администрирование фонов
                    </div>
                    <Divider/>
                    <Btn onClick={()=>setIsSortBackgroundPacks(!isSortBackgroundPacks)}
                         disabled={!adminBackgrounds || !Array.isArray(adminBackgrounds) || adminBackgrounds.length < 2}
                         intent={isSortBackgroundPacks ? 'warning' : ''}
                    >
                        {isSortBackgroundPacks ? 'Сортировка' : 'Сортировать'}
                    </Btn>
                    <Btn onClick={()=>setShowCreateBackgroundPackModal(true)}>Добавить набор</Btn>
                </AdminPageHeader>

                {/*НАБОРЫ ФОНОВ*/}
                <AdminBackgroundPacksPanel onSelect={selectBackgroundPackAction} onSortEnd={onSortEndHandler} list={adminBackgrounds} activeId={currentBackgroundPackId} sort={isSortBackgroundPacks}/>

                {/*КОНКРЕТНЫЙ НАБОР ФОНОВ*/}
                <AdminCurrentBackgroundPack onSelectBackgroundAction={onSelectHandler}
                                         showMoveBackgroundsModalAction={showMoveBackgroundHandler}
                                         showConstrainProportionsAction={showConstrainProportionsHandler}
                                         showAddBackgroundsModalAction={toggleAddBackgroundsModalHandler}
                />

            </AdminPageStyled>
        </Page>

        {/*Модалка создания новой коллекции фонов*/}
        <ModalCreateBackgroundPack isOpen={showCreateBackgroundPackModal}
                                closeCallback={()=>setShowCreateBackgroundPackModal(false)}
                                createBackgroundPackAction={createBackgroundPackHandler}
        />
        {/*Просмотр фона*/}
        <ModalBackgroundPreview isOpen={!!showBackgroundModal}
                             closeCallback={()=>setShowBackgroundModal(null)}
                             showMoveBackgroundAction={showMoveBackgroundHandler}
                             data={showBackgroundModal}
                             config={backgroundsConfig}
        />
        {/*Модалка выбора коллекции (для перемещения фона)*/}
        <ModalBackgroundMove isOpen={!!showMoveBackgroundPackModal}
                          closeCallback={()=>setShowMoveBackgroundPackModal(null)}
                          movedBackgroundsList={showMoveBackgroundPackModal}
                          currentBackgroundPackId={currentBackgroundPackId}
                          createBackgroundPackAction={()=>setShowCreateBackgroundPackModal(true)}
        />
    </OnlyAuth>;
};
// @ts-ignore
export default memo(AdminBackgrounds);
