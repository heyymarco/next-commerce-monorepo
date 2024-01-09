// auth-js:
import type {
    // types:
    Awaitable,
    
    
    
    // models:
    DefaultSession,
    DefaultSession as AuthDefaultSession,
    
    User,
    Session,
}                           from '@auth/core/types'
import type {
    // models:
    Adapter,
    AdapterUser,
    AdapterSession,
    AdapterAccount,
}                           from '@auth/core/adapters'
import type {
    OAuthConfig,
}                           from '@auth/core/providers'

// next-auth:
import type {
    // models:
    DefaultUser,
    DefaultUser as NextAuthDefaultUser,
}                           from 'next-auth' // TODO: to be removed, for compatibility reason



// types:
export type {
    Awaitable,
}



// models:
export type {
    DefaultUser,
    DefaultSession,
    
    User,
    Session,
    
    Adapter,
    AdapterUser,
    AdapterSession,
    AdapterAccount,
}



declare module 'next-auth' { // TODO: to be removed, for compatibility reason
    interface DefaultUser {
        role ?: Role|null
    }
    
    
    
    interface DefaultSession extends AuthDefaultSession {
        role ?: Role|null
    }
}
declare module '@auth/core' {
    interface DefaultUser extends NextAuthDefaultUser {
        role ?: Role|null
    }
    
    
    
    interface DefaultSession {
        role ?: Role|null
    }
}



export interface DefaultRole {
    id   : string
    name : string
}
export interface Role extends DefaultRole {}
export interface AdapterRole extends Role {}



export interface BusinessConfig {
    name                     : string
    url                      : string
}
export interface SignUpConfig {
    enabled                  : boolean
}
export interface SignInConfig {
    requireVerifiedEmail     : boolean
    failureMaxAttempts       : number|null /* times */
    failureLockDuration      : number      /* hours */
    path                     : string
}
export interface ResetConfig {
    enabled                  : boolean
    throttle                 : number /* hours */
    maxAge                   : number /* hours */
}
export interface SessionConfig {
    maxAge                   : number /* hours */
    updateAge                : number /* hours */
}
export interface EmailConfig {
    host                     : string
    port                     : number
    secure                   : boolean
    username                 : string
    password                 : string
    
    from                     : string
    subject                  : React.ReactNode
    message                  : React.ReactNode
}
export interface AuthConfigServer {
    business                 : BusinessConfig
    signUp                   : SignUpConfig
    signIn                   : SignInConfig
    reset                    : ResetConfig
    session                  : SessionConfig
    
    
    
    oAuthProviders           : OAuthConfig<any>[]
    
    
    
    emails                   : {
        signUp               : EmailConfig
        reset                : EmailConfig
    }
}



export interface FieldLengthConfig {
    minLength      : number
    maxLength      : number
}
export interface FieldFormatConfig {
    format         : RegExp
    formatHint     : React.ReactNode
}
export interface FieldProhibitedConfig {
    prohibited     : (string|RegExp)[]
    prohibitedHint : React.ReactNode
}
export interface FieldCaseConfig {
    hasUppercase   : boolean
    hasLowercase   : boolean
}
export type FieldNameConfig =
    & FieldLengthConfig
export type FieldEmailConfig =
    & FieldLengthConfig
    & FieldFormatConfig
export type FieldUsernameConfig =
    & FieldLengthConfig
    & FieldFormatConfig
    & FieldProhibitedConfig
export type FieldPasswordConfig =
    & FieldLengthConfig
    & FieldCaseConfig
    & FieldProhibitedConfig
export interface CredentialsConfigServer {
    name     : FieldNameConfig
    email    : Omit<FieldEmailConfig   , 'formatHint'>
    username : Omit<FieldUsernameConfig, 'prohibitedHint'|'formatHint'>
    password : Omit<FieldPasswordConfig, 'prohibitedHint'>
};
export interface CredentialsConfigClient {
    name     : FieldNameConfig
    email    : FieldEmailConfig
    username : Omit<FieldUsernameConfig, 'prohibited'>
    password : Omit<FieldPasswordConfig, 'prohibited'>
};
export interface CredentialsConfigShared {
    name     : FieldNameConfig
    email    : Omit<FieldEmailConfig   , 'formatHint'>
    username : Omit<FieldUsernameConfig, 'prohibited'|'prohibitedHint'|'formatHint'>
    password : Omit<FieldPasswordConfig, 'prohibited'|'prohibitedHint'>
};
