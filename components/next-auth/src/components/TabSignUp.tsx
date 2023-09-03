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
    TextInput,
    PasswordInput,
    EmailInput,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    ListProps,
    List,
    
    
    
    // notification-components:
    TooltipProps,
    Tooltip,
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
export interface TabSignUpProps {
    // components:
    signUpTitleComponent                 ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>
    
    fullnameInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    emailInputComponent                  ?: React.ReactComponentElement<any, InputProps<Element>>
    usernameInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent               ?: React.ReactComponentElement<any, InputProps<Element>>
    password2InputComponent              ?: React.ReactComponentElement<any, InputProps<Element>>
    signUpButtonComponent                ?: ButtonComponentProps['buttonComponent']
    
    fullnameTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    fullnameValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    fullnameValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    fullnameValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
    
    emailTooltipComponent                ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    emailValidationListComponent         ?: React.ReactComponentElement<any, ListProps<Element>>
    emailValidationListItemComponent     ?: React.ReactComponentElement<any, ListItemProps<Element>>
    emailValidationIconComponent         ?: React.ReactComponentElement<any, IconProps<Element>>
    
    usernameTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    usernameValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    usernameValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    usernameValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
    
    passwordTooltipComponent             ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    password2TooltipComponent            ?: React.ReactComponentElement<any, TooltipProps<Element>>|null
    passwordValidationListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    password2ValidationListComponent     ?: React.ReactComponentElement<any, ListProps<Element>>
    passwordValidationListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    password2ValidationListItemComponent ?: React.ReactComponentElement<any, ListItemProps<Element>>
    passwordValidationIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
    password2ValidationIconComponent     ?: React.ReactComponentElement<any, IconProps<Element>>
}
export const TabSignUp = (props: TabSignUpProps) => {
    // rest props:
    const {
        // components:
        signUpTitleComponent                 = (<h1>Sign Up</h1> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        fullnameInputComponent               = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput autoCapitalize='words' />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        emailInputComponent                  = (<InputWithLabel icon='alternate_email'    inputComponent={<EmailInput                       />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        usernameInputComponent               = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput                        />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent               = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput                    />} /> as React.ReactComponentElement<any, InputProps<Element>>),
        password2InputComponent              = passwordInputComponent,
        signUpButtonComponent                = (<ButtonWithBusy busyType='signUp'         buttonComponent={<ButtonIcon icon='account_box' />} />   as React.ReactComponentElement<any, ButtonProps>),
        
        fullnameTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        fullnameValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        fullnameValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        fullnameValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
        
        emailTooltipComponent                = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        emailValidationListComponent         = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        emailValidationListItemComponent     = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        emailValidationIconComponent         = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
        
        usernameTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        usernameValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        usernameValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        usernameValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
        
        passwordTooltipComponent             = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                                       as React.ReactComponentElement<any, TooltipProps<Element>>),
        password2TooltipComponent            = passwordTooltipComponent,
        passwordValidationListComponent      = (<List<Element> listStyle='flat' />                                                                 as React.ReactComponentElement<any, ListProps<Element>>),
        password2ValidationListComponent     = passwordValidationListComponent,
        passwordValidationListItemComponent  = (<ListItem<Element> size='sm' outlined={true} />                                                    as React.ReactComponentElement<any, ListItemProps<Element>>),
        password2ValidationListItemComponent = passwordValidationListItemComponent,
        passwordValidationIconComponent      = (<Icon<Element> size='sm' icon={undefined as any} />                                                as React.ReactComponentElement<any, IconProps<Element>>),
        password2ValidationIconComponent     = passwordValidationIconComponent,
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // constraints:
        fullnameMinLength,
        fullnameMaxLength,
        
        emailMinLength,
        emailMaxLength,
        emailFormatHint,
        
        usernameMinLength,
        usernameMaxLength,
        usernameFormatHint,
        
        passwordMinLength,
        passwordMaxLength,
        passwordHasUppercase,
        passwordHasLowercase,
        
        
        
        // states:
        isSignUpSection,
        isSignUpApplied,
        isBusy,
        
        
        
        // fields & validations:
        formRef,
        
        fullnameRef,
        fullname,
        fullnameHandlers,
        fullnameFocused,
        fullnameValid,
        fullnameValidLength,
        
        emailRef,
        email,
        emailHandlers,
        emailFocused,
        emailValid,
        emailValidLength,
        emailValidFormat,
        emailValidAvailable,
        
        usernameRef,
        username,
        usernameHandlers,
        usernameFocused,
        usernameValid,
        usernameValidLength,
        usernameValidFormat,
        usernameValidAvailable,
        
        passwordRef,
        password,
        passwordHandlers,
        passwordFocused,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2Ref,
        password2,
        password2Handlers,
        password2Focused,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // actions:
        doSignIn,
    } = signInState;
    const specificValidations = {
        fullnameValid,
        fullnameValidLength,
        
        emailValidLength,
        emailValidFormat,
        emailValidAvailable,
        
        usernameValidLength,
        usernameValidFormat,
        usernameValidAvailable,
        
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
    };
    
    
    
    // validations:
    const fullnameValidationMap = {
        Length    : <>{fullnameMinLength}-{fullnameMaxLength} characters</>,
    };
    const emailValidationMap = {
        Length    : <>{emailMinLength}-{emailMaxLength} characters</>,
        Format    : emailFormatHint,
        Available : <>The email is available</>,
    };
    const usernameValidationMap = {
        Length    : <>{usernameMinLength}-{usernameMaxLength} characters</>,
        Format    : usernameFormatHint,
        Available : <>The username is available</>,
    };
    const passwordValidationMap = {
        Length    : <>{passwordMinLength}-{passwordMaxLength} characters</>,
        Uppercase : !!passwordHasUppercase && <>At least one capital letter</>,
        Lowercase : !!passwordHasLowercase && <>At least one non-capital letter</>,
        Match     : <>Exact match to previous password</>,
    };
    
    
    
    // refs:
    const mergedFullnameInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `fullnameInputComponent`:
        fullnameInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? fullnameRef : undefined),
    );
    const mergedEmailInputRef     = useMergeRefs(
        // preserves the original `elmRef` from `emailInputComponent`:
        emailInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? emailRef : undefined),
    );
    const mergedUsernameInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `usernameInputComponent`:
        usernameInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? usernameRef : undefined),
    );
    const mergedPasswordInputRef  = useMergeRefs(
        // preserves the original `elmRef` from `passwordInputComponent`:
        passwordInputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? passwordRef : undefined),
    );
    const mergedPassword2InputRef = useMergeRefs(
        // preserves the original `elmRef` from `password2InputComponent`:
        password2InputComponent.props.elmRef,
        
        
        
        (isSignUpSection ? password2Ref : undefined),
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
            {/* <FullnameInput> */}
            {React.cloneElement<InputProps<Element>>(fullnameInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedFullnameInputRef,
                    
                    
                    
                    // classes:
                    className    : fullnameInputComponent.props.className    ?? 'fullname',
                    
                    
                    
                    // accessibilities:
                    placeholder  : fullnameInputComponent.props.placeholder  ?? 'Your Name',
                    autoComplete : fullnameInputComponent.props.autoComplete ?? 'fullname',
                    
                    
                    
                    // values:
                    value        : fullnameInputComponent.props.value        ?? fullname,
                    
                    
                    
                    // validations:
                    isValid      : fullnameInputComponent.props.isValid      ?? fullnameValid,
                    required     : fullnameInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...fullnameHandlers,
                },
            )}
            {/* <EmailInput> */}
            {React.cloneElement<InputProps<Element>>(emailInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : mergedEmailInputRef,
                    
                    
                    
                    // classes:
                    className    : emailInputComponent.props.className    ?? 'email',
                    
                    
                    
                    // accessibilities:
                    placeholder  : emailInputComponent.props.placeholder  ?? 'Email',
                    autoComplete : emailInputComponent.props.autoComplete ?? 'email',
                    
                    
                    
                    // values:
                    value        : emailInputComponent.props.value        ?? email,
                    
                    
                    
                    // validations:
                    isValid      : emailInputComponent.props.isValid      ?? emailValid,
                    required     : emailInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...emailHandlers,
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
                    placeholder  : usernameInputComponent.props.placeholder  ?? 'Username',
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
                    placeholder  : passwordInputComponent.props.placeholder  ?? 'New Password',
                    autoComplete : passwordInputComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : passwordInputComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : passwordInputComponent.props.isValid      ?? passwordValid,
                    required     : passwordInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
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
                },
            )}
            {/* <Tooltip> */}
            {!!fullnameTooltipComponent && React.cloneElement<TooltipProps<Element>>(fullnameTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : fullnameTooltipComponent.props.expanded   ?? (fullnameFocused && !isBusy && isSignUpSection && !isSignUpApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : fullnameTooltipComponent.props.floatingOn ?? fullnameRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(fullnameValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (fullnameValidationListComponent.props.children ?? Object.entries(fullnameValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`fullnameValid${validationType}`] as (boolean|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(fullnameValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : fullnameValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : fullnameValidationListItemComponent.props.theme ?? (isValid ? 'success' : 'danger'),
                            },
                            
                            
                            
                            // children:
                            fullnameValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(fullnameValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : fullnameValidationIconComponent.props.icon ?? (isValid ? 'check' : 'error_outline'),
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
            {!!emailTooltipComponent && React.cloneElement<TooltipProps<Element>>(emailTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : emailTooltipComponent.props.expanded   ?? (emailFocused && !isBusy && isSignUpSection && !isSignUpApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : emailTooltipComponent.props.floatingOn ?? emailRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(emailValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (emailValidationListComponent.props.children ?? Object.entries(emailValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`emailValid${validationType}`] as (boolean|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(emailValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : emailValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : emailValidationListItemComponent.props.theme ?? (isValid ? 'success' : 'danger'),
                            },
                            
                            
                            
                            // children:
                            emailValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(emailValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : emailValidationIconComponent.props.icon ?? (isValid ? 'check' : 'error_outline'),
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
            {!!usernameTooltipComponent && React.cloneElement<TooltipProps<Element>>(usernameTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : usernameTooltipComponent.props.expanded   ?? (usernameFocused && !isBusy && isSignUpSection && !isSignUpApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : usernameTooltipComponent.props.floatingOn ?? usernameRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(usernameValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (usernameValidationListComponent.props.children ?? Object.entries(usernameValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`usernameValid${validationType}`] as (boolean|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return React.cloneElement<ListItemProps<Element>>(usernameValidationListItemComponent,
                            // props:
                            {
                                // identifiers:
                                key   : usernameValidationListItemComponent.key         ?? index,
                                
                                
                                
                                // variants:
                                theme : usernameValidationListItemComponent.props.theme ?? (isValid ? 'success' : 'danger'),
                            },
                            
                            
                            
                            // children:
                            usernameValidationListItemComponent.props.children ?? <>
                                {React.cloneElement<IconProps<Element>>(usernameValidationIconComponent,
                                    // props:
                                    {
                                        // appearances:
                                        icon : usernameValidationIconComponent.props.icon ?? (isValid ? 'check' : 'error_outline'),
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
            {!!passwordTooltipComponent && React.cloneElement<TooltipProps<Element>>(passwordTooltipComponent,
                // props:
                {
                    // states:
                    expanded   : passwordTooltipComponent.props.expanded   ?? (passwordFocused && !isBusy && isSignUpSection && !isSignUpApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : passwordTooltipComponent.props.floatingOn ?? passwordRef,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(passwordValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (passwordValidationListComponent.props.children ?? Object.entries(passwordValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`passwordValid${validationType}`] as (boolean|undefined);
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
                    expanded   : password2TooltipComponent.props.expanded   ?? (password2Focused && !isBusy && isSignUpSection && !isSignUpApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : password2TooltipComponent.props.floatingOn ?? password2Ref,
                },
                
                
                
                // children:
                /* <List> */
                React.cloneElement<ListProps<Element>>(password2ValidationListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (password2ValidationListComponent.props.children ?? Object.entries(passwordValidationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`password2Valid${validationType}`] as (boolean|undefined);
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
