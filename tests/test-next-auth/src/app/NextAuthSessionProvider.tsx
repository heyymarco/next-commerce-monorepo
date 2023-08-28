'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'
import { SessionProvider } from 'next-auth/react'



export interface NextAuthSessionProviderProps {
    children ?: React.ReactNode
}
export function NextAuthSessionProvider(props: NextAuthSessionProviderProps) {
    // jsx:
    return (
        <SessionProvider>
            {props.children}
        </SessionProvider>
    )
}