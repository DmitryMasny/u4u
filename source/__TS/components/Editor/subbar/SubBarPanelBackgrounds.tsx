// @ts-ignore
import React from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import Checkbox from 'components/_forms/Checkbox';
// @ts-ignore
import { userRoleIsAdmin } from "__TS/selectors/user";
import {
    addBackgroundsInThemePackAction, photoLibraryShowOnlyNotUsedToggleAction,
} from "../_actions";
// @ts-ignore
import { backgroundGetCurrentInLayout } from "__TS/selectors/backgrounds";
// @ts-ignore
import { productLayoutThemeId } from "__TS/selectors/layout";
// @ts-ignore
import { SubBarButton, SubBarDivider, SubBarSector, SubBarSmallHeader, HelperText } from "__TS/styles/editor";
// @ts-ignore
import { updateBackgroundContentAction } from "__TS/actions/backgrounds";
import Color from "./_ColorPicker";
import {
    IconAddPhoto
// @ts-ignore
} from 'components/Icons';
// @ts-ignore
import SelectSlider from '__TS/components/_misc/SelectSlider';
// @ts-ignore
import { uploadBackground } from "__TS/libs/upload";
import {SelectSliderDropDownMM} from "./_SelectSlider"


/** Загрузить фоны в тему*/
const UploadBackgroundsToTheme = ( themeId ) => {

    uploadBackground({
        ///packId: currentBackgroundPackId,
        themeId: themeId,
        acceptFormats: ['png', 'jpg', 'jpeg'],
        //config: backgroundsConfig,
    } ).then( data => {
        addBackgroundsInThemePackAction( 'theme', { backgroundList: data }, true );
        //addUploadedBackgroundsAction(currentBackgroundPackId, data, backgroundsConfig);
    }).catch( ( err ) => {
        console.error( 'ERROR ', err );
    } );

}

/**
 * Компонент суб-меню фоны!
 */
const SubBarPanelBackgrounds: React.FC = () => {
    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const background = useSelector( backgroundGetCurrentInLayout );
    const themeId: string = useSelector( productLayoutThemeId );

    if ( !background ) {
        return <SubBarSector align={ 'start' }>
            <HelperText>
                Выберите фон
            </HelperText>
        </SubBarSector>

    }

    return <>
        {isAdmin && <>
            <SubBarButton onClick={ () => UploadBackgroundsToTheme( themeId ) }>
                <IconAddPhoto />
                Загрузить фон
            </SubBarButton>
            <SubBarDivider />
        </>}

        <SubBarButton isDisabled={ !background.backgroundId } active={ background.isPattern } onClick={ () => updateBackgroundContentAction( { isPattern: !background.isPattern } ) }>
            {/* @ts-ignore */}
            <Checkbox checked={ background.isPattern } className={'SubBarButtonCheckbox'}/>
            Размножить
        </SubBarButton>

        <SubBarSector align={'start'} isDisabled={!background.isPattern}>
            <SubBarSmallHeader>Размер рисунка</SubBarSmallHeader>
            <SelectSlider xParams={ { value: background.patternWidth, min: 5, max: 200, } }
                          debounce={0}
                          width={88}
                          InnerDrawComponent={SelectSliderDropDownMM}
                          callBackFunction={ ( { x } ) => updateBackgroundContentAction( {
                              patternWidth: x,
                              patternHeight: x
                          } ) }
            />
        </SubBarSector>

        <SubBarDivider />

        <SubBarSector align={'start'} isDisabled={false}>
            <SubBarSmallHeader>Цвет фона</SubBarSmallHeader>
            <Color colorInvoice={ background.bgColor } type="backgroundColor" disableAlpha={true} />
        </SubBarSector>
    </>

}
export default SubBarPanelBackgrounds;