'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'



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



// handlers:
export const handlePreventSubmit : React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
};
