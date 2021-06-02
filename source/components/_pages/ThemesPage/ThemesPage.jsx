import React from 'react';
import Themes from '__TS/components/Themes'
import { Page, PageInner } from 'components/Page';


/**
 * Themes page
 */
const ThemesPage = (props) => {
    return <Page>
        <PageInner>
            <Themes/>
        </PageInner>
    </Page>
};

export default ThemesPage;