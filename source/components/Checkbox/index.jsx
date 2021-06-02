import React, { Component } from 'react';

import s from './Checkbox.scss';
import { IconCheck } from "components/Icons";


class Checkbox extends Component {

    state = {
        checked: false
    };
    componentDidMount () {
        if (this.props.checked) this.setState({checked :this.props.checked});
    }

    shouldComponentUpdate ( nextProps, nextState ) {
        if (nextProps.checked !== this.props.checked ) {
            this.setState({checked: nextProps.checked});
            return false;
        }
        return true;
    }

    handlerClick = () => {
        this.props.onChange && this.props.onChange();
        this.setState({checked: !this.state.checked});
    };

    render () {
        // Определяем css классы
        let className = s.checkbox;
        this.props.className ? (className += ` ${this.props.className}`) : null;    // Доп. класс.
        this.state.checked ? (className += ` ${s.active}`) : null;                // Активное состояние.
        this.props.disabled ? (className += ` ${s.disabled}`) : null;                // Можно снять выделение при повторном
        // this.props.small ? (className += ` ${s.small}`) : null;                 // Уменьшенный.
        // this.props.large ? (className += ` ${s.large}`) : null;                 // Увеличенный.
                                                                                 // клике, задаем cursor:default
        return (
            <div className={className} onClick={this.handlerClick}>
                <div className={s.checkboxBox}>
                    <IconCheck className={s.checkboxIcon}/>
                </div>
                <span className={s.checkboxText}>{this.props.label}</span>
            </div>);

    }
}

export default Checkbox;
