import React from 'react';
import s from './footer.scss';

// import { ControlGroup, InputGroup } from 'bp';
import { Btn } from 'components/_forms';


const SubsriptionForm = props => {
    return (
        <div className={s.menuItem}>
            <input placeholder="Ваш e-mail"/>
            <Btn intent="primary">Подписаться</Btn>
        </div>
    );
    // return (
    //     <ControlGroup className={s.menuItem}>
    //         <InputGroup placeholder="Ваш e-mail"/>
    //         <BtnPrimary intent="primary">Подписаться</BtnPrimary>
    //     </ControlGroup>
    // );
};

export default SubsriptionForm;
