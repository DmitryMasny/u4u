import React, { PureComponent, Fragment } from 'react';

import { IconMenu } from 'components/Icons';
import SideMenuBlock from './SideMenuBlock';

class SideMenu extends PureComponent {
    state = {
        showSideMenu : false
    };

    componentWillUnmount() {
        this.hideSideMenuAction();
    }

    showSideMenuAction = () =>  {
        this.setState({showSideMenu : true });
    };

    hideSideMenuAction = ( prop ) => {
        if (prop && prop.metricAction) prop.metricAction();
        this.setState({showSideMenu : false });
    };

    render(){

        const {className, menu, button, children, parentId = 'spa-top', title, openIcon, right } = this.props;

        return (
            <Fragment>

                <div className={className || null} onClick={() => this.showSideMenuAction()}>
                    {   // КНОПКА ВЫЗОВА МЕНЮ
                        // кастомная кнопка || иконка при открытии || Иконка по-умолчанию
                        button || (openIcon && this.state.showSideMenu && openIcon) || <IconMenu/>  }
                </div>

                <SideMenuBlock menu={menu} show={this.state.showSideMenu} closeAction={this.hideSideMenuAction} parentId={parentId} title={title} right={right}>
                    {children}
                </SideMenuBlock>

                {/*<Transition in={this.state.showSideMenu} timeout={500} mountOnEnter unmountOnExit>
                    {state => <SideMenuBlock menu={menu} transition={state} closeAction={this.hideSideMenuAction} parentId={parentId} title={title} right={right}>
                        {children}
                    </SideMenuBlock>}
                </Transition>*/}

            </Fragment>
        );
    }
}

export default SideMenu;