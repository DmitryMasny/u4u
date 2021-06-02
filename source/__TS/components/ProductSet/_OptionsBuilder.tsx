// @ts-ignore
import React from 'react';

import ProductSetFilter from './_ProductSetFilter';
// import LabelInfoBtn from './_LabelInfoBtn';
// @ts-ignore
import {getOptionCategoryName} from 'libs/helpers';


/** Interfaces */
interface Props {
    options: any;
    selectAction: any;
}


/**
 * Конструктор опций продукта
 */
const OptionsBuilder: React.FC<Props> = ({ options, selectAction }) => {

    if ( !options ) return null;

    let reselect = null;  // Перезапишется если отсутсвует опция и надо перевыбрать

    const renderOptions =  options.map( filter => {
        if ( !filter.parameters ) return null;
        const selectedOption = filter.parameters.find( ( item ) => item.selected );

        if (!selectedOption) {
            selectAction({ id: filter.parameters[0].id, filterId: filter.id });
            reselect = { id: filter.parameters[0].id, filterId: filter.id };
            return null;
        }

        return <ProductSetFilter   list={filter.parameters}
                                   selectedId={selectedOption.id}
                                   onSelect={(id)=>selectAction( { id: id, filterId: filter.id })}
                                   label={`${getOptionCategoryName(filter.name)}:`}
                                   // labelBtn={<LabelInfoBtn data={filter.parameters}/>}
                                   compact={filter.parameters.length > 3}
                                   key={filter.id}
        />
    });

    if (reselect) {
        selectAction(reselect);
        return null;
    }

    return renderOptions;
};

export default OptionsBuilder;