import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';

import styled from 'styled-components';
import { Page, PageInner} from 'components/Page';

import Tooltip from '__TS/components/_misc/Tooltip';
import {Select, Input} from "components/_forms";

import { modalConditionAction } from "actions/modals";
import { sendGiftCardToServerAction } from "./actions";

import Form from "./_GiftCardForm";
import Preview from "./_GiftCardPreview";
import { windowIsMobileSelector } from "selectors/global";
import postSend from "libs/postSend";
import LINKS from "config/links";
import {IMG_DIR} from "config/dirs";
import { IconHelp } from "components/Icons";


/**
 * Styles
 */
const StyledGiftCardPage = styled('div')`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -20px 30px;
    ${({theme}) => theme.media.sm`
        flex-direction: column;
        margin-bottom: 15px;
    `};
    .column {
        width: 50%;
        padding: 20px;
        ${({theme}) => theme.media.sm`
            width: 100%;
            padding-bottom: 0;
        `};
    }
    .rightCol {
        max-width: 500px;
    }
    .checkboxAgree {
        margin-bottom: 15px;
    }
    .mainBtn {
        padding: 0 30px;
    }
    .customAmountWrap {
        margin: 10px 0;
        .nominalLabel {
            font-size: 18px;
            text-transform: uppercase;
            font-weight: 600;
        }
      input {
          max-width: 100px;
      }
    }
    .amountHelperText {
        display: flex;
        align-items: center;
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
const GiftCardDesignThumbStyled = styled.div`
    width: 68px;
    height: 48px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-image: url(${ ({url}) => url });
`;


const GiftCardDesignThumb = ({ id }) => <GiftCardDesignThumbStyled url={getImageUrlByDesign(id, true)}/>

const AMOUNTS_LIST = [
    1500, 3000, 5000
].map((item)=>({name: item ? `${item} руб.` : 'Своя сумма', amount: item}));

const DESIGNS_LIST = [
    {id: 'default_skin', name: <GiftCardDesignThumb id="default_skin"/>, fileName: 'design-3'},
    {id: 'pink_flower', name: <GiftCardDesignThumb id="pink_flower"/>, fileName: 'design-2'},
    {id: 'flat_bee', name: <GiftCardDesignThumb id="flat_bee"/>, fileName: 'design-1'},
]


//min-max возможного номинала карты
const customAmountMIN = 500,
    customAmountMAX = 30000;

const AmountHelperText = ({}) => <div className={'amountHelperText'}>
    от {customAmountMIN} до {customAmountMAX} рублей
</div> || null;


const getImageUrlByDesign = (design, isThumb = false) => {
    const curDesign = DESIGNS_LIST.find( x => x.id === design)
    const fileName = curDesign && curDesign.fileName || DESIGNS_LIST[0].fileName
    return `${IMG_DIR}common/giftCard/${fileName}${isThumb ? '-thumb' : ''}.png`
}



/**
 * Страница подарочного сертификата
 */
const GiftCardPage = ({  } ) => {
    const dispatch = useDispatch();
    const isMobile = useSelector( windowIsMobileSelector );
    const [ amountIndex, setAmountIndex ] = useState( 0 );
    const [ disableBuyBtn, setDisableBuyBtn] = useState( false );
    const [ serverErrors, setServerErrors] = useState( null );
    const [ isLoading, setIsLoading] = useState( false );

    //получаем паратеры из URL
    const { nominal, design } = useParams()
    const history = useHistory()


    useEffect(()=> {
        const price = parseInt(nominal)
        const nominalIsCorrect = Number.isInteger(price)
        const designIsCorrect = DESIGNS_LIST.some( x => x.id === design)

        if ( nominalIsCorrect && designIsCorrect ) {
            const priceIndex = AMOUNTS_LIST.findIndex( x => x.amount.toString() === nominal );
            if (~priceIndex) {
                setAmountIndex(priceIndex)
                return
            }
            setAmountIndex(AMOUNTS_LIST.length - 1)
        } else updateUrl(nominalIsCorrect ? nominal : AMOUNTS_LIST[0].amount, designIsCorrect ? design : DESIGNS_LIST[0].id)
    }, [nominal, design]);
    
    // обновление параметров в урле
    const updateUrl = ( newPrice = '', newDesign = '' ) => {
        history.replace( generatePath( LINKS.GIFT_CARD, {
            nominal: newPrice || nominal || customAmountMIN,
            design: newDesign || design || DESIGNS_LIST[0].id,
        } ) )
    };

    // обновление своей цены  (customAmount)
    const updateCustomAmountHandler = ( value = '0' ) => {
        value = parseInt(value.replace(/\D/, '') || 0);
        updateUrl(value.toString().substring(0, 5))
        setDisableBuyBtn(true);
    };

    const onBlurCustomAmountHandler = ( value ) => {
        value = parseInt(value);
        if (value < customAmountMIN) value = customAmountMIN;
        if (value > customAmountMAX) value = customAmountMAX;
        updateUrl( value.toString() )
        setDisableBuyBtn(false);
    };

    // Кнопка Купить
    const buyActionHandler = ( data ) => {
        setServerErrors(null);
        if (data) {
            setIsLoading(true);
            sendGiftCardToServerAction({
                    ...data,
                    amount: nominal,
                    skin: {
                        slug: design
                    }
                },
                (r)=>{
                    if (r.url) {
                        postSend( r.url );
                    } else {
                        console.log('r',r);
                        const se = r.response.data && Object.keys(r.response.data);
                        if (se && se.length) {
                            let sErrors = {};
                            se.map((key)=> {
                                sErrors[key] = r.response.data[key][0]
                            });
                            setServerErrors(sErrors);
                        }
                        setIsLoading(false);
                    }
            });
        }
    };

    return <Page>
            <PageInner>
                <StyledGiftCardPage>
                    <div className="column leftCol">
                        <StyledTitle>Электронный подарочный сертификат</StyledTitle>

                        <Select showAllGridItems fullHeight grid large
                                list={AMOUNTS_LIST}
                                onSelect={(index)=>updateCustomAmountHandler((AMOUNTS_LIST[index] && AMOUNTS_LIST[index].amount || customAmountMIN).toString())}
                                selected={amountIndex}
                        />

                        <div className={ 'customAmountWrap' }>
                            <Input inline
                                   label={<div className="nominalLabel">Номинал карты</div>}
                                   intent="primary"
                                   value={ nominal }
                                   onChange={ ( e ) => updateCustomAmountHandler(e.target.value)}
                                   onBlur={(e) => onBlurCustomAmountHandler(e.target.value)}
                                   autoFocus
                                   large
                                   helperText={
                                       <Tooltip intent="info"
                                                tooltip={<AmountHelperText customAmount={ nominal }/> }
                                       >
                                           <IconHelp intent="info"/>
                                       </Tooltip>}
                            />

                        </div>

                        <Preview amount={ nominal } url={getImageUrlByDesign(design)}/>

                        <StyledTitle>Выберите дизайн</StyledTitle>

                        <Select showAllGridItems fullHeight grid large
                                list={DESIGNS_LIST}
                                onSelect={(id)=>updateUrl('', id)}
                                selectedId={design}
                        />

                    </div>

                    <Form isLoading={isLoading} serverErrors={serverErrors} buyAction={buyActionHandler} showModalCondition={()=>dispatch(modalConditionAction(true))} showModalRules={()=>dispatch(modalConditionAction({isGiftCard: true}))} disableBuyBtn={ !nominal|| disableBuyBtn }/>

                </StyledGiftCardPage>
            </PageInner>
        </Page>

};

export default GiftCardPage;