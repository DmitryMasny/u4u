import React, { Component } from 'react';

import s from './Slider.scss';

// import { Slider as BPSlider } from 'bp';

class Slider extends Component {

    constructor( props ) {
        super(props);
        this.state =  {
            value: 0
        };
    }

    componentDidMount() {
        this.setState({value: this.props.defaultValue});
    }

    shouldComponentUpdate ( nextProps, nextState ) {
        if (nextProps.min !== this.props.min || nextProps.max !== this.props.max) {
            this.setState({value: nextProps.defaultValue});
            return true;
        }
        return (nextState.value !== this.state.value);
    }

    handlerSliderChange = (value) => this.setState({value: value});

    render() {
        // Определяем css классы
        let classNameFull = s.slider;

        const {className, ...other} = this.props,
            labelStep = this.props.max - this.props.min;

        className ? (classNameFull += ` ${className}`) : null;

    return <h2>Слайдер нема</h2>;
        // return null;
        /*<BPSlider {...other}
                      className={classNameFull}
                      labelStepSize={labelStep}
                      onChange={this.handlerSliderChange}
                      value={this.state.value}
            />*/
    }
}

export default Slider;
