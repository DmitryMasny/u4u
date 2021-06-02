// @ts-ignore
import React from 'react';
import styled, {css} from 'styled-components';
// @ts-ignore
import {COLORS} from 'const/styles';
// @ts-ignore
import {Select, Btn} from 'components/_forms';
// @ts-ignore
import {IconCheck} from 'components/Icons';
// @ts-ignore
import {hexToRgbA} from 'libs/helpers';



/** Interfaces */
interface Props {
    productData: IProductData|any;  // данные продукта коллекции
    onSelectProduct: (id: string)=>any;  // выбрать продукт для добавления в коллекцию
    onRemoveProduct?: (id: string)=>any;  // выбрать продукт для удаления из коллекции
    inProductSet?: boolean;              // Этот продукт добавлен в список продуктов коллекции
    disabled?: boolean;                 // Нельзя менять (на публикации)
}
interface IProductData {
    id: string;
    name: string;
    productType: string;
    format: string;
    preview: string;
    lastChanged: number;
    options?: any;
    cost: string|number;
    selected?: boolean;
    useForPreview?: boolean;
}
interface IProductsListItem {
    selected: boolean;
    inProductSet: boolean;
    disabled: boolean;
}

/** Styles */
const StyledProductsListItem = styled('div')`
    position: relative;
    display: flex;
    width: ${({inProductSet}: IProductsListItem)=> inProductSet ? '200px' : '25%'};
    min-width: 200px;
    padding: 10px;
    .innerWrap {
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
        cursor: ${({disabled}: IProductsListItem)=> disabled ? 'default' : 'pointer'};;
        transition: box-shadow .2s ease-out, color .1s ease-out;
        &:hover {
            box-shadow: 1px 2px 7px ${hexToRgbA(COLORS.BLACK, .12)};
        }
        &, &:hover{
            ${({selected}: IProductsListItem)=>selected && css`
                cursor: default;
                box-shadow: 1px 2px 7px ${hexToRgbA(COLORS.PRIMARY, .7)};
                .name {
                  color: ${COLORS.PRIMARY};
                }
            `};
            ${({disabled}: IProductsListItem)=>disabled && css`
                cursor: default;
                box-shadow: none;
                .name {
                  color: inherit;
                }
            `};
        }
    }
    .selectedCheck{
      position: absolute;
      left: 25px;
      top: 25px;
      width: 26px;
      height: 26px;
      opacity: ${({selected}: IProductsListItem)=> selected ? 1 : 0};
      border: 2px solid ${COLORS.PRIMARY};
      border-radius: 2px;
      background-color: #fff;
      transition: opacity .2s ease-out;
      pointer-events: none;
       .icon {
          fill: ${COLORS.PRIMARY};
          transform: translateY(${({selected}: IProductsListItem)=> selected ? '-1' : '-3'}px);
          transition: transform .12s ease-out;
       }
        .useForPreview {
            position: absolute;
            top: 0;
            left: 24px;
            padding: 3px;
            background: rgba(255, 255, 255, 0.5);
            white-space: nowrap;
            font-size: 14px;
            color: ${COLORS.TEXT_PRIMARY};
        }
    }
    
    .label {
      margin-bottom: 10px;
    }
    .preview{
       width: 160px;
       height: 120px;
       margin-bottom: 10px;
    }
    .info{
       .name {
        font-size: 18px;
        margin-bottom: 5px;
        min-height: 36px;
       }
       .other {
        font-size: 14px;
        color: ${COLORS.TEXT_MUTE};
        &Item {
             margin-bottom: 5px;
        }
        .label {
            font-weight: 200;
        }
       }
    }
    .formatSize {
        //font-size: 14px;
        color: ${COLORS.NEPAL};
    }
`;

/**
 * Блок фильтра (выбора опции) продукта витрины
 */
const ProductsListItem: React.FC<Props> = ({productData, onSelectProduct, onRemoveProduct, inProductSet, disabled}) => {

    const onRemoveProductHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemoveProduct(productData.id);
    };

    // const lastChanged = productData.lastChanged && (new Date(productData.lastChanged)).toLocaleDateString();
// console.log('productData',productData);
    return <StyledProductsListItem selected={inProductSet ? productData.useForPreview : productData.selected} inProductSet={inProductSet} disabled={disabled}>
        <div className="innerWrap" onClick={()=>!disabled && onSelectProduct(productData.id)}>
            <div className="preview" dangerouslySetInnerHTML={{ __html: productData.preview.replace('/%IMAGESIZE%/', 'w270') }}/>
            <div className="info">
                <div className="name">
                    {productData.name}
                </div>
                <div className="other">
                    <div className="otherItem">{productData.productType}</div>
                    <div className="otherItem">{productData.format.name}
                        <span className="formatSize">&nbsp;
                            ({productData.format.width} x {productData.format.height})
                        </span>
                    </div>
                    <div className="otherItem">{productData.cost}</div>
                    {productData.options && productData.options.map(
                        (o, i)=><div className="otherItem" key={i}><span className="label">{o.label}: </span>{o.value}</div>
                    )}
                </div>
            </div>
            {inProductSet && !disabled && <div className="actions">
                <Btn intent="minimal-danger" fill onClick={onRemoveProductHandler}>Убрать</Btn>
            </div>}
        </div>
        <div className="selectedCheck">
            <IconCheck className="icon"/>
            {
                inProductSet && <span className="useForPreview">Исп. для превью</span>
            }
        </div>

    </StyledProductsListItem>;
};

export default ProductsListItem;



