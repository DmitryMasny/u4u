import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom'
import { ResizeContext } from 'contexts/resizeContext';


import s from './Tabs.scss';
import CompactMenu from 'components/CompactMenu';

// Таб
const Tab = ( {active, tabData, id, onSelect } ) => {
    const className = s.tab + (active ? ` ${s.active}` : '');
    const { divider, title, link, icon } = tabData;
    if ( divider ) return <div className={s.tabDivider}/>;
    if ( link ) {
        return (
            <NavLink className={className} to={link} data-tab-id={id}
                     onClick={( e ) => {onSelect( id, e )}}>
                {icon && <span className={s.tabIcon}>{icon}</span>}
                {title}
            </NavLink>
        )
    } else {
        return (
            <div className={className} data-tab-id={id} onClick={() => onSelect( id )}>
                {icon && <span className={s.tabIcon}>{icon}</span>}
                {title}
            </div>
        )
    }
};

const Underline = ( { cutTabDOM } ) => {
    if (!cutTabDOM ) return null;
    const { offsetWidth, offsetLeft} = cutTabDOM;
    const underlineStyle = {
        transform: `translateX(${Math.floor( offsetLeft )}px)`,
        width: `${Math.floor( offsetWidth )}px`
    };

    return (<div className={s.tabUnderline} style={underlineStyle}/>);
};

// Главный компонент табов
class Tabs extends Component {

    constructor ( props ) {
        super( props );
        this.state = {
            currentTab: this.props.defaultTab || 0,     // таб по-умолчанию - props.defaultTab, если есть
            cutTabDOM: null,
            underline: {
                width: 0,
                offset: 50
            }

        };
        this.tabs = React.createRef();
    }

    // Выбор таба
    setTab = ( tab, event ) => {

        if ( this.state.currentTab === tab ) {
            event && event.preventDefault();
            return null;
        }

        this.setState( { currentTab: tab } );
        if ( this.props.onSelect ) this.props.onSelect( tab );
    };

    // Изменение width,offset линии подчеркивающей активный таб в state
    setCurrentTab = ( currentTab ) => {
        const curTab = this.tabs.current ? this.tabs.current.querySelectorAll( '[data-tab-id="' + currentTab + '"]' )[0] : null;
        if ( curTab ) {
            this.setState( {
                cutTabDOM: curTab
            } );
        }
    };

    componentDidMount () {
        this.setCurrentTab( this.state.currentTab );
    }

    shouldComponentUpdate ( nextProps ) {
        if ( nextProps.defaultTab !== this.props.defaultTab ) {
            this.setCurrentTab( nextProps.defaultTab );
            this.setState( { currentTab: nextProps.defaultTab } );
            return false;
        } else return true;
    }


    render () {
        const { tabs, disabled, noMobile } = this.props;
        if ( !tabs || tabs.length < 1 ) return null;
        const { currentTab, cutTabDOM } = this.state;

        const tabsClass = s.tabs + (disabled ? ` ${s.disabled}` : '');

        const getTitle = (() => {
            for ( let i = 0; i < tabs.length; i++) {
                if (tabs[i].id === currentTab) return tabs[i].title;
            }
        })();


        return (
            <div className={tabsClass} ref={this.tabs}>
                <ResizeContext.Consumer>
                    {( { media } ) => {
                        return !noMobile && (media === 'xs' || media === 'sm') ?
                            <CompactMenu className={s.tabsCompactMenu} active={currentTab} title={getTitle} bordered>
                                {tabs}
                            </CompactMenu>
                                :
                            <Fragment>
                                {tabs.map( ( {id, ...other}, key ) => <Tab tabData={{...other}}
                                                                  onSelect={this.setTab}
                                                                  active={id === currentTab}
                                                                  id={id}
                                                                  key={id+key || key}
                                /> )}
                                <Underline cutTabDOM={cutTabDOM}/>
                            </Fragment>
                    }}
                </ResizeContext.Consumer>

            </div>
       );
    }
}

Tabs.contextType = ResizeContext;

export default Tabs;
