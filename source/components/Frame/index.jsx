import React from 'react';
import s from './index.scss';

const Frame = React.createClass({
    render: () => {
        return <iframe />;
    },
    componentDidMount: () => {
        this.renderFrameContents();
    },
    renderFrameContents: () => {
        const doc = this.getDOMNode().contentWindow.document;

        if(doc.readyState === 'complete') {
            const contents = (
                <div className={s.frame}>
                    {this.props.children}
                </div>
            );

            React.renderComponent(contents, doc.body);
        } else {
            setTimeout(this.renderFrameContents, 0);
        }
    },
    componentDidUpdate: () => {
        this.renderFrameContents();
    },
    componentWillUnmount: () => {
        React.unmountComponentAtNode(this.getDOMNode().contentWindow.document.body);
    }
});

export default Frame;
