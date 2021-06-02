import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor( props ) {
        super( props );
        this.state = { hasError: false };
    }
    componentDidCatch(error, info) {

        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            console.log('ErrorBoundary: ОШИБКО!!!');
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return  React.Children.map( this.props.children, child =>
                    React.cloneElement( child, this.props)
                );
    }
}

export default ErrorBoundary;
