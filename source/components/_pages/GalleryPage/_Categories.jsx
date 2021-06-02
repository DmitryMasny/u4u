import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import s from './GalleryPage.scss';
import TEXT_GALLERY from 'texts/gallery';
import { getCategoriesAction } from './actions/categories';
import { modalSpecProjectAction} from 'actions/modals';
import { galleryCategoriesSelector, specProjectSelector } from './selectors';
import { withRouter } from 'react-router-dom';
import { IconLock, IconLockOpen } from 'components/Icons';
import { GALLERY_SPEC, GALLERY_CATEGORY } from 'const/metrics'
import sendMetric from 'libs/metrics'
import Spinner from 'components/Spinner';
import LINKS from 'config/links';

import { setSpecProjectAction } from 'components/_modals/SpecProject/actions';

const Category = ({name, id, selected, onClick, spec}) => (
    <div className={`${s.category} ${selected ? s.categoryActive: ''} ${spec ? s.categorySpec: ''}`} onClick={()=>onClick(id)}>
        {spec && (selected ? <IconLockOpen size={18}/> : <IconLock size={18}/> )} {name}
    </div>
);

class Categories extends Component {
    componentDidMount() {
        if ( !this.props.galleryCategoriesSelector ) {
            this.props.getCategoriesAction();
        }
    }
    selectCategoryHandler( id ) {
        const { history } = this.props;
        history.push( LINKS.GALLERY.replace( ':categoryId?', id > 0 ? id : '' ) );
    }
    render() {
        const {
            galleryCategoriesSelector,
            modalSpecProjectAction,
            specProjectSelector,
            setSpecProjectAction,
            match
        } = this.props;

        const categoryId = parseInt(match.params.categoryId) || 0;

        return (
            <div className={s.categories}>
                <div className={s.categoriesHeader}>
                    {TEXT_GALLERY.CATEGORIES + ': '}
                </div>
                {!galleryCategoriesSelector
                    ?
                        <div className={s.categoriesLoading}>
                            <Spinner className={s.categoriesLoading} size={30} />
                        </div>
                    :
                        <div className={s.categoriesWrap}>
                            <Category onClick={(c)=>{ sendMetric(GALLERY_CATEGORY); this.selectCategoryHandler(c)}} key={-1} name={TEXT_GALLERY.ALL} id={0} selected={categoryId === 0} />
                            {Object.values( galleryCategoriesSelector ).map( ( cat, key ) => <Category
                                {...cat}
                                onClick={(c)=>{ sendMetric(GALLERY_CATEGORY); this.selectCategoryHandler(c)}}
                                selected={categoryId === cat.id}
                                key={key}
                                name={cat.name}/>
                            )}

                            <Category spec
                                      onClick={(c)=>{ sendMetric(GALLERY_SPEC); modalSpecProjectAction(true)}}
                                      key='spec'
                                      name={TEXT_GALLERY.SPECPROJECT}
                                      id={999}
                                      selected={categoryId === 999} />

                            {specProjectSelector &&
                                <Fragment>
                                    <div className={s.categoriesSpecProjectKey}>{specProjectSelector}</div>
                                    <a className={s.categoriesSpecProjectCancel} href="#" onClick={()=>setSpecProjectAction(null)}>Отменить</a>
                                </Fragment>
                            }
                        </div>
                }
            </div>
        );
    }
}

export default  withRouter(connect(
    state => ({
        specProjectSelector: specProjectSelector( state ),
        galleryCategoriesSelector: galleryCategoriesSelector(state)
    }),
    dispatch => ({
        getCategoriesAction: () => {dispatch( getCategoriesAction() )},
        setSpecProjectAction: ( value ) => dispatch( setSpecProjectAction( value ) ),
        modalSpecProjectAction: ( show ) => {dispatch( modalSpecProjectAction( show ) )},
    })
)(Categories));
