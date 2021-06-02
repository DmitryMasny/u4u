// @ts-ignore
import React, {memo} from 'react';
import styled from 'styled-components'

// @ts-ignore
import { COLORS } from 'const/styles';


/** Interfaces */
interface IthemeTips {
    total: number;
    completed: number;
    isFull: boolean;
}

/** Styles */
const ThemeTipsStyled = styled('div')`
    padding: 20px;
    color: ${COLORS.MUTE};
    text-align: center;
`;

//
const ThemeTips: React.FC<IthemeTips> = ( {total, completed, isFull} ): any => {

    return <ThemeTipsStyled>
        {total ?
            completed ?
                isFull ?
                    'Все форматы заполнены, тему можно опубликовать!'
                    :
                    'Перетащите готовый формат на другой формат, чтобы скопировать его'
                :
                'Выберите формат ниже чтобы заполнить его'
            :
            'загрузка темы'
        }
    </ThemeTipsStyled>
};

export default memo( ThemeTips );