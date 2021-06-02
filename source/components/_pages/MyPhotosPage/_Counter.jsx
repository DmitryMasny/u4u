import React from 'react';

import styled from 'styled-components'
import {COLORS} from 'const/styles';
import Tooltip from '__TS/components/_misc/Tooltip/Tooltip'

const CounterStyled = styled( 'div' )`
    margin: 0 5px;
    display: flex;
    .item {
      height: 36px;
      text-align: center;
      display: flex;
      flex-direction: column;
      padding: 2px 5px;
      border-right: 2px solid #fff;
      background-color: #dcf0f9;
      color: ${COLORS.TEXT_INFO};
      &.selected {
        border-radius:  4px 0 0 4px; 
        background-color: ${ ({ isAllSelected, isAllShowed }) => isAllSelected ? isAllShowed ? '#d9f5b5' : '#dcf0f9' : COLORS.ATHENSGRAY };
        color: ${ ({ isAllSelected, isAllShowed }) => isAllSelected ? isAllShowed ? COLORS.TEXT_SUCCESS : COLORS.TEXT_INFO : COLORS.TEXT_MUTE };
      }
      &.showed {
        background-color: ${ ({isAllShowed}) => isAllShowed ? '#d9f5b5' : '#dcf0f9' };
        color: ${ ({ isAllShowed }) => isAllShowed ? COLORS.TEXT_SUCCESS : COLORS.TEXT_INFO };
      }
      &.total {
        border-radius: 0 4px 4px 0;
        background-color: ${ ({isAllShowed}) => isAllShowed ? '#d9f5b5' : '#f9e9dc' };
        color: ${ ({ isAllShowed }) => isAllShowed ? COLORS.TEXT_SUCCESS : COLORS.TEXT_WARNING };
      }
    }
    .value {
      font-size: 18px;
      line-height: 20px;
    }
    .label {
      font-size: 10px;
    }
`;

export const Counter = ({ selected, showed, total }) => {
    return <CounterStyled isAllSelected={selected === showed} isAllShowed={showed === total}>
        <div className="item selected">
            <span className="value">{ selected }</span>
            <span className="label">выбрано</span>
        </div>
        <div className="item showed">
            <span className="value">{ showed }</span>
            <span className="label">показано</span>
        </div>
        <Tooltip placement="bottom" tooltip={'Фотографии подгружаются пачками по 50 штук. Чтобы подгрузить еще фотографии, нажмите на кнопку "Показать ещё"'}>
            <div className="item total">
                <span className="value">{ total }</span>
                <span className="label">всего</span>
            </div>
        </Tooltip>
    </CounterStyled>
}