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
    theme   ?: ThemeName
    title   ?: React.ReactNode
    message  : React.ReactNode
}

export type FieldErrorMessage = React.ReactNode|((errorInfo: { invalidFields : ArrayLike<Element>, context: any }) => React.ReactNode)
export type FetchErrorMessage = React.ReactNode|((errorInfo: { isRequestError: boolean, isClientError: boolean, isServerError: boolean, errorCode: number, error: any, context: any }) => React.ReactNode)
