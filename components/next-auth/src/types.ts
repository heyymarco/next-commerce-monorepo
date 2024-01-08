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
    name                 : string
    url                  : string
}
export interface SignUpConfig {
    enabled              : boolean
}
export interface SignInConfig {
    requireVerifiedEmail : boolean
    failureMaxAttempts   : number|null /* times */
    failureLockDuration  : number      /* hours */
    path                 : string
}
export interface ResetConfig {
    throttle             : number /* hours */
    maxAge               : number /* hours */
}
export interface SessionConfig {
    maxAge               : number /* hours */
    updateAge            : number /* hours */
}
export interface EmailConfig {
    host                 : string
    port                 : number
    secure               : boolean
    username             : string
    password             : string
    
    from                 : string
    subject              : React.ReactNode
    message              : React.ReactNode
}
export interface AuthConfig {
    business             : BusinessConfig
    signUp               : SignUpConfig
    signIn               : SignInConfig
    reset                : ResetConfig
    session              : SessionConfig
    
    
    
    oAuthProviders                     : OAuthConfig<any>[]
    
    
    
    emails                             : {
        signUp : EmailConfig
        reset  : EmailConfig
    }
}



export interface CredentialsConfig {
    FULLNAME_MIN_LENGTH      : number /* characters */
    FULLNAME_MAX_LENGTH      : number /* characters */
    
    
    
    EMAIL_MIN_LENGTH         : number /* characters */
    EMAIL_MAX_LENGTH         : number /* characters */
    EMAIL_FORMAT             : RegExp
    EMAIL_FORMAT_HINT        : React.ReactNode
    
    
    
    USERNAME_MIN_LENGTH      : number /* characters */
    USERNAME_MAX_LENGTH      : number /* characters */
    USERNAME_FORMAT          : RegExp
    USERNAME_FORMAT_HINT     : React.ReactNode
    USERNAME_PROHIBITED      : (string|RegExp)[]
    USERNAME_PROHIBITED_HINT : React.ReactNode
    
    
    
    PASSWORD_MIN_LENGTH      : number /* characters */
    PASSWORD_MAX_LENGTH      : number /* characters */
    PASSWORD_HAS_UPPERCASE   : boolean
    PASSWORD_HAS_LOWERCASE   : boolean
    PASSWORD_PROHIBITED      : (string|RegExp)[]
    PASSWORD_PROHIBITED_HINT : React.ReactNode
};
