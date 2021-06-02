// @ts-ignore
import React, { memo } from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet'


/** Interfaces */
interface Props {
    title?: string;
    description?: string;
}



const ProductMetaTags: React.FC<Props> = ({title, description}) => {
    if ( !title ) return null;

    // @ts-ignore
    return <Helmet>
        <title>{ title }</title>
        <meta name="title" content={ title }/>
        <meta name="description" content={ description }/>
        <meta property="title" content={ title }/>
        <meta property="description" content={ description }/>
        <meta property="og:title" content={ title }/>
        <meta property="og:description" content={ description }/>
    </Helmet>
};

export default memo( ProductMetaTags );