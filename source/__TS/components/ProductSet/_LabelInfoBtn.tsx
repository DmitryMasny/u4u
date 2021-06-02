// @ts-ignore
import React from 'react';
import styled from 'styled-components';
// @ts-ignore
import { IconRotateL, IconRotateR, IconHelp } from 'components/Icons';
// @ts-ignore
import {Btn, Tooltip, Select} from "components/_forms";


/** Interfaces */
interface Props {
    data: any;
}

const StyledTooltipText = styled('div')`
    display: flex;
    flex-direction: column;
    max-width: 400px;
    .item {
        padding: 5px 10px;
    }
`;


/**
 * Кнопка подсказка к опции
 */
const LabelInfoBtn: React.FC<Props> = ({ data }) => {
    const tooltip = data.map((p, i)=><StyledTooltipText key={i}>
        <div className="item"><b>{p.name}</b> {p.description && <span>- {p.description}</span>} { !!p.price && <i>- {p.price}руб.</i>}</div>
    </StyledTooltipText>);

    return <Tooltip tooltip={tooltip}>
        <Btn intent="minimal" small iconed><IconHelp intent={'info'} size={18}/></Btn>
    </Tooltip>
};

export default LabelInfoBtn;