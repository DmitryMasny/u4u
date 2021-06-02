import React from 'react';
import { withRouter } from 'react-router-dom';

import { Page, PageInner, Wrapper } from "components/Page";
import OnlyAuth from 'hoc/OnlyAuth';
import TabPersonal from './_TabPersonal';
import TabChangePwd from './_TabChangePwd';
import TabSocial from './_TabSocial';

import s from "./ProfilePage.scss";
import LINKS_MAIN from 'config/links';
import TEXT_PROFILE from 'texts/profile';
import {PROFILE_PERSONAL, PROFILE_CHANGE_PWD, PROFILE_SOCIAL} from 'const/profile';
import Navbar from "components/Navbar";

const ProfilePage = props => {
    const
        // Список табов (подразделов)
        tabs = [
            { id: PROFILE_PERSONAL, title: TEXT_PROFILE.TAB_PERSONAL },
            { id: PROFILE_CHANGE_PWD, title: TEXT_PROFILE.TAB_CHANGE_PWD },
            // { id: PROFILE_SOCIAL, title: TEXT_PROFILE.TAB_SOCIAL, link: LINKS_MAIN.PROFILE.replace( /:tab/, PROFILE_SOCIAL ) }
        ],

        // Текущий таб (из url'а)
        currentTab = props.match.params.tab || PROFILE_PERSONAL;

    const content = (() => {
        switch ( currentTab ) {
            case PROFILE_PERSONAL:
                return <TabPersonal/>;
            case PROFILE_CHANGE_PWD:
                return <TabChangePwd/>;
            case PROFILE_SOCIAL:
                return <TabSocial/>;
        }
    })();
    const selectTabAction = (tab) => {
        props.history.push(LINKS_MAIN.PROFILE.replace( /:tab/, tab ));
    };

    return (
        <OnlyAuth>
            <Page>
                <PageInner>
                    {/*<h1 className={s.header}>{TEXT.PROFILE}</h1>*/}
                        <Navbar selectTabAction={selectTabAction}
                                currentTab={currentTab}
                                tabs={tabs}
                                size="md"
                        />
                        <Wrapper className={s.myProducts}>
                            {content}
                        </Wrapper>

                </PageInner>
            </Page>
        </OnlyAuth>);
};

export default withRouter( ProfilePage );

