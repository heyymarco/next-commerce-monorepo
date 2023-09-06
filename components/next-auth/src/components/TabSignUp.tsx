'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // react components:
    ButtonWithBusy,
}                           from './ButtonWithBusy.js'
import {
    // react components:
    FieldFullnameProps,
    FieldFullname,
}                           from './FieldFullname.js'
import {
    // react components:
    FieldEmailProps,
    FieldEmail,
}                           from './FieldEmail.js'
import {
    // react components:
    FieldUsernameProps,
    FieldUsername,
}                           from './FieldUsername.js'
import {
    // react components:
    FieldPasswordProps,
    FieldPassword,
}                           from './FieldPassword.js'
import {
    // react components:
    FieldPassword2Props,
    FieldPassword2,
}                           from './FieldPassword2.js'

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
export interface TabSignUpProps
    extends
        // components:
        Omit<FieldFullnameProps,  'isActiveSection'|'isActionApplied'>,
        Omit<FieldEmailProps,     'isActiveSection'|'isActionApplied'|'emailReadOnly'>,
        Omit<FieldUsernameProps,  'isActiveSection'|'isActionApplied'>,
        Omit<FieldPasswordProps,  'isActiveSection'|'isActionApplied'>,
        Omit<FieldPassword2Props, 'isActiveSection'|'isActionApplied'>
{
    // components:
    signUpTitleComponent                 ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    signUpButtonComponent                ?: ButtonComponentProps['buttonComponent']
}
export const TabSignUp = (props: TabSignUpProps) => {
    // rest props:
    const {
        // components:
        signUpTitleComponent                 = (<h1>Sign Up</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        fullnameInputComponent,
        fullnameTooltipComponent,
        fullnameValidationListComponent,
        fullnameValidationListItemComponent,
        fullnameValidationIconComponent,
        
        emailInputComponent,
        emailTooltipComponent,
        emailValidationListComponent,
        emailValidationListItemComponent,
        emailValidationIconComponent,
        
        usernameInputComponent,
        usernameTooltipComponent,
        usernameValidationListComponent,
        usernameValidationListItemComponent,
        usernameValidationIconComponent,
        
        passwordInputComponent,
        passwordTooltipComponent,
        passwordValidationListComponent,
        passwordValidationListItemComponent,
        passwordValidationIconComponent,
        
        password2InputComponent,
        password2TooltipComponent,
        password2ValidationListComponent,
        password2ValidationListItemComponent,
        password2ValidationIconComponent,
        
        signUpButtonComponent                = (<ButtonWithBusy busyType='signUp'         buttonComponent={<ButtonIcon icon='account_box' />} />   as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const {
        // states:
        isSignUpSection,
        isSignUpApplied,
        
        
        
        // fields & validations:
        formRef,
        
        
        
        // actions:
        doSignUp,
    } = useSignInState();
    
    
    
    // handlers:
    const signUpButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        doSignUp();
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
            
            <FieldFullname
                // states:
                isActiveSection={isSignUpSection}
                isActionApplied={isSignUpApplied}
                
                
                
                // components:
                fullnameInputComponent={fullnameInputComponent}
                fullnameTooltipComponent={fullnameTooltipComponent}
                fullnameValidationListComponent={fullnameValidationListComponent}
                fullnameValidationListItemComponent={fullnameValidationListItemComponent}
                fullnameValidationIconComponent={fullnameValidationIconComponent}
            />
            
            <FieldEmail
                // states:
                isActiveSection={isSignUpSection}
                isActionApplied={isSignUpApplied}
                
                
                
                // components:
                emailInputComponent={emailInputComponent}
                emailTooltipComponent={emailTooltipComponent}
                emailValidationListComponent={emailValidationListComponent}
                emailValidationListItemComponent={emailValidationListItemComponent}
                emailValidationIconComponent={emailValidationIconComponent}
            />
            
            <FieldUsername
                // states:
                isActiveSection={isSignUpSection}
                isActionApplied={isSignUpApplied}
                
                
                
                // components:
                usernameInputComponent={usernameInputComponent}
                usernameTooltipComponent={usernameTooltipComponent}
                usernameValidationListComponent={usernameValidationListComponent}
                usernameValidationListItemComponent={usernameValidationListItemComponent}
                usernameValidationIconComponent={usernameValidationIconComponent}
            />
            
            <FieldPassword
                // states:
                isActiveSection={isSignUpSection}
                isActionApplied={isSignUpApplied}
                
                
                
                // components:
                passwordInputComponent={passwordInputComponent}
                passwordTooltipComponent={passwordTooltipComponent}
                passwordValidationListComponent={passwordValidationListComponent}
                passwordValidationListItemComponent={passwordValidationListItemComponent}
                passwordValidationIconComponent={passwordValidationIconComponent}
            />
            
            <FieldPassword2
                // states:
                isActiveSection={isSignUpSection}
                isActionApplied={isSignUpApplied}
                
                
                
                // components:
                passwordInputComponent={passwordInputComponent}
                passwordTooltipComponent={passwordTooltipComponent}
                passwordValidationListComponent={passwordValidationListComponent}
                passwordValidationListItemComponent={passwordValidationListItemComponent}
                passwordValidationIconComponent={passwordValidationIconComponent}
                
                password2InputComponent={password2InputComponent}
                password2TooltipComponent={password2TooltipComponent}
                password2ValidationListComponent={password2ValidationListComponent}
                password2ValidationListItemComponent={password2ValidationListItemComponent}
                password2ValidationIconComponent={password2ValidationIconComponent}
            />
            
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
