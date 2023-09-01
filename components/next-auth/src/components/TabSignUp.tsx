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



// react components:
export interface TabSignUpProps {
    // auths:
    providers                         ?: BuiltInProviderType[]
    
    
    
    // components:
    signUpTitleComponent              ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    usernameInputComponent            ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent            ?: React.ReactComponentElement<any, InputProps<Element>>
    signUpButtonComponent             ?: ButtonComponentProps['buttonComponent']
    signInWithButtonComponent         ?: ButtonComponentProps['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
    alternateSignInSeparatorComponent ?: React.ReactComponentElement<any, GenericProps<Element>>
}
export const TabSignUp = (props: TabSignUpProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        
        
        
        // components:
        signUpTitleComponent              = (<h1>Sign Up</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameInputComponent            = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />                  as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent            = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />                  as React.ReactComponentElement<any, InputProps<Element>>),
        signUpButtonComponent             = (<ButtonWithBusy busyType='signUp'         buttonComponent={<ButtonIcon icon='account_box' />} /> as React.ReactComponentElement<any, ButtonProps>),
        signInWithButtonComponent         = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignUpProps>['signInWithButtonComponent']),
        alternateSignInSeparatorComponent = (<AlternateSignInSeparator  />                                                                    as React.ReactComponentElement<any, GenericProps<Element>>),
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
        
        
        
        // actions:
        doSignIn,
        doSignInWith,
        
        
        
        // utilities:
        resolveProviderName
    } = signInState;
    
    
    
    // refs:
    const mergedUsernameInputRef = useMergeRefs(
        // preserves the original `elmRef` from `usernameInputComponent`:
        usernameInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? usernameRef : undefined),
    );
    const mergedPasswordInputRef = useMergeRefs(
        // preserves the original `elmRef` from `passwordInputComponent`:
        passwordInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? passwordRef : undefined),
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
                    placeholder  : passwordInputComponent.props.placeholder  ?? 'Password',
                    autoComplete : passwordInputComponent.props.autoComplete ?? 'current-password',
                    
                    
                    
                    // values:
                    value        : passwordInputComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : passwordInputComponent.props.isValid      ?? passwordValid,
                    required     : passwordInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
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
            {!!providers.length && <>
                {React.cloneElement<GenericProps<Element>>(alternateSignInSeparatorComponent,
                    // props:
                    {
                        // classes:
                        className : alternateSignInSeparatorComponent.props.className ?? 'signinSeparator',
                    },
                )}
                <div className='signinGroup'>
                    {providers.map((providerType) => {
                        const signInWithProviderButtonComponent : React.ReactComponentElement<any, ButtonProps> = (
                            (typeof(signInWithButtonComponent) === 'function')
                            ? signInWithButtonComponent(providerType)
                            : signInWithButtonComponent
                        );
                        
                        
                        
                        // jsx:
                        return (
                            <ButtonWithSignIn
                                // identifiers:
                                key={providerType}
                                
                                
                                
                                // auths:
                                providerType={providerType}
                                
                                
                                
                                // components:
                                buttonComponent={
                                    /* <SignInWithProviderButton> */
                                    React.cloneElement<ButtonProps>(signInWithProviderButtonComponent,
                                        // props:
                                        {
                                            // identifiers:
                                            key       : providerType,
                                            
                                            
                                            
                                            // actions:
                                            type      : signInWithProviderButtonComponent.props.type      ?? 'submit',
                                            
                                            
                                            
                                            // classes:
                                            className : signInWithProviderButtonComponent.props.className ?? `doSignIn ${providerType}`,
                                        },
                                        
                                        
                                        
                                        // children:
                                        signInWithProviderButtonComponent.props.children ?? <>Sign In with {resolveProviderName(providerType)}</>,
                                    )
                                }
                                
                                
                                
                                // handlers:
                                onSignInWith={doSignInWith}
                            />
                        );
                    })}
                </div>
            </>}
        </form>
    );
};
