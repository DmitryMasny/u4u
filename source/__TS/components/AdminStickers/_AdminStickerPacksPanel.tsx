// @ts-ignore
import React from 'react';

// @ts-ignore
import {Btn} from 'components/_forms'

import {
    IadminStickerPacksPanel,
    IadminStickerPacksPanelWrap,
    IadminStickersList
} from "../../interfaces/admin/adminStickers";
import {AdminListPanelStyled, AdminListItemStyled} from "../../styles/admin";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';


/** Interfaces */
interface IadminListItem extends IadminStickersList {
    onSelect: (id: string)=>any;
    active: boolean;
    disabled?: boolean;
    sortable: boolean;
}


/**
 * Панель выбора стикерпака
 */
const AdminStickerPacksPanel: React.FC<IadminStickerPacksPanel> = (props): any => {

    if (!props.list || !props.list.length) return props.isInModal ? <div style={{padding: 20}}>
        <h4>Нет подходящего набора, куда можно переместить стикеры</h4>
        <Btn intent="primary" onClick={props.createStickerPackAction}>Создать набор стикеров</Btn>
    </div> : null;
// @ts-ignore
    return <AdminStickerPacksPanelSortable {...props} axis={'xy'}/>
};
// @ts-ignore
const AdminStickerPacksPanelSortable: React.FC = SortableContainer( ( { activeId, onSelect, list, createStickerPackAction, isInModal, sort }: IadminStickerPacksPanel ) => {
    return <AdminListPanelStyled>
{/*
// @ts-ignore */}
        {list.map((item, i) => item && <AdminListItem disabled={!sort} sortable={sort} onSelect={onSelect} active={item.id === activeId} id={item.id} name={item.name} thumb={item.thumb} key={item.id} index={i}/>) || null}
    </AdminListPanelStyled>;
});
// @ts-ignore
const AdminListItem: React.FC = SortableElement( ( { id, name, thumb, onSelect, active = false, sortable }: IadminListItem ) => (
    <AdminListItemStyled sortable={sortable} className={`listItem ${active ? 'active' : ''}`} onClick={()=>onSelect(id)}>
        {thumb && (thumb.svg ?
            <div className="listItemIcon" dangerouslySetInnerHTML={{__html: thumb.svg}}/>
                : thumb.src ?
                <div className="listItemIcon">
                    <img src={thumb.src} alt=""/>
                </div>
                : null
        )}

        {name && <div className="listItemName" title={name}>
            {name}
        </div>}
    </AdminListItemStyled>));

export default AdminStickerPacksPanel;
