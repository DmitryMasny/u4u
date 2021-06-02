import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom'
import { Page, PageInner } from 'components/Page';
import { Btn } from 'components/_forms';

import BLOG from './blogData';
import SALES from './salesData';
import {StyledPostsList, StyledPostsItem} from './styles';

import Post from './Post';
import SaleTest from './posts/SaleTest';
import SaleTest2 from './posts/SaleTest2';

import LINKS from "config/links";

//время в милисекундах ОДИН ЧАС
const ONE_HOUR = 1000 * 60 * 60;
//время в милисекундах ОДИН ДЕНЬ
const ONE_DAY = ONE_HOUR * 24;
// прячем каждую n прошедшую акцию
const HIDE_EVERY_INDEX = 2;

const nowDate = new Date().getTime();

const PostsList = ({list, selectAction, isSales}) => {

    const selectActionHandler = ({id, url, showMoreInfo}) => {
        if (isSales && !showMoreInfo) {
            if (url) selectAction(url);
        } else selectAction(LINKS[ isSales ? 'SALES' : 'BLOG' ].replace( ':post', id ));
    };

    return (
        <StyledPostsList>
            {list && list.map((p)=><PostBlock post={p} selectAction={selectActionHandler} key={p.id}
                                              showMoreInfo={!isSales || p.showMoreInfo}/> )}
        </StyledPostsList>);
};

const ReadMoreBtn = () => <span className="ReadMoreBtn">Подробнее...</span>;

//считаем срок действия акции
const PostDate = ( { days } ) => {
    if (days < 0) {
        return <span className="PostDate">Акция закончилась</span>;
    }
    return <>
                <span className="PostDate">До конца акции осталось { days } дней.</span>
                <div style={{paddingTop: 10}}><Btn intent="primary" >Участвовать!</Btn></div>
           </>
};

const PostBlock = ( { post, selectAction, showMoreInfo } ) => {
    const diff = post.date && (post.date.getTime() - nowDate) || 0;
    const days = post.date && Math.floor( diff / ONE_DAY ) || 0;

    const cursor = post.email ? 'default' : null;
    return (
        <StyledPostsItem cursor={cursor} clickable={days > -1 && (showMoreInfo || post.url || post.email)} fullWidth={!post.description || !post.src}>
            <div className="post-inner" onClick={()=>days > -1 && selectAction({id: post.id, url: post.url, showMoreInfo: post.showMoreInfo})}>
                {(post.src || post.email) && <div className="post-thumb">
                                                <img src={post.src} alt={post.title}/>
                                            </div>}
                {post.description && <div className="post-info">
                    <h2 className="post-title">
                        {post.title}
                    </h2>
                    <p className="post-text" dangerouslySetInnerHTML={{ __html: post.description }} />
                    {showMoreInfo && <ReadMoreBtn/>}
                    {days && days < 1000 && <PostDate days={days}/> || null}
                    {days && days > 1000 && <div style={{paddingTop: 10}}>
                                                <a href={post.email} target={'_blank'}>
                                                    <Btn intent="primary" >
                                                    {post.buttonText || 'Участвовать!'}
                                                    </Btn>
                                                </a>
                                            </div> || null}
                </div>}
            </div>
        </StyledPostsItem>);
};

/**
 * БЛОГ
 */
const BlogPage = ({isSales, match, history}) => {
    let oldSalesIndex = 0;
    // Определяем что и каком порядке показывать
    const DATA = isSales ?
        SALES.sort((a, b)=> b.date - a.date).filter((post, i)=>{
            const diff = post.date && (post.date.getTime() - nowDate) || 0;

            if ( !oldSalesIndex && diff < 0 ) oldSalesIndex = i;
            return i === 0 && diff <= 0 || diff >= 0 || (i - oldSalesIndex) % HIDE_EVERY_INDEX === 0;
        })
        : BLOG;

    const [currentPost, setCurrentPost] = useState( null );

    useEffect(()=>{
        if (!DATA) return null;
        const postId = match && match.params[ 'post' ];
        const current = DATA.find( ( p ) => p.id === postId );

        if ( current ) {
            setCurrentPost( current );
        } else {
            console.log('cant find post ', postId);
            if ( postId ) history.push( LINKS[ isSales ? 'SALES' : 'BLOG' ].replace( ':post', '' ) );
        }
    }, [match] );


    if ( !DATA ) return null;


    const selectAction = ( url ) => {
        history.push( url );
    };

    return (
        <Page>
            <PageInner>
                {currentPost ?
                    <Post {...currentPost}/>
                :
                    <PostsList list={DATA} selectAction={selectAction} isSales={isSales}/>
                }

            </PageInner>
        </Page>);
};


export default withRouter(BlogPage);

