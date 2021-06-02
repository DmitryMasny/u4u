import React, { Component } from 'react';
import { addScript } from 'libs/helpers';
import Spinner from 'components/Spinner';


/**
 * Яндекс карты
 * props.height {String, Number}
 * props.width {String, Number}
 */
export default class YaMaps extends Component {
    static defaultProps = {
        height: '500',
        width:'100%'
    };

    state = {
      isLoaded: false
    };

    constructor(props) {
        super(props);
        this.yaMapsCont = React.createRef();
    }

    componentDidMount () {
        this.script = addScript({
            src:'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ab5c8c8a480f978fb649e4e237b677d9577474d349ae7d748b243e00b65b82186&amp;width='+
                this.props.width + '25&amp;height='+
                this.props.height + '&amp;lang=ru_RU&amp;scroll=true',
            container: this.yaMapsCont.current
        });
        this.script.onload = () => this.setState({isLoaded: true});
    }
    componentWillUnmount() {
        if (this.script) {
            this.script.remove();
        }
    }
    render () {
        return (
            <div ref={this.yaMapsCont} style={{height:this.props.height + 'px'}}>
                { !this.state.isLoaded && <Spinner size={50}/> }
            </div>
        )
    }
}
