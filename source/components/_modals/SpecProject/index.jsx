import React, { useEffect, useContext, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import TEXT_MAIN from 'texts/main';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';

import { setSpecProjectAction } from './actions';
import { specProjectSelector } from "components/_pages/GalleryPage/selectors";
import {Input} from "components/_forms";

/**
 * Спецпроект
 */
const SpecProjectModal = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const dispatch = useDispatch();
    const specInput = useRef(null);
    const specProject = useSelector(specProjectSelector);
    const [specValue, setSpecValue] = useState(specProject || '');


    const handleInputChange = ( event ) => {
        setSpecValue(event.target.value);
    };
    const handlerSetCode = (value) => {
        dispatch(setSpecProjectAction( value.trim().toUpperCase() ));
        closeModal();
    };

    useEffect(() => {
        specInput && specInput.current.focus();
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, action: closeModal},
                {type: TYPES.BTN, text: TEXT_MAIN.APPLY, action: () => handlerSetCode(specValue), primary: true},
            ]
        });
    },[specValue, specInput]);


    return <Input name="specValue"
                  value={specValue}
                  onChange={handleInputChange}
                  ref={specInput}
    />;
};

export default SpecProjectModal;