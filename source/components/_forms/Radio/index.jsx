import React, {useEffect, useState} from 'react';

import {StyledRadio} from 'const/styles';
import { FormGroup } from 'components/_forms';


const Radio = ({selectedValue, onChange, className, name, disabled, label, options, inline}) => {

    const [selected, setSelected] = useState(selectedValue || options[0].value);

    useEffect(() => {
        if (selected !== selectedValue ) setSelected(selectedValue);
    }, [selectedValue]);

    const handlerClick = (value) => {
        onChange && onChange({
            target: {
                name: name,
                value: value
            }
        });
        setSelected(value);
    };

    return <FormGroup className={className} label={label} >
        {options && <div className="formContent">
            {options.map((item)=><RadioControl onClick={handlerClick}
                                               active={selected === item.value}
                                               inline={inline}
                                               value={item.value}
                                               label={item.label}
                                               disabled={disabled}
                                               key={item.value}
            />)}
        </div>}
    </FormGroup>;

};
export const RadioControl = ({onClick, active, label, value, disabled, inline }) => {
    return <StyledRadio onClick={()=> !disabled && onClick(value)} active={active} disabled={disabled} inline={inline}>
        <div className="control radio"/>
        <span className="label">{label}</span>
    </StyledRadio>;
};

export default Radio;
