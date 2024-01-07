// next-auth:
import type {
    // models:
    DefaultUser,
    DefaultSession,
    
    User,
    Session,
}                           from 'next-auth'
import type {
    // models:
    Adapter,
    AdapterUser,
    AdapterSession,
    AdapterAccount,
}                           from '@auth/core/adapters'



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



declare module 'next-auth' {
    interface DefaultUser {
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
