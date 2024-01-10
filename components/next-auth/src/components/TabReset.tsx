'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    GlobalStackableProps,
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
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCard,
    
    
    
    // utility-components:
    PromiseDialog,
    ModalBaseProps,
    useDialogMessage,
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
    resetTitleComponent             ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    passwordResetButtonComponent    ?: ButtonComponentProps['buttonComponent']
    
    tokenValidationDialogComponent  ?: React.ReactComponentElement<any, (ModalBaseProps<Element, ModalExpandedChangeEvent<any>> & GlobalStackableProps)>|null
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
        
        passwordResetButtonComponent         = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='save' />} />  as React.ReactComponentElement<any, ButtonProps>),
        
        tokenValidationDialogComponent       = (<ModalCard<Element> theme='primary' backdropStyle='static' inheritEnabled={false} />       as React.ReactComponentElement<any, (ModalBaseProps<Element, ModalExpandedChangeEvent<any>> & GlobalStackableProps)>),
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
    const passwordResetButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        doReset();
    });
    const passwordResetButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `passwordResetButtonComponent`:
        passwordResetButtonComponent.props.onClick,
        
        
        
        // actions:
        passwordResetButtonHandleClickInternal,
    );
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // effects:
    const shouldTokenValidationDialogShown : boolean = (
        !!tokenValidationDialogComponent // if no <Dialog> defined => nothing to display
        &&
        (tokenVerified === null)         // if already verified => no need to display the <Dialog>
    );
    const shownTokenValidationDialogRef = useRef<null|PromiseDialog<any>>(null); // initially no <Dialog> was shown
    if ((!!shownTokenValidationDialogRef.current) !== shouldTokenValidationDialogShown) { // detect changes
        // close prev shown <Dialog> (if any):
        shownTokenValidationDialogRef.current?.closeDialog(null);
        
        // show a new <Dialog> (if needed):
        if (tokenValidationDialogComponent && shouldTokenValidationDialogShown) {
            shownTokenValidationDialogRef.current = showDialog(
                React.cloneElement<(ModalBaseProps<Element, ModalExpandedChangeEvent<any>> & GlobalStackableProps)>(tokenValidationDialogComponent,
                    // props:
                    {
                        // global stackable:
                        viewport : tokenValidationDialogComponent.props.viewport ?? formRef,
                    },
                    
                    
                    
                    // children:
                    (tokenValidationDialogComponent.props.children ?? <CardBody>
                        <p>
                            <Busy />&nbsp;Validating password reset token...
                        </p>
                    </CardBody>),
                )
            );
        } // if
    } // if
    
    
    
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
            
            {/* <PasswordResetButton> */}
            {React.cloneElement<ButtonProps>(passwordResetButtonComponent,
                // props:
                {
                    // actions:
                    type      : passwordResetButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : passwordResetButtonComponent.props.className ?? 'doReset',
                    
                    
                    
                    // handlers:
                    onClick   : passwordResetButtonHandleClick,
                },
                
                
                
                // children:
                passwordResetButtonComponent.props.children ?? 'Reset Password',
            )}
        </form>
    );
};
