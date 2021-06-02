import React from 'react';
import WINDOW_TEXT from 'texts/reqisites';
import { Page, PageInner,Wrapper, PageTitle } from 'components/Page';

const Requisites = () => {
    return (
        <Page>
            <PageInner>
                <Wrapper>
                    <PageTitle>{ WINDOW_TEXT.title}</PageTitle>
                    <div dangerouslySetInnerHTML={{ __html: WINDOW_TEXT.text }}/>
                </Wrapper>
            </PageInner>
        </Page>
    )
};

export default Requisites
