// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import type {
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'



// types:
export interface DialogMessage {
    theme         ?: ThemeName
    title         ?: React.ReactNode
    message        : React.ReactNode
}

export interface FieldErrorInfo {
    invalidFields  : ArrayLike<Element>
    
    context        : any
}
export interface FetchErrorInfo {
    isRequestError : boolean
    isClientError  : boolean
    isServerError  : boolean
    
    errorCode      : number
    error          : any
    
    context        : any
}

export type FieldErrorTitle   = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)
export type FieldErrorMessage = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)

export type FetchErrorTitle   = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
export type FetchErrorMessage = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
