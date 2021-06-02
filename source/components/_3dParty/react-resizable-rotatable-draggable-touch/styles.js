export default `
position:absolute;
border: 2px solid #1278ca;
touch-action:none;
outline: 2px solid white;

.square {
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid #1278ca;
    background: white;
}

&.orange {
    border: 2px solid #ea7c23
    .square {
        border: 2px solid #ea7c23;
        border-radius: 100%;
    }
}

.resizable-handler {
    position: absolute;
    width: 20px;
    height: 20px;
    cursor: pointer;
    z-index: 1;
    &.tl, &.t, &.tr {
        top: -10px;
    }
    &.tl, &.l, &.bl {
        left: -10px;
    }
    &.bl, &.b, &.br {
        bottom: -10px;
    }
    &.br, &.r, &.tr {
        right: -10px;
    }
    &.l, &.r {
        margin-top: -7px;
    }
    &.t, &.b {
        margin-left: -7px;
    }   
}

.rotate {
    position: absolute;
    left: 50%;
    top: -36px;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.t, .tl, .tr {
    top: -8px;
}

.b, .bl, .br {
    bottom: -8px;
}

.r, .tr, .br {
    right: -8px;
}

.tl, .l, .bl {
    left: -8px;
}

.l, .r {
    top: 50%;
    margin-top: -8px;
}

.t, .b {
    left: 50%;
    margin-left: -8px;
}



`;