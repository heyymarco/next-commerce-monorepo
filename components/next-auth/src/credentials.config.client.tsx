// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // types:
    CredentialsConfigClient,
}                           from './types.js'



export const defaultCredentialsConfigClient : CredentialsConfigClient = {
    name     : {
        minLength      : 2,
        maxLength      : 30,
    },
    email    : {
        minLength      : 5,
        maxLength      : 50,
        
        format         : /^[a-zA-Z0-9-_.!#$%&'*+/=?^`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
        formatHint     : <>Must be a common email format.</>,
    },
    username : {
        minLength      : 3,
        maxLength      : 20,
        
        format         : /^[a-z][a-z0-9-_]*$/i,
        formatHint     : <>Begins with a letter followed by letters, numbers, underscores, or hyphens.</>,
        
        prohibitedHint : <>Must not contain prohibited words.</>,
    },
    password : {
        minLength      : 5,
        maxLength      : 30,
        
        hasUppercase   : true,
        hasLowercase   : false,
        
        prohibitedHint : <>Must not using common passwords.</>,
    },
};
