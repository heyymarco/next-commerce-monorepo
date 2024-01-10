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
    FieldUsernameOrEmailProps,
    FieldUsernameOrEmail,
}                           from './FieldUsernameOrEmail.js'

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
export interface TabRecoverProps
    extends
        // components:
        Omit<FieldUsernameOrEmailProps,  'isActiveSection'|'isActionApplied'>
{
    // components:
    recoverTitleComponent          ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    sendRecoverLinkButtonComponent ?: ButtonComponentProps['buttonComponent']
}
export const TabRecover = (props: TabRecoverProps) => {
    // rest props:
    const {
        // components:
        recoverTitleComponent          = (<h1>Forgot Password?</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameOrEmailInputComponent,
        
        sendRecoverLinkButtonComponent = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const {
        // states:
        isRecoverSection,
        
        
        
        // fields & validations:
        formRef,
        
        
        
        // actions:
        doRecover,
    } = useSignInState();
    
    
    
    // handlers:
    const sendRecoverLinkButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        doRecover();
    });
    const sendRecoverLinkButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `sendRecoverLinkButtonComponent`:
        sendRecoverLinkButtonComponent.props.onClick,
        
        
        
        // actions:
        sendRecoverLinkButtonHandleClickInternal,
    );
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isRecoverSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            {/* <RecoverTitle> */}
            {React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(recoverTitleComponent,
                // props:
                {
                    // classes:
                    className : recoverTitleComponent.props.className ?? 'recoverTitle',
                },
            )}
            
            <FieldUsernameOrEmail
                // states:
                isActiveSection={isRecoverSection}
                
                
                
                // components:
                usernameOrEmailInputComponent={usernameOrEmailInputComponent}
            />
            
            {/* <SendRecoverLinkButton> */}
            {React.cloneElement<ButtonProps>(sendRecoverLinkButtonComponent,
                // props:
                {
                    // actions:
                    type      : sendRecoverLinkButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : sendRecoverLinkButtonComponent.props.className ?? 'doRecover',
                    
                    
                    
                    // handlers:
                    onClick   : sendRecoverLinkButtonHandleClick,
                },
                
                
                
                // children:
                sendRecoverLinkButtonComponent.props.children ?? 'Send Password Reset Link',
            )}
        </form>
    );
};
