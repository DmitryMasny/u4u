import React from 'react';

import { Page, PageInner } from "components/Page";
import { IMG_DIR } from 'config/dirs'
//import { ResizeContext } from 'contexts/resizeContext';

import s from './index.scss';


/*class PageImage extends Component {

    state = {
        pageImageWidth: 0
    };

    componentDidMount() {
        this.pageImage && this.setState({pageImageWidth: this.pageImage.offsetWidth});
    }

    shouldComponentUpdate ( nextProps, nextState) {
        if (nextState.pageImageWidth !== this.state.pageImageWidth){
            this.pageImage && this.setState({pageImageWidth: this.pageImage.offsetWidth});
            return true;
        }
        return false;
    }

    render () {
        return (
            <div className={s.pageImage} ref={(r)=>this.pageImage = r}>
                <div className={s.lines}/>
                <img className={s.image} src={IMG_DIR + 'example-page404.png'}/>
                <div className={s.title} style={{ fontSize: fontSize + 'px' }}>
                    Упс, страница <br/>
                    не найдена
                </div>
            </div>);
    }
}

PageImage.contextType = ResizeContext;*/


const Page404 = props => {
    return (
        <Page>
            <PageInner className={s.page404}>
                <div className={s.pageImage}>
                    <div className={s.lines}/>
                    <img className={s.image} src={IMG_DIR + 'common/page404.png'}/>
                    <svg className={s.title} viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                        <text x="170" y="440" >
                            Упс, страница
                        </text>
                        <text x="170" y="500" >
                            не найдена
                        </text>
                    </svg>

                </div>
            </PageInner>
        </Page>);
};
export default Page404;

