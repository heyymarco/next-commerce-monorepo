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
export interface TabRecoverProps {
    // components:
    recoverTitleComponent          ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    usernameInputComponent         ?: React.ReactComponentElement<any, InputProps<Element>>
    sendRecoverLinkButtonComponent ?: ButtonComponentProps['buttonComponent']
}
export const TabRecover = (props: TabRecoverProps) => {
    // rest props:
    const {
        // components:
        recoverTitleComponent          = (<h1>Forgot Password?</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameInputComponent         = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />                as React.ReactComponentElement<any, InputProps<Element>>),
        sendRecoverLinkButtonComponent = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        isRecoverSection,
        
        
        
        // fields & validations:
        formRef,
        
        usernameRef,
        username,
        usernameHandlers,
        usernameValid,
        
        
        
        // actions:
        doRecover,
    } = signInState;
    
    
    
    // refs:
    const mergedUsernameInputRef = useMergeRefs(
        // preserves the original `elmRef` from `usernameInputComponent`:
        usernameInputComponent.props.elmRef,
        
        
        
        (isRecoverSection ? usernameRef : undefined),
    );
    
    
    
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
            {/* <SendRecoverLinkButton> */}
            {React.cloneElement<ButtonProps>(sendRecoverLinkButtonComponent,
                // props:
                {
                    // actions:
                    type      : sendRecoverLinkButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : sendRecoverLinkButtonComponent.props.className ?? 'sendRecoverLink',
                    
                    
                    
                    // handlers:
                    onClick   : sendRecoverLinkButtonHandleClick,
                },
                
                
                
                // children:
                sendRecoverLinkButtonComponent.props.children ?? 'Send Reset Password Link',
            )}
        </form>
    );
};
