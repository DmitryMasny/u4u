import React from 'react';
import WINDOW_TEXT from 'texts/offer';
import { Page, PageInner } from 'components/Page';

const Requisites = () => {
    return (
        <Page>
            <PageInner>
                <div dangerouslySetInnerHTML={{ __html: WINDOW_TEXT.text }}/>
            </PageInner>
        </Page>
    )
};

export default Requisites
