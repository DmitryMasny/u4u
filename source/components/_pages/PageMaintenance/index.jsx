import React from 'react';

import { IMG_DIR } from 'config/dirs'
import { Page, PageInner } from "components/Page";
import s from './index.scss';

const PageMaintenance = props => {
    return (
        <Page>
            <PageInner>
                <div className={s.pageImage}>
                    <img className={s.image} src={IMG_DIR + 'common/pageMaintenance.png'}/>
                    <svg className={s.title} viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                        <text x="410" y="80"  textAnchor="middle">
                           Идут технические работы
                        </text>
                    </svg>
                </div>
            </PageInner>
        </Page>);
};
export default PageMaintenance;


