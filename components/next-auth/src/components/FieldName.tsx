'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    IconProps,
    Icon,
    InputProps,
    TextInput,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    ListProps,
    List,
    
    
    
    // notification-components:
    TooltipProps,
    Tooltip,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // react components:
    InputWithLabel,
}                           from './InputWithLabel.js'

// internals:
import {
    // types:
    ValidityStatus,
    
    
    
    // states:
    useSignInState,
}                           from './states/signInState.js'
import {
    // utilities:
    getValidityTheme,
    getValidityIcon,
}                           from './utilities.js'



// react components:
export interface FieldNameProps {
    // states:
    isActiveSection                   : boolean
    isActionApplied                   : boolean
    
    
    
    // components:
    nameInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    nameTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    nameValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    nameValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    nameValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const FieldName = (props: FieldNameProps) => {
    // rest props:
    const {
        // states:
        isActiveSection,
        isActionApplied,
        
        
        
        // components:
        nameInputComponent               = (<InputWithLabel icon='account_box'        inputComponent={<TextInput autoCapitalize='words' />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        nameTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        nameValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        nameValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        nameValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // constraints:
        nameMinLength,
        nameMaxLength,
        
        
        
        // states:
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        nameRef,
        name,
        nameHandlers,
        nameFocused,
        nameValid,
        nameValidLength,
    } = useSignInState();
    const specificValidations = {
        nameValid,
        nameValidLength,
    };
    
    
    
    // validations:
    const nameValidationMap = {
        Length        : <>Must be {nameMinLength}-{nameMaxLength} characters.</>,
    };
    
    
    
    // refs:
    const mergedNameInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `nameInputComponent`:
        nameInputComponent.props.elmRef,
        
        
        
        (isActiveSection ? nameRef : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <NameInput> */}
            {React.cloneElement<InputProps<Element>>(nameInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedNameInputRef,
                    
                    
                    
                    // classes:
                    className    : nameInputComponent.props.className    ?? 'name',
                    
                    
                    
                    // accessibilities:
                    placeholder  : nameInputComponent.props.placeholder  ?? 'Your Name',
                    
                    
                    
                    // values:
                    value        : nameInputComponent.props.value        ?? name,
                    
                    
                    
                    // validations:
                    isValid      : nameInputComponent.props.isValid      ?? (nameValid === true),
                    required     : nameInputComponent.props.required     ?? true,
                    
                    
                    
                    // formats:
                    autoComplete : nameInputComponent.props.autoComplete ?? 'nickname',
                    
                    
                    
                    // handlers:
                    ...nameHandlers,
                },
            )}
            {/* <Tooltip> */}
            {!!nameTooltipComponent && React.cloneElement<TooltipProps<Element>>(nameTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : nameTooltipComponent.props.expanded   ?? (nameFocused && userInteracted && !isBusy && isActiveSection && !isActionApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : nameTooltipComponent.props.floatingOn ?? nameRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(nameValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (nameValidationListComponent.props.children ?? Object.entries(nameValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`nameValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(nameValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : nameValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : nameValidationListItemComponent.props.theme ?? getValidityTheme(isValid),
                            },
                            
                            
                            
                            // children:
                            nameValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(nameValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : nameValidationIconComponent.props.icon ?? getValidityIcon(isValid),
                                    },
                                )}
                                &nbsp;
                                {text}
                            </>,
                        )
                    })),
                ),
            )}
        </>
    );
};
