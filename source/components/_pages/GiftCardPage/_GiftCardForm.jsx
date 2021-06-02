import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';

import {Btn, Select, Input, TextArea, Checkbox} from "components/_forms";
import {COLORS} from 'const/styles'
import { userPersonalInfoSelector } from 'selectors/user';
import Spinner from 'components/Spinner';
import InputMask from "react-input-mask";


/**
 * Styles
 */
const StyledTextDisplayLettersLeft = styled.div`
    color: ${({danger})=> danger ? COLORS.TEXT_DANGER : COLORS.TEXT_INFO};
`;
const StyledTextAgree = styled.div`
    font-size: 14px;
    .link {
      color: ${COLORS.TEXT_PRIMARY};
      &:hover{
        color: ${COLORS.PRIMARY};
      }
    }
`;

const StyledTitle = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: 600;
`;

const StyledRedStar = styled('span')`
    font-size: 1.5em;
    color: ${({isErr})=> isErr ? COLORS.DANGER : COLORS.NEPAL};
    font-weight: 600;
`;

const StyledCheckAgreeText = styled('div')`
      margin: -10px 10px 10px;
      color: ${COLORS.TEXT_DANGER};
`;


/**
 * Сколько осталось букв для поздравления
 */
const TextDisplayLettersLeft = ({ current, max } ) => {
    if (!current && current !== 0 || !max) return null;
    return <StyledTextDisplayLettersLeft danger={max - current < 1}>
        Осталось символов: {max - current}
    </StyledTextDisplayLettersLeft>;
};

/**
 * Красная звезочка для обязательных полей
 */
const RedStar = ({isErr}) => <StyledRedStar isErr={isErr}>*</StyledRedStar>;

/**
 * Я согласен с ...
 */
const TextAgree = ({showModalCondition, showModalRules}) => <StyledTextAgree>
    Я согласен с <span className="link" onClick={showModalCondition}>правилами использования ЭПК</span> и
    <span className="link" onClick={showModalRules}> пользовательским соглашением</span>.
</StyledTextAgree>;

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;
const phoneRegex = /^((\+7|7|8)+([0-9]){10})$/gm;
const numberPattern = /\d+/g;

// Вычленить только циферки номера без 8 (+7)
const numberizeMaskedPhone = (string) => {
    const returnedString =  string && string.match( numberPattern ).join('') || '';
    return returnedString.length ? returnedString.substring(1) : returnedString
};
/**
 * Форма подарочного сертификата
 */
const GiftCardForm = ({ buyAction, showModalCondition, showModalRules, disableBuyBtn, serverErrors, isLoading } ) => {
    const userPersonalInfo = useSelector( userPersonalInfoSelector );

    const [ form, setForm ] = useState( {
        email: userPersonalInfo && userPersonalInfo.email || '',
        greeting: '',
        compliment: '',
        to_email: '',
        to_phone: '',
        signature: '',
        agree: false,
    } );
    const [ formErrors, setFormErrors ] = useState( {} );

    useEffect(()=>{
        if (!form.to_email){
            const lsData = localStorage.getItem('u4u_gift_card_form');
            if (lsData) setForm({...(JSON.parse(lsData) || {}), agree: false});
        }
    },[]);
    useEffect(()=>{
        if (serverErrors) setFormErrors(serverErrors);
    },[serverErrors]);

    const showModalConditionHandler = ( e, isCondition ) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCondition) {
            showModalCondition();
        } else showModalRules();
    };

    // Обновление значения поля
    const updateForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    // Очистка ошибок
    const clearFormError = (e) => {
        const errO = {...formErrors};
        if (errO[e.target.name]) delete errO[e.target.name];
        setFormErrors(errO);
    };

    // Клик по кнопке купить
    const buyActionHandler = () => {
        const valid = checkForm();
        console.log('valid',valid);
        if (valid) {
            localStorage.setItem('u4u_gift_card_form', JSON.stringify(form));
            buyAction({...form, to_phone: numberizeMaskedPhone(form.to_phone), greeting: form.greeting || 'Вам подарок!'});
        }
    };

    // Условия при которых кнопка Купить блокируется
    const validateFormItem = (target) => {
        switch (target.name) {
            case 'email':
            case 'to_email':
                if (!form[target.name] ||  !~form[target.name].indexOf('@') || !emailRegex.test(form[target.name]) ) {
                    return 'Введите корректный e-mail';
                } else if (form[target.name].length > 80 ) {
                    return 'Введите не более 80 знаков';
                }
                break;
            case 'greeting':
            case 'signature':
                if (form[target.name] && form[target.name].length > 80 ) {
                    return 'Введите не более 80 знаков';
                }
                break;
            case 'compliment':
                if (form[target.name] && form[target.name].length > 400 ) {
                    return 'Введите не более 400 знаков';
                }
                break;
            case 'to_phone':
                const numPhone = numberizeMaskedPhone(form[target.name]);
                if (!numPhone || numPhone.length !== 10) {
                    return 'Введите корректный номер мобильного телефона';
                }
                break;
            case 'agree':
                if (!form.agree) {
                    return 'Необходимо согласиться с условиями';
                }
                break;
        }
        return null;
    };

    const checkFormItem = (e) => {
        const err = validateFormItem(e.target);
        setFormErrors({...formErrors, [e.target.name]: err});
    };

    const checkForm = () => {
        let asembledErrors = {};

        Object.keys(form).map((key)=>{
            const err = validateFormItem({name: key, value: form[key]});
            if (err) asembledErrors[key] = err;
        });
        setFormErrors(asembledErrors);
        return !Object.values(asembledErrors).filter((x)=>x).length;
    };
    const checkAgreeHandler = (value) => {
        const e = {target: {name: 'agree', value: value}};
        clearFormError(e);
        updateForm(e)
    };

// console.log('formErrors',formErrors);

    return <div className="column rightCol">
        <StyledTitle>Отправитель</StyledTitle>
        <Input name="email"
               value={form.email}
               onChange={updateForm}
               onBlur={checkFormItem}
               onFocus={clearFormError}
               label={<span>E-mail<RedStar isErr={formErrors.email}/></span>}
               error={formErrors.email}
               type="email"
            // placeholder={TEXT_PROFILE.FIO}
        />

        <StyledTitle>Ваше поздравление</StyledTitle>
        <Input name="greeting"
               value={form.greeting}
               onChange={updateForm}
               onBlur={checkFormItem}
               onFocus={clearFormError}
               label={'Приветствие'}
               error={formErrors.greeting}
        />
        <TextArea name="compliment"
                  value={form.compliment}
                  onChange={updateForm}
                  onBlur={checkFormItem}
                  onFocus={clearFormError}
                  label={'Текст поздравления'}
                  rows={4}
                  maxLength={400}
                  helperText={<TextDisplayLettersLeft current={form.compliment.length} max={400}/>}
        />
        <Input name="signature"
               value={form.signature}
               onChange={updateForm}
               onBlur={checkFormItem}
               onFocus={clearFormError}
               label={'Подпись отправителя'}
               error={formErrors.signature}
        />

        <StyledTitle>Получатель</StyledTitle>
        <Input name="to_email"
               value={form.to_email}
               onChange={updateForm}
               onBlur={checkFormItem}
               onFocus={clearFormError}
               label={<span>E-mail<RedStar isErr={formErrors.to_email}/></span>}
               error={formErrors.to_email}
               type="email"
        />
        <InputMask mask='+7 (999) 999-99-99'
                   placeholder={'+7 (___) ___-__-__'}
                   value={form.to_phone}
                   onBlur={checkFormItem}
                   onFocus={clearFormError}
                   onChange={updateForm}>
            {(props)=><Input name="to_phone"
                   label={<span>Моб. телефон<RedStar isErr={formErrors.to_phone}/></span>}
                   error={formErrors.to_phone}
                   type="tel"
                   {...props}
            />}
        </InputMask>

        <Checkbox checked={form.agree}
                  onChange={checkAgreeHandler}
                  label={<TextAgree showModalCondition={(e) => showModalConditionHandler(e, false)}
                                    showModalRules={(e) => showModalConditionHandler(e, true)}/>}
                  className="checkboxAgree"/>

        {formErrors.agree && <StyledCheckAgreeText>{formErrors.agree}</StyledCheckAgreeText>}

        <Btn large intent="primary" className="mainBtn" onClick={buyActionHandler} disabled={disableBuyBtn || isLoading || Object.values(formErrors).filter((x)=>x).length}>
            {isLoading ? <Spinner size={24} delay={0} light/> : 'Купить'}
        </Btn>
    </div>;
};

export default GiftCardForm;