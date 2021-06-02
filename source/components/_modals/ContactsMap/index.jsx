import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import YaMaps from 'components/YaMaps';

import TEXT_MAIN from 'texts/main';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';

const StyledText = styled.p`
    margin-top: 10px;
`;


/**
 * Создание и переименование папки
 */
const ContactsMap = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);

    useEffect(() => {
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeModal},
                {type: TYPES.DIVIDER},
            ]
        });
    },[]);

    return <div>
        <YaMaps />
        <StyledText>
            Около 5 минут пешком от метро «Улица 1905 года» или «Краснопресненская».<br/>
            Вход со двора, со стороны дома 26. Подъезд с вывеской "Нотариус" и табличкой U4U у входа.
        </StyledText>
    </div>;
};

export default ContactsMap;