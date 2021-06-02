// @ts-ignore
import React, {memo, useCallback, useEffect, useState} from 'react';
// @ts-ignore
import styled, {css} from 'styled-components'

// @ts-ignore
import { useDrag, DragSourceMonitor, useDrop } from 'react-dnd';
// @ts-ignore
import { COLORS } from 'const/styles';
// @ts-ignore
import { hexToRgbA } from 'libs/helpers';
// @ts-ignore
import { DndProvider } from 'react-dnd';
// @ts-ignore
import MultiBackend from 'react-dnd-multi-backend';
// @ts-ignore
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import {IconArrowForward} from 'components/Icons';

import DialogOverwriteConfirm from './_DialogOverwriteConfirm';

import {clearThemeDataAction, updateThemeFormatAction} from "./_actions";

import {
    copyThemeLayoutAction
// @ts-ignore
} from "__TS/actions/layout";
import ThemeTips from "./_AdminThemeTips";



/** Interfaces */
interface IthemeFormatsItemData {
    id?: string;
    width?: string;
    height?: string;
    aspect?: number;
    preview?: string;
    themeId?: string;
    type?: string;
    isLoading?: boolean;
    error?: string;
}
interface IthemeFormatsItem {
    data?: IthemeFormatsItemData;
    disabled?: boolean;
    masterFormatCopyAction?: any;
    onSelect?: any;
    overwriteConfirm?: any;
    copyThemeFormatAction?: any;
}
interface IthemeFormatsItemRow {
    data?: IthemeFormatsItemData[];
    disabled?: boolean;
    onSelect?: any;
    copyThemeFormatAction?: any;
}

interface IthemeFormats {
    formatsList: any;
    disabled?: boolean;
    onSelect?: any;
    themeId?: string;
    information?: any;
}
interface ItargetLayout {
    width: string;
    height: string;
    id: string;
    themeId?: string;
}

interface IEmptySvgPreview {
    width?: string;
    height?: string;
}

interface IthemeLayoutFromServer {
    id?: string;
    preview?: string;
    themeId?: string;
    format?: {
        width?: string;
        height?: string;
    }
}

/** Styles */
const ThemeFormatItemStyled = styled('div')`
    position: relative;
    padding: 5px;
    width: 200px;
    flex-shrink: 0;
    ${({isDropable, isDragging}) => (isDropable || isDragging) && css`
      .themeFormatItemInner {
          outline: 3px solid ${isDragging ? COLORS.WARNING : COLORS.PRIMARY};
      }
    `}
    &:first-child{
      margin-right: 40px;
    }
    
    ${({slave}) => slave && css`
      width: auto;
      flex-grow: 1;
    `}
    .columnTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 36px;
      color: ${COLORS.MUTE};
      border-bottom: 3px solid ${COLORS.MUTE};
    }
    
    ${({master}) => master && css`
       .columnTitle {
             color: ${COLORS.TEXT};
             border-bottom-color: ${COLORS.TEXT};
        }
    `}
    .themeFormatItemInner {
      border: 1px solid ${COLORS.LINE};
      background-color: ${hexToRgbA(COLORS.WHITE, .5)};
      transition: background-color .1s ease-out;
      cursor: pointer;
        ${({isDragging}) => isDragging && css`
          box-shadow: 1px  2px 5px ${hexToRgbA(COLORS.BLACK, .3)};
        `}
        &:hover{
          background-color: #fff;
        }
    }
   .preview {
       padding: 10px;
       height: 160px;
       position: relative;
   }
   .name {
       text-align: center;
       font-size: 14px;
       padding: 2px;
       &.error {
          color: ${COLORS.TEXT_DANGER};
          font-size: 12px;
       }
   }
   .spinnerWrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
   }
   .masterCopyBtn {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      right: -30px;
      width: 30px;
      height: 30px;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
      background-color: ${COLORS.INFO};
      fill: #fff;
      opacity: .9;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
   }
`;


// Отрисовка пустой страницы, когда нет превью лейаута
const EmptySvgPreview: React.FC<IEmptySvgPreview> = ( { width, height } ): any => width && (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={ `0 0 ${ width } ${ height }` }
         style={ { overflow: 'visible' } }>
        <rect x="0" y="0" width={ width } height={ height } rx="1" ry="1" fill="white" stroke={COLORS.LINE} strokeWidth={Math.round(parseInt(height || '300')/140*2)}/>
    </svg>) || null;

//заменяем метку размера на размер и ко всем ID добавляем префикс
const replaceImagesAndIdData = ( { data, prefix } ) => {

    const getAllIds = data.matchAll( /id="(?<id>[^"]+)"/gm );

    for ( let groupOfIds of getAllIds ) {
        const { id } = groupOfIds.groups;
        data = data.split( id ).join( id + prefix );
    }

    return data.replaceAll('/%IMAGESIZE%/', 'w200');
}


// Формат темы
const ThemeFormatsItem: React.FC<IthemeFormatsItem> = ( {copyThemeFormatAction, masterFormatCopyAction, onSelect, data = null, disabled = false} ): any => {

    const [ formatData, setFormatData ] = useState( data ); // Храним локальное состояние для удобного обновления или показа in progress

    // При обновлении входящих пропсов обновляем локальное состояние
    useEffect( () => {
        setFormatData( data );
    }, [ data ] );

    // Копирование формата
    const copyThemeFormat = useCallback((item) => {
        copyThemeFormatAction({
            sourceId: item && item.id,
            targetLayout: {
                id: formatData.id,
                width: formatData.width,
                height: formatData.height
            },
            callback: (layout) => {
                // Копирование формата завершено - обновляем локально
                layout && setFormatData(layout);
            }
        });
    }, [formatData]);

    // Подключаем возможность таскать
    const [ { isDragging }, drag ] = useDrag( {
        item: {
            ...formatData,
            type: 'format'
        },
        canDrag: !disabled && formatData && !!formatData.preview,
        collect: ( monitor: DragSourceMonitor ) => ( {
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
        }),
    } );

    // Подключаем возможность бросать
    const [{ isDropable }, drop] = useDrop( {
        accept: ['format'],
        // @ts-ignore
        type: 'format',
        // @ts-ignore
        drop( item: IthemeFormatsItemData ) {
            // Если кидаем формат на формат - то копируем - заменяем его отмасштабированным
            if (item.type === 'format' && formatData.id !== item.id) {
                copyThemeFormat(item);
            }
        },
        collect: ( monitor ) => ({
            isDropable: monitor.isOver({ shallow: false }),
        }),
    } );

    // Копирование большого формата в меньшие тех же пропорций
    const masterFormatCopyHandler = () => {
        masterFormatCopyAction(formatData.id, (layout)=>{
            //callback после копирования:
            if (layout && layout.isLoading) {
                setFormatData(layout);
            } else clearThemeDataAction();
        });  // вызываем экшен в ThemeFormatsRow
        // в колбек передастся layout = {isLoading: true} и прелоадер выставится после того, как пользователь подтвердит действие замены
    }

    return formatData && <ThemeFormatItemStyled  isDropable={isDropable} isDragging={isDragging} ref={drop} >
        <div className="themeFormatItemInner"
             onClick={()=>onSelect(formatData)}
             ref={ drag }
        >
            {formatData.preview ?
                <div className="preview"
                     dangerouslySetInnerHTML={ {
                         __html: replaceImagesAndIdData( {
                             data: formatData.preview,
                             prefix: '-' + formatData.width + '-' + formatData.height
                         } )
                     } }/>
                :
                <div className="preview">
                    <EmptySvgPreview width={formatData.width} height={formatData.height}/>
                    {formatData.isLoading && <div className="spinnerWrap"><Spinner size={32} delay={0}/></div> }
                </div>
            }
            {formatData.error ?
                <div className="name error">{formatData.error}</div>
                : formatData.width ?
                <div className="name">{formatData.width} x {formatData.height}</div>
                :
                <div className="name">loading...</div>
            }
        </div>
        {masterFormatCopyAction && formatData.id && <div className="masterCopyBtn" onClick={masterFormatCopyHandler}>
            <IconArrowForward/>
        </div>}
    </ThemeFormatItemStyled> || null;
};

// Ряд форматов одной пропорции
const ThemeFormatsRow: React.FC<IthemeFormatsItemRow> = memo(( {copyThemeFormatAction, onSelect, data = [], disabled} ): any => {
    // Копировать мастер-формат в дочерние
    const masterFormatCopyAction = useCallback( ( sourceId, callback ) => {
        copyThemeFormatAction({
            sourceId: sourceId,
            targetLayout: data.slice( 1, data.length ),
            callback: callback
        });
    }, [ data ] );

    //если нет данных, ничего не рисуем
    if ( !data || !Array.isArray( data ) ) return null;

    return <div className="themeFormatRow">
                { data.map( ( item, i ) => item ? <ThemeFormatsItem copyThemeFormatAction={ copyThemeFormatAction }
                                                                             masterFormatCopyAction={ data.length > 1 && i === 0 ? masterFormatCopyAction : null }
                                                                             onSelect={ onSelect }
                                                                             data={ item }
                                                                             disabled={ disabled }
                                                                             key={ i }/> : null) }
           </div>
});

// Визуальный заголовок форматов темы
const ThemeFormatsHeader: React.FC<IthemeFormatsItemRow> = (): any => {
    return <div className="themeFormatRow">
                <ThemeFormatItemStyled header master>
                    <div className="columnTitle">Мастер формат</div>
                </ThemeFormatItemStyled>
                <ThemeFormatItemStyled header slave>
                    <div className="columnTitle">Наследуемые форматы</div>
                </ThemeFormatItemStyled>
            </div>
};

/**
 * Форматы темы
 * @param onSelect - действие при выборе формата
 * @param formatsList - список всех форматов
 * @param disabled - заблокировано, если тема опубликована
 * @param themeId - id темы
 * @param information - обьект с информацией сколько форматов темы заполнено и т.д.
 */
const ThemeFormats: React.FC<IthemeFormats> = ( {information, onSelect, formatsList = [], disabled, themeId} ): any => {
    // Массив форматов в удобном для отображения виде
    const [formats, setFormats] = useState([]);
    // Показ модалки подтверждения перезаписи формата
    const [showDialogOverwriteConfirm, setShowDialogOverwriteConfirm] = useState(null);

    // Собираем все форматы по рядам исходя из их пропорций
    useEffect(()=>{
        if (formatsList) {
            const fRows = {};

            formatsList.map((f)=>{
                if ( f.format) {
                    const aspect = Math.round(parseInt(f.format.width)/parseInt(f.format.height) * 100);
                    const data = {
                        ...f.format,
                        aspect: aspect,
                        id: f.layoutId || f.id,
                        formatSlug: f.formatSlug,
                        preview: f.preview,
                    };
                    if (aspect) fRows[aspect] = (fRows[aspect] ? [...fRows[aspect], data] : [data]);
                }
            });
            // Сортируем ряды и форматы внутри ряда
            setFormats( Object.keys(fRows)
                .sort((a, b)=> parseInt(b) - parseInt(a))
                .map((key)=>{
                    return fRows[key].sort((a, b)=> b.width - a.width)
                }) );
        }
    }, [formatsList]);


    // При подтверждении перезаписи отправляем колбэк
    const overwriteConfirm = useCallback((agree)=>{
         if (agree && showDialogOverwriteConfirm && showDialogOverwriteConfirm.callback) showDialogOverwriteConfirm.callback(agree);
        setShowDialogOverwriteConfirm(null);
    }, [showDialogOverwriteConfirm]);

    // Копировать формат темы в другой формат
    const copyThemeFormatAction = useCallback(({sourceId, targetLayout, callback = ()=>null}
            : {sourceId: string, targetLayout : ItargetLayout|ItargetLayout[], callback?: (layout:IthemeFormatsItemData)=>any }
        ): any=>{

        const targetIsArray = Array.isArray(targetLayout);
        // Копируем один лейаут
        const copyThemeLayout = () => {
            // in Progress
            callback({isLoading: true});
            copyThemeLayoutAction(sourceId, targetLayout, themeId).catch(err => {
                console.log('err', err);
                // in Fail
                callback({ error: 'Ошибка при копировании' });
            }).then((result: { layout: IthemeLayoutFromServer }) => {
                // in Success
                if (!targetIsArray) {
                    updateThemeFormatAction(result && result.layout);
                } else clearThemeDataAction();
                // callback({isLoading: false});
            })
        };

        // Проверка, стоит ли спрашивать подтверждение перезаписи
        if (Array.isArray(targetLayout)) {
            // Если хоть один формат не пустой, спрашиваем о перезаписи
            if ( targetLayout.some((item)=>item.id) ) {
                setShowDialogOverwriteConfirm({
                    text: 'Вы действительно хотите заменить все форматы в ряду?',
                    callback: copyThemeLayout
                });
            } else copyThemeLayout();
        } else {
            // Если формат не пустой - спрашиваем о перезаписи
            if ( targetLayout.id ) {
                setShowDialogOverwriteConfirm({
                    text: 'Вы уверены, что хотите перезаписать формат темы?',
                    callback: copyThemeLayout
                });
            } else copyThemeLayout();
        }

    }, []);



    if (!formats || !formats.length) return null;

    return <div className="themeFormatsBlock">
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>

            {!disabled && <ThemeTips {...information} />}

            <ThemeFormatsHeader/>

            {formats.map((f, i) => f && <ThemeFormatsRow key={i}
                                                         copyThemeFormatAction={copyThemeFormatAction}
                                                         onSelect={onSelect}
                                                         data={f}
                                                         disabled={disabled}
            />)}
        </DndProvider>

        {/*Модалка подтверждения перезаписи*/}
        <DialogOverwriteConfirm isOpen={showDialogOverwriteConfirm}
                                text={showDialogOverwriteConfirm && showDialogOverwriteConfirm.text}
                                closeCallback={overwriteConfirm}
        />
    </div>
};

export default memo( ThemeFormats );