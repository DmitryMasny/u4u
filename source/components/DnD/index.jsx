import React, { PureComponent, Fragment } from 'react';
import { DragDropContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import { TouchTransition, MouseTransition } from 'dnd-multi-backend';

export Drop from './DropWrap';
export Drag from './DragWrap';

class DnD extends PureComponent {
  generatePreview(type, item, style) {
    return <div style={style}>{item.el}</div>;
  }

  render() {

    return (
      <div>
          {this.props.children}
          <Preview generator={this.generatePreview} />
      </div>
    );
  }
}

const HTML5toTouch2 = {
    backends: [
        {
            backend: HTML5Backend,
            transition: MouseTransition,
        },
        {
            backend: TouchBackend({enableMouseEvents: true}),
            preview: true,
            transition: TouchTransition,
        },
    ],
};

export default DragDropContext(MultiBackend(HTML5toTouch2))(DnD);
