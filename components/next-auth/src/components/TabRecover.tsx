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
    
    usernameOrEmailInputComponent  ?: React.ReactComponentElement<any, InputProps<Element>>
    sendRecoverLinkButtonComponent ?: ButtonComponentProps['buttonComponent']
}
export const TabRecover = (props: TabRecoverProps) => {
    // rest props:
    const {
        // components:
        recoverTitleComponent          = (<h1>Forgot Password?</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        usernameOrEmailInputComponent  = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />                as React.ReactComponentElement<any, InputProps<Element>>),
        sendRecoverLinkButtonComponent = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        isRecoverSection,
        
        
        
        // fields & validations:
        formRef,
        
        usernameOrEmailRef,
        usernameOrEmail,
        usernameOrEmailHandlers,
        usernameOrEmailValid,
        
        
        
        // actions:
        doRecover,
    } = signInState;
    
    
    
    // refs:
    const mergedUsernameOrEmailInputRef = useMergeRefs(
        // preserves the original `elmRef` from `usernameOrEmailInputComponent`:
        usernameOrEmailInputComponent.props.elmRef,
        
        
        
        (isRecoverSection ? usernameOrEmailRef : undefined),
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
                    autoComplete : usernameOrEmailInputComponent.props.autoComplete ?? 'username',
                    
                    
                    
                    // values:
                    value        : usernameOrEmailInputComponent.props.value        ?? usernameOrEmail,
                    
                    
                    
                    // validations:
                    isValid      : usernameOrEmailInputComponent.props.isValid      ?? usernameOrEmailValid,
                    required     : usernameOrEmailInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...usernameOrEmailHandlers,
                },
            )}
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
                sendRecoverLinkButtonComponent.props.children ?? 'Send Reset Password Link',
            )}
        </form>
    );
};
