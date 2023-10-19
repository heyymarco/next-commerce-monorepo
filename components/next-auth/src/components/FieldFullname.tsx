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
export interface FieldFullnameProps {
    // states:
    isActiveSection                       : boolean
    isActionApplied                       : boolean
    
    
    
    // components:
    fullnameInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    fullnameTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    fullnameValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    fullnameValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    fullnameValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const FieldFullname = (props: FieldFullnameProps) => {
    // rest props:
    const {
        // states:
        isActiveSection,
        isActionApplied,
        
        
        
        // components:
        fullnameInputComponent               = (<InputWithLabel icon='account_box'        inputComponent={<TextInput autoCapitalize='words' />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        fullnameTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        fullnameValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        fullnameValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        fullnameValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // constraints:
        fullnameMinLength,
        fullnameMaxLength,
        
        
        
        // states:
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        fullnameRef,
        fullname,
        fullnameHandlers,
        fullnameFocused,
        fullnameValid,
        fullnameValidLength,
    } = useSignInState();
    const specificValidations = {
        fullnameValid,
        fullnameValidLength,
    };
    
    
    
    // validations:
    const fullnameValidationMap = {
        Length        : <>Must be {fullnameMinLength}-{fullnameMaxLength} characters.</>,
    };
    
    
    
    // refs:
    const mergedFullnameInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `fullnameInputComponent`:
        fullnameInputComponent.props.elmRef,
        
        
        
        (isActiveSection ? fullnameRef : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <FullnameInput> */}
            {React.cloneElement<InputProps<Element>>(fullnameInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedFullnameInputRef,
                    
                    
                    
                    // classes:
                    className    : fullnameInputComponent.props.className    ?? 'fullname',
                    
                    
                    
                    // accessibilities:
                    placeholder  : fullnameInputComponent.props.placeholder  ?? 'Your Name',
                    
                    
                    
                    // values:
                    value        : fullnameInputComponent.props.value        ?? fullname,
                    
                    
                    
                    // validations:
                    isValid      : fullnameInputComponent.props.isValid      ?? (fullnameValid === true),
                    required     : fullnameInputComponent.props.required     ?? true,
                    
                    
                    
                    // formats:
                    autoComplete : fullnameInputComponent.props.autoComplete ?? 'fullname',
                    
                    
                    
                    // handlers:
                    ...fullnameHandlers,
                },
            )}
            {/* <Tooltip> */}
            {!!fullnameTooltipComponent && React.cloneElement<TooltipProps<Element>>(fullnameTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : fullnameTooltipComponent.props.expanded   ?? (fullnameFocused && userInteracted && !isBusy && isActiveSection && !isActionApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : fullnameTooltipComponent.props.floatingOn ?? fullnameRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(fullnameValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (fullnameValidationListComponent.props.children ?? Object.entries(fullnameValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`fullnameValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(fullnameValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : fullnameValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : fullnameValidationListItemComponent.props.theme ?? getValidityTheme(isValid),
                            },
                            
                            
                            
                            // children:
                            fullnameValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(fullnameValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : fullnameValidationIconComponent.props.icon ?? getValidityIcon(isValid),
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
