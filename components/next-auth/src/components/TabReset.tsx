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
    FieldEmailProps,
    FieldEmail,
}                           from './FieldEmail.js'
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
export interface TabResetProps
    extends
        // components:
        Omit<FieldEmailProps    , 'isActiveSection'|'isActionApplied'|'emailReadOnly'>,
        Omit<FieldPasswordProps , 'isActiveSection'|'isActionApplied'|'isPasswordEntry'>,
        Omit<FieldPassword2Props, 'isActiveSection'|'isActionApplied'>
{
    // components:
    resetTitleComponent                  ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    resetPasswordButtonComponent         ?: ButtonComponentProps['buttonComponent']
    
    tokenValidationModalStatusComponent  ?: React.ReactComponentElement<any, ModalStatusProps<Element>>|null
}
export const TabReset = (props: TabResetProps) => {
    // rest props:
    const {
        // components:
        resetTitleComponent                  = (<h1>Password Reset</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        emailInputComponent,
        
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
        
        resetPasswordButtonComponent         = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='save' />} />  as React.ReactComponentElement<any, ButtonProps>),
        
        tokenValidationModalStatusComponent  = (<ModalStatus<Element> theme='primary' />                                                   as React.ReactComponentElement<any, ModalStatusProps<Element>>),
    } = props;
    
    
    
    // states:
    const {
        // states:
        isResetSection,
        tokenVerified,
        isResetApplied,
        
        
        
        // fields & validations:
        formRef,
        
        
        
        // actions:
        doReset,
    } = useSignInState();
    
    
    
    // handlers:
    const resetPasswordButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        doReset();
    });
    const resetPasswordButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `resetPasswordButtonComponent`:
        resetPasswordButtonComponent.props.onClick,
        
        
        
        // actions:
        resetPasswordButtonHandleClickInternal,
    );
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isResetSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            {/* <SignInTitle> */}
            {React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(resetTitleComponent,
                // props:
                {
                    // classes:
                    className : resetTitleComponent.props.className ?? 'resetTitle',
                },
            )}
            
            <FieldEmail
                // accessibilities:
                emailReadOnly={true}
                
                
                
                // states:
                isActiveSection={isResetSection}
                isActionApplied={isResetSection}
                
                
                
                // components:
                emailInputComponent={emailInputComponent}
                emailTooltipComponent={null}
            />
            
            <FieldPassword
                // states:
                isActiveSection={isResetSection}
                isActionApplied={isResetApplied}
                
                
                
                // components:
                passwordInputComponent={passwordInputComponent}
                passwordTooltipComponent={passwordTooltipComponent}
                passwordValidationListComponent={passwordValidationListComponent}
                passwordValidationListItemComponent={passwordValidationListItemComponent}
                passwordValidationIconComponent={passwordValidationIconComponent}
            />
            
            <FieldPassword2
                // states:
                isActiveSection={isResetSection}
                isActionApplied={isResetApplied}
                
                
                
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
            
            {/* <ResetPasswordButton> */}
            {React.cloneElement<ButtonProps>(resetPasswordButtonComponent,
                // props:
                {
                    // actions:
                    type      : resetPasswordButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : resetPasswordButtonComponent.props.className ?? 'doReset',
                    
                    
                    
                    // handlers:
                    onClick   : resetPasswordButtonHandleClick,
                },
                
                
                
                // children:
                resetPasswordButtonComponent.props.children ?? 'Reset Password',
            )}
            
            {/* <ModalStatus> */}
            {!!tokenValidationModalStatusComponent && React.cloneElement<ModalStatusProps<Element>>(tokenValidationModalStatusComponent,
                // props:
                {
                    // accessibilities:
                    inheritEnabled : tokenValidationModalStatusComponent.props.inheritEnabled ?? false,
                    
                    
                    
                    // global stackable:
                    viewport       : tokenValidationModalStatusComponent.props.viewport       ?? formRef,
                },
                
                
                
                // children:
                (tokenValidationModalStatusComponent.props.children ?? ((tokenVerified === null) && <CardBody>
                    <p>
                        <Busy />&nbsp;Validating reset password token...
                    </p>
                </CardBody>)),
            )}
        </form>
    );
};
