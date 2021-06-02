import React, {useEffect, useState, memo} from 'react';

import { IconCheck } from "components/Icons";
import { Checkbox as StyledCheckbox } from 'const/styles';


export default memo( ( { checked: checkedProp, onChange, className, disabled, label, height = null, maxWidth = null, display, intent } ) => {

    const [checked, setChecked] = useState( false );

    useEffect(() => {
        setChecked( !!checkedProp );
    }, [checkedProp] );


    const handlerClick = () => {
        onChange && onChange(!checked);
        setChecked(!checked);
    };

    return <StyledCheckbox className={className} onClick={handlerClick} active={checked} disabled={disabled} height={height} maxWidth={maxWidth} display={display} intent={intent}>
                <div className="control box">
                    <IconCheck className="icon" />
                </div>
                {label ? <span className="label">{label}</span> : null}
           </StyledCheckbox>;

});
