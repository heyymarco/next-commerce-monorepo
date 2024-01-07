'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// auth-js:
import type {
    // types:
    BuiltInProviderType,
}                           from '@auth/core/providers'

// reusable-ui core:
import type {
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // simple-components:
    IconProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// utilities:
export const invalidSelector = ':is(.invalidating, .invalidated)';
export const getAuthErrorDescription = (errorCode: string): React.ReactNode => {
    switch (errorCode) {
        case 'SessionRequired'   : // the content of this page requires you to be signed in at all times
            return <p>You are not signed in. Please <strong>sign in to continue</strong>.</p>;
        
        case 'CredentialsSignin' : // the authorize callback returned null in the Credentials provider
            return <p>Sign in failed. Make sure <strong>your username (or email)</strong> and <strong>your password</strong> are correct.</p>;
        
        case 'OAuthSignin'       : // error in constructing an authorization URL
        case 'OAuthCallback'     : // error in handling the response from an OAuth provider
        case 'OAuthCreateAccount': // could not create OAuth provider user in the database
        case 'Callback'          : // error in the OAuth callback handler route
            return <p>Sign in failed. Make sure you have <strong>granted access</strong> from your 3rd party account.</p>;
        
        case 'AccessDenied'      :
            return <p>You do <strong>not have permission</strong> to sign in.</p>;
        
        case 'Verification'      :
            return <p>The token has <strong>expired</strong> or has <strong>already been used</strong>.</p>;
        
        case 'Configuration'     :
            return <>
                <p>There is a problem with the <strong>server configuration</strong>.</p>
                <p>Please contact our technical support for assistance.</p>
            </>;
        
        case 'Default'           :
        default                  :
            return <p>Oops, an <strong>error occured</strong>.</p>;
    } // switch
};

export const resolveProviderName = (oAuthProvider: BuiltInProviderType): string => {
    return oAuthProvider.replace(/((?:^| )[a-z])/g, (found) => found.toUpperCase())
};

export const getValidityTheme = (isValid: boolean|'unknown'|'loading'|'error'|undefined): ThemeName => {
    switch (isValid) {
        case true      : return 'success';
        case false     : return 'danger';
        case 'unknown' : return 'danger';
        default        : return 'secondary';
    } // switch
};
export const getValidityIcon  = (isValid: boolean|'unknown'|'loading'|'error'|undefined): IconProps['icon'] => {
    switch (isValid) {
        case true      : return 'check';
        case false     : return 'error_outline';
        case 'loading' : return 'busy';
        case 'unknown' : return 'help_outline';
        default        : return 'help_outline';
    } // switch
};

export const isClientError = (fetchError: any): boolean => {
    const errorCode = (
        fetchError?.status
        ??
        fetchError?.cause?.status
    );
    if (typeof(errorCode) !== 'number') return false;
    return (errorCode >= 400) && (errorCode <= 499);
};



// handlers:
export const handlePreventSubmit : React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
};
