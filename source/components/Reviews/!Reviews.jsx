import React from 'react';

import DATA from './data';
import {StyledReviewsWrap, StyledReviews} from './styles';
import ReviewAva from './_ReviewAva';
import {IconYandex, IconVk} from 'components/Icons';


const SourceIcon = ( { slug } ) => {
    switch ( slug ) {
        case 'yandex':
            return <IconYandex className={slug}/>
        case 'vk':
            return <IconVk className={slug}/>
    }
    return null;
};


const ReadMoreBtn = ({url, source}) => url && <a href={url} target="_blank" className={`ReadMoreBtn ${source ? 'source' : ''}`}>
    { source ?
        <span><SourceIcon slug={source.slug}/>&nbsp;{source.name}</span>
        : 'Подробнее...'
    }</a>;

const ReviewBlock = ({review}) => {

    return (
        <div className="review">
            <div className="review-inner">

                <div className="review-header">
                    <ReviewAva ava={review.authorAva} name={review.authorName}/>
                    <div className="review-name">{review.authorName}</div>
                    <div className="review-date">{review.date}</div>
                    <ReadMoreBtn url={review.url} source={{name: review.sourceName, slug: review.sourceSlug }}/>
                </div>

                <div className="review-text">
                    {review.text}
                    <ReadMoreBtn url={review.url}/>
                </div>
            </div>
        </div>);
};

const Reviews = ({productSlug}) => {
    const currentReviews = DATA[productSlug];

    return currentReviews &&
        <StyledReviewsWrap>
            <h2>Отзывы</h2>
            <StyledReviews>
                {currentReviews.map((r, i)=><ReviewBlock review={r} key={i}/>)}
            </StyledReviews>
        </StyledReviewsWrap> || null;
};


export default Reviews;

