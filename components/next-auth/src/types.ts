// auth-js:
import type {
    // types:
    Awaitable,
    
    
    
    // models:
    DefaultSession,
    DefaultSession as AuthDefaultSession,
    
    // // User,
    Session,
}                           from '@auth/core/types'
import type {
    // models:
    Adapter,
    // // AdapterUser,
    AdapterSession,
    AdapterAccount,
}                           from '@auth/core/adapters'
import type {
    OAuthConfig,
}                           from '@auth/core/providers'

// next-auth:
import type {
    DefaultJWT,
    DefaultJWT as NextAuthDefaultJWT,
    
    JWT,
}                           from 'next-auth/jwt' // TODO: to be removed, for compatibility reason
// // import type {
// //     // models:
// //     DefaultUser,
// //     DefaultUser as NextAuthDefaultUser,
// // }                           from 'next-auth' // TODO: to be removed, for compatibility reason



// types:
export type {
    Awaitable,
}



// models:
export type {
    // // DefaultUser,
    DefaultSession,
    DefaultJWT,
    
    // // User,
    Session,
    JWT,
    
    Adapter,
    // // AdapterUser,
    AdapterSession,
    AdapterAccount,
}



declare module 'next-auth' { // TODO: to be removed, for compatibility reason
    // ref to '@heymarco/next-auth':
    interface DefaultUser extends HeyMarcoDefaultUser {}
    
    
    
    // mod of '@auth/core/types':
    interface DefaultSession extends AuthDefaultSession {
        // user        ?: User        // maybe empty // TODO: conflict! to be fixed soon
        credentials ?: Credentials // maybe empty
        role        ?: Role        // maybe empty
    }
}
declare module 'next-auth/jwt' { // TODO: to be removed, for compatibility reason
    interface DefaultJWT { // as NextAuthDefaultJWT
        userId ?: string|null
    }
}
declare module '@auth/core/types' {
    // ref to '@heymarco/next-auth':
    type DefaultUser = HeyMarcoDefaultUser
    
    
    
    interface DefaultSession { // as AuthDefaultSession
        user        ?: User        // maybe empty
        credentials ?: Credentials // maybe empty
        role        ?: Role        // maybe empty
    }
    
    
    
    type DefaultJWT = NextAuthDefaultJWT
}



export interface DefaultUser {
    id    : string
    name  : string
    email : string
    image : string|null // maybe empty
}
type HeyMarcoDefaultUser = DefaultUser
export interface User extends DefaultUser {}
export interface AdapterUser extends User {
    emailVerified : Date|null // maybe empty
}



export interface DefaultCredentials {
    username : string
}
export interface Credentials extends DefaultCredentials {}
export interface AdapterCredentials extends Credentials {}



export interface DefaultRole {
    id       : string
    name     : string
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
export interface AuthConfigShared {
    business                 : BusinessConfig
    signUp                   : Pick<SignUpConfig, 'enabled'>
    signIn                   : Pick<SignInConfig, 'path'>
    reset                    : Pick<ResetConfig , 'enabled'>
}
export interface AuthConfigClient extends AuthConfigShared {}



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
