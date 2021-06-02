import React, { useEffect, useContext, useState, useRef, Fragment, memo } from 'react';
import { useSelector } from "react-redux";
import { modalProductProblemInfo } from 'selectors/modals'
import { ModalContext } from "components/Modal";
import { TYPES } from "const/types";
import styled from 'styled-components';
import { IconError, IconInfo } from 'components/Icons';
import {COLORS} from "const/styles";

/** Styles **/
const DivError = styled.div`
  color: ${({isError})=> isError ? COLORS.TEXT_DANGER : COLORS.TEXT_INFO};
  padding-bottom: 5px;
`;
const StyledIcon = styled.div`
  padding: 10px;
  margin-bottom: 15px;
  text-align: center;
`;

const ProductProblemInfo = ()=> {

    const modalProductProblemInfoState = useSelector( modalProductProblemInfo );

    const { setModal, closeModal } = useContext( ModalContext );

    let isError = false;
    const errors =  modalProductProblemInfoState.errors.map((err) => {
        if ( err.level === 'error' ) isError = true;
        return err;
    }).sort( ( a, b ) => {
        if (b && b.level === 'error') {
            return 1;
        } else {
            return -1;
        }
    });

    // Открыть настройки формата
    const openConfigAction = () => {
        closeModal();
        if ( modalProductProblemInfoState.callback ) modalProductProblemInfoState.callback();
    };
    useEffect(() => {
        if ( isError ) {
            setModal( {
                          blocked: true,
                          footer: [
                              { type: TYPES.DIVIDER },
                              { type: TYPES.BTN, text: 'Изменить настройки формата', action: openConfigAction, primary: true },
                          ]
                      } );
        } else {
            setModal( {
                          footer: [
                              { type: TYPES.DIVIDER },
                              { type: TYPES.BTN, text: 'Изменить настройки формата', action: openConfigAction, primary: true  },
                              { type: TYPES.BTN, text: 'Закрыть', action: closeModal},
                          ]
                      } );
        }
    },[]);

    console.log('modalProductProblemInfoState', modalProductProblemInfoState);

    return (<div>
                <StyledIcon>
                    {isError ? <IconError size={72} intent={'danger'}/> :  <IconInfo size={72} intent={'info'}/>}
                </StyledIcon>
                <div>
                    В сервисе U4U произошли изменения в продуктах.
                    <br /><br />
                    {isError ? <div>Данный постер не может быть заказан, так как содержит следующие изменения:</div>
                             : <div>Данный постер содержит следующие изменения:</div>}
                    <br />
                </div>
                {errors.map(( err, index ) => <DivError key={index} isError={err.level === 'error'}> - {err.text}</DivError>)}

                <br/>
                <div>
                    {isError ?
                        'Вам необходимо изменить настройки формата!':
                        'Вы можете изменить настройки формата или оставить текущие параметры.'
                    }
                </div>
             </div>)
};

export default memo(ProductProblemInfo);