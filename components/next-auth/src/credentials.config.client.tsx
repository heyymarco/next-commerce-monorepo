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
import {
    // types:
    defaultCredentialsConfigShared,
}                           from './credentials.config.shared.js'



export const defaultCredentialsConfigClient : CredentialsConfigClient = {
    name     : defaultCredentialsConfigShared.name,
    email    : {
        ...defaultCredentialsConfigShared.email,
        
        formatHint     : <>Must be a common email format.</>,
    },
    username : {
        ...defaultCredentialsConfigShared.username,
        
        formatHint     : <>Begins with a letter followed by letters, numbers, underscores, or hyphens.</>,
        
        prohibitedHint : <>Must not contain prohibited words.</>,
    },
    password : {
        ...defaultCredentialsConfigShared.password,
        
        prohibitedHint : <>Must not using common passwords.</>,
    },
};
