import React, { forwardRef, useRef, memo, useState, useEffect } from 'react';

import {FormGroup, Tooltip} from "components/_forms";
import {Input as StyledInput} from 'const/styles';
import { IconEdit, IconCheck, IconClose } from 'components/Icons';
import { Btn } from 'components/_forms';
import { useKeyPress } from 'libs/hooks';
import Spinner from "components/Spinner";


function useCombinedRefs(...refs) {
    const targetRef = useRef(null);

    React.useEffect(() => {
        refs.forEach(ref => {
            if (!ref) return null;

            if (typeof ref === 'function') {
                ref(targetRef.current)
            } else {
                ref.current = targetRef.current
            }
        })
    }, [refs]);

    return targetRef
}

/**
 * Input
 */
const Input = memo(forwardRef((props, ref) => {
    const {
        autoComplete,
        className,
        disabled,
        error,
        helperText,
        intent,
        label,
        large,
        leftEl,
        name,
        onChange,
        onFocus,
        onBlur,
        placeholder,
        rightEl,
        small,
        type,
        value,
        id,
        autoFocus,
        latent,
        noMargin,
        update = 0,
        inline,
        maxLength = 0
    } = props;

    const InputWrapRef = useRef(null);
    const innerRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, innerRef);

    const [isEditing, setIsEditing] = useState(false);          // для latent - редактируется ли поле
    const [editedValue, setEditedValue] = useState(value || '');// для latent - редактируемый текст в инпуте
    const [loading, setLoading] = useState(false);              // для latent - true если текст в инпуте обновляется
    const [maxLengthReached, setMaxLengthReached] = useState(false);  // достигнута максимальная длина символов


    useEffect(() => {
        if (latent) {
            if (isEditing) {
                combinedRef.current.focus();
            } else combinedRef.current.blur();
        }
    },[isEditing]);

    useEffect(() => {
        if (autoFocus) {
            if (combinedRef && combinedRef.current) combinedRef.current.focus();
        }
    },[]);

    useEffect(() => {
        if (latent) {
            if (value !== editedValue) setEditedValue(value);
            if (loading) setLoading(false);
            if (isEditing) setIsEditing(false);
        }
    },[value, update]);

    const onChangeHandler = (e) => {
        if (maxLength && e.target.value) {
            if (e.target.value.length < maxLength) {
                if (maxLengthReached) setMaxLengthReached(false);
            } else {
                if (e.target.value.length > maxLength) return null;
                if (e.target.value.length === maxLength) setMaxLengthReached(true);
            }

        }
        if (latent) {   // Для латентных меняем значения внутри этого компонента, и прокидываем в родитель по кнопке Применить
            setEditedValue(e.target.value);
        } else  if (onChange) onChange(e);
    };
    const onFocusHandler = (e) => {
        if (latent) latentEditAction();
        if (onFocus) onFocus(e);
    };
    const onBlurHandler = (e) => {
        if (maxLengthReached) setMaxLengthReached(false);
        if (latent) latentCancelAction();
        if (onBlur) onBlur(e);
    };
    const latentEditAction = () => {
        if (isEditing) return null;
        setIsEditing(true);
    };

    const latentAcceptAction = () => {
        setLoading(true);
        if (onChange) onChange(editedValue);
        setIsEditing(false);
    };
    const latentCancelAction = () => {
        setEditedValue(value);
        setIsEditing(false);
    };

    const maxLengthError = (maxLengthReached && !error) ? `Достигнута максимальная длина - ${maxLength} знаков` : false;

    return <FormGroup noMargin={latent || noMargin} className={className} label={label} name={name} helperText={helperText} inline={inline}>
        <Tooltip tooltip={error || maxLengthError} tooltipShown={!!error || maxLengthError} intent={error ? 'danger' : maxLengthError ? 'warning' : intent} placement="top">
            <StyledInput
                intent={error ? 'danger' : maxLengthError ? 'warning' : intent}
                disabled={disabled}
                leftEl={leftEl}
                rightEl={rightEl}
                small={small}
                large={large}
                latent={latent && !isEditing}
                isLoading={loading}
                ref={InputWrapRef}
            >
                {leftEl && React.cloneElement(leftEl, { className: "leftEl", disabled: disabled })}

                {latent && <div onClick={disabled ? null : latentEditAction} className="latentText" >
                    {editedValue} {disabled ? null : loading ? <Spinner light className="loader" size={24} delay={200}/> : <IconEdit className="btnEdit"/>}
                </div> || null}

                <input
                    id={id || name}
                    type={type || 'text'}
                    value={latent ? editedValue : value}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChangeHandler}
                    onFocus={onFocusHandler}
                    onBlur={onBlurHandler}
                    autoComplete={autoComplete}
                    disabled={disabled || loading}
                    ref={combinedRef}
                />

                { isEditing ?
                    loading ?
                        <div className="rightEl loading"><Spinner size={24} delay={0}/></div>
                            :
                        <div className="rightEl latent">
                            <Btn small iconed intent="minimal" onMouseDown={latentAcceptAction} onTouchStart={latentAcceptAction}><IconCheck/></Btn>
                            <Btn small iconed intent="minimal-danger" ><IconClose/></Btn>
                            <KeyListener acceptAction={latentAcceptAction} cancelAction={latentCancelAction}/>
                        </div>
                    :
                    (rightEl && React.cloneElement(rightEl, { className: "rightEl", disabled: disabled }))
                }
            </StyledInput>
        </Tooltip>

    </FormGroup>;
}));

const KeyListener = ({acceptAction, cancelAction}) => {
    const enterPress = useKeyPress(13);
    const escapePress = useKeyPress(27);

    useEffect(() => {
        if (enterPress && acceptAction) acceptAction();
        if (escapePress && cancelAction) cancelAction();
    },[enterPress, escapePress]);

    return null;
};

export default Input;


