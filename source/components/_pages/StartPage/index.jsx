import React from 'react';
import PrintUpLogo from "./Pr/PrintupLogo";

import OurProducts from "./_OurProducts";
import TopImage from "./TopImage/index";
//import Pr from "./Pr/MultiGiftCard";
import Pr from "./Pr/2021Feb";
import { Page, PageInner } from "components/Page";
// import { Btn } from "components/_forms";
import s from './StartPage.scss';
import {IMG_DIR} from "../../../config/dirs";

import styled, {keyframes} from 'styled-components';

//import DeliveryProblem from 'components/WarningBlock/deliveryProblem';
//import ProductionWorking from 'components/WarningBlock/productionWorking';

const PrintUpBanner = styled('div')`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  
    color: #3d4c62;   
    background: #eef1f7;
    padding: 20px;
    border-radius: 10px;

    font-family: 'Gilroy',-apple-system,'Helvetica Neue',sans-serif;
    font-size: 20px;  
  
    margin: 0 0 25px;

    & > span:first-child {
        margin-right:10px;
    }

    @media(max-width: 740px) {
        flex-direction: column;
        & > span {
           text-align: center;
           margin-right:0!important;
        }
        & > span + span {
            margin-top: 15px;
        }
    } 
  
    svg {
        width:100px;
        height: 43px;
        align-self: center;
    }
`;

const PrintUpBannerLogo = styled('span')`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: right;
`;

const PrintUpLogoText = styled('span')`
    padding: 0 15px;

    @media(max-width: 380px) {
        padding: 0 10px;
    }
    @media(max-width: 340px) {
        display: none;
    }  
  
    font-size: 12px;
    text-align: left;
    align-self: center;
`

const PrintUpMoreInfoButton = styled('a')`
  background: #004a64;
  color: #fff;
  padding: 10px 15px;
  align-self: center;
  font-size: 16px;
  margin-left: 5px;

  &:hover {
    color: #fff;
    background: rgba(0, 74, 100, 0.85);
  }

  @media(max-width: 340px) {
    margin-left:25px;
  }
  @media(max-width: 380px) {
    font-size: 13px;
  }  
`

const StartPage = props => {

    //console.log('----------=============== START PAGE ===============--------------');
    return (
        <Page>
            <div className={s.page}>
                {/*<ProductionWorking />*/}
                <PageInner>
                    <TopImage />
                    <Pr />

                    <PrintUpBanner>
                        <span>Печатаем на оборудовании компании <b>PrintUP</b></span>
                        <PrintUpBannerLogo>
                            <PrintUpLogo />
                            <PrintUpLogoText>типография полного циикла<br />для частных клиентов<br />и бизнеса</PrintUpLogoText>
                            <PrintUpMoreInfoButton href={'https://www.printup.ru'} target={'_blank'}>ПОДРОБНЕЕ</PrintUpMoreInfoButton>
                        </PrintUpBannerLogo>
                        {/*<img src={IMG_DIR + 'pr/printup.png'} alt={'Печатаем на оборудовании PrintUP'} />*/}
                    </PrintUpBanner>

                    <OurProducts />

                    {/*<PageTitle center h3>{TEXT_STARTPAGE.OUR_PHOTOBOOKS}</PageTitle>*/}

                </PageInner>

                {/*<div className={s.promo}>
                    <PageInner>
                        <h1 className={s.promoHeader}> Супер акция! Скидка 147% на невидимые книги! </h1>
                    </PageInner>
                </div>*/}

                {/*<div className={s.advantages}>
                    <PageInner>
                        <PageTitle center>{TEXT_STARTPAGE.OUR_ADVANTAGES}</PageTitle>

                        <Wrapper className={s.photobookTypes}>
                            <div className={s.advantagesRow}>
                                <div className={s.advantagesItem}>
                                    <div className={s.advantagesIcon}>
                                        <HearthIcon size={72} type="shift"/>
                                    </div>
                                    <div className={s.advantagesText}>
                                        {TEXT_STARTPAGE.ADV_1}
                                    </div>
                                </div>
                                <div className={s.advantagesItem}>
                                    <div className={s.advantagesIcon}>
                                        <GridIcon size={72} type="shift"/>
                                    </div>
                                    <div className={s.advantagesText}>
                                        {TEXT_STARTPAGE.ADV_2}
                                    </div>
                                </div>
                                <div className={s.advantagesItem}>
                                    <div className={s.advantagesIcon}>
                                        <TruckIcon size={72} type="shift"/>
                                    </div>
                                    <div className={s.advantagesText}>
                                        {TEXT_STARTPAGE.ADV_3}
                                    </div>
                                </div>
                                <div className={s.advantagesItem}>
                                    <div className={s.advantagesIcon}>
                                        <ClockIcon size={72} type="shift"/>
                                    </div>
                                    <div className={s.advantagesText}>
                                        {TEXT_STARTPAGE.ADV_4}
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                    </PageInner>
                </div>*/}
            </div>
        </Page>);
};
export default StartPage;
