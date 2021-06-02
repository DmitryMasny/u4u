import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styled, {css} from 'styled-components';

import LINKS from "config/links";
import {IMG_DIR} from 'config/dirs'

import { Btn } from 'components/_forms';
import Carousel from "components/Carousel2";
import MainHeader from "./_MainHeader";

/** Styles **/
const TopImageWrap = styled.div`
    margin-bottom: 20px;
`;
const TopImageView = styled.div`
    
    .bgImage {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 100%;
        height: auto;
        z-index: 1;
        ${({showProducts})=>showProducts && css`
            filter: blur(2px);
        `};
    }
    .view {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: 12%;
        left: 12%;
        right: 12%;
        transition: opacity .1s ease-in-out;
        &.startView{
            opacity: ${({showProducts})=> showProducts ? 0 : 1};
            z-index: 2;
        }
        &.productsView{
            z-index: 3;
            ${({showProducts})=>showProducts ? css`
                opacity: 1;
                pointer-events: all;
            `:
    css`
                opacity: 0;
                pointer-events: none;
            `};
        }
    }
    .btnRow{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 25px;//50px;
         ${({theme}) => theme.media && theme.media.sm`
            margin-top: 20px;
        `};
        ${({theme}) => theme.media && theme.media.xs`
            display: none;
        `};
        .link {
            margin: 0 10px 20px;
        }
    }
    .mainHeader {
        font-size: 2.4em;
        font-weight: 400;
        text-transform: uppercase;
        text-align: center;
        margin-bottom: 15px;
        ${({theme}) => theme.media && theme.media.sm`
            font-size: 25px;
        `};
        ${({theme}) => theme.media && theme.media.xs`
            font-size: 18px;
        `};
    }
`;

// случайное число от min до max
const randomInteger = ( min, max ) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor( rand );
}

const TopImage = props => (
    <TopImageWrap>
        <Carousel proportion={500 / 1240}
                  viewComponent={
                      () => <TopImageComponent/>
                  }
        />
    </TopImageWrap>)
;

const imageNumber = (()=>{
    const MIN = 1,
        MAX = 3;
    let rImage = randomInteger( 1, 3 );

    if ( !process.env.server_render ) {
        const imageLast = localStorage.getItem( 'mainPageLastBg' );
        if ( imageLast ) {
            let lastImg = parseInt( imageLast );
            if ( rImage === lastImg ) {
                if ( lastImg < MAX ) {
                    rImage = ++lastImg;
                } else {
                    rImage = MIN;
                }
            }
        }
        localStorage.setItem( 'mainPageLastBg', rImage );
    }

    return rImage;
})();

const TopImageComponent = props => {

    const [showProducts, setShowProducts] = useState(false);

    return <TopImageView showProducts={showProducts}>

        <img className="bgImage"
            //src={IMG_DIR + 'common/startPageBg.jpg'}
            //srcSet={IMG_DIR + 'common/startPageBg@2x.jpg 2x'}
             src={IMG_DIR + `common/imgRotation/vesna_${imageNumber}a.jpg`}
             srcSet={IMG_DIR + `common/imgRotation/vesna_${imageNumber}a.jpg`}
             onClick={()=>showProducts && setShowProducts(false)}
             alt="u4uMainBg" />

        <div className="view startView">
            <MainHeader/>
            <div className="btnRow">
                <Btn intent="danger" large className="btn item" onClick={()=>setShowProducts(true)}>
                    Наши продукты
                </Btn>
            </div>
        </div>

        <div className="view productsView" onClick={()=>showProducts && setShowProducts(false)}>
            <div className="mainHeader">
                Выберите продукт
            </div>
            <div className="btnRow">
                <Link className="link" to={LINKS.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-glue')}>
                    <Btn intent="warning" large>
                        Фотокниги
                    </Btn>
                </Link>
                <Link className="link" to={LINKS.PRODUCT.replace(':productType', '12')}>
                    <Btn intent="warning" large>
                        Пазлы
                    </Btn>
                </Link>
                <Link className="link" to={LINKS.PRODUCT.replace(':productType', '4')}>
                    <Btn intent="warning" large>
                        Постеры
                    </Btn>
                </Link>
                <Link className="link" to={LINKS.PRODUCT.replace(':productType', '5')}>
                    <Btn intent="warning" large>
                        Фотографии
                    </Btn>
                </Link>
                <Link className="link" to={LINKS.PRODUCT.replace(':productType', '8')}>
                    <Btn intent="warning" large>
                        Холсты
                    </Btn>
                </Link>
                <Link className="link" to={LINKS.PRODUCT.replace(':productType', '11')}>
                    <Btn intent="warning" large>
                        Календари
                    </Btn>
                </Link>
            </div>

        </div>


    </TopImageView>;
};
export default TopImage;