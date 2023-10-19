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
import type {
    // react components:
    FieldPasswordProps,
}                           from './FieldPassword.js'

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
export interface FieldPassword2Props
    extends
        Pick<FieldPasswordProps,
            // components:
            |'passwordInputComponent'
            |'passwordTooltipComponent'
            |'passwordValidationListComponent'
            |'passwordValidationListItemComponent'
            |'passwordValidationIconComponent'
        >
{
    // states:
    isActiveSection                       : boolean
    isActionApplied                       : boolean
    
    
    
    // components:
    password2InputComponent              ?: React.ReactComponentElement<any, InputProps<Element>>
    password2TooltipComponent            ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    password2ValidationListComponent     ?: React.ReactComponentElement<any, ListProps<Element>>
    password2ValidationListItemComponent ?: React.ReactComponentElement<any, ListItemProps<Element>>
    password2ValidationIconComponent     ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const FieldPassword2 = (props: FieldPassword2Props) => {
    // rest props:
    const {
        // states:
        isActiveSection,
        isActionApplied,
        
        
        
        // components:
        passwordInputComponent               = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput                    />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        passwordTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        passwordValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        passwordValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        passwordValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
        
        password2InputComponent              = passwordInputComponent,
        password2TooltipComponent            = passwordTooltipComponent,
        password2ValidationListComponent     = passwordValidationListComponent,
        password2ValidationListItemComponent = passwordValidationListItemComponent,
        password2ValidationIconComponent     = passwordValidationIconComponent,
    } = props;
    
    
    
    // states:
    const {
        // constraints:
        passwordMinLength,
        passwordMaxLength,
        passwordHasUppercase,
        passwordHasLowercase,
     // passwordProhibitedHint,
        
        
        
        // states:
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        password2Ref,
        password2,
        password2Handlers,
        password2Focused,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
    } = useSignInState();
    const specificValidations = {
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
    };
    
    
    
    // validations:
    const passwordValidationMap = {
        Length        : <>Must be {passwordMinLength}-{passwordMaxLength} characters.</>,
        Uppercase     : !!passwordHasUppercase && <>At least one capital letter.</>,
        Lowercase     : !!passwordHasLowercase && <>At least one non-capital letter.</>,
        Match         : <>Exact match to previous password.</>,
     // NotProhibited : passwordProhibitedHint,
    };
    
    
    
    // refs:
    const mergedPassword2InputRef = useMergeRefs(
        // preserves the original `elmRef` from `password2InputComponent`:
        password2InputComponent.props.elmRef,
        
        
        
        (isActiveSection ? password2Ref : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <PasswordInput> */}
            {React.cloneElement<InputProps<Element>>(password2InputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedPassword2InputRef,
                    
                    
                    
                    // classes:
                    className    : password2InputComponent.props.className    ?? 'password2',
                    
                    
                    
                    // accessibilities:
                    placeholder  : password2InputComponent.props.placeholder  ?? 'Confirm New Password',
                    
                    
                    
                    // values:
                    value        : password2InputComponent.props.value        ?? password2,
                    
                    
                    
                    // validations:
                    isValid      : password2InputComponent.props.isValid      ?? (password2Valid === true),
                    required     : password2InputComponent.props.required     ?? true,
                    
                    
                    
                    // formats:
                    autoComplete : password2InputComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // handlers:
                    ...password2Handlers,
                },
            )}
            {/* <Tooltip> */}
            {!!password2TooltipComponent && React.cloneElement<TooltipProps<Element>>(password2TooltipComponent,
                // props:
                {
                    // states:
                    expanded   : password2TooltipComponent.props.expanded   ?? (password2Focused && userInteracted && !isBusy && isActiveSection && !isActionApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : password2TooltipComponent.props.floatingOn ?? password2Ref,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(password2ValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (password2ValidationListComponent.props.children ?? Object.entries(passwordValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`password2Valid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(password2ValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : password2ValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : password2ValidationListItemComponent.props.theme ?? getValidityTheme(isValid),
                            },
                            
                            
                            
                            // children:
                            password2ValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(password2ValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : password2ValidationIconComponent.props.icon ?? getValidityIcon(isValid),
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
