import React, {memo, useState} from "react";
import styled, {css} from 'styled-components'
import {COLORS} from "const/styles";
import {hexToRgbA} from "libs/helpers";
// import pSBC from 'shade-blend-color';
// import MEDIA from "config/media";
import {Btn, Checkbox, Input, RadioControl, Select} from "components/_forms";
import {IconClose, IconLib} from "components/Icons";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';


const StyledFlexTable = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 15px;
    padding-bottom: 10px;
    overflow-x: auto;
`;
const StyledTableRow = styled.div`
    display: flex;
    padding: 2px 0;
    border-radius: 2px;
    transition: box-shadow .2s ease-out;
    background-color: #fff;
    body > & { // Стили на dnd
        box-shadow: 1px 3px 10px 1px ${hexToRgbA(COLORS.WARNING, .2)};
        .cell {
            &.move {
                fill: ${COLORS.TEXT_WARNING};
                &:hover{
                    fill: ${COLORS.TEXT_WARNING}
                }
            }
        }
    }
    &:hover {
        background-color: ${ ({deleting, headRow}) => headRow ? 'transparent' : hexToRgbA(deleting ? COLORS.DANGER : COLORS.INFO, .1)};
    }
    .cell {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        padding: 0 5px;
        ${ ({headRow}) => headRow && css`
            padding-bottom: 5px;
            font-weight: 600;
        `};
        &>div {
            max-width: 100%;
        }
        &.removeBtn {
            justify-content: flex-end;
            flex-grow: 1;
        }
        &.move {
            width: 40px;
            cursor: move;
            transition: fill .1s ease-out;
            &:hover{
                fill: ${COLORS.TEXT_PRIMARY}
            }
        }
        .textCell {
            font-weight: 200;
            font-size: 14px;
            color: ${COLORS.MUTE}
        }
    
    }
    .noMargin {
        margin: 0;
    }   
    .mr {
        margin-right: 10px;
    }
`;


const AdminTable = SortableContainer(memo(({head, row, data, sortable, onChange, onRemoveRow ,errors, clearError}) => {
    if (!data || !row) return null;

    return <StyledFlexTable>
        <StyledTableRow headRow>
            {sortable && <div className="cell" style={{width: 40}}/>}
            {head.length && head.map((item, i) =>
                <div className="cell" style={{width: item.width}} key={'head' + i}>
                    {item.title}
                </div>)
            }
        </StyledTableRow>
        {data.length && data.map((dataItem, k) => <AdminTableRow dataItem={dataItem}
                                                                 sortable={sortable}
                                                                 disabled={!sortable}
                                                                 row={row}
                                                                 head={head}
                                                                 onChange={(data) => onChange && onChange(data, k)}
                                                                 errors={errors && errors.find((item)=> item.id === dataItem.id)}
                                                                 clearError={clearError}
                                                                 removeAction={()=>onRemoveRow(k)}
                                                                 index={k} key={k}/>)
        }
    </StyledFlexTable>;
}));

const AdminTableRow = SortableElement(memo(({dataItem, sortable, row, head, errors = {}, clearError, onChange, removeAction}) => {
    const [deleting, setDeleting] = useState(false);
    const [moving, setMoving] = useState(false);
    if (!dataItem || dataItem.deleted) return null;

    return <StyledTableRow deleting={deleting} moving={moving}>
        {sortable && <AdminTableSortHandle setMoving={setMoving}/>}
        {row.length && row.map((cellItem, i) =>
            <div className="cell" style={{width: head[i] && head[i].width}} key={'cell' + i}>
                <CellItem item={cellItem}
                          value={dataItem[cellItem.name]}
                          id={dataItem.id}
                          onChange={(data)=>onChange(data)}
                          error={errors[cellItem.name]}
                          clearError={clearError}
                          placeholder={head[i] && head[i].title}
                />
            </div>)
        }
        <div className="cell removeBtn">
            <Btn small intent="minimal-danger" onClick={removeAction} onMouseEnter={()=>setDeleting(true)} onMouseLeave={()=>setDeleting(false)}><IconClose/></Btn>
        </div>
    </StyledTableRow>;
}));


const CellItem = memo(({item, id, value, onChange, removeRowAction, placeholder, error, clearError}) => {
    if (!item) return null;

    switch (item.type) {
        case 'btn':
            return <Btn small onClick={() => item.action && item.action(id)}>{item.title}</Btn>;

        case 'checkbox':
            return <Checkbox checked={value} onChange={(value) => onChange({[item.name]: value})}/>;

        case 'input':
            return <Input value={value || (item.format === 'number' ? 0 : '')}
                          onChange={(e) => onChange({[item.name]: (item.format === 'number') ? parseFloat(e.target.value || 0) : e.target.value})}
                          placeholder={placeholder}
                          className="noMargin"
                          error={error}
                          onFocus={() => error && clearError && clearError(id, item.name)}
            />;

        case 'radio':
            return <RadioControl onClick={() => onChange({[item.name]: true, isRadio: true})}
                                 active={value}
                                 value={id}
            />;

        case 'select':
            const list = item.list && typeof item.list === 'function' ? item.list(value) : item.list;
            return <Select list={list}
                           onSelect={(index)=>onChange({ [item.name]: list[index].id })}
                           error={error}
                           onFocus={()=> error && clearError && clearError( id, item.name)}
                           selected={list.findIndex((it)=>it.id === value) || 0}/>;
        case 'text':
            return <div className="textCell">{item.value || value}</div>;
    }
});

const AdminTableSortHandle = SortableHandle(() => {
    return <div className="cell move"><IconLib/></div>;
});

export default AdminTable;