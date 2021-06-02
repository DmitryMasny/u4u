import React from 'react';
import {StyledPost} from './styles';
import {IMG_DIR} from "config/dirs";
import {POST_CONTENTS} from './blogData';


const PostItem = ({ id, img, header, p, a, b, span, ol, ul, content, html } ) => {
    if (html) return <span dangerouslySetInnerHTML={{__html: html}}/>;
    return <>
        {img && <div className="postImage">
            <img src={`${IMG_DIR}blog/${id}/${img}`} alt={header || ''}/>
        </div>}
        {header && <h2>{header}</h2>}
        {p && <p>{p} {a && <a href={a.href}>{a.text}</a>}</p>}
        {b && <b>{b}</b>}
        {span && <span>{span}</span>}
        {ol && <ol>{ol.map((li, i)=><li key={i}><PostItem id={id} {...li}/></li>)}</ol>}
        {ul && <ul>{ul.map((li, i)=><li key={i}><PostItem id={id} {...li}/></li>)}</ul>}
        {content && content.map((item, i)=>item && <PostItem id={id} {...item} key={i}/>)}
        {header && <div className="mb"/>}
    </>
};

const Post = ({ id, title, src } ) => {
    const content = POST_CONTENTS[id];
    if (!id || !content) return <div><h2>Пост не найден</h2></div>;
    return (<StyledPost>

        <div className="postImage">
            <img src={src} alt={title}/>
        </div>
        <h1>{title}</h1>

        {content && content.map((item, i)=>item && <PostItem id={id} {...item} key={'post' + i}/>)}

    </StyledPost>);
};

export default Post;