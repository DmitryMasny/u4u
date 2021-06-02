// @ts-ignore
import React, {memo, useCallback, useMemo} from 'react';

import {StyledLibrary, StyledLibraryItem, StyledTags} from "./_styles";
import {Ilibrary, IlibraryItem, IlibraryItemTags} from "./_interfaces";
// import ImageLoader from "./ImageLoader";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';


// @ts-ignore
import {Tooltip} from 'components/_forms';
// @ts-ignore
import {IconCheck, IconView, IconError, IconMove} from "components/Icons";
import Spinner from '__TS/components/_misc/Spinner';



const SvgConstrainProportions: React.FC = () =>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="2.5" width="13" height="13" rx="0.5" fill="white" stroke="#2B7ED5"/>
        <path d="M7.5 4.5H4.5V7.5" stroke="#2B7ED5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 13.5L13.5 13.5L13.5 10.5" stroke="#2B7ED5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>;
const SvgConstrainProportions2: React.FC = () =>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="14" height="8" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M2.5 4C2.10218 4 1.72064 4.15804 1.43934 4.43934C1.15804 4.72064 1 5.10218 1 5.5L1 12.5C1 12.8978 1.15804 13.2794 1.43934 13.5607C1.72064 13.842 2.10218 14 2.5 14H15.5C15.8978 14 16.2794 13.842 16.5607 13.5607C16.842 13.2794 17 12.8978 17 12.5V5.5C17 5.10218 16.842 4.72064 16.5607 4.43934C16.2794 4.15804 15.8978 4 15.5 4H2.5ZM3.5 6C3.36739 6 3.24021 6.05268 3.14645 6.14645C3.05268 6.24021 3 6.36739 3 6.5V9.5C3 9.63261 3.05268 9.75979 3.14645 9.85355C3.24021 9.94732 3.36739 10 3.5 10C3.63261 10 3.75979 9.94732 3.85355 9.85355C3.94732 9.75979 4 9.63261 4 9.5V7H6.5C6.63261 7 6.75979 6.94732 6.85355 6.85355C6.94732 6.75979 7 6.63261 7 6.5C7 6.36739 6.94732 6.24021 6.85355 6.14645C6.75979 6.05268 6.63261 6 6.5 6H3.5ZM14.5 12C14.6326 12 14.7598 11.9473 14.8536 11.8536C14.9473 11.7598 15 11.6326 15 11.5V8.5C15 8.36739 14.9473 8.24021 14.8536 8.14645C14.7598 8.05268 14.6326 8 14.5 8C14.3674 8 14.2402 8.05268 14.1464 8.14645C14.0527 8.24021 14 8.36739 14 8.5V11H11.5C11.3674 11 11.2402 11.0527 11.1464 11.1464C11.0527 11.2402 11 11.3674 11 11.5C11 11.6326 11.0527 11.7598 11.1464 11.8536C11.2402 11.9473 11.3674 12 11.5 12H14.5Z" fill="#F68225"/>
    </svg>;

const SvgUseForPreview: React.FC = () =>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.61261 16.4435C4.22661 16.6415 3.78861 16.2945 3.86661 15.8515L4.69661 11.1215L1.17361 7.7655C0.844607 7.4515 1.01561 6.8775 1.45661 6.8155L6.35461 6.1195L8.53861 1.7925C8.73561 1.4025 9.26861 1.4025 9.46561 1.7925L11.6496 6.1195L16.5476 6.8155C16.9886 6.8775 17.1596 7.4515 16.8306 7.7655L13.3076 11.1215L14.1376 15.8515C14.2156 16.2945 13.7776 16.6415 13.3916 16.4435L9.00061 14.1875L4.61161 16.4435H4.61261Z" fill="#2B7ED5"/>
    </svg>;


const SvgRepeatBackground: React.FC = () =>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="18" fill="white"/>
        <path d="M0 0V18H18C18 17.6773 18 0.513562 18 0C18 0 0.513562 0 0 0ZM16.9453 1.05469V3.19922H14.8008V1.05469H16.9453ZM12.4826 7.99432C13.4621 8.30426 13.462 9.69581 12.4826 10.0057L11.8847 10.1949L12.1737 10.7515C12.5405 11.4577 12.0225 12.292 11.2375 12.2919C10.8431 12.2919 10.6465 12.0952 10.1949 11.8847L10.0057 12.4826C9.69578 13.4622 8.30412 13.4619 7.99432 12.4826L7.80514 11.8847C7.35114 12.0963 7.15616 12.2919 6.76248 12.2919C5.97639 12.2919 5.46008 11.4566 5.82627 10.7515L6.11532 10.1949L5.51735 10.0057C4.53786 9.69578 4.53804 8.30419 5.51735 7.99432L6.11532 7.80514L5.82627 7.24852C5.45948 6.54219 5.97751 5.70811 6.76248 5.70811C7.1569 5.70811 7.35346 5.90477 7.80514 6.11532L7.99432 5.51735C8.30419 4.53783 9.69585 4.53811 10.0057 5.51735L10.1949 6.11532C10.6489 5.90368 10.8438 5.70811 11.2375 5.70811C12.0236 5.70811 12.5399 6.54339 12.1737 7.24852L11.8847 7.80514L12.4826 7.99432ZM1.05469 1.05469H3.19922V3.19922H1.05469V1.05469ZM4.25391 4.25391V1.05469H8.47266V3.79269C7.95329 3.92541 7.5053 4.25092 7.21895 4.70341C5.7144 4.3707 4.36507 5.7157 4.70215 7.21976C4.25032 7.50611 3.9253 7.95375 3.79269 8.47266H1.05469V4.25391H4.25391ZM1.05469 16.9453V14.8008H3.19922V16.9453H1.05469ZM1.05469 13.7461V9.52734H3.79269C3.9253 10.0462 4.25032 10.4939 4.70215 10.7802C4.36556 12.2822 5.71138 13.63 7.21895 13.2966C7.5053 13.7491 7.95326 14.0746 8.47266 14.2073V16.9453H4.25391V13.7461H1.05469ZM16.9453 16.9453H14.8008V14.8008H16.9453V16.9453ZM13.7461 13.7461V16.9453H9.52734V14.2073C10.0467 14.0746 10.4947 13.7491 10.7811 13.2966C12.2935 13.6311 13.6331 12.2763 13.2979 10.7802C13.7497 10.4938 14.0747 10.0462 14.2073 9.52731H16.9453V13.7461H13.7461V13.7461ZM16.9453 8.47266H14.2073C14.0747 7.95379 13.7497 7.50614 13.2979 7.21976C13.6344 5.71785 12.2886 4.37003 10.7811 4.70341C10.4947 4.25088 10.0467 3.92541 9.52734 3.79269V1.05469H13.7461V4.25391H16.9453V8.47266Z" fill="#3D4C62"/>
        <path d="M9 6.89062C7.83689 6.89062 6.89062 7.83689 6.89062 9C6.89062 10.1631 7.83689 11.1094 9 11.1094C10.1631 11.1094 11.1094 10.1631 11.1094 9C11.1094 7.83689 10.1631 6.89062 9 6.89062ZM9 10.0547C8.41845 10.0547 7.94531 9.58155 7.94531 9C7.94531 8.41845 8.41845 7.94531 9 7.94531C9.58155 7.94531 10.0547 8.41845 10.0547 9C10.0547 9.58155 9.58155 10.0547 9 10.0547Z" fill="#3D4C62"/>
    </svg>
;



// Ярлыки элемента библиотеки
const LibraryItemTags: React.FC<IlibraryItemTags> = ({constrainProportions, useForPreview, fileType, repeatBackground}) => {

    return(
        <StyledTags>
            {useForPreview && <SvgUseForPreview/>}
            {fileType && <div className="fileTypeTag">{fileType}</div>}
            {repeatBackground && <SvgRepeatBackground/>}
            {constrainProportions !== undefined ?
                (constrainProportions ? <SvgConstrainProportions/> : <SvgConstrainProportions2/>)
                : null}
        </StyledTags>);
};

// Ручка для сортировки
const SortHandle = SortableHandle(() => {
    return <div className="SortHandle"><IconMove className="icon"/></div>;
});

// Элемент библиотеки
// @ts-ignore
const LibraryItem: React.FC = SortableElement( ( { data, thumbSize = 100, onClick, disableSort }: IlibraryItem ) => {

    if (!data) return null;
    // console.log('data',data);
    const {src, svg, selected, disabled, tags, error, name, id} = data;

    const onClickItemHandler = ( e ) => {
        // if (disabled) return null;
        onClick({
            data,
            shiftKey: e.shiftKey
        });
    };

    const icon = useMemo(()=> svg ?
                                <div dangerouslySetInnerHTML={{__html: svg}} className="svgWrap"/>
                                :
                                src ?
                                    <img className="image" src={src} alt=""/>
                                    // <ImageLoader className="itemImage" src={src} showLoader={disabled} light/>
                                    :
                                        <div className="spinnerWrap">
                                            <Spinner delay={0} size={24} light/>
                                        </div>,
    [ id ]);


    return <StyledLibraryItem
                onClick={onClickItemHandler}
                selected={selected}
                disabled={disabled}
                error={error}
                thumbSize={thumbSize}
                isNamed={!!name}
            >
                {icon}

                {name && <div className="name" title={name}>{name}</div>}

                {/* Чекбокс выделения */ !disabled &&
                <div className="selectionBox">
                    {selected ? <IconCheck/> : null}
                </div>}

                {/* Ярлыки */ tags &&
                    <LibraryItemTags {...tags}/>
                }
                {/* Иконка ошибки */ error &&
                <div className="errorWrap">
                    <Tooltip tooltip={error} intent={'danger'} placement="top">
                        <IconError intent={'danger'} size={48}/>
                    </Tooltip>
                </div>
                }
                {/* Якорь для сортировки */ !disableSort &&
                    <SortHandle/>
                }
            </StyledLibraryItem>
});

/**
 * Сортируемая обёртка
 */
// @ts-ignore
const LibrarySortable: React.FC = SortableContainer(({ disabled, items, selectionActive, sortable, selectAction, thumbSize }: Ilibrary ): any => {

    const onClickItemHandler = useCallback( ( { data, shiftKey } ) => {
        selectAction && selectAction( { data, shiftKey } );
    }, [ selectAction ] );

    return (
        <StyledLibrary disabled={disabled} disableEvents={!selectAction} className={selectionActive ? 'selectionActive' : ''}>
            { (items && items.length || false) && items.map(
                ( item, i ) => {

                    return <LibraryItem
// @ts-ignore
                        data={item}
                        thumbSize={thumbSize}
                        onClick={onClickItemHandler}
                        key={item.id || `index_${i}`}
                        index={i}
                        disabled={!sortable}
                        disableSort={!sortable}
                    />
                }
            )}
            {disabled && <Spinner className="spinner" size={50}/>}
        </StyledLibrary>
    );
});

/**
 * Библиотека граф. элементов (фото, стикеры...)
 */
const Library: React.FC<Ilibrary> = ( props ) => {

    if (!props || !props.items || !props.items.length) return null;
    // @ts-ignore
    return <LibrarySortable {...props} useDragHandle={true}/>;
};

export default memo( Library );
