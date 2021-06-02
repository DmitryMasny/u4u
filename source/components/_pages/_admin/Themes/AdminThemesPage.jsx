import React from 'react';
import Themes from '__TS/components/Themes'
import { Page, PageInner } from 'components/Page';


/**
 * Admin Themes
 */
const AdminThemes = (props) => {
    return <Page>
        <PageInner>
            <Themes isAdminPage/>
        </PageInner>
    </Page>
};

export default AdminThemes;