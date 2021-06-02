import React, { memo } from 'react';
import { generatePath } from 'react-router';
import styled, {keyframes} from 'styled-components';
import LINKS from "config/links";
import { IMG_DIR } from "config/dirs";

/** Styles **/
const StyledBlock = styled.div`
   margin: 20px 0;
   font-size: 0;
   display: flex;
   flex-direction: row;
   @media (max-width: 740px) {
      flex-direction: column;   
   }
`;
const StyledBannerBig = styled.a`
    display: block;
    width: 50%;
    overflow: hidden;
    border-radius: 10px;
    font-size: 0;
    & + & {
      margin-left:20px;   
    }
    @media (max-width: 740px) {
      display: none;
    } 
`;
const StyledBannerMini = styled.a`
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
    font-size: 0;
    margin-left: 0;
    & + & {
      margin-top:20px;   
    }
    display: none;          
    @media (max-width: 740px) {
      display: block;
    }    
`;

const gcAnimation = keyframes`
  0%{
    transform: translate(0, -170%);   
  }
  100%{
    transform: translate(0, 170%);
  } 
`;

const StyledGiftCardPr = styled.div`
    display: flex;
    width: 100%;
    align-items: flex-start;
    .inner {
      flex: 1 1 auto;
      position: relative;
    }
    .inner:before {
      content: "";
      display: block;
      padding-top: 36.75%;
    }
    .content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      &_bg {
        width:100%; 
      }
    }
    
    .card {
      transition: all 1s ease-out;
      width:35%;
      position: absolute;
      top: 15%;
      right: 7%;
      box-shadow: 0 1px 10px rgba(0,0,0,0.3); 
      border-radius: 5%;
      transform: translate(0, -150%);  
    }
    .card_1 {
      animation: ${gcAnimation} 9s linear infinite;
      animation-delay: -6s;  
    }
    .card_2 {
      animation: ${gcAnimation} 9s linear infinite;
      animation-delay: -3s;
    }
    .card_3 {
      animation: ${gcAnimation} 9s linear infinite;
    }
`;

const GiftCardPr = () => (
    <StyledGiftCardPr>
        <div className="inner">
            <div className='content'>
                <img src={IMG_DIR + 'pr/giftcard/gcBg.png'} alt="" className="content_bg"/>
                <img src={IMG_DIR + 'pr/giftcard/gc1.png'} alt="" className="card card_3"/>
                <img src={IMG_DIR + 'pr/giftcard/gc3.png'} alt="" className="card card_2"/>
                <img src={IMG_DIR + 'pr/giftcard/gc5.png'} alt="" className="card card_1"/>
            </div>
        </div>
    </StyledGiftCardPr>
);

const calendarPath = generatePath( LINKS.PRODUCT, {
    productType: 11,
    format: 0,
    themeId: 0
});


const Multi = () => <StyledBlock>

    {/*<StyledBannerMini href={LINKS.GIFT_CARD}>*/}
    {/*    <img src={IMG_DIR + 'pr/november/sert.png'} alt={'Сертификат'} />*/}
    {/*</StyledBannerMini>*/}


    {/*<StyledBannerMini href={calendarPath}>*/}
    {/*    <img src={IMG_DIR + 'pr/dec/calendar.png'} alt={'Календарии'} />*/}
    {/*</StyledBannerMini>*/}

    <StyledBannerMini href={LINKS.SALES_MAIN}>
        <img src={IMG_DIR + 'pr/2021/calendar-dar-30.png'} alt={'30% скидка на календари'} />
    </StyledBannerMini>

    <StyledBannerMini href={LINKS.GALLERY.replace(':categoryId?', '11')}>
        <img src={IMG_DIR + 'pr/2021/photobook_winter.png'} alt={'Зимние темы фотокниг'} />
    </StyledBannerMini>


    {/*<StyledBannerMini href={LINKS.SHOP_MAIN + '0/1/calendars/0/0'}>
        <img src={IMG_DIR + 'pr/sept/calendar2021.png'} alt={'Создайте свой календарь или закажите свой из магазина'} />
    </StyledBannerMini>*/}
    {/*<StyledBannerMini href={LINKS.SALES_MAIN}>
                            <img src={IMG_DIR + 'pr/november/5.11.jpg'} alt={'45% скидка на фотокниги 20x20 на пружине в твердой обложке'} />
                        </StyledBannerMini>*/}
    {/*<StyledBannerMini href={LINKS.SALES_MAIN}>
                            <img src={IMG_DIR + 'pr/sept/24.jpg'} alt={'Скидка 30% на фотокниги'} />
                        </StyledBannerMini>*/}

    {/*<StyledBannerMini href={LINKS.SALES_MAIN}>
                            <img src={IMG_DIR + 'pr/october/22.10.jpg'} alt={'40% скидка на фотокниги в книжном переплете в твердой обложке формата 30х20'} />
                        </StyledBannerMini>*/}

    {/*<StyledBannerMini href={LINKS.SALES_MAIN}>*/}
    {/*    <img src={IMG_DIR + 'pr/november/06.12.png'} alt={'40% скидка на фотокниги в книжном переплете формата 20х30'} />*/}
    {/*</StyledBannerMini>*/}
    {/*<StyledBannerMini href={LINKS.GALLERY.replace(':categoryId?', '11')}>
                            <img src={IMG_DIR + 'pr/sept/o.png'} alt={'Осенние темы фотокниг'} />
                        </StyledBannerMini>*/}

    {/*
                        <StyledBannerMini href={LINKS.GALLERY.replace(':categoryId?', '11')}>
                            <img src={IMG_DIR + 'pr/sept/17.jpg'} alt={'Скидка 44% на фотокниги в переплете на скрепке в мягкой обложке 20х20'} />
                        </StyledBannerMini>
                        */}
    {/*
                        <StyledBannerMini href={LINKS.GIFT_CARD}>
                            <GiftCardPr/>
                        </StyledBannerMini>
                        */}

    {/*<StyledBannerBig href={LINKS.GIFT_CARD}>*/}
    {/*    <img src={IMG_DIR + 'pr/november/sert.png'} alt={'Сертификат'} />*/}
    {/*</StyledBannerBig>*/}

    {/*<StyledBannerBig href={calendarPath}>*/}
    {/*    <img src={IMG_DIR + 'pr/dec/calendar.png'} alt={'Календарии'} />*/}
    {/*</StyledBannerBig>*/}

    {/*<StyledBannerBig href={LINKS.SHOP_MAIN + '0/1/calendars/0/0'}>
        <img src={IMG_DIR + 'pr/sept/calendar2021.png'} alt={'Создайте свой календарь или закажите свой из магазина'} />
    </StyledBannerBig>*/}

    <StyledBannerBig href={LINKS.SALES_MAIN}>
        <img src={IMG_DIR + 'pr/2021/calendar-dar-30.png'} alt={'30% скидка на календари'} />
    </StyledBannerBig>


    <StyledBannerBig href={LINKS.GALLERY.replace(':categoryId?', '11')}>
        <img src={IMG_DIR + 'pr/2021/photobook_winter.png'} alt={'Зимние темы фотокниг'} />
    </StyledBannerBig>

    {/*<StyledBannerBig href={LINKS.SALES_MAIN}>
                            <img src={IMG_DIR + 'pr/november/5.11.jpg'} alt={'45% скидка на фотокниги 20x20 на пружине в твердой обложке'} />
                        </StyledBannerBig>*/}

    {/*<StyledBannerBig href={LINKS.SALES_MAIN}>
                            <img src={IMG_DIR + 'pr/sept/24.jpg'} alt={'Скидка 30% на фотокниги'} />
                        </StyledBannerBig>*/}

    {/*<StyledBannerBig href={5.11.jpg}>
                            <img src={IMG_DIR + 'pr/october/22.10.jpg'} alt={'40% скидка на фотокниги в книжном переплете в твердой обложке формата 30х20'} />
                        </StyledBannerBig>*/}
    {/*<StyledBannerBig href={LINKS.SALES_MAIN}>*/}
    {/*    <img src={IMG_DIR + 'pr/november/06.12.png'} alt={'40% скидка на фотокниги в книжном переплете формата 20х30'} />*/}
    {/*</StyledBannerBig>*/}
    {/*
                        <StyledBannerBig href={LINKS.GALLERY.replace(':categoryId?', '11')}>
                            <img src={IMG_DIR + 'pr/sept/o.png'} alt={'Осенние темы фотокниг'} />
                        </StyledBannerBig>
                        */}

    {/*
                        <StyledBannerBig href={LINKS.SALES_MAIN}>
                            <img src={IMG_DIR + 'pr/sept/17.jpg'} alt={'Скидка 44% на фотокниги в переплете на скрепке в мягкой обложке 20х20'} />
                        </StyledBannerBig>
                        */}
    {/*
                        <StyledBannerBig href={LINKS.GIFT_CARD}>
                            <GiftCardPr/>
                        </StyledBannerBig>
                        */}
</StyledBlock>;
export default memo( Multi );