import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import s from './index.scss';

/**
 * Drop Target Specification
 * http://react-dnd.github.io/react-dnd/docs/api/drag-source
 */
const spec = {
  drop: (props, monitor, component) => {
    console.log(`Dropped: ${monitor.getItem().type}`);
  },
  // hover: (props, monitor, component)=> {
  // console.log(`hover: ${monitor.getItem().type}`);
  // },
  // canDrop: (props, monitor,)=> {
  //   console.log(`canDrop: ${monitor.getItem().type}`);
  // }
};

/**
 * Collecting Function
 * @param connect - An instance of DragSourceConnector
 * @param monitor - An instance of DragSourceMonitor
 */
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  };
}

/**
 * Обёртка для Drop-зоны
 */
class DropWrap extends PureComponent {
  static propTypes = {
    types: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    className: PropTypes.string,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
  };

  render() {
    const { isOver, canDrop, connectDropTarget, className, classNameOver, classNameActive, children } = this.props;
    const style = { border: '1px dashed black' , ...canDrop && {...isOver ? {backgroundColor: '#c55'} : { backgroundColor: '#c99'} }};

    const finalClassName = children?
        (className + (canDrop ?  (isOver ? ` ${classNameOver || ''}` : ` ${classNameActive || ''}`) : ''))
        :
        (s.dropWrap + (canDrop ?  (isOver ? ` ${s.over}` : ` ${s.active}`) : ''));

    return connectDropTarget( <div className={finalClassName}>{children}</div>);
  }
}

export default DropTarget(( {types} ) => types, spec, collect)(DropWrap);
