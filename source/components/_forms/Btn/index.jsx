import React from 'react';

import {Btn as StyledBtn} from 'const/styles';

/**
 * Кнопка
 * { onClick, className, disabled, intent, children, large, small, fill }
 */
const Btn = (props) => {
    const {children, fill, ...others} = props;
    return <StyledBtn {...others} widthFill={fill} >
                {children}
           </StyledBtn>
};

export default Btn;
