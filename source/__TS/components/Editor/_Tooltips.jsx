import React from "react";
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles'


const TooltipStyled = styled('div')`
  display: flex;
  align-self: center;
  flex-direction: column;
  text-align: center;
`;
const Circle = styled('span')`
  border-radius: 100%;
  display: inline-block;
  width: 10px;
  height: 10px;
`;
const YellowCircle = styled( Circle )`
  background: ${COLORS.WARNING};
`;
const RedCircle = styled( Circle )`
    background: ${COLORS.DANGER};
`;

const tooltipWarningText = <TooltipStyled>
                                <div>Фотография отмеченная желтым кругом <YellowCircle/> слишком растянута.</div>
                                <div>Возможно плохое качество при печати!</div>
                            </TooltipStyled>
const tooltipDangerText = <TooltipStyled>
                                <div>Фотография отмеченная красным кругом <RedCircle/> имеет низкое разрешение и очень сильно растянута!</div>
                                <div>Печать такой фотографии <b>НЕ ВОЗМОЖНА!</b></div>
                                <div>Уменьшите фотографию или удалите ее с листа!</div>
                            </TooltipStyled>

export { tooltipWarningText, tooltipDangerText }

