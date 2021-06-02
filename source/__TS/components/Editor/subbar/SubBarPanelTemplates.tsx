// @ts-ignore
import React from 'react';

// @ts-ignore
import { SubBarSector, HelperText } from "__TS/styles/editor";

/**
 * Компонент суб-меню фоны!
 */
const SubBarPanelTemplates: React.FC = () => {
    return <SubBarSector>
        <HelperText>
            Выберите шаблон в библиотеке и перетащите его на страницу, чтобы применить
        </HelperText>
    </SubBarSector>
}

export default SubBarPanelTemplates;