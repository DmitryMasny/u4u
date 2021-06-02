// @ts-ignore
import React from 'react';
import styled from 'styled-components';
// @ts-ignore
import { IconRotateL, IconRotateR, IconHelp } from 'components/Icons';
// @ts-ignore
import {Btn, Tooltip, Select} from "components/_forms";
// @ts-ignore
import {COLORS} from "const/styles";


/** Interfaces */
interface Props {
    format: any;
}

const StyledFormatFiltersName = styled('div')`
    text-align:center;
    font-size: 13px;
    .size{
      font-size: 12px;
      color: ${COLORS.NEPAL};
    }
    // выбранная в выпадающем списке
    .selectedTitle & {
      display: flex;
      justify-content: center;
      font-size: 16px;
        .size{
          font-size: 14px;
          margin-left: 10px;
        }
    }
`;

/**
 * Название формата
 */
const FormatTitle: React.FC<Props> = ({ format }) => (
    <StyledFormatFiltersName>
        {format.name}
        <div className="size">({format.width} x {format.height})</div>
    </StyledFormatFiltersName>);

export default FormatTitle;