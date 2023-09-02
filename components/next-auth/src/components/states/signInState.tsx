'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useRef,
    useState,
    useEffect,
    useMemo,
}                           from 'react'

// next-js:
import {
    // navigations:
    useRouter,
    usePathname,
    useSearchParams,
}                           from 'next/navigation'

// next-auth:
import type {
    // types:
    BuiltInProviderType,
}                           from 'next-auth/providers'
import {
    // apis:
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    Busy,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // utilities:
    invalidSelector,
    getAuthErrorDescription,
    resolveProviderName as defaultResolveProviderName,
}                           from '../utilities.js'
import {
    // hooks:
    FieldHandlers,
    useFieldState,
}                           from '../hooks.js'

// configs:
import type {
    CredentialsConfig,
}                           from '../../credentials.config.js'



// contexts:
export type SignInSection =
    | 'signUp'
    | 'signIn'
    | 'recover'
    | 'reset'
export type BusyState =
    | false               // idle
    |'signUp'             // busy: sign up
    | BuiltInProviderType // busy: login with ...
    | 'recover'           // busy: recover
    | 'reset'             // busy: reset
export interface SignInState {
    // constraints:
    passwordMinLength       : number
    passwordMaxLength       : number
    passwordHasUppercase    : boolean
    passwordHasLowercase    : boolean
    
    
    
    // data:
    callbackUrl             : string|null
    resetPasswordToken      : string|null
    
    
    
    // states:
    section                 : SignInSection
    isSignUpSection         : boolean
    isSignInSection         : boolean
    isRecoverSection        : boolean
    isResetSection          : boolean
    isSignUpApplied         : boolean
    isRecoverApplied        : boolean
    isResetApplied          : boolean
    isBusy                  : BusyState
    setIsBusy               : (isBusy: BusyState) => void
    
    
    
    // fields & validations:
    formRef                 : React.MutableRefObject<HTMLFormElement|null>
    
    emailRef                : React.MutableRefObject<HTMLInputElement|null>
    email                   : string
    emailHandlers           : FieldHandlers<HTMLInputElement>
    emailValid              : boolean
    
    usernameRef             : React.MutableRefObject<HTMLInputElement|null>
    username                : string
    usernameHandlers        : FieldHandlers<HTMLInputElement>
    usernameValid           : boolean
    
    usernameOrEmailRef      : React.MutableRefObject<HTMLInputElement|null>
    usernameOrEmail         : string
    usernameOrEmailHandlers : FieldHandlers<HTMLInputElement>
    usernameOrEmailValid    : boolean
    
    passwordRef             : React.MutableRefObject<HTMLInputElement|null>
    password                : string
    passwordHandlers        : FieldHandlers<HTMLInputElement>
    passwordValid           : boolean
    passwordValidLength     : boolean
    passwordValidUppercase  : boolean
    passwordValidLowercase  : boolean
    
    password2Ref            : React.MutableRefObject<HTMLInputElement|null>
    password2               : string
    password2Handlers       : FieldHandlers<HTMLInputElement>
    password2Valid          : boolean
    password2ValidLength    : boolean
    password2ValidUppercase : boolean
    password2ValidLowercase : boolean
    password2ValidMatch     : boolean
    
    
    
    // navigations:
    gotoSignUp              : () => void
    gotoSignIn              : () => void
    gotoRecover             : () => void
    gotoHome                : () => void
    
    
    
    // actions:
    doSignIn                : () => Promise<void>
    doSignInWith            : (providerType: BuiltInProviderType) => Promise<void>
    doRecover               : () => Promise<void>
    doReset                 : () => Promise<void>
    
    
    
    // utilities:
    resolveProviderName     : (oAuthProvider: BuiltInProviderType) => string
}
const SignInStateContext = createContext<SignInState>({
    // constraints:
    passwordMinLength       : 0,
    passwordMaxLength       : 0,
    passwordHasUppercase    : false,
    passwordHasLowercase    : false,
    
    
    
    // data:
    callbackUrl             : null,
    resetPasswordToken      : null,
    
    
    
    // states:
    section                 : 'signIn',
    isSignUpSection         : false,
    isSignInSection         : false,
    isRecoverSection        : false,
    isResetSection          : false,
    isSignUpApplied         : false,
    isRecoverApplied        : false,
    isResetApplied          : false,
    isBusy                  : false,
    setIsBusy               : () => {},
    
    
    
    // fields & validations:
    formRef                 : { current: null },
    
    emailRef                : { current: null },
    email                   : '',
    emailHandlers           : { onChange: () => {} },
    emailValid              : false,
    
    usernameRef             : { current: null },
    username                : '',
    usernameHandlers        : { onChange: () => {} },
    usernameValid           : false,
    
    usernameOrEmailRef      : { current: null },
    usernameOrEmail         : '',
    usernameOrEmailHandlers : { onChange: () => {} },
    usernameOrEmailValid    : false,
    
    passwordRef             : { current: null },
    password                : '',
    passwordHandlers        : { onChange: () => {} },
    passwordValid           : false,
    passwordValidLength     : false,
    passwordValidUppercase  : false,
    passwordValidLowercase  : false,
    
    password2Ref            : { current: null },
    password2               : '',
    password2Handlers       : { onChange: () => {} },
    password2Valid          : false,
    password2ValidLength    : false,
    password2ValidUppercase : false,
    password2ValidLowercase : false,
    password2ValidMatch     : false,
    
    
    
    // navigations:
    gotoSignUp              : () => {},
    gotoSignIn              : () => {},
    gotoRecover             : () => {},
    gotoHome                : () => {},
    
    
    
    // actions:
    doSignIn                : async () => {},
    doSignInWith            : async () => {},
    doRecover               : async () => {},
    doReset                 : async () => {},
    
    
    
    // utilities:
    resolveProviderName     : () => '',
});
export interface SignInStateProps {
    // configs:
    credentialsConfig    : CredentialsConfig
    
    
    
    // auths:
    resolveProviderName ?: (oAuthProvider: BuiltInProviderType) => string
    basePath            ?: string
    
    
    
    // pages:
    homepagePath        ?: string
}
export const SignInStateProvider = (props: React.PropsWithChildren<SignInStateProps>) => {
    // rest props:
    const {
        // configs:
        credentialsConfig,
        
        
        
        // auths:
        resolveProviderName : resolveProviderNameUnstable,
        basePath            = '/api/auth',
        
        
        
        // pages:
        homepagePath        = '/',
        
        
        
        // children:
        children,
    } = props;
    const resolveProviderName = useEvent<Required<SignInStateProps>['resolveProviderName']>((oAuthProvider) => { // make a stable ref
        return (resolveProviderNameUnstable ?? defaultResolveProviderName)(oAuthProvider);
    });
    const resetPath           = `${basePath}/reset`;
    
    
    
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname();
    const searchParams = useSearchParams();
    
    
    
    // data:
    const callbackUrlRef        = useRef<string|null>(searchParams?.get('callbackUrl'       ) || null);
    const callbackUrl           = callbackUrlRef.current;
    const resetPasswordTokenRef = useRef<string|null>(searchParams?.get('resetPasswordToken') || null);
    const resetPasswordToken    = resetPasswordTokenRef.current;
    
    
    
    // states:
    const [section         , setSection         ] = useState<SignInSection>(!!resetPasswordTokenRef.current ? 'reset' : 'signIn');
    const isSignUpSection                         = (section === 'signUp');
    const isSignInSection                         = (section === 'signIn');
    const isRecoverSection                        = (section === 'recover');
    const isResetSection                          = (section === 'reset');
    const [tokenVerified   , setTokenVerified   ] = useState<undefined|{ email: string, username: string|null }|false>(!resetPasswordToken ? false : undefined);
    const [isSignUpApplied , setIsSignUpApplied ] = useState<boolean>(false);
    const [isRecoverApplied, setIsRecoverApplied] = useState<boolean>(false);
    const [isResetApplied  , setIsResetApplied  ] = useState<boolean>(false);
    const [isBusy          , setIsBusyInternal  ] = useState<BusyState>(false);
    const isMounted                               = useMountedFlag();
    
    
    
    // fields:
    const formRef            = useRef<HTMLFormElement|null>(null);
    const emailRef           = useRef<HTMLInputElement|null>(null);
    const usernameRef        = useRef<HTMLInputElement|null>(null);
    const usernameOrEmailRef = useRef<HTMLInputElement|null>(null);
    const passwordRef        = useRef<HTMLInputElement|null>(null);
    const password2Ref       = useRef<HTMLInputElement|null>(null);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [email           , setEmail           , emailHandlers          ] = useFieldState();
    const [username        , setUsername        , usernameHandlers       ] = useFieldState();
    const [usernameOrEmail , setUsernameOrEmail , usernameOrEmailHandlers] = useFieldState();
    const [password        , setPassword        , passwordHandlers       ] = useFieldState();
    const [password2       , setPassword2       , password2Handlers      ] = useFieldState();
    
    
    
    // constraints:
    const passwordMinLength       = credentialsConfig.PASSWORD_MIN_LENGTH;
    const passwordMaxLength       = credentialsConfig.PASSWORD_MAX_LENGTH;
    const passwordHasUppercase    = credentialsConfig.PASSWORD_HAS_UPPERCASE;
    const passwordHasLowercase    = credentialsConfig.PASSWORD_HAS_LOWERCASE;
    
    
    
    // validations:
    const isDataEntry             = ((section === 'signUp') || (section === 'reset'));
    
    const emailValid              = (/^[a-zA-Z0-9-_.!#$%&'*+/=?^`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/).test(email);
    const usernameValid           = (username.length >= 1);
    const usernameOrEmailValid    = (usernameOrEmail.length >= 1);
    
    const passwordValidLength     = !isDataEntry ? (password.length >= 1)  : ((password.length >= passwordMinLength) && (password.length <= passwordMaxLength));
    const passwordValidUppercase  = !isDataEntry ? true                    : (!passwordHasUppercase || !!password.match(/[A-Z]/));
    const passwordValidLowercase  = !isDataEntry ? true                    : (!passwordHasLowercase || !!password.match(/[a-z]/));
    const passwordValid           = passwordValidLength && passwordValidUppercase && passwordValidLowercase;
    
    const password2ValidLength    = !isDataEntry ? (password2.length >= 1) : ((password2.length >= passwordMinLength) && (password2.length <= passwordMaxLength));
    const password2ValidUppercase = !isDataEntry ? true                    : (!passwordHasUppercase || !!password2.match(/[A-Z]/));
    const password2ValidLowercase = !isDataEntry ? true                    : (!passwordHasLowercase || !!password2.match(/[a-z]/));
    const password2ValidMatch     = !isDataEntry ? true                    : (!!password && (password2 === password));
    const password2Valid          = password2ValidLength && password2ValidUppercase && password2ValidLowercase && password2ValidMatch;
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
        showMessageNotification,
    } = useDialogMessage();
    
    
    
    // dom effects:
    
    // displays an error passed by `next-auth`:
    useEffect(() => {
        // conditions:
        const error = searchParams?.get('error');
        if (!error) return; // no error passed => ignore
        
        
        
        // report the failure:
        showMessageError(getAuthErrorDescription(error));
    }, []);
    
    // remove passed queryString(s):
    useEffect(() => {
        // conditions:
        if (!pathName) return; // the router is not ready => ignore
        if (
            !searchParams?.get('error')
            &&
            !searchParams?.get('callbackUrl')
            &&
            !searchParams?.get('resetPasswordToken')
        ) return; // no queryString(s) passed => nothing to remove => ignore
        
        
        
        try {
            // get current browser's queryString:
            const newSearchParams = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
            
            // remove `?error=***` on browser's url:
            newSearchParams.delete('error');
            
            // remove `?callbackUrl=***` on browser's url:
            newSearchParams.delete('callbackUrl');
            
            // remove `?resetPasswordToken=***` on browser's url:
            newSearchParams.delete('resetPasswordToken');
            
            // update browser's url:
            router.replace(`${pathName}${!!newSearchParams.size ? `?${newSearchParams}` : ''}`, { scroll: false });
        }
        catch {
            // ignore any error
        } // if
    }, [pathName]);
    
    // validate password reset token at startup:
    const hasInitialized = useRef(false); // make sure the validation is never performed twice
    useEffect(() => {
        // conditions:
        if (!resetPasswordToken)         return; // no token => nothing to reset => ignore
        if (tokenVerified !== undefined) return; // already verified with success/failed result => ignore
        if (hasInitialized.current)      return; // already performed => ignore
        hasInitialized.current = true; // mark as performed
        
        
        
        // actions:
        (async () => {
            // attempts validate password reset:
            try {
                const response = await fetch(`${resetPath}?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`, {
                    method : 'GET',
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                const data = await response.json();
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                setTokenVerified(data);
            }
            catch (error: any) { // error
                // save the failure:
                setTokenVerified(false);
                
                
                
                // report the failure:
                await showMessageFetchError(error);
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                const isRequestError = (
                    // axios'  error request:
                    !!error.request
                    ||
                    // fetch's error request:
                    (error instanceof TypeError)
                );
                if (!isRequestError) {
                    // redirect to sign in tab:
                    gotoSignIn();
                } // if
                // nothing to do with unverified token & server_side_error => keeps the UI disabled
                // else {
                //     // focus to password field:
                //     passwordRef.current?.setSelectionRange(0, password.length);
                //     passwordRef.current?.focus();
                // } // if
            } // try
        })();
    }, [resetPasswordToken, tokenVerified]);
    
    // focus on email field when the section is 'signUp':
    useEffect(() => {
        // conditions:
        if (section !== 'signUp') return; // other than 'signUp' => ignore
        
        
        
        // actions:
        emailRef.current?.focus();
    }, [section]);
    
    // focus on usernameOrEmail field when the section is 'signIn' or 'recover':
    useEffect(() => {
        // conditions:
        if ((section !== 'signIn') && (section !== 'recover')) return; // other than 'signIn' or 'recover' => ignore
        
        
        
        // actions:
        usernameOrEmailRef.current?.focus();
    }, [section]);
    
    // focus on password field after successfully verified the password reset token:
    useEffect(() => {
        // conditions:
        if (!tokenVerified) return; // NOT verified with success result => ignore
        
        
        
        // actions:
        passwordRef.current?.focus();
    }, [tokenVerified]);
    
    // resets input states when the `section` changes:
    const prevSection = useRef<SignInSection>(section);
    useEffect(() => {
        // conditions:
        if (prevSection.current === section) return; // no change => ignore
        prevSection.current = section; // sync
        
        
        
        // reset request states:
        setIsRecoverApplied(false);
        setIsResetApplied(false);
        
        
        
        // reset fields & validations:
        setEnableValidation(false);
        setEmail('');
        setUsername('');
        setUsernameOrEmail('');
        setPassword('');
        setPassword2('');
    }, [section]);
    
    
    
    // stable callbacks:
    const setIsBusy    = useEvent((isBusy: BusyState) => {
        signInState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoSignUp   = useEvent(() => {
        setSection('signUp');
    });
    const gotoSignIn   = useEvent(() => {
        setSection('signIn');
    });
    const gotoRecover  = useEvent(() => {
        setSection('recover');
    });
    const gotoHome     = useEvent(() => {
        router.push(homepagePath);
    });
    
    const doSignIn     = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts sign in using credentials:
        setIsBusy('credentials'); // mark as busy
        const result = await signIn('credentials', { username: usernameOrEmail, password, redirect: false });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!!result?.error) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            
            
            
            // report the failure:
            await showMessageError(getAuthErrorDescription(result?.error ?? 'CredentialsSignin'));
            
            
            
            // focus to password field:
            passwordRef.current?.setSelectionRange(0, password.length);
            passwordRef.current?.focus();
        }
        else { // success
            // resets:
            setUsernameOrEmail('');
            setPassword('');
            
            
            
            // redirect to origin page:
            if (callbackUrl) {
                // redirect to `callbackUrl` (if supplied)
                
                
                
                router.replace(callbackUrl);
            }
            else {
                // stays on login page
                
                
                
                setIsBusy(false); // unmark as busy
                
                
                
                // resets:
                setEnableValidation(false);
             // setUsernameOrEmail(''); // already reseted above
             // setPassword('');        // already reseted above
            } // if
        } // if
    });
    const doSignInWith = useEvent(async (providerType: BuiltInProviderType): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // attempts sign in using OAuth:
        setIsBusy(providerType); // mark as busy
        const result = await signIn(providerType, {
            callbackUrl:
                callbackUrl // redirect to `callbackUrl` (if supplied)
                ||          // -or-
                undefined   // stays on login page
        });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!!result?.error) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
        }
        else { // success
            // report the success:
            showMessageNotification(
                <p><Busy />&nbsp;You are being redirected to <strong>{resolveProviderName(providerType)} sign in page</strong>. Please wait...</p>
            );
        } // if
    });
    const doRecover    = useEvent(async(): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts request recover password:
        setIsBusy('recover'); // mark as busy
        try {
            const response = await fetch(resetPath, {
                method  : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body    : JSON.stringify({ username: usernameOrEmail }),
            });
            if (!response.ok) throw Error(response.statusText, { cause: response });
            const data = await response.json();
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setIsRecoverApplied(true); // mark recoverRequest as sent
            setIsBusy(false); // unmark as busy
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
                </p>
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // redirect to sign in tab:
            gotoSignIn();
        }
        catch (error: any) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            
            
            
            // focus to usernameOrEmail field:
            usernameOrEmailRef.current?.setSelectionRange(0, usernameOrEmail.length);
            usernameOrEmailRef.current?.focus();
        } // try
    });
    const doReset      = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts apply password reset:
        setIsBusy('reset'); // mark as busy
        try {
            const response = await fetch(resetPath, {
                method  : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body    : JSON.stringify({ resetPasswordToken, password }),
            });
            if (!response.ok) throw Error(response.statusText, { cause: response });
            const data = await response.json();
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setIsResetApplied(true); // mark resetPassword as applied
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            setPassword2('');
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {data.message ?? 'The password has been successfully changed. Now you can sign in with the new password.'}
                </p>
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // redirect to sign in tab:
            gotoSignIn();
        }
        catch (error: any) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            const isRequestError = (
                // axios'  error request:
                !!error.request
                ||
                // fetch's error request:
                (error instanceof TypeError)
            );
            if (!isRequestError) {
                // redirect to sign in tab:
                gotoSignIn();
            }
            else {
                // focus to password field:
                passwordRef.current?.setSelectionRange(0, password.length);
                passwordRef.current?.focus();
            } // if
        } // try
    });
    
    
    
    // apis:
    const signInState = useMemo<SignInState>(() => ({
        // constraints:
        passwordMinLength,       // stable value
        passwordMaxLength,       // stable value
        passwordHasUppercase,    // stable value
        passwordHasLowercase,    // stable value
        
        
        
        // data:
        callbackUrl,             // mutable value
        resetPasswordToken,      // mutable value
        
        
        
        // states:
        section,                 // mutable value
        isSignUpSection,         // mutable value
        isSignInSection,         // mutable value
        isRecoverSection,        // mutable value
        isResetSection,          // mutable value
        isSignUpApplied,         // mutable value
        isRecoverApplied,        // mutable value
        isResetApplied,          // mutable value
        isBusy,                  // mutable value
        setIsBusy,               // stable ref
        
        
        
        // fields & validations:
        formRef,                 // stable ref
        
        emailRef,                // stable ref
        email : (
            isResetSection
            ? (tokenVerified === false) ? '' : (tokenVerified?.email ?? '')
            : email
        ),                       // mutable value
        emailHandlers,           // stable ref
        emailValid,              // mutable value
        
        usernameRef,             // stable ref
        username,                // mutable value
        usernameHandlers,        // stable ref
        usernameValid,           // mutable value
        
        usernameOrEmailRef,      // stable ref
        usernameOrEmail,         // mutable value
        usernameOrEmailHandlers, // stable ref
        usernameOrEmailValid,    // mutable value
        
        passwordRef,             // stable ref
        password,                // mutable value
        passwordHandlers,        // stable ref
        passwordValid,           // mutable value
        passwordValidLength,     // mutable value
        passwordValidUppercase,  // mutable value
        passwordValidLowercase,  // mutable value
        
        password2Ref,            // stable ref
        password2,               // mutable value
        password2Handlers,       // stable ref
        password2Valid,          // mutable value
        password2ValidLength,    // mutable value
        password2ValidUppercase, // mutable value
        password2ValidLowercase, // mutable value
        password2ValidMatch,     // mutable value
        
        
        
        // navigations:
        gotoSignUp,              // stable ref
        gotoSignIn,              // stable ref
        gotoRecover,             // stable ref
        gotoHome,                // stable ref
        
        
        
        // actions:
        doSignIn,                // stable ref
        doSignInWith,            // stable ref
        doRecover,               // stable ref
        doReset,                 // stable ref
        
        
        
        // utilities:
        resolveProviderName,     // stable ref
    }), [
        // data:
        callbackUrl,
        resetPasswordToken,
        
        
        
        // states:
        section,
        isSignUpSection,
        isSignInSection,
        isRecoverSection,
        isResetSection,
        isSignUpApplied,
        isRecoverApplied,
        isResetApplied,
        isBusy,
        
        
        
        // fields & validations:
        tokenVerified,
        
        email,
        emailValid,
        
        username,
        usernameValid,
        
        usernameOrEmail,
        usernameOrEmailValid,
        
        password,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
    ]);
    
    
    
    // jsx:
    return (
        <SignInStateContext.Provider value={signInState}>
            <AccessibilityProvider
                 // accessibilities:
                enabled={
                    !isBusy // disabled if busy
                    &&
                    (
                        (isSignUpSection  && !isSignUpApplied)                   // on 'signUp'  section => enabled if registration   was NOT sent
                        ||
                        isSignInSection                                          // on 'signIn'  section => always enabled
                        ||
                        (isRecoverSection && !isRecoverApplied)                  // on 'recover' section => enabled if recoverRequest was NOT sent
                        ||
                        (isResetSection   && !isResetApplied && !!tokenVerified) // on 'reset'   section => enabled if resetPassword  was NOT applied and token verified
                    )
                }
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
                    {children}
                </ValidationProvider>
            </AccessibilityProvider>
        </SignInStateContext.Provider>
    );
}
export const useSignInState = (): SignInState => {
    return useContext(SignInStateContext);
};
