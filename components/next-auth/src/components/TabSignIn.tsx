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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    
    
    
    // layout-components:
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // utility-components:
    ModalStatusProps,
    ModalStatus,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
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
import {
    // react components:
    FieldUsernameOrEmailProps,
    FieldUsernameOrEmail,
}                           from './FieldUsernameOrEmail.js'
import {
    // react components:
    FieldPasswordProps,
    FieldPassword,
}                           from './FieldPassword.js'

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
export interface TabSignInProps
    extends
        // components:
        Omit<FieldUsernameOrEmailProps,  'isActiveSection'|'isActionApplied'>,
        Omit<FieldPasswordProps       , 'isActiveSection'|'isActionApplied'|'isPasswordEntry'>
{
    // auths:
    providers                           ?: BuiltInProviderType[]
    
    
    
    // components:
    signInTitleComponent                ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    signInButtonComponent               ?: ButtonComponentProps['buttonComponent']
    signInWithButtonComponent           ?: ButtonComponentProps['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
    
    alternateSignInSeparatorComponent   ?: React.ReactComponentElement<any, GenericProps<Element>>
    
    emailValidationModalStatusComponent ?: React.ReactComponentElement<any, ModalStatusProps<Element>>|null
}
export const TabSignIn = (props: TabSignInProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        
        
        
        // components:
        signInTitleComponent                = (<h1>Sign In</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameOrEmailInputComponent,
        
        passwordInputComponent,
        
        signInButtonComponent               = (<ButtonWithBusy busyType='credentials'    buttonComponent={<ButtonIcon icon='login' />} /> as React.ReactComponentElement<any, ButtonProps>),
        signInWithButtonComponent           = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignInProps>['signInWithButtonComponent']),
        
        alternateSignInSeparatorComponent   = (<AlternateSignInSeparator  />                                                              as React.ReactComponentElement<any, GenericProps<Element>>),
        
        emailValidationModalStatusComponent = (<ModalStatus<Element> theme='primary' />                                                   as React.ReactComponentElement<any, ModalStatusProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // states:
        isSignInSection,
        emailVerified,
        
        
        
        // fields & validations:
        formRef,
        
        
        
        // actions:
        doSignIn,
        doSignInWith,
        
        
        
        // utilities:
        resolveProviderName
    } = useSignInState();
    
    
    
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
            
            <FieldUsernameOrEmail
                // states:
                isActiveSection={isSignInSection}
                
                
                
                // components:
                usernameOrEmailInputComponent={usernameOrEmailInputComponent}
            />
            
            <FieldPassword
                // behaviors:
                isPasswordEntry={false}
                
                
                
                // states:
                isActiveSection={isSignInSection}
                isActionApplied={false}
                
                
                
                // components:
                passwordInputComponent={passwordInputComponent}
                passwordTooltipComponent={null}
            />
            
            {/* <SignInButton> */}
            {React.cloneElement<ButtonProps>(signInButtonComponent,
                // props:
                {
                    // actions:
                    type      : signInButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : signInButtonComponent.props.className ?? 'doSignIn credentials',
                    
                    
                    
                    // handlers:
                    onClick   : signInButtonHandleClick,
                },
                
                
                
                // children:
                signInButtonComponent.props.children ?? 'Sign In',
            )}
            
            {/* signIn alternates */}
            {!!providers.length && <>
                {/* <AlternateSignInSeparator> */}
                {React.cloneElement<GenericProps<Element>>(alternateSignInSeparatorComponent,
                    // props:
                    {
                        // classes:
                        className : alternateSignInSeparatorComponent.props.className ?? 'signinSeparator',
                    },
                )}
                
                {/* <SigninGroup> */}
                <div className='signinGroup'>
                    {/* <SignInWithButtonComponent> */}
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
            
            {/* <ModalStatus> */}
            {!!emailValidationModalStatusComponent && React.cloneElement<ModalStatusProps<Element>>(emailValidationModalStatusComponent,
                // props:
                {
                    // accessibilities:
                    inheritEnabled : emailValidationModalStatusComponent.props.inheritEnabled ?? false,
                    
                    
                    
                    // global stackable:
                    viewport       : emailValidationModalStatusComponent.props.viewport       ?? formRef,
                },
                
                
                
                // children:
                (emailValidationModalStatusComponent.props.children ?? ((emailVerified === null) && <CardBody>
                    <p>
                        <Busy />&nbsp;Validating email confirmation token...
                    </p>
                </CardBody>)),
            )}
        </form>
    );
};
