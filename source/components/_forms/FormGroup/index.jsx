import React, {useState} from 'react';

import styled, {css} from 'styled-components';
import {COLORS} from 'const/styles';
import {hexToRgbA} from "libs/helpers";

/** Styles */
const StyledFormGroup = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  flex-direction: column;
  margin: ${({noMargin})=>noMargin ? 0 : '0 0 15px' };
  font-size: 0;
  &>.label {
    margin-bottom: 5px;
    font-weight: 200;
    line-height: 1em;
    font-size: 16px;
  }
  .helperText {
    margin-top: 5px;
    color: ${COLORS.TEXT_MUTE};
    font-size: 14px;
  }
  .formContent {
      display: flex;
      width: 100%;
  }

  ${({intent})=>{ if (intent) {
      switch (intent) {
          case 'primary': return css`
              color: ${COLORS.TEXT_PRIMARY}
            `;
          case 'success': return css`
              color: ${COLORS.TEXT_SUCCESS}
            `;
          case 'warnind': return css`
              color: ${COLORS.TEXT_WARNING}
            `;
          case 'danger': return css`
              color: ${COLORS.TEXT_DANGER}
            `;
          case 'info': return css`
              color: ${COLORS.TEXT_INFO}
            `;
      }
} }};
  ${({disabled})=> disabled && css`color: ${COLORS.TEXT_MUTE}`};
  ${({inline})=> inline && css`
    flex-direction: row;
    align-items: center;
    &>.label {
        margin-bottom: 0;
        margin-right: 10px;
    }
    &>.helperText {
        margin-top: 0;
        margin-left: 10px;
        font-size: 16px;  
        font-weight: 200;
        line-height: 1em;
        color: ${COLORS.TEXT_MUTE};
    }
    `};
`;


/**
 * Выпадающий список
 */
const FormGroup = ({label, name, className, children, helperText, inline, intent, disabled,  onClick, noMargin}) => {

    return <StyledFormGroup className={className} intent={intent} inline={inline} disabled={disabled} onClick={onClick} noMargin={noMargin}>
        {label && <label className="label" htmlFor={name}>{ label }</label>}
        {children}
        {helperText && <div className="helperText">{helperText}</div>}
    </StyledFormGroup>;
};

export default FormGroup;


