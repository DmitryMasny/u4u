// @ts-ignore
import React from 'react';
import styled from 'styled-components';
// @ts-ignore
import {COLORS} from 'const/styles';
// @ts-ignore
import {Select} from 'components/_forms';



/** Interfaces */
interface Props {
    list: ListProps[];                  // список выбора
    onSelect?: (id: string)=>any;       // экшен выбора
    selectedId: any;        // текущий id из списка
    label?: string;         // лейбл
    labelBtn?: any;         // кнопка после лейбла (Форматы: [повернуть])
    compact?: boolean;      // true если: показать весь list (не Select и без ограничения высоты)
    grid?: boolean;         // (не SelectПоказать элементы списка блоками (не Select)
    maxWidth?: number;      // ограничение Select по ширине
    large?: boolean;        // если grid, то увеличенный
    noEmpty?: boolean;      // true если: Показывать выбор, даже с одим вариантом
}
interface ListProps {
    id: string,
    name: string|JSX.Element,
    icon?: JSX.Element,
}

/** Styles */
const StyledProductSetFilter = styled('div')`
    margin-bottom: 20px;
    .label {
      font-size: 18px;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 5px;
    }
`;

/**
 * Блок фильтра (выбора опции) продукта витрины
 */
const ProductSetFilter: React.FC<Props> = ({list, onSelect, selectedId, label, labelBtn, compact, grid, maxWidth, large, noEmpty}) => {

    if (!list || !list.length || !noEmpty && list.length < 2) return null;

    return <StyledProductSetFilter borders={!compact && grid}>
        {
            label &&
            <h3 className="label">
                {label}&nbsp;
                {labelBtn}
            </h3>
        }
        <Select list={list}
                onSelect={onSelect}
                selectedId={selectedId}
                showAllGridItems={!compact}
                grid={grid}
                large={large}
                maxWidth={maxWidth}
        />
    </StyledProductSetFilter>;
};

export default ProductSetFilter;



