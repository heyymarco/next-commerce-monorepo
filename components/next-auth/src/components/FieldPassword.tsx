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
    PasswordInput,
    
    
    
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
export interface FieldPasswordProps {
    // behaviors:
    isPasswordEntry                      ?: boolean
    
    
    
    // states:
    isActiveSection                       : boolean
    isActionApplied                       : boolean
    
    
    
    // components:
    passwordInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    passwordValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    passwordValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    passwordValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const FieldPassword = (props: FieldPasswordProps) => {
    // rest props:
    const {
        // behaviors:
        isPasswordEntry = true,
        
        
        
        // states:
        isActiveSection,
        isActionApplied,
        
        
        
        // components:
        passwordInputComponent               = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput                    />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        passwordTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        passwordValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        passwordValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        passwordValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // constraints:
        passwordMinLength,
        passwordMaxLength,
        passwordHasUppercase,
        passwordHasLowercase,
        passwordProhibitedHint,
        
        
        
        // states:
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        passwordRef,
        password,
        passwordHandlers,
        passwordFocused,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        passwordValidNotProhibited,
    } = useSignInState();
    const specificValidations = {
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        passwordValidNotProhibited,
    };
    
    
    
    // validations:
    const passwordValidationMap = {
        Length        : <>Must be {passwordMinLength}-{passwordMaxLength} characters.</>,
        Uppercase     : !!passwordHasUppercase && <>At least one capital letter.</>,
        Lowercase     : !!passwordHasLowercase && <>At least one non-capital letter.</>,
     // Match         : <>Exact match to previous password.</>,
        NotProhibited : passwordProhibitedHint,
    };
    
    
    
    // refs:
    const mergedPasswordInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `passwordInputComponent`:
        passwordInputComponent.props.elmRef,
        
        
        
        (isActiveSection ? passwordRef : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <PasswordInput> */}
            {React.cloneElement<InputProps<Element>>(passwordInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedPasswordInputRef,
                    
                    
                    
                    // classes:
                    className    : passwordInputComponent.props.className    ?? 'password',
                    
                    
                    
                    // accessibilities:
                    placeholder  : passwordInputComponent.props.placeholder  ?? (isPasswordEntry ? 'New Password' : 'Password'),
                    autoComplete : passwordInputComponent.props.autoComplete ?? (isPasswordEntry ? 'new-password' : 'password'),
                    
                    
                    
                    // values:
                    value        : passwordInputComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : passwordInputComponent.props.isValid      ?? (passwordValid === true),
                    required     : passwordInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
                },
            )}
            {/* <Tooltip> */}
            {!!passwordTooltipComponent && React.cloneElement<TooltipProps<Element>>(passwordTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : passwordTooltipComponent.props.expanded   ?? (passwordFocused && userInteracted && !isBusy && isActiveSection && !isActionApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : passwordTooltipComponent.props.floatingOn ?? passwordRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(passwordValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (passwordValidationListComponent.props.children ?? Object.entries(passwordValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`passwordValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(passwordValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : passwordValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : passwordValidationListItemComponent.props.theme ?? getValidityTheme(isValid),
                            },
                            
                            
                            
                            // children:
                            passwordValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(passwordValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : passwordValidationIconComponent.props.icon ?? getValidityIcon(isValid),
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
