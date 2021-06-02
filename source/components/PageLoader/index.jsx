import React from 'react';

import {Page, PageInner} from 'components/Page';
import Spinner from 'components/Spinner';


const PageLoader = props => (
    <Page>
        <PageInner>
            <Spinner fill />
        </PageInner>
    </Page>
);
export default PageLoader;
