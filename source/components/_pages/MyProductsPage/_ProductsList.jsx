import React, { Fragment, memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import 'components/PreviewAlbum/preview.scss';

import Product from './_Product';

/**
 * Список продуктов (позиций заказа)
 */
const ProductsList = memo(( { data, type, orderId, ...other } ) => {
    const dataArray = data.length ? data : [data]; // нам нужен массив
    return (<Fragment>

                <TransitionGroup>
                    {dataArray.map( product => (
                        <CSSTransition
                            key={product.id}
                            timeout={500}
                            classNames="product-fade"
                        >
                            <Product data={product}
                                     type={type}
                                     orderId={orderId}
                                     key={orderId + product.id}
                                     {...other} />
                        </CSSTransition>
                    ) )}
                </TransitionGroup>

            </Fragment>);
});

export default memo( ProductsList );