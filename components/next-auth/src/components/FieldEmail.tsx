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
    EmailInput,
    
    
    
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
export interface FieldEmailProps {
    // states:
    isActiveSection                       : boolean
    isActionApplied                       : boolean
    
    
    
    // components:
    emailInputComponent                  ?: React.ReactComponentElement<any, InputProps<Element>>
    emailTooltipComponent                ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    emailValidationListComponent         ?: React.ReactComponentElement<any, ListProps<Element>>
    emailValidationListItemComponent     ?: React.ReactComponentElement<any, ListItemProps<Element>>
    emailValidationIconComponent         ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const FieldEmail = (props: FieldEmailProps) => {
    // rest props:
    const {
        // states:
        isActiveSection,
        isActionApplied,
        
        
        
        // components:
        emailInputComponent                  = (<InputWithLabel icon='alternate_email'    inputComponent={<EmailInput                       />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        emailTooltipComponent                = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        emailValidationListComponent         = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        emailValidationListItemComponent     = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        emailValidationIconComponent         = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // constraints:
        emailMinLength,
        emailMaxLength,
        emailFormatHint,
        
        
        
        // states:
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        emailRef,
        email,
        emailHandlers,
        emailFocused,
        emailValid,
        emailValidLength,
        emailValidFormat,
        emailValidAvailable,
    } = useSignInState();
    const specificValidations = {
        emailValidLength,
        emailValidFormat,
        emailValidAvailable,
    };
    
    
    
    // validations:
    const emailValidationMap    = {
        Length        : <>Must be {emailMinLength}-{emailMaxLength} characters.</>,
        Format        : emailFormatHint,
        Available     : <>Must have never been registered.</>,
    };
    
    
    
    // refs:
    const mergedEmailInputRef     = useMergeRefs(
        // preserves the original `elmRef` from `emailInputComponent`:
        emailInputComponent.props.elmRef,
        
        
        
        (isActiveSection ? emailRef : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <EmailInput> */}
            {React.cloneElement<InputProps<Element>>(emailInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedEmailInputRef,
                    
                    
                    
                    // classes:
                    className    : emailInputComponent.props.className    ?? 'email',
                    
                    
                    
                    // accessibilities:
                    placeholder  : emailInputComponent.props.placeholder  ?? 'Email',
                    autoComplete : emailInputComponent.props.autoComplete ?? 'email',
                    
                    
                    
                    // values:
                    value        : emailInputComponent.props.value        ?? email,
                    
                    
                    
                    // validations:
                    isValid      : emailInputComponent.props.isValid      ?? (emailValid === true),
                    required     : emailInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...emailHandlers,
                },
            )}
            {/* <Tooltip> */}
            {!!emailTooltipComponent && React.cloneElement<TooltipProps<Element>>(emailTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : emailTooltipComponent.props.expanded   ?? (emailFocused && userInteracted && !isBusy && isActiveSection && !isActionApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : emailTooltipComponent.props.floatingOn ?? emailRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(emailValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (emailValidationListComponent.props.children ?? Object.entries(emailValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`emailValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(emailValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : emailValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : emailValidationListItemComponent.props.theme ?? getValidityTheme(isValid),
                            },
                            
                            
                            
                            // children:
                            emailValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(emailValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : emailValidationIconComponent.props.icon ?? getValidityIcon(isValid),
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
