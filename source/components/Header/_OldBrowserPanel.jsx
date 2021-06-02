import React, { Component } from 'react';
import s from './header.scss';

import { IconChrome, IconOpera, IconFirefox, IconSafari, IconYandex } from 'components/Icons/ColorIcon';


export default class OldBrowserPanel extends Component {
    state = {
        isIE: false,
        showBrowsers: false,
        ignore: false
    };

    componentDidMount () {
        if ( document.documentMode ) this.setState( { isIE: true } );
    }

    shouldComponentUpdate ( nextProps,  nextState ) {
        return nextState !== this.state;
    }

    showBrowsersToggle = () => {
        this.setState( { showBrowsers: !this.state.showBrowsers } );
    };

    render () {
        return this.state.isIE && !this.state.ignore &&
            <div className={s.ie + (this.state.showBrowsers ? ` ${s.showBrowsers}`: '')}>
                {!this.state.showBrowsers &&
                    <div className={s.ieInner}>
                        <div className={s.ieSide}>
                            <div><b>Внимание!</b> Ваш браузер (Internet Explorer) устарел.</div>
                            <div>Для комфортной работы с нашим сайтом рекомендуем установить другой браузер.</div>
                        </div>
                        <div className={s.ieSide}>
                            <span className={s.ieBtn + ` ${s.main}`} onClick={this.showBrowsersToggle}>Установить</span>
                            <span className={s.ieBtn} onClick={() => {this.setState( { ignore: true } )}}>Игнорировать</span>
                        </div>
                    </div>
                }

                {this.state.showBrowsers &&
                    <div className={s.ieInner}>

                        <div className={s.ieSide}>
                            Какой браузер вы хотите установить?
                        </div>

                        <div className={s.ieSide}>
                            <a className={s.ieBtn + ` ${s.icon}`} href='https://www.google.com/chrome/browser/desktop/'
                               target='_blank' title='Google Chrome'>
                                <IconChrome/>
                            </a>
                            <a className={s.ieBtn + ` ${s.icon}`} href='https://www.mozilla.org/firefox/'
                               target='_blank' title='Firefox'>
                               <IconFirefox/>
                            </a>
                            {/*<a className={s.ieBtn + ` ${s.icon}`} href='https://www.apple.com/ru/safari/'
                               target='_blank' title='Safari'>
                                <IconSafari/>
                            </a>*/}
                            <a className={s.ieBtn + ` ${s.icon}`} href='https://opera.com/'
                               target='_blank' title='Opera'>
                                <IconOpera/>
                            </a>
                            <a className={s.ieBtn + ` ${s.icon}`} href='https://browser.yandex.ru/'
                               target='_blank' title='Yandex browser'>
                                <IconYandex/>
                            </a>
                        </div>

                        <div className={s.ieSide}>
                            <span className={s.ieBtn} onClick={() => {this.setState( { ignore: true } )}}>Игнорировать</span>
                        </div>

                    </div>
                }
            </div>
    }
}
