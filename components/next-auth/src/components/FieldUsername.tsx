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
export interface FieldUsernameProps {
    // states:
    isActiveSection                       : boolean
    isActionApplied                       : boolean
    
    
    
    // components:
    usernameInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    usernameTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    usernameValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    usernameValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    usernameValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const FieldUsername = (props: FieldUsernameProps) => {
    // rest props:
    const {
        // states:
        isActiveSection,
        isActionApplied,
        
        
        
        // components:
        usernameInputComponent               = (<InputWithLabel icon='person'             inputComponent={<TextInput                        />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        usernameTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        usernameValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        usernameValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        usernameValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // constraints:
        usernameMinLength,
        usernameMaxLength,
        usernameFormatHint,
        usernameProhibitedHint,
        
        
        
        // states:
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        usernameRef,
        username,
        usernameHandlers,
        usernameFocused,
        usernameValid,
        usernameValidLength,
        usernameValidFormat,
        usernameValidAvailable,
        usernameValidNotProhibited,
    } = useSignInState();
    const specificValidations = {
        usernameValidLength,
        usernameValidFormat,
        usernameValidAvailable,
        usernameValidNotProhibited,
    };
    
    
    
    // validations:
    const usernameValidationMap = {
        Length        : <>Must be {usernameMinLength}-{usernameMaxLength} characters.</>,
        Format        : usernameFormatHint,
        Available     : <>Must have never been registered.</>,
        NotProhibited : usernameProhibitedHint,
    };
    
    
    
    // refs:
    const mergedUsernameInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `usernameInputComponent`:
        usernameInputComponent.props.elmRef,
        
        
        
        (isActiveSection ? usernameRef : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <UsernameInput> */}
            {React.cloneElement<InputProps<Element>>(usernameInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedUsernameInputRef,
                    
                    
                    
                    // classes:
                    className    : usernameInputComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    placeholder  : usernameInputComponent.props.placeholder  ?? 'Username',
                    
                    
                    
                    // values:
                    value        : usernameInputComponent.props.value        ?? username,
                    
                    
                    
                    // validations:
                    isValid      : usernameInputComponent.props.isValid      ?? (usernameValid === true),
                    required     : usernameInputComponent.props.required     ?? true,
                    
                    
                    
                    // formats:
                    autoComplete : usernameInputComponent.props.autoComplete ?? 'username',
                    
                    
                    
                    // handlers:
                    ...usernameHandlers,
                },
            )}
            {/* <Tooltip> */}
            {!!usernameTooltipComponent && React.cloneElement<TooltipProps<Element>>(usernameTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : usernameTooltipComponent.props.expanded   ?? (usernameFocused && userInteracted && !isBusy && isActiveSection && !isActionApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : usernameTooltipComponent.props.floatingOn ?? usernameRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(usernameValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (usernameValidationListComponent.props.children ?? Object.entries(usernameValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`usernameValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(usernameValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : usernameValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : usernameValidationListItemComponent.props.theme ?? getValidityTheme(isValid),
                            },
                            
                            
                            
                            // children:
                            usernameValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(usernameValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : usernameValidationIconComponent.props.icon ?? getValidityIcon(isValid),
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
