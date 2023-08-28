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
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    InputProps,
    TextInput,
    PasswordInput,
}                           from '@reusable-ui/components'

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
export interface TabSignInProps {
    // auths:
    providers                 ?: BuiltInProviderType[]
    
    
    
    // components:
    signInTitleComponent      ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    usernameInputComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    signInButtonComponent     ?: ButtonComponentProps['buttonComponent']
    signInWithButtonComponent ?: ButtonComponentProps['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
}
export const TabSignIn = (props: TabSignInProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        
        
        
        // components:
        signInTitleComponent      = (<h1>Sign In</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameInputComponent    = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent    = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        signInButtonComponent     = (<ButtonWithBusy busyType='credentials'    buttonComponent={<ButtonIcon icon='login' />} /> as React.ReactComponentElement<any, ButtonProps>),
        signInWithButtonComponent = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignInProps>['signInWithButtonComponent']),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        isSignInSection,
        
        
        
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
        
        
        
        (isSignInSection ? usernameRef : undefined),
    );
    const mergedPasswordInputRef = useMergeRefs(
        // preserves the original `elmRef` from `passwordInputComponent`:
        passwordInputComponent.props.elmRef,
        
        
        
        (isSignInSection ? passwordRef : undefined),
    );
    
    
    
    // handlers:
    const signInButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        doSignIn();
    });
    const signInButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `signInButtonComponent`:
        signInButtonComponent.props.onClick,
        
        
        
        // actions:
        signInButtonHandleClickInternal,
    );
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isSignInSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            {/* <SignInTitle> */}
            {React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(signInTitleComponent,
                // props:
                {
                    // classes:
                    className : signInTitleComponent.props.className ?? 'signInTitle',
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
            {/* <SignInButton> */}
            {React.cloneElement<ButtonProps>(signInButtonComponent,
                // props:
                {
                    // actions:
                    type      : signInButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : signInButtonComponent.props.className ?? 'signin credentials',
                    
                    
                    
                    // handlers:
                    onClick   : signInButtonHandleClick,
                },
                
                
                
                // children:
                signInButtonComponent.props.children ?? 'Sign In',
            )}
            {!!providers.length && <hr className='signinSeparator' />}
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
                                    className : signInWithProviderButtonComponent.props.className ?? `signin ${providerType}`,
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
        </form>
    );
};
