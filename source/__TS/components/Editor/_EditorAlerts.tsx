// @ts-ignore
import React, { useState, useEffect, useCallback, memo } from 'react';
// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import { useSelector } from "react-redux";
import { notGoodPhotosSelector, notAcceptedPhotosSelector } from "./_selectors";

// @ts-ignore
import { IconError } from 'components/Icons';
// @ts-ignore
import Tooltip from '__TS/components/_misc/Tooltip';
// @ts-ignore
import {getLayoutParents} from '__TS/libs/layout';

import { EditorHeaderBtn } from "../../styles/editor";
// @ts-ignore
import { COLORS } from "const/styles";
// @ts-ignore
import { hexToRgbA } from "libs/helpers";
import { ILayout } from "../../interfaces/layout";
import { productLayoutSelector } from "../../selectors/layout";
import { setAreaSelectedAction, setCurrentControlElementAction } from "./_actions";


const thumbSize = 100;

/** Interfaces */
interface IAlert {
    title: string;
    desc?: string;
    url?: string;
    action?: any;
    intent?: string;
}

interface IAlerts {
    danger: IAlert[];
    warning: IAlert[];
    info: IAlert[];
}

interface IEditorAlertsBlock {
    alerts: IAlerts
}

/** Styles */
const EditorAlertsBlockStyled = styled( 'div' )`
  margin: -5px;
  max-width: 420px;
  .alertsList {
      display: flex;
      flex-direction: column;
      max-height: 65vh;
      overflow-y: auto;
      padding: 5px 15px 5px 5px;
  }
`;
const AlertHeader = styled( 'div' )`
      margin: 10px 0 5px;
      color: ${ ( { intent } ) => intent ? COLORS['TEXT_' + intent.toUpperCase()] : COLORS.TEXT };
`;

const AlertItemStyled = styled( 'div' )`
  margin: 1px 0;
  padding: 5px;
  user-select: none;
  border-radius: 4px;
  transition: box-shadow .2s ease-out;
  cursor: pointer;
  &:hover {
      box-shadow: 1px 2px 6px ${ hexToRgbA( COLORS.TEXT, .22 ) };
      .buttonWrap .button {
        opacity: 1;
      }
      .innerWrap:before {
        opacity: 1;
      }
  }
  .innerWrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before{
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      border-radius: 2px;
      background-color: ${ ( { intent } ) => intent ? COLORS[intent.toUpperCase()] : COLORS.LAVENDERMIST };
      opacity: .5;
      transition: opacity .2s ease-out;
    }
  }
  .thumbWrap {
    width: 50px;
    height: 50px;
    margin: 0 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &> img {
        object-fit: contain;
        width: 100%;
        height: 100%;
    }
  }
  .textWrap {
    flex-grow: 1;
    line-height: 1.1;
    .title {
    
    }
    .desc {
      font-size: 13px;
      color: ${ COLORS.TEXT_MUTE };
    }
  }
  .buttonWrap {
    margin: 0 5px;
    .button {
      display: flex;
      align-items: center;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 13px;
      min-height: 24px;
      color: #fff;
      opacity: .5;
      background-color: ${ ( { intent } ) => intent ? COLORS[intent.toUpperCase()] : COLORS.LAVENDERMIST };
      transition: opacity .2s ease-out;
    }
  }
`;

/**
 * Одна ошибка из списка
 */
const AlertItem: React.FC<IAlert> = ( { title, desc, url, action, intent } ): any => {

    return (
        <AlertItemStyled onClick={ action } intent={ intent }>
            <div className="innerWrap">
                <div className="thumbWrap">
                    { url && <img src={ url } alt=""/> }
                </div>
                <div className="textWrap">
                    <div className="title">
                        { title }
                    </div>
                    <div className="desc">
                        { desc }
                    </div>
                </div>
                { action && <div className="buttonWrap">
                    <div className="button">
                        Показать
                    </div>
                </div> }
            </div>
        </AlertItemStyled>
    )
}
/**
 * Выпадающий блок всех ошибок редактора
 */
const EditorAlertsBlock = memo( ( { alerts }: IEditorAlertsBlock ): any => {
    return (
        <EditorAlertsBlockStyled>
            <div className="alertsList">
                { !!alerts.danger.length &&
                <AlertHeader intent="danger">Ошибки препятствующие изготовлению макета:</AlertHeader> }
                { !!alerts.danger.length && alerts.danger.map( ( item, i ) => <AlertItem { ...item } intent="danger" key={'d'+i} /> ) }

                { !!alerts.warning.length && <AlertHeader intent="warning">Некритичные замечания:</AlertHeader> }
                { !!alerts.warning.length && alerts.warning.map( ( item, i ) => <AlertItem { ...item }
                                                                                        intent="warning" key={'w'+i} /> ) }

                { !!alerts.info.length && alerts.info.map( ( item, i ) => <AlertItem { ...item } intent="info" key={'i'+i} /> ) }
            </div>
        </EditorAlertsBlockStyled>
    )
})


/**
 * Генерация урла превьюшки
 */
const generateThumbUrl = ( data ): string => `${ data.url }=${ (data.pxWidth / data.pxHeight) > 1 ? 'w' : 'h' }${ thumbSize }`


/**
 * Отображение предупреждений редактора
 */
const EditorAlerts = memo((): any => {
    const layout: ILayout = useSelector( productLayoutSelector );
    const notAcceptedPhotos: any[] = useSelector( notAcceptedPhotosSelector );
    const notGoodPhotos: any[] = useSelector( notGoodPhotosSelector );

    const [ isShow, setIsShow ] = useState( false )
    const [ alerts, setAlerts ] = useState( {
        danger: [],
        warning: [],
        info: [],
    } )


    const showContentOnPage = useCallback( (contentId) => {
        const {areaIndex, block} = getLayoutParents({layout, contentId})
        setAreaSelectedAction(areaIndex)
        setCurrentControlElementAction({ blockId: block.id, blockType: block.type })
        setIsShow(false)
    }, [ notAcceptedPhotos, notGoodPhotos ])

    useEffect( () => {
        setAlerts( {
            danger: notAcceptedPhotos.map( ( item ) => ({
                title: 'Плохое качество фотографии',
                desc: 'Уменьшите блок фотографии или замените её',
                url: generateThumbUrl( item ),
                action: () => showContentOnPage( item.id )
            }) ),
            warning: notGoodPhotos.map( ( item ) => ({
                title: 'Низкое качество фотографии',
                desc: 'Уменьшите блок фотографии или замените её',
                url: generateThumbUrl( item ),
                action: () => showContentOnPage( item.id )
            }) ),
            info: []
        } )
    }, [ notAcceptedPhotos, notGoodPhotos ] );

    if ( !alerts.danger.length && !alerts.warning.length && !alerts.info.length ) return null;

    const intent = alerts.danger.length ? 'danger' : alerts.warning.length ? 'warning' : 'info'


    return <Tooltip tooltip={ <EditorAlertsBlock alerts={ alerts }/> }
                    trigger={ 'click' }
                    tooltipShown={ isShow }
                    onVisibilityChange={ ( x ) => setIsShow( x ) }
                    intent="minimal"
                    placement="bottom">

        <EditorHeaderBtn intent={ intent } onClick={ () => setIsShow( true ) } active={ isShow }>
            <IconError intent={ intent }/>
        </EditorHeaderBtn>
    </Tooltip>
})
// <span className="moreLink" onClick={showQualityModal}>Подробнее</span>


export default EditorAlerts;