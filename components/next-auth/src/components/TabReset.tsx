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
    IconProps,
    Icon,
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    InputProps,
    PasswordInput,
    EmailInput,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    ListProps,
    List,
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // notification-components:
    TooltipProps,
    Tooltip,
    
    
    
    // utility-components:
    ModalStatusProps,
    ModalStatus,
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
export interface TabResetProps {
    // components:
    resetTitleComponent                  ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    emailInputComponent                  ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    password2InputComponent              ?: React.ReactComponentElement<any, InputProps<Element>>
    resetPasswordButtonComponent         ?: ButtonComponentProps['buttonComponent']
    
    passwordTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    password2TooltipComponent            ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    passwordValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    password2ValidationListComponent     ?: React.ReactComponentElement<any, ListProps<Element>>
    passwordValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    password2ValidationListItemComponent ?: React.ReactComponentElement<any, ListItemProps<Element>>
    passwordValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
    password2ValidationIconComponent     ?: React.ReactComponentElement<any, IconProps<Element>>
    
    tokenValidationModalStatusComponent  ?: React.ReactComponentElement<any, ModalStatusProps<Element>>|null
}
export const TabReset = (props: TabResetProps) => {
    // rest props:
    const {
        // components:
        resetTitleComponent                  = (<h1>Password Reset</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        emailInputComponent                  = (<InputWithLabel icon='supervisor_account' inputComponent={<EmailInput    />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent               = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        password2InputComponent              = passwordInputComponent,
        resetPasswordButtonComponent         = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='save' />} />  as React.ReactComponentElement<any, ButtonProps>),
        
        passwordTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        password2TooltipComponent            = passwordTooltipComponent,
        passwordValidationListComponent      = (<List<Element> listStyle='flat' />                                                         as React.ReactComponentElement<any, ListProps<Element>>),
        password2ValidationListComponent     = passwordValidationListComponent,
        passwordValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                            as React.ReactComponentElement<any, ListItemProps<Element>>),
        password2ValidationListItemComponent = passwordValidationListItemComponent,
        passwordValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                        as React.ReactComponentElement<any, IconProps<Element>>),
        password2ValidationIconComponent     = passwordValidationIconComponent,
        
        tokenValidationModalStatusComponent  = (<ModalStatus<Element> theme='primary' />                                                   as React.ReactComponentElement<any, ModalStatusProps<Element>>),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // constraints:
        passwordMinLength,
        passwordMaxLength,
        passwordHasUppercase,
        passwordHasLowercase,
        
        
        
        // states:
        isResetSection,
        isResetApplied,
        isBusy,
        
        
        
        // fields & validations:
        formRef,
        
        email,
        
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
        doReset,
    } = signInState;
    const validation = {
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
    };
    
    
    
    // states:
    const [passwordFocused , passwordFocusHandlers ] = useFocusState<HTMLSpanElement>();
    const [password2Focused, password2FocusHandlers] = useFocusState<HTMLSpanElement>();
    
    
    
    // validations:
    const validationMap = {
        Length    : <>{passwordMinLength}-{passwordMaxLength} characters</>,
        Uppercase : !!passwordHasUppercase && <>At least one capital letter</>,
        Lowercase : !!passwordHasLowercase && <>At least one non-capital letter</>,
        Match     : <>Exact match to previous password</>,
    };
    
    
    
    // refs:
    const mergedPasswordInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `passwordInputComponent`:
        passwordInputComponent.props.elmRef,
        
        
        
        (isResetSection ? passwordRef : undefined),
    );
    const mergedPassword2InputRef = useMergeRefs(
        // preserves the original `elmRef` from `password2InputComponent`:
        password2InputComponent.props.elmRef,
        
        
        
        (isResetSection ? password2Ref : undefined),
    );
    
    
    
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
            {/* <EmailInput> */}
            {React.cloneElement<InputProps<Element>>(emailInputComponent,
                // props:
                {
                    // classes:
                    className    : emailInputComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    readOnly     : emailInputComponent.props.readOnly     ?? true,
                    
                    
                    
                    // values:
                    value        : emailInputComponent.props.value        ?? (email ?? ''),
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
            {/* <Tooltip> */}
            {!!passwordTooltipComponent && React.cloneElement<TooltipProps<Element>>(passwordTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : passwordTooltipComponent.props.expanded   ?? (passwordFocused && !isBusy && isResetSection && !isResetApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : passwordTooltipComponent.props.floatingOn ?? passwordRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(passwordValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (passwordValidationListComponent.props.children ?? Object.entries(validationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (validation as any)?.[`passwordValid${validationType}`] as (boolean|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(passwordValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : passwordValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : passwordValidationListItemComponent.props.theme ?? (isValid ? 'success' : 'danger'),
                            },
                            
                            
                            
                            // children:
                            passwordValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(passwordValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : passwordValidationIconComponent.props.icon ?? (isValid ? 'check' : 'error_outline'),
                                    },
                                )}
                                &nbsp;
                                {text}
                            </>,
                        )
                    })),
                ),
            )}
            {/* <Tooltip> */}
            {!!password2TooltipComponent && React.cloneElement<TooltipProps<Element>>(password2TooltipComponent,
                // props:
                {
                    // states:
                    expanded   : password2TooltipComponent.props.expanded   ?? (password2Focused && !isBusy && isResetSection && !isResetApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : password2TooltipComponent.props.floatingOn ?? password2Ref,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(password2ValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (password2ValidationListComponent.props.children ?? Object.entries(validationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (validation as any)?.[`password2Valid${validationType}`] as (boolean|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(password2ValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : password2ValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : password2ValidationListItemComponent.props.theme ?? (isValid ? 'success' : 'danger'),
                            },
                            
                            
                            
                            // children:
                            password2ValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(password2ValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : password2ValidationIconComponent.props.icon ?? (isValid ? 'check' : 'error_outline'),
                                    },
                                )}
                                &nbsp;
                                {text}
                            </>,
                        )
                    })),
                ),
            )}
            {/* <ResetPasswordButton> */}
            {React.cloneElement<ButtonProps>(resetPasswordButtonComponent,
                // props:
                {
                    // actions:
                    type      : resetPasswordButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : resetPasswordButtonComponent.props.className ?? 'resetPassword',
                    
                    
                    
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
                (tokenValidationModalStatusComponent.props.children ?? ((email === null) && <CardBody>
                    <p>
                        <Busy />&nbsp;Validating reset password token...
                    </p>
                </CardBody>)),
            )}
        </form>
    );
};
