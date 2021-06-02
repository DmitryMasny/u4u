import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

// import s from './index.scss';

/**
 * Drag Source Specification
 * http://react-dnd.github.io/react-dnd/docs/api/drag-source
 */
const spec = {
  beginDrag: (props) => {
    return {type: props.type, el: props.children, };
  },
  // endDrag: (props) => {
  //  console.log('props',props);
  // },
};

/**
 * Collecting Function
 * @param connect - An instance of DragSourceConnector
 * @param monitor - An instance of DragSourceMonitor
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

let type = '';

/**
 * Обёртка для Drag-элемента
 */
class DragWrap extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
  };

  componentDidMount() {
    type = this.props.type;
  }
  render() {
    const { isDragging, connectDragSource, children } = this.props,
          style = { opacity: isDragging ? 0.5 : 1, display: ' inline-block' };

    return connectDragSource(<div style={style}>{children}</div>);
  }
}

export default DragSource(( {type} ) => type, spec, collect)(DragWrap);
