import React, {Component, Fragment} from 'react';
import { Btn } from 'components/_forms';

import WINDOW_TEXT from 'texts/delivery';
import { Page, PageInner, PageTitle, Wrapper } from 'components/Page';
import DDeliveryWidget from "components/DDeliveryWidget";
import s from './Info.scss';
import { NavLink } from 'react-router-dom'
import  LINKS_MAIN  from 'config/links';

const Paragraph = ( { p } ) => {
    if ( !p ) return null;
    const pSplitted = p.split( '<br/>' );

    return pSplitted && pSplitted.map( ( line, i ) =>
           <Fragment key={i}>
                {line}
                {i < pSplitted.length && <br/>}
           </Fragment> );
};

export default class DeliveryPage extends Component {
    state = {
        showWidget: false
    };

    showWidgetToggle = () => {
        this.setState( { showWidget: !this.state.showWidget } );
    };

    dDeliveryCallback = () => {
        if (this.state.showWidget) this.setState( { showWidget: false } );
    };

    render () {
        const ddExampleProps = {
            cartData: {
                id: '1',
                orders: [{
                    id: '1',
                    name: 'calc-example',
                    cost: 1000,
                    count: 1,
                }]
            },
            deliveryData: {
                delivery: { boxSize: { height: 31, width: 21, depth: 5, weight: 0.4 } }
            },
            setDeliveryAction: this.dDeliveryCallback
        };

        return (
            <Page className={s.delivery}>
                <PageInner>
                    <Wrapper>
                        <PageTitle>{WINDOW_TEXT.title}</PageTitle>

                        <div className={s.deliveryWrap}>
                            <div className={s.deliveryBlock} >
                                <h3>{WINDOW_TEXT.textData[0].header}</h3>
                                {WINDOW_TEXT.textData[0].texts.map((text, index)=>{
                                    if (text.numberList){
                                        return <ol key={index}>
                                                {text.numberList.map((li, i)=>{
                                                    return(
                                                        <li key={i}><b>{li.label}{li.disabled && <span className={s.danger}> {li.disabled}</span>}:</b>
                                                            <ul>
                                                                <li>{li.text}.</li>
                                                            </ul>
                                                        </li>
                                                    );
                                                })}
                                        </ol>
                                    } else {
                                        return(
                                            <p key={index} style={text.style}>
                                                <b>{text.title}:</b><br/>
                                                {text.navlinkTemp && <NavLink to={LINKS_MAIN.INFO_CONTACTS}>{text.navlinkTemp}<br/></NavLink>}
                                                <Paragraph p={text.p}/>
                                            </p>
                                        );
                                    }
                                })}
                                <ol>
                                </ol>
                            </div>
                            <div className={s.deliveryBlock}>
                                {!this.state.showWidget ?
                                    <>
                                        <NavLink to={LINKS_MAIN.INFO_CONTACTS}>
                                            <Btn intent="success" className={s.showWidgetBtn} large >
                                                {WINDOW_TEXT.buttonOfficeText}
                                            </Btn>
                                        </NavLink>
                                        <Btn intent="info" className={s.showWidgetBtn} onClick={this.showWidgetToggle} large>
                                            {WINDOW_TEXT.buttonWidgetText}
                                        </Btn>
                                    </>
                                    :
                                    <Fragment>
                                        <h3>{WINDOW_TEXT.ddWidgetTitle}</h3>
                                        <DDeliveryWidget {...ddExampleProps} />
                                    </Fragment>
                                }
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: WINDOW_TEXT.text2 }}/>

                    </Wrapper>
                </PageInner>
            </Page>
        );
    }

}

