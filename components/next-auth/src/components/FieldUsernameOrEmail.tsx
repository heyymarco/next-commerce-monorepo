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
    InputProps,
    TextInput,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // react components:
    InputWithLabel,
}                           from './InputWithLabel.js'

// internals:
import {
    // states:
    useSignInState,
}                           from './states/signInState.js'



// react components:
export interface FieldUsernameOrEmailProps {
    // states:
    isActiveSection                       : boolean
    
    
    
    // components:
    usernameOrEmailInputComponent        ?: React.ReactComponentElement<any, InputProps<Element>>
}
export const FieldUsernameOrEmail = (props: FieldUsernameOrEmailProps) => {
    // rest props:
    const {
        // states:
        isActiveSection,
        
        
        
        // components:
        usernameOrEmailInputComponent        = (<InputWithLabel icon='person'             inputComponent={<TextInput                        />} /> as React.ReactComponentElement<any, InputProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // fields & validations:
        usernameOrEmailRef,
        usernameOrEmail,
        usernameOrEmailHandlers,
        usernameOrEmailValid,
    } = useSignInState();
    
    
    
    // refs:
    const mergedUsernameOrEmailInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `usernameOrEmailInputComponent`:
        usernameOrEmailInputComponent.props.elmRef,
        
        
        
        (isActiveSection ? usernameOrEmailRef : undefined),
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <UsernameOrEmailInput> */}
            {React.cloneElement<InputProps<Element>>(usernameOrEmailInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedUsernameOrEmailInputRef,
                    
                    
                    
                    // classes:
                    className    : usernameOrEmailInputComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    placeholder  : usernameOrEmailInputComponent.props.placeholder  ?? 'Username or Email',
                    
                    
                    
                    // values:
                    value        : usernameOrEmailInputComponent.props.value        ?? usernameOrEmail,
                    
                    
                    
                    // validations:
                    isValid      : usernameOrEmailInputComponent.props.isValid      ?? (usernameOrEmailValid === true),
                    required     : usernameOrEmailInputComponent.props.required     ?? true,
                    
                    
                    
                    // formats:
                    autoComplete : usernameOrEmailInputComponent.props.autoComplete ?? 'username',
                    
                    
                    
                    // handlers:
                    ...usernameOrEmailHandlers,
                },
            )}
        </>
    );
};
