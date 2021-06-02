import React, { Component, useRef, useState  } from 'react';
import { Page, PageInner, PageTitle} from "components/Page";

import { toast } from '__TS/libs/tools';

import  * as Icons from "components/Icons";
import  * as LineIcons from "components/Icons/LineIcon";
import  {copyToClipboard} from "libs/helpers";

import s from "./index.scss";

const copyToClipboardHandler = ( text ) => {
    copyToClipboard(text);
    toast.info('Иконка ' + text + ' скопирована', {
        autoClose: 3000
    });
};

const IconsO = ({obj, isLine}) => {
    let a = [];
    for (let prop in obj) {
        if( obj.hasOwnProperty( prop ) ) {
            a.push(
                <div className={s.supericon} onClick={()=>copyToClipboardHandler(prop, isLine)} key={prop}>
                    { React.createElement(obj[prop])}
                    <span className={s.supericonName}>{prop}</span>
                    </div>

            );
        }
    }
return a;
};


const IconsPage = props => {
    return (
            <Page>
                <PageInner>
                    <PageTitle>Иконки</PageTitle>
                    <div className={s.iconsWrap}>
                        <IconsO obj={Icons}/>
                    </div>
                    <PageTitle>Линейные иконки</PageTitle>
                    <div className={s.iconsWrap}>
                        <IconsO obj={LineIcons} isLine={true} />
                    </div>
                </PageInner>
            </Page>);
};

export default IconsPage;
