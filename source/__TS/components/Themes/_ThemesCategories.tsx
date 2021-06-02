// @ts-ignore
import React from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import { modalSpecProjectAction} from 'actions/modals';

// @ts-ignore
import { IconLock, IconLockOpen } from 'components/Icons';
// @ts-ignore
import { GALLERY_SPEC, GALLERY_CATEGORY } from 'const/metrics'
// @ts-ignore
import sendMetric from 'libs/metrics'
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import TEXT_GALLERY from 'texts/gallery';


// @ts-ignore
import { IThemeCategories, ICategory } from "__TS/interfaces/themes";

import {
    themesCategoriesSelector,
    themesAdminCategoriesSelector,
    themesSpecProjectSelector, themesAdminProductGroupsSelector, themesProductTypesSelector,
} from "./_selectors";

import {
    specProjectModalAction
} from "./_actions";

import {ThemeCategoriesStyled} from "./_styles";

const Category: React.FC<ICategory> = ({name, id, selected, onClick, spec}) => (
    <div className={`category ${selected ? 'active': ''} ${spec ? 'spec': ''}`} onClick={()=>onClick(id)}>
        {spec && (selected ? <IconLockOpen size={18}/> : <IconLock size={18}/> )} {name}
    </div>
);

/**
 * Список категорий темы
 */
const ThemeCategories: React.FC<IThemeCategories> = ({setCategoryAction, selectedCategory, productType, isAdmin}) => {

    const categories = isAdmin ?
        useSelector(themesAdminCategoriesSelector)
        :
        useSelector((s)=>themesCategoriesSelector(s, productType));
    // const specProject = useSelector(themesSpecProjectSelector);

        return (
            <ThemeCategoriesStyled>
                {!categories || !categories.length
                    ?
                        <div className="categoriesLoading">
                            <Spinner size={30} fill/>
                        </div>
                    :
                        <div className="categoriesWrap">
                            <Category onClick={setCategoryAction} key={-1} name={TEXT_GALLERY.ALL} id={0} selected={selectedCategory === 0} />
                            {categories.map( ( cat, key ) => <Category
                                id={cat.id}
                                onClick={setCategoryAction}
                                selected={selectedCategory === cat.id}
                                key={key}
                                name={cat.name}/>
                            )}

                            {/*<Category spec
                                      onClick={()=>{ sendMetric(GALLERY_SPEC); specProjectModalAction(true)}}
                                      key='spec'
                                      name={TEXT_GALLERY.SPECPROJECT}
                                      id={999}
                                      selected={specProject} />*/}

                            {/*{specProject &&
                                <>
                                    <div className="categoriesSpecProjectKey">{specProject}</div>
                                    <div className="categoriesSpecProjectCancel" onClick={()=>specProjectModalAction(false)}>Отменить</div>
                                </>
                            }*/}
                        </div>
                }
            </ThemeCategoriesStyled>
        );
};

export default  ThemeCategories;