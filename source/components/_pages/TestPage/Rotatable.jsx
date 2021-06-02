import React, { useState, Fragment } from 'react'
//import ResizableRect from 'react-resizable-rotatable-draggable';
//import ResizableRect from 'react-resizable-rotatable-draggable-touch';
import ResizableRect from 'components/_3dParty/react-resizable-rotatable-draggable-touch';

import s from "./index.scss";
import "./rotatable.scss";

const App = () => {
    const padding = 0;
    const [ mover, setMover ] = useState( {
            width: 100,
            height: 100,
            top: 100,
            left: 100,
            rotateAngle: 0,
            moveId: 0,
            shown: false
    });

    const [ rect, setRect ] = useState( {
                                            0: {
                                                width: 150,
                                                height: 200,
                                                top: 10,
                                                left: 10,
                                                rotateAngle: 0,
                                                color: 'red',
                                                photo: {
                                                    url: 'http://lh3.googleusercontent.com/BaIShQBLrBWEgxHoCYFDHJDwNDbFuaVA4U_O40a28wcb4dJTLTPsvDANaGmE8roGwPqqWgW9t_r2nanITDwIatcK=h750',
                                                    width: 150,
                                                    height: 200,
                                                    ratio: 0.75,
                                                    top: 0,
                                                    left: 0,
                                                    rotateAngle: 0
                                                }
                                            },
                                            1: {
                                                width: 250,
                                                height: 150,
                                                top: 10,
                                                left: 250,
                                                rotateAngle: 0,
                                                color: 'green',
                                            },
                                            2: {
                                                width: 90,
                                                height: 90,
                                                top: 250,
                                                left: 100,
                                                rotateAngle: 25,
                                                color: 'blue',
                                            }
                                          });

    const setNewValueToSelectedObject =( values ) => {
        let r =  {...rect[ mover.moveId ], ...values };
        let s = rect;
        s[ mover.moveId  ] = r;
        setRect( s );
    };

    const handleResize = (style, isShiftKey, type) => {
        // type is a string and it shows which resize-handler you clicked
        // e.g. if you clicked top-right handler, then type is 'tr'
        let { top, left, width, height } = style;
        top = Math.round( top );
        left = Math.round( left );
        width = Math.round( width );
        height = Math.round( height );

        setMover({...mover,
                     top,
                     left,
                     width,
                     height
                  });



        setNewValueToSelectedObject( {
                                         top: top + padding,
                                         left: left + padding,
                                         width: width - padding * 2,
                                         height: height - padding * 2,
                                         //photo: photo
                                     } );

    };

    const handleRotate = ( rotateAngle ) => {
        setMover({...mover,
                     rotateAngle
                 });
        setNewValueToSelectedObject( { rotateAngle } );
    };

    const handleDrag = ( deltaX, deltaY ) => {
        const left = mover.left + deltaX,
              top = mover.top + deltaY;

        setMover({...mover,
                     left,
                     top
                 });
        setNewValueToSelectedObject( { top: top + padding, left: left + padding} );
    };

    const handlerStartResize = ( id, e )=>  {
        const o = rect[id];
        setMover({...mover,
                     left: o.left - padding,
                     top: o.top - padding,
                     width: o.width + padding * 2,
                     height: o.height + padding * 2,
                     rotateAngle: o.rotateAngle,
                     moveId: id,
                     show: true
                 });
        e.preventDefault();
        e.stopPropagation();
    };
    const handlerStopResize = ()=>  {

        setMover({...mover,
                     show: false
                 });
    };

    const { width, top, left, height, rotateAngle, show } = mover;
    return (
        <div className={s.rotatableBlock}>
            <svg id="chart" style={{height: '100%', width: '100%', margin: 0}}>
                {Object.entries(rect).map(( [id, item]) => {
                    return (<Fragment key={id}>
                                <rect width={item.width}
                                      height={item.height}
                                      x={item.left}
                                      y={item.top}
                                      transform = {`rotate(${item.rotateAngle}  ${item.left + item.width / 2 } ${item.top + item.height / 2})`}
                                      style={{fill: item.color, stroke: 'green', strokeWidth: 1}}
                                      onMouseDown={(e)=>handlerStartResize(id, e)}
                                />
                                {item.photo &&
                                <clipPath id={'rec' + id}>
                                    <rect width={item.width}
                                          height={item.height}
                                          x={item.left}
                                          y={item.top}
                                          transform = {`rotate(${item.rotateAngle}  ${item.left + item.width / 2 } ${item.top + item.height / 2})`}
                                          style={{fill: item.color, stroke: 'green', strokeWidth: 1}}
                                          onClick={(e)=>handlerStartResize(id, e)}
                                    />
                                </clipPath>}
                                {item.photo &&
                                <image  xlinkHref={item.photo.url}
                                        x={item.photo.left}
                                        y={item.photo.top}
                                        width={item.photo.width}
                                        height={item.photo.height}
                                        transform = {`rotate(${item.photo.rotateAngle}  ${item.photo.left + item.photo.width / 2 } ${item.photo.top + item.photo.height / 2})`}
                                        clipPath={`url(#rec${id})`}
                                />}
                            </Fragment>);
                })}
            </svg>
            {/*Object.entries(rect).map(( [id, item]) =>
                          <div style={{ position: 'absolute',
                                        top: item.top,
                                        left: item.left,
                                        width: item.width,
                                        height: item.height,
                                        transform: 'rotate(' + item.rotateAngle + 'deg)',
                                        backgroundColor: item.color,
                                        color: 'white',
                                        textAlign: 'center'}}
                               onClick={(e)=>handlerStartResize(id, e)}
                               key={id}>
                              {item.photo &&
                                <img    src={item.photo.url}
                                        style={{
                                            position: 'absolute',
                                            top: item.photo.top,
                                            left: item.photo.left,
                                            width: item.photo.width,
                                            height: item.photo.height,
                                            transform: 'rotate(' + item.photo.rotateAngle + 'deg)'
                                        }}
                                />
                              }
                          </div>)*/}

            {show &&
                <ResizableRect

                    left={left}
                    top={top}
                    width={width}
                    height={height}
                    rotateAngle={rotateAngle}
                    // aspectRatio={false}
                    // minWidth={10}
                    // minHeight={10}
                    zoomable='n, w, s, e, nw, ne, se, sw'
                    // rotatable={true}
                    // onRotateStart={this.handleRotateStart}
                    onRotate={handleRotate}
                    // onRotateEnd={this.handleRotateEnd}
                    // onResizeStart={this.handleResizeStart}
                    onResize={handleResize}
                    // onResizeEnd={this.handleUp}
                    // onDragStart={this.handleDragStart}
                    onDrag={handleDrag}
                    // onDragEnd={this.handleDragEnd}
                />
            }
        </div>
    )
};

export default App