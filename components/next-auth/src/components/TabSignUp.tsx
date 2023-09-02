'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import type {
    // types:
    BuiltInProviderType,
}                           from 'next-auth/providers'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    InputProps,
    TextInput,
    PasswordInput,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // react components:
    InputWithLabel,
}                           from './InputWithLabel.js'
import {
    // react components:
    ButtonWithBusy,
}                           from './ButtonWithBusy.js'
import {
    // react components:
    ButtonWithSignIn,
}                           from './ButtonWithSignIn.js'
import {
    // react components:
    AlternateSignInSeparator,
}                           from './AlternateSignInSeparator.js'

// internals:
import {
    // states:
    useSignInState,
}                           from './states/signInState.js'
import {
    // handlers:
    handlePreventSubmit,
}                           from './utilities.js'
import {
    // hooks:
    useFocusState,
}                           from './hooks.js'



// react components:
export interface TabSignUpProps {
    // components:
    signUpTitleComponent              ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    usernameInputComponent            ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent            ?: React.ReactComponentElement<any, InputProps<Element>>
    password2InputComponent           ?: React.ReactComponentElement<any, InputProps<Element>>
    signUpButtonComponent             ?: ButtonComponentProps['buttonComponent']
}
export const TabSignUp = (props: TabSignUpProps) => {
    // rest props:
    const {
        // components:
        signUpTitleComponent              = (<h1>Sign Up</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameInputComponent            = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />                  as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent            = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />                  as React.ReactComponentElement<any, InputProps<Element>>),
        password2InputComponent           = passwordInputComponent,
        signUpButtonComponent             = (<ButtonWithBusy busyType='signUp'         buttonComponent={<ButtonIcon icon='account_box' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        isSignUpSection,
        
        
        
        // fields & validations:
        formRef,
        
        usernameRef,
        username,
        usernameHandlers,
        usernameValid,
        
        passwordRef,
        password,
        passwordHandlers,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2Ref,
        password2,
        password2Handlers,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // actions:
        doSignIn,
        doSignInWith,
        
        
        
        // utilities:
        resolveProviderName
    } = signInState;
    
    
    
    // states:
    const [passwordFocused , passwordFocusHandlers ] = useFocusState<HTMLSpanElement>();
    const [password2Focused, password2FocusHandlers] = useFocusState<HTMLSpanElement>();
    
    
    
    // refs:
    const mergedUsernameInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `usernameInputComponent`:
        usernameInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? usernameRef : undefined),
    );
    const mergedPasswordInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `passwordInputComponent`:
        passwordInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? passwordRef : undefined),
    );
    const mergedPassword2InputRef = useMergeRefs(
        // preserves the original `elmRef` from `password2InputComponent`:
        password2InputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? password2Ref : undefined),
    );
    
    
    
    // handlers:
    const signUpButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        doSignIn();
    });
    const signUpButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `signUpButtonComponent`:
        signUpButtonComponent.props.onClick,
        
        
        
        // actions:
        signUpButtonHandleClickInternal,
    );
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isSignUpSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            {/* <SignUpTitle> */}
            {React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(signUpTitleComponent,
                // props:
                {
                    // classes:
                    className : signUpTitleComponent.props.className ?? 'signUpTitle',
                },
            )}
            {/* <UsernameInput> */}
            {React.cloneElement<InputProps<Element>>(usernameInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedUsernameInputRef,
                    
                    
                    
                    // classes:
                    className    : usernameInputComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    placeholder  : usernameInputComponent.props.placeholder  ?? 'Username or Email',
                    autoComplete : usernameInputComponent.props.autoComplete ?? 'username',
                    
                    
                    
                    // values:
                    value        : usernameInputComponent.props.value        ?? username,
                    
                    
                    
                    // validations:
                    isValid      : usernameInputComponent.props.isValid      ?? usernameValid,
                    required     : usernameInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...usernameHandlers,
                },
            )}
            {/* <PasswordInput> */}
            {React.cloneElement<InputProps<Element>>(passwordInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedPasswordInputRef,
                    
                    
                    
                    // classes:
                    className    : passwordInputComponent.props.className    ?? 'password',
                    
                    
                    
                    // accessibilities:
                    placeholder  : passwordInputComponent.props.placeholder  ?? 'New Password',
                    autoComplete : passwordInputComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : passwordInputComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : passwordInputComponent.props.isValid      ?? passwordValid,
                    required     : passwordInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
                    ...passwordFocusHandlers,
                },
            )}
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
                    autoComplete : password2InputComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : password2InputComponent.props.value        ?? password2,
                    
                    
                    
                    // validations:
                    isValid      : password2InputComponent.props.isValid      ?? password2Valid,
                    required     : password2InputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...password2Handlers,
                    ...password2FocusHandlers,
                },
            )}
            {/* <SignUpButton> */}
            {React.cloneElement<ButtonProps>(signUpButtonComponent,
                // props:
                {
                    // actions:
                    type      : signUpButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : signUpButtonComponent.props.className ?? 'doSignUp',
                    
                    
                    
                    // handlers:
                    onClick   : signUpButtonHandleClick,
                },
                
                
                
                // children:
                signUpButtonComponent.props.children ?? 'Sign Up',
            )}
        </form>
    );
};
