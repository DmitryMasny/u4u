import React, {memo, forwardRef} from 'react';

import {Input as StyledInput} from 'const/styles';
import {FormGroup, Tooltip} from "components/_forms";


/**
 * Текстовое поле
 */
const TextArea = memo(forwardRef(({
                      className,
                      disabled,
                      error,
                      helperText,
                      intent,
                      label,
                      large,
                      name,
                      onChange,
                      onFocus,
                      placeholder,
                      small,
                      value,
                      growVertically,
                      maxLength,
                      rows
                  },  inputRef) => {


    // const handleChange = (e) => {
    //     if (growVertically) {
    //         setHeight(e.target.scrollHeight);
    //     }
    //     if (onChange) {
    //         onChange(e);
    //     }
    // };
    //
    // const style = height ? {
    //     height: height
    // } : null;


    return <FormGroup className={className} label={label} name={name} helperText={helperText}>
        <Tooltip tooltip={error} tooltipShown={!!error} intent={ error ? 'danger' : intent} placement="top">
            <StyledInput
                textarea
                intent={error ? 'danger' : intent}
                disabled={disabled}
                small={small}
                large={large}
            >
                <textarea
                    id={name}
                    value={value}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    onFocus={onFocus}
                    disabled={disabled}
                    ref={inputRef}
                    rows={rows || 2}
                    maxLength={maxLength}
                    // style={style}
                />
            </StyledInput>
        </Tooltip>

    </FormGroup>;
}));

export default TextArea;


