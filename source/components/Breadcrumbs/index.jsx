import React, { Fragment, createElement } from 'react';
import s from './breadcrumbs.scss';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { BREAD_CRUMBS_LINKS } from 'config/routes';

const Breadcrumbs = ( { breadcrumbs, renderHeaderAndFooter } ) => {
    //если не нужно рендерить, возвращаем null
    if ( !renderHeaderAndFooter ) return null;

    if ( breadcrumbs.length < 2 ) return null;
    return (
        <div className={s.breadcrumbs}>
            <div className={s.breadcrumbsInner}>
                {breadcrumbs.map( ( breadcrumb, index ) => {

                    if (index > 1 && index < (breadcrumbs.length - 1) && !breadcrumbs[index-1].props.children ) return null;
                    if ( ["/postery", "/photo"].some((x) => x === breadcrumb.key) ) return null;
                    if (index > 0 && index < (breadcrumbs.length - 1) && breadcrumbs[index].props.children === breadcrumbs[index+1].props.children ) return null;

                    const b = ( typeof breadcrumb.type === 'function' ? createElement(breadcrumb.type, {...breadcrumb.props, ...{last: breadcrumbs.length - 1 === index}}) : breadcrumb.props.children);

                    return ((breadcrumbs.length - 1) === index ?    // если последний элемент
                        <span key={index}>{b}</span> : // тогда не ссылка
                        <Fragment key={index}>
                            <NavLink to={breadcrumb.props.match.url}>{b}</NavLink>
                            &nbsp;/&nbsp;
                        </Fragment>);
                    }
                )}
            </div>
        </div>
    );
};

export default withBreadcrumbs( BREAD_CRUMBS_LINKS, { disableDefaults: true } )( Breadcrumbs );