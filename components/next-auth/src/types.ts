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
