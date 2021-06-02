import React, {memo, Fragment} from 'react';
import s from './Table.scss';

const ResponseWrap = ({ responsive, children, large, small }) => (responsive ?
        <div className={s.tableWrap + (large ? ` ${s.large}`: ` ${small ? s.small : null}`)}>
            {children}
        </div>
        : children
);

const Row = ( { head, children, className, headRow, emptyCell } ) => {
    if ( children === false || children.content === false ) {
        return <tr className={s.emptyRow}><td colSpan={headRow.length}/></tr>
    }

    const content = children.content || children;
    let trClassName = (children.className || '') + (className ? ` ${className}` : '');
    if (!trClassName) trClassName = null;

    return (
        <tr className={trClassName}>
            {content.map( ( cell, i ) => <Cell head={head} emptyCell={emptyCell} key={i}>{cell}</Cell> )}
        </tr>
    )
};

const Cell = ( { head, children, emptyCell } ) => {
    if (children === false || children.text === false){
        return <td className={s.emptyCell}>{emptyCell || ''}</td>
    }

    const className = children.className || null,
        text = children.text || children;

    return(
        head ?
            <th className={className} dangerouslySetInnerHTML={{__html: text}} />
            :
            <td className={className} dangerouslySetInnerHTML={{__html: text}} />
    );
};

/**
 * TABLE Component
 */
const Table = ( {data, responsive, fill, emptyCell, hover, className, title, desc, large, small, flipTable} ) =>{
    if (!data) return  null;

    // Если надо перевернуть таблицу - делаем это
    if (flipTable) {
       data = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
    }

    // Отделяем данные шапки от остальных
    const headRow = data.splice(0, 1)[0];



    const tableClassName = s.table
                            + (fill ?       ` ${s.fill}` : '')
                            + (hover ?      ` ${s.hover}` : '')
                            + (className ?  ` ${className}` : '');
    return (
        <Fragment>
            {title && <h3 className={s.tableTitle}>{title}</h3>}
            <ResponseWrap responsive={responsive} large={large} small={small} >
                <table className={tableClassName}>
                    <thead>
                        <Row head emptyCell={emptyCell} headRow={headRow}>{headRow}</Row>
                    </thead>
                    <tbody>
                        {data.map((row, i)=> <Row key={i} emptyCell={emptyCell} headRow={headRow}>{row}</Row> )}
                    </tbody>
                </table>
            </ResponseWrap>
            {desc && <div className={s.tableDesc}>{desc}</div>}
        </Fragment>
    );
};

export default memo(Table);
